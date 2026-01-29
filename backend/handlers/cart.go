package handlers

import (
	"fmt"
	"strconv"

	"ecommerce-backend/database"
	"ecommerce-backend/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// AddToCart adds a product to the user's cart
// @Summary Add product to cart
// @Description Add a product to the authenticated user's cart
// @Tags cart
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body map[string]interface{} true "Cart item data"
// @Success 201 {object} models.CartItem
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Router /cart/add [post]
func AddToCart(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	fmt.Printf("AddToCart: User %d attempting to add item to cart\n", user.ID)

	var req struct {
		ProductID uint `json:"product_id" validate:"required"`
		Quantity  int  `json:"quantity" validate:"required,min=1"`
	}

	if err := c.BodyParser(&req); err != nil {
		fmt.Printf("AddToCart: Invalid request body: %v\n", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	fmt.Printf("AddToCart: Request data - ProductID: %d, Quantity: %d\n", req.ProductID, req.Quantity)

	// Check if product exists and has enough stock
	var product models.Product
	if err := database.DB.First(&product, req.ProductID).Error; err != nil {
		fmt.Printf("AddToCart: Product %d not found\n", req.ProductID)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}

	if product.Stock < req.Quantity {
		fmt.Printf("AddToCart: Insufficient stock for product %d. Available: %d, Requested: %d\n", req.ProductID, product.Stock, req.Quantity)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Insufficient stock",
		})
	}

	// Get or create user's active cart
	var cart models.Cart
	if err := database.DB.Where("user_id = ? AND is_active = ?", user.ID, true).First(&cart).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// Create new cart
			fmt.Printf("AddToCart: Creating new cart for user %d\n", user.ID)
			cart = models.Cart{
				UserID:   user.ID,
				IsActive: true,
			}
			if err := database.DB.Create(&cart).Error; err != nil {
				fmt.Printf("AddToCart: Failed to create cart: %v\n", err)
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "Failed to create cart",
				})
			}
			fmt.Printf("AddToCart: Created new cart with ID %d\n", cart.ID)
		} else {
			fmt.Printf("AddToCart: Database error getting cart: %v\n", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to get cart",
			})
		}
	} else {
		fmt.Printf("AddToCart: Found existing cart with ID %d\n", cart.ID)
	}

	// Check if product already in cart
	var existingCartItem models.CartItem
	if err := database.DB.Where("cart_id = ? AND product_id = ?", cart.ID, req.ProductID).First(&existingCartItem).Error; err == nil {
		// Update quantity
		fmt.Printf("AddToCart: Product already in cart, updating quantity from %d to %d\n", existingCartItem.Quantity, existingCartItem.Quantity+req.Quantity)
		newQuantity := existingCartItem.Quantity + req.Quantity
		if product.Stock < newQuantity {
			fmt.Printf("AddToCart: Insufficient stock for updated quantity. Available: %d, Requested: %d\n", product.Stock, newQuantity)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Insufficient stock",
			})
		}
		existingCartItem.Quantity = newQuantity
		if err := database.DB.Save(&existingCartItem).Error; err != nil {
			fmt.Printf("AddToCart: Failed to update cart item: %v\n", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to update cart item",
			})
		}
		fmt.Printf("AddToCart: Successfully updated cart item quantity to %d\n", existingCartItem.Quantity)
		return c.JSON(existingCartItem)
	}

	// Create new cart item
	fmt.Printf("AddToCart: Creating new cart item for cart %d, product %d, quantity %d\n", cart.ID, req.ProductID, req.Quantity)
	cartItem := models.CartItem{
		CartID:    cart.ID,
		ProductID: req.ProductID,
		Quantity:  req.Quantity,
	}

	if err := database.DB.Create(&cartItem).Error; err != nil {
		fmt.Printf("AddToCart: Failed to create cart item: %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to add item to cart",
		})
	}

	fmt.Printf("AddToCart: Successfully created cart item with ID %d\n", cartItem.ID)
	return c.Status(fiber.StatusCreated).JSON(cartItem)
}

// GetCart returns the user's cart
// @Summary Get user cart
// @Description Get the authenticated user's cart with items
// @Tags cart
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} map[string]interface{}
// @Router /cart [get]
func GetCart(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	userID := user.ID

	var cart models.Cart
	if err := database.DB.Preload("CartItems.Product").Where("user_id = ? AND is_active = ?", userID, true).First(&cart).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// Create a new empty cart for the user
			newCart := models.Cart{
				UserID:    userID,
				IsActive:  true,
				CartItems: []models.CartItem{},
			}
			if createErr := database.DB.Create(&newCart).Error; createErr != nil {
				fmt.Printf("Failed to create new cart: %v\n", createErr)
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "Failed to create cart",
				})
			}
			fmt.Printf("Created new cart ID %d for user %d\n", newCart.ID, userID)
			return c.JSON(newCart)
		}
		fmt.Printf("Failed to get cart: %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get cart",
		})
	}

	fmt.Printf("Retrieved cart ID %d for user %d with %d items\n", cart.ID, userID, len(cart.CartItems))
	return c.JSON(cart)
}

// UpdateCartItem updates the quantity of a cart item
// @Summary Update cart item
// @Description Update the quantity of an item in the cart
// @Tags cart
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Cart item ID"
// @Param request body map[string]interface{} true "Update data"
// @Success 200 {object} models.CartItem
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Router /cart/items/{id} [put]
func UpdateCartItem(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)

	itemID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid cart item ID",
		})
	}

	var req struct {
		Quantity int `json:"quantity" validate:"required,min=1"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Get cart item with cart and product
	var cartItem models.CartItem
	if err := database.DB.Preload("Cart").Preload("Product").First(&cartItem, itemID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Cart item not found",
		})
	}

	// Verify cart belongs to user
	if cartItem.Cart.UserID != user.ID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Access denied",
		})
	}

	// Check stock
	if cartItem.Product.Stock < req.Quantity {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Insufficient stock",
		})
	}

	// Update quantity
	cartItem.Quantity = req.Quantity
	if err := database.DB.Save(&cartItem).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update cart item",
		})
	}

	return c.JSON(cartItem)
}

// RemoveFromCart removes an item from the cart
// @Summary Remove cart item
// @Description Remove an item from the user's cart
// @Tags cart
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Cart item ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Router /cart/items/{id} [delete]
func RemoveFromCart(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)

	itemID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid cart item ID",
		})
	}

	// Get cart item with cart
	var cartItem models.CartItem
	if err := database.DB.Preload("Cart").First(&cartItem, itemID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Cart item not found",
		})
	}

	// Verify cart belongs to user
	if cartItem.Cart.UserID != user.ID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Access denied",
		})
	}

	if err := database.DB.Delete(&cartItem).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to remove cart item",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Item removed from cart successfully",
	})
}

// GetCartSummary returns cart summary with totals
// @Summary Get cart summary
// @Description Get cart summary with subtotal and total calculations
// @Tags cart
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} map[string]interface{}
// @Router /cart/summary [get]
func GetCartSummary(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)

	var cart models.Cart
	if err := database.DB.Preload("CartItems.Product").Where("user_id = ? AND is_active = ?", user.ID, true).First(&cart).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.JSON(fiber.Map{
				"subtotal":    0,
				"total_items": 0,
				"total":       0,
				"cart_items":  []models.CartItem{},
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get cart",
		})
	}

	subtotal := 0.0
	totalItems := 0

	for _, item := range cart.CartItems {
		subtotal += float64(item.Quantity) * float64(item.Product.Price)
		totalItems += item.Quantity
	}

	// You can add tax, shipping, discount calculations here
	tax := subtotal * 0.11 // 11% tax for example
	shipping := 0.0        // Free shipping
	total := subtotal + tax + shipping

	return c.JSON(fiber.Map{
		"subtotal":    subtotal,
		"tax":         tax,
		"shipping":    shipping,
		"total":       total,
		"total_items": totalItems,
		"cart_items":  cart.CartItems,
	})
}

// ClearCart removes all items from the user's cart
// @Summary Clear cart
// @Description Clear all items from the user's cart
// @Tags cart
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} map[string]interface{}
// @Router /cart/clear [delete]
func ClearCart(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)

	// Get user's active cart
	var cart models.Cart
	if err := database.DB.Where("user_id = ? AND is_active = ?", user.ID, true).First(&cart).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Cart not found",
		})
	}

	// Delete all cart items
	if err := database.DB.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to clear cart",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Cart cleared successfully",
	})
}

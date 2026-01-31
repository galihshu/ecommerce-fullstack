package handlers

import (
	"fmt"
	"strconv"
	"time"

	"ecommerce-backend/database"
	"ecommerce-backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type CheckoutRequest struct {
	ShippingAddress models.Address `json:"shipping_address" binding:"required"`
	PaymentMethod   string         `json:"payment_method" binding:"required,oneof=cod bank_transfer"`
	Notes           string         `json:"notes"`
}

type CheckoutResponse struct {
	OrderID       uint   `json:"order_id"`
	OrderNumber   string `json:"order_number"`
	Status        string `json:"status"`
	TotalAmount   int64  `json:"total_amount"`
	PaymentMethod string `json:"payment_method"`
	Message       string `json:"message"`
}

// Checkout creates a new order from user's cart
// @Summary Create order from cart
// @Description Process checkout and create order from user's active cart items
// @Tags checkout
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body CheckoutRequest true "Checkout data"
// @Success 201 {object} CheckoutResponse
// @Failure 400 {object} map[string]interface{}
// @Failure 401 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /protected/checkout [post]
func Checkout(c *fiber.Ctx) error {
	// Get user from context (set by JWT middleware)
	user := c.Locals("user").(models.User)
	userID := user.ID

	// Parse checkout request
	var req CheckoutRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Get database connection
	db := database.GetDB()

	// Get cart items for user with products
	var cartItems []models.CartItem
	if err := db.Preload("Product").Joins("JOIN carts ON cart_items.cart_id = carts.id").
		Where("carts.user_id = ? AND carts.is_active = ?", userID, true).Find(&cartItems).Error; err != nil {
		fmt.Printf("Database error getting cart items: %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get cart items"})
	}

	// Debug logging
	fmt.Printf("User %d cart items count: %d\n", userID, len(cartItems))
	for _, item := range cartItems {
		fmt.Printf("Cart Item: ProductID=%d, Quantity=%d, Product.Name=%s\n",
			item.ProductID, item.Quantity, item.Product.Name)
	}

	if len(cartItems) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cart is empty"})
	}

	// Calculate total amount
	var subtotal int64 = 0
	for _, item := range cartItems {
		if item.Product.ID == 0 {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Product not found for cart item"})
		}
		subtotal += item.Product.Price * int64(item.Quantity)
	}

	// Calculate tax (10%) and shipping (fixed for now)
	tax := subtotal * 10 / 100
	shippingCost := int64(10000) // Fixed shipping cost of 10,000
	totalAmount := subtotal + tax + shippingCost

	// Generate order number
	orderNumber := generateOrderNumber()

	// Create shipping address
	req.ShippingAddress.UserID = userID
	if err := db.Create(&req.ShippingAddress).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save shipping address"})
	}

	// Create order
	order := models.Order{
		UserID:          userID,
		OrderNumber:     orderNumber,
		Status:          "pending",
		Subtotal:        subtotal,
		Tax:             tax,
		ShippingCost:    shippingCost,
		TotalAmount:     totalAmount,
		PaymentMethod:   req.PaymentMethod,
		PaymentStatus:   "unpaid",
		ShippingAddress: formatShippingAddress(req.ShippingAddress),
		Notes:           req.Notes,
	}

	if err := db.Create(&order).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create order"})
	}

	// Create order items
	for _, cartItem := range cartItems {
		orderItem := models.OrderItem{
			OrderID:    order.ID,
			ProductID:  cartItem.ProductID,
			Quantity:   cartItem.Quantity,
			UnitPrice:  cartItem.Product.Price,
			TotalPrice: cartItem.Product.Price * int64(cartItem.Quantity),
		}
		if err := db.Create(&orderItem).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create order item"})
		}
	}

	// Clear cart after successful order and create new empty cart
	// First, get the current active cart ID
	var currentCart models.Cart
	if err := db.Where("user_id = ? AND is_active = ?", userID, true).First(&currentCart).Error; err != nil {
		fmt.Printf("Failed to get current cart: %v\n", err)
		// Continue without failing the order
	} else {
		// Clear all items from the current cart
		if err := db.Where("cart_id = ?", currentCart.ID).Delete(&models.CartItem{}).Error; err != nil {
			fmt.Printf("Failed to clear cart items: %v\n", err)
		}

		// Deactivate the current cart
		if err := db.Model(&currentCart).Update("is_active", false).Error; err != nil {
			fmt.Printf("Failed to deactivate cart: %v\n", err)
		}
	}

	// Create new empty cart for future shopping
	newCart := models.Cart{
		UserID:   userID,
		IsActive: true,
	}
	if err := db.Create(&newCart).Error; err != nil {
		fmt.Printf("Failed to create new cart: %v\n", err)
	} else {
		fmt.Printf("Created new cart ID %d for user %d\n", newCart.ID, userID)
	}

	// Return success response
	response := CheckoutResponse{
		OrderID:       order.ID,
		OrderNumber:   order.OrderNumber,
		Status:        order.Status,
		TotalAmount:   order.TotalAmount,
		PaymentMethod: order.PaymentMethod,
		Message:       "Order created successfully",
	}

	return c.Status(fiber.StatusCreated).JSON(response)
}

// GetOrderHistory retrieves user's order history
// @Summary Get user order history
// @Description Get all orders for the authenticated user
// @Tags checkout
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} models.Order
// @Failure 401 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /protected/checkout/history [get]
func GetOrderHistory(c *fiber.Ctx) error {
	// Get user from context (set by JWT middleware)
	user := c.Locals("user").(models.User)
	userID := user.ID

	// Get database connection
	db := database.GetDB()

	// Get orders for user
	var orders []models.Order
	if err := db.Where("user_id = ?", userID).Order("created_at DESC").Find(&orders).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get orders"})
	}

	// Load order items with products for each order
	for i := range orders {
		var orderItems []models.OrderItem
		if err := db.Preload("Product").Where("order_id = ?", orders[i].ID).Find(&orderItems).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get order items"})
		}
		orders[i].OrderItems = orderItems
	}

	return c.JSON(orders)
}

// GetOrderDetails retrieves specific order details
// @Summary Get order details
// @Description Get detailed information for a specific order
// @Tags checkout
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Order ID"
// @Success 200 {object} models.Order
// @Failure 400 {object} map[string]interface{}
// @Failure 401 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /protected/checkout/orders/{id} [get]
func GetOrderDetails(c *fiber.Ctx) error {
	// Get user from context (set by JWT middleware)
	user := c.Locals("user").(models.User)
	userID := user.ID

	// Get order ID from URL
	orderID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid order ID"})
	}

	// Get database connection
	db := database.GetDB()

	// Get order
	var order models.Order
	if err := db.Where("id = ? AND user_id = ?", orderID, userID).First(&order).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Order not found"})
	}

	// Load order items with products
	var orderItems []models.OrderItem
	if err := db.Preload("Product").Where("order_id = ?", order.ID).Find(&orderItems).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get order items"})
	}
	order.OrderItems = orderItems

	return c.JSON(order)
}

// CancelOrder cancels a user's order
// @Summary Cancel order
// @Description Cancel a specific order (only if it's still pending)
// @Tags checkout
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Order ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 401 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /protected/checkout/orders/{id}/cancel [put]
func CancelOrder(c *fiber.Ctx) error {
	// Get user from context (set by JWT middleware)
	user := c.Locals("user").(models.User)
	userID := user.ID

	// Get order ID from URL
	orderID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid order ID"})
	}

	// Get database connection
	db := database.GetDB()

	// Get order
	var order models.Order
	if err := db.Where("id = ? AND user_id = ?", orderID, userID).First(&order).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Order not found"})
	}

	// Check if order can be cancelled (only pending orders can be cancelled)
	if order.Status != "pending" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":  "Only pending orders can be cancelled",
			"status": order.Status,
		})
	}

	// Update order status to cancelled
	if err := db.Model(&order).Update("status", "cancelled").Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to cancel order"})
	}

	// Return success response
	return c.JSON(fiber.Map{
		"message":      "Order cancelled successfully",
		"order_id":     order.ID,
		"order_number": order.OrderNumber,
		"status":       "cancelled",
	})
}

// Helper functions
func generateOrderNumber() string {
	timestamp := time.Now().Format("20060102")
	random := uuid.New().String()[:8]
	return fmt.Sprintf("ORD-%s-%s", timestamp, random)
}

func formatShippingAddress(address models.Address) string {
	return fmt.Sprintf("%s, %s, %s, %s", address.Address, address.City, address.Province, address.PostalCode)
}

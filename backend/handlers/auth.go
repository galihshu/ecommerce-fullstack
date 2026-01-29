package handlers

import (
	"fmt"
	"time"

	"ecommerce-backend/config"
	"ecommerce-backend/database"
	"ecommerce-backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type RegisterRequest struct {
	FirstName string `json:"first_name" validate:"required"`
	LastName  string `json:"last_name" validate:"required"`
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required,min=6"`
	Phone     string `json:"phone"`
}

type LoginRequest struct {
	Email     string                   `json:"email" validate:"required,email"`
	Password  string                   `json:"password" validate:"required"`
	GuestCart []map[string]interface{} `json:"guest_cart"` // Array of guest cart items
}

type AuthResponse struct {
	User  models.User `json:"user"`
	Token string      `json:"token"`
}

// Register handles user registration
// @Summary Register a new user
// @Description Register a new user account
// @Tags auth
// @Accept json
// @Produce json
// @Param request body RegisterRequest true "Registration data"
// @Success 201 {object} AuthResponse
// @Failure 400 {object} map[string]interface{}
// @Failure 409 {object} map[string]interface{}
// @Router /auth/register [post]
func Register(c *fiber.Ctx) error {
	var req RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Check if user already exists
	var existingUser models.User
	if err := database.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Email already registered",
		})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to hash password",
		})
	}

	// Create user
	user := models.User{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Email:     req.Email,
		Password:  string(hashedPassword),
		Phone:     req.Phone,
		Role:      "user",
		IsActive:  true,
	}

	if err := database.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create user",
		})
	}

	// Generate JWT token
	token, err := generateJWT(user.ID, user.Role)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate token",
		})
	}

	// Remove password from response
	user.Password = ""

	return c.Status(fiber.StatusCreated).JSON(AuthResponse{
		User:  user,
		Token: token,
	})
}

// Login handles user login
// @Summary Login user
// @Description Authenticate user and return JWT token
// @Tags auth
// @Accept json
// @Produce json
// @Param request body LoginRequest true "Login credentials"
// @Success 200 {object} AuthResponse
// @Failure 400 {object} map[string]interface{}
// @Failure 401 {object} map[string]interface{}
// @Router /auth/login [post]
func Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Find user
	var user models.User
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	// Check if user is active
	if !user.IsActive {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Account is inactive",
		})
	}

	// Generate JWT token
	token, err := generateJWT(user.ID, user.Role)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate token",
		})
	}

	// Merge guest cart if provided
	if len(req.GuestCart) > 0 {
		fmt.Printf("Login: Guest cart found with %d items\n", len(req.GuestCart))
		fmt.Printf("Login: Guest cart data: %+v\n", req.GuestCart)
		if err := mergeGuestCart(user.ID, req.GuestCart); err != nil {
			// Log error but don't fail login
			fmt.Printf("Failed to merge guest cart: %v\n", err)
		} else {
			fmt.Printf("Guest cart merged successfully for user %d\n", user.ID)
		}
	} else {
		fmt.Printf("Login: No guest cart provided for user %d\n", user.ID)
	}

	// Remove password from response
	user.Password = ""

	return c.JSON(AuthResponse{
		User:  user,
		Token: token,
	})
}

// GetProfile returns the current user profile
// @Summary Get user profile
// @Description Get the current authenticated user's profile
// @Tags auth
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} models.User
// @Failure 401 {object} map[string]interface{}
// @Router /auth/profile [get]
func GetProfile(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	user.Password = ""
	return c.JSON(user)
}

// generateJWT creates a new JWT token
func generateJWT(userID uint, role string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"role":    role,
		"exp":     time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.GetString("JWT_SECRET", "your-super-secret-jwt-key")))
}

// mergeGuestCart merges guest cart items to user cart
func mergeGuestCart(userID uint, guestCart []map[string]interface{}) error {
	db := database.GetDB()

	fmt.Printf("Merging guest cart for user %d with %d items\n", userID, len(guestCart))

	// Get or create user cart
	var cart models.Cart
	if err := db.Where("user_id = ? AND is_active = ?", userID, true).First(&cart).Error; err != nil {
		// Create new cart if not exists
		cart = models.Cart{
			UserID:   userID,
			IsActive: true,
		}
		if err := db.Create(&cart).Error; err != nil {
			return fmt.Errorf("failed to create cart: %w", err)
		}
		fmt.Printf("Created new cart with ID: %d\n", cart.ID)
	} else {
		fmt.Printf("Found existing cart with ID: %d\n", cart.ID)
	}

	// Add guest cart items to user cart
	for i, item := range guestCart {
		fmt.Printf("Processing guest cart item %d: %+v\n", i, item)

		productIDFloat, ok := item["product_id"].(float64)
		if !ok {
			fmt.Printf("Invalid product_id in item %d\n", i)
			continue
		}
		productID := uint(productIDFloat)

		quantityFloat, ok := item["quantity"].(float64)
		if !ok {
			fmt.Printf("Invalid quantity in item %d\n", i)
			continue
		}
		quantity := int(quantityFloat)

		fmt.Printf("Processing: ProductID=%d, Quantity=%d\n", productID, quantity)

		// Check if product exists
		var product models.Product
		if err := db.First(&product, productID).Error; err != nil {
			fmt.Printf("Product %d not found, skipping\n", productID)
			continue // Skip if product doesn't exist
		}

		// Check if item already exists in cart
		var existingItem models.CartItem
		if err := db.Joins("JOIN carts ON cart_items.cart_id = carts.id").
			Where("cart_items.product_id = ? AND carts.user_id = ? AND carts.is_active = ?", productID, userID, true).
			First(&existingItem).Error; err == nil {
			// Update quantity if item exists
			newQuantity := existingItem.Quantity + quantity
			if newQuantity <= product.Stock {
				if err := db.Model(&existingItem).Where("id = ?", existingItem.ID).Update("quantity", newQuantity).Error; err != nil {
					return fmt.Errorf("failed to update cart item: %w", err)
				}
				fmt.Printf("Updated existing cart item: New quantity=%d\n", newQuantity)
			} else {
				fmt.Printf("Quantity exceeds stock, keeping existing quantity\n")
			}
		} else {
			// Create new cart item if not exists
			cartItem := models.CartItem{
				CartID:    cart.ID,
				ProductID: productID,
				Quantity:  quantity,
			}
			if err := db.Create(&cartItem).Error; err != nil {
				return fmt.Errorf("failed to create cart item: %w", err)
			}
			fmt.Printf("Created new cart item: CartID=%d, ProductID=%d, Quantity=%d\n",
				cartItem.CartID, cartItem.ProductID, cartItem.Quantity)
		}
	}

	fmt.Printf("Guest cart merge completed for user %d\n", userID)
	return nil
}

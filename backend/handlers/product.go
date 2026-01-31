package handlers

import (
	"strconv"

	"ecommerce-backend/database"
	"ecommerce-backend/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// GetProducts returns all products with pagination and filtering
// @Summary Get all products
// @Description Get a paginated list of products with optional filtering
// @Tags products
// @Accept json
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Param category query string false "Filter by category"
// @Param search query string false "Search products"
// @Param min_price query int false "Minimum price filter"
// @Param max_price query int false "Maximum price filter"
// @Success 200 {object} map[string]interface{}
// @Router /products [get]
func GetProducts(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	category := c.Query("category")
	search := c.Query("search")
	minPrice := c.Query("min_price")
	maxPrice := c.Query("max_price")

	offset := (page - 1) * limit

	var products []models.Product
	var total int64

	query := database.DB.Model(&models.Product{}).Preload("Category")

	// Apply filters
	if category != "" {
		query = query.Joins("JOIN categories ON products.category_id = categories.id").
			Where("categories.name ILIKE ?", "%"+category+"%")
	}

	if search != "" {
		query = query.Where("products.name ILIKE ? OR products.description ILIKE ?",
			"%"+search+"%", "%"+search+"%")
	}

	if minPrice != "" {
		query = query.Where("products.price >= ?", minPrice)
	}

	if maxPrice != "" {
		query = query.Where("products.price <= ?", maxPrice)
	}

	// Only active products
	query = query.Where("products.is_active = ?", true)

	// Count total records
	query.Count(&total)

	// Get products with pagination
	if err := query.Offset(offset).Limit(limit).Find(&products).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch products",
		})
	}

	return c.JSON(fiber.Map{
		"products": products,
		"pagination": fiber.Map{
			"page":       page,
			"limit":      limit,
			"total":      total,
			"totalPages": (total + int64(limit) - 1) / int64(limit),
		},
	})
}

// GetProduct returns a single product by ID
// @Summary Get product by ID
// @Description Get a single product by its ID
// @Tags products
// @Accept json
// @Produce json
// @Param id path int true "Product ID"
// @Success 200 {object} models.Product
// @Failure 404 {object} map[string]interface{}
// @Router /products/{id} [get]
func GetProduct(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid product ID",
		})
	}

	var product models.Product
	if err := database.DB.Preload("Category").Preload("Reviews.User").First(&product, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Product not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch product",
		})
	}

	return c.JSON(product)
}

// GetCategories returns all categories
// @Summary Get all categories
// @Description Get a list of all active categories
// @Tags categories
// @Accept json
// @Produce json
// @Success 200 {array} models.Category
// @Router /categories [get]
func GetCategories(c *fiber.Ctx) error {
	var categories []models.Category
	if err := database.DB.Where("is_active = ?", true).Find(&categories).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch categories",
		})
	}

	return c.JSON(categories)
}

// GetAdminProducts returns all products (including inactive ones) for admin
// @Summary Get all products (admin)
// @Description Get all products with pagination and filtering (admin only, includes inactive products)
// @Tags products
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Param category query string false "Filter by category"
// @Param search query string false "Search products"
// @Param min_price query int false "Minimum price filter"
// @Param max_price query int false "Maximum price filter"
// @Success 200 {object} map[string]interface{}
// @Router /admin/products [get]
func GetAdminProducts(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	category := c.Query("category")
	search := c.Query("search")
	minPrice := c.Query("min_price")
	maxPrice := c.Query("max_price")

	offset := (page - 1) * limit

	var products []models.Product
	var total int64

	query := database.DB.Model(&models.Product{}).Preload("Category").Unscoped()

	// Apply filters
	if category != "" {
		query = query.Joins("JOIN categories ON products.category_id = categories.id").
			Where("categories.name ILIKE ?", "%"+category+"%")
	}

	if search != "" {
		query = query.Where("products.name ILIKE ? OR products.description ILIKE ?",
			"%"+search+"%", "%"+search+"%")
	}

	if minPrice != "" {
		query = query.Where("products.price >= ?", minPrice)
	}

	if maxPrice != "" {
		query = query.Where("products.price <= ?", maxPrice)
	}

	// Count total records
	query.Count(&total)

	// Get products with pagination
	if err := query.Offset(offset).Limit(limit).Find(&products).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch products",
		})
	}

	return c.JSON(fiber.Map{
		"products": products,
		"pagination": fiber.Map{
			"page":       page,
			"limit":      limit,
			"total":      total,
			"totalPages": (total + int64(limit) - 1) / int64(limit),
		},
	})
}

// CreateProduct creates a new product (admin only)
// @Summary Create new product
// @Description Create a new product (admin only)
// @Tags products
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param product body models.Product true "Product data"
// @Success 201 {object} models.Product
// @Failure 400 {object} map[string]interface{}
// @Failure 403 {object} map[string]interface{}
// @Router /admin/products [post]
func CreateProduct(c *fiber.Ctx) error {
	var product models.Product
	if err := c.BodyParser(&product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if err := database.DB.Create(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create product",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(product)
}

// UpdateProduct updates an existing product (admin only)
// @Summary Update product
// @Description Update an existing product (admin only)
// @Tags products
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Product ID"
// @Param product body models.Product true "Product data"
// @Success 200 {object} models.Product
// @Failure 400 {object} map[string]interface{}
// @Failure 403 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Router /admin/products/{id} [put]
func UpdateProduct(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid product ID",
		})
	}

	var product models.Product
	if err := database.DB.First(&product, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}

	if err := c.BodyParser(&product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if err := database.DB.Save(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update product",
		})
	}

	return c.JSON(product)
}

// DeleteProduct soft deletes a product (admin only)
// @Summary Delete product
// @Description Soft delete a product (admin only)
// @Tags products
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Product ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 403 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Router /admin/products/{id} [delete]
func DeleteProduct(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid product ID",
		})
	}

	var product models.Product
	if err := database.DB.First(&product, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}

	if err := database.DB.Delete(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete product",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Product deleted successfully",
	})
}

package handlers

import (
	"strconv"

	"ecommerce-backend/database"
	"ecommerce-backend/models"

	"github.com/gofiber/fiber/v2"
)

// GetAdminOrders returns all orders for admin
// @Summary Get all orders (admin)
// @Description Get all orders with pagination and filtering (admin only)
// @Tags orders
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Param search query string false "Search orders by order number or customer name"
// @Param status query string false "Filter by status"
// @Param payment_status query string false "Filter by payment status"
// @Success 200 {object} map[string]interface{}
// @Router /admin/orders [get]
func GetAdminOrders(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	search := c.Query("search")
	status := c.Query("status")
	paymentStatus := c.Query("payment_status")

	offset := (page - 1) * limit

	var orders []models.Order
	var total int64

	query := database.DB.Model(&models.Order{}).
		Preload("User").
		Preload("OrderItems.Product")

	// Apply filters
	if search != "" {
		query = query.Where("order_number ILIKE ? OR shipping_address ILIKE ?",
			"%"+search+"%", "%"+search+"%")
	}

	if status != "" {
		query = query.Where("status = ?", status)
	}

	if paymentStatus != "" {
		query = query.Where("payment_status = ?", paymentStatus)
	}

	// Count total records
	query.Count(&total)

	// Get orders with pagination
	if err := query.Offset(offset).Limit(limit).
		Order("created_at DESC").
		Find(&orders).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch orders",
		})
	}

	return c.JSON(fiber.Map{
		"orders": orders,
		"pagination": fiber.Map{
			"page":       page,
			"limit":      limit,
			"total":      total,
			"totalPages": (total + int64(limit) - 1) / int64(limit),
		},
	})
}

// GetAdminOrder returns a single order by ID for admin
// @Summary Get order by ID (admin)
// @Description Get a single order by ID with full details (admin only)
// @Tags orders
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Order ID"
// @Success 200 {object} models.Order
// @Failure 404 {object} map[string]interface{}
// @Router /admin/orders/{id} [get]
func GetAdminOrder(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid order ID",
		})
	}

	var order models.Order
	if err := database.DB.Preload("User").
		Preload("OrderItems.Product").
		Preload("OrderItems.Product.Category").
		First(&order, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Order not found",
		})
	}

	return c.JSON(order)
}

// UpdateOrderStatus updates order status (admin only)
// @Summary Update order status (admin)
// @Description Update order status and optionally add tracking number (admin only)
// @Tags orders
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Order ID"
// @Param request body UpdateOrderStatusRequest true "Status update data"
// @Success 200 {object} models.Order
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Router /admin/orders/{id}/status [put]
func UpdateOrderStatus(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid order ID",
		})
	}

	var order models.Order
	if err := database.DB.First(&order, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Order not found",
		})
	}

	var req UpdateOrderStatusRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Update order
	order.Status = req.Status
	order.TrackingNumber = req.TrackingNumber
	order.Notes = req.Notes

	if err := database.DB.Save(&order).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update order",
		})
	}

	// Return updated order with relationships
	if err := database.DB.Preload("User").
		Preload("OrderItems.Product").
		First(&order, id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch updated order",
		})
	}

	return c.JSON(order)
}

// UpdatePaymentStatus updates payment status (admin only)
// @Summary Update payment status (admin)
// @Description Update payment status for an order (admin only)
// @Tags orders
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Order ID"
// @Param request body UpdatePaymentStatusRequest true "Payment status data"
// @Success 200 {object} models.Order
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Router /admin/orders/{id}/payment [put]
func UpdatePaymentStatus(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid order ID",
		})
	}

	var order models.Order
	if err := database.DB.First(&order, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Order not found",
		})
	}

	var req UpdatePaymentStatusRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Update payment status
	order.PaymentStatus = req.PaymentStatus

	if err := database.DB.Save(&order).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update payment status",
		})
	}

	// Return updated order with relationships
	if err := database.DB.Preload("User").
		Preload("OrderItems.Product").
		First(&order, id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch updated order",
		})
	}

	return c.JSON(order)
}

// GetOrderStats returns order statistics for admin dashboard
// @Summary Get order statistics (admin)
// @Description Get order statistics for dashboard (admin only)
// @Tags orders
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} map[string]interface{}
// @Router /admin/orders/stats [get]
func GetOrderStats(c *fiber.Ctx) error {
	var stats struct {
		TotalOrders      int64 `json:"total_orders"`
		PendingOrders    int64 `json:"pending_orders"`
		ProcessingOrders int64 `json:"processing_orders"`
		ShippedOrders    int64 `json:"shipped_orders"`
		DeliveredOrders  int64 `json:"delivered_orders"`
		CancelledOrders  int64 `json:"cancelled_orders"`
		TotalRevenue     int64 `json:"total_revenue"`
		TodayOrders      int64 `json:"today_orders"`
		TodayRevenue     int64 `json:"today_revenue"`
	}

	// Total orders
	database.DB.Model(&models.Order{}).Count(&stats.TotalOrders)

	// Orders by status
	database.DB.Model(&models.Order{}).Where("status = ?", "pending").Count(&stats.PendingOrders)
	database.DB.Model(&models.Order{}).Where("status = ?", "processing").Count(&stats.ProcessingOrders)
	database.DB.Model(&models.Order{}).Where("status = ?", "shipped").Count(&stats.ShippedOrders)
	database.DB.Model(&models.Order{}).Where("status = ?", "delivered").Count(&stats.DeliveredOrders)
	database.DB.Model(&models.Order{}).Where("status = ?", "cancelled").Count(&stats.CancelledOrders)

	// Total revenue (only delivered orders)
	database.DB.Model(&models.Order{}).Where("status = ?", "delivered").Select("COALESCE(SUM(total_amount), 0)").Scan(&stats.TotalRevenue)

	// Today's orders and revenue
	today := "2006-01-02" // Format for today's date
	database.DB.Model(&models.Order{}).Where("DATE(created_at) = ?", today).Count(&stats.TodayOrders)
	database.DB.Model(&models.Order{}).Where("DATE(created_at) = ? AND status = ?", today, "delivered").
		Select("COALESCE(SUM(total_amount), 0)").Scan(&stats.TodayRevenue)

	return c.JSON(stats)
}

// Request/Response types
type UpdateOrderStatusRequest struct {
	Status         string `json:"status" validate:"required,oneof=pending processing shipped delivered cancelled"`
	TrackingNumber string `json:"tracking_number"`
	Notes          string `json:"notes"`
}

type UpdatePaymentStatusRequest struct {
	PaymentStatus string `json:"payment_status" validate:"required,oneof=unpaid paid failed refunded"`
}

package handlers

import (
	"log"
	"strconv"

	"ecommerce-backend/database"
	"ecommerce-backend/models"

	"time"

	"github.com/gofiber/fiber/v2"
)

// GetDashboardStats returns comprehensive dashboard statistics
// @Summary Get dashboard statistics
// @Description Get comprehensive statistics for admin dashboard
// @Tags dashboard
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} map[string]interface{}
// @Router /admin/dashboard/stats [get]
func GetDashboardStats(c *fiber.Ctx) error {
	var stats struct {
		TotalRevenue       int64 `json:"total_revenue"`
		TotalOrders        int64 `json:"total_orders"`
		TotalCustomers     int64 `json:"total_customers"`
		TotalProducts      int64 `json:"total_products"`
		PendingOrders      int64 `json:"pending_orders"`
		ProcessingOrders   int64 `json:"processing_orders"`
		DeliveredOrders    int64 `json:"delivered_orders"`
		ActiveUsers        int64 `json:"active_users"`
		TodayRevenue       int64 `json:"today_revenue"`
		TodayOrders        int64 `json:"today_orders"`
		TodayCustomers     int64 `json:"today_customers"`
		LowStockProducts   int64 `json:"low_stock_products"`
		OutOfStockProducts int64 `json:"out_of_stock_products"`
	}

	// Total revenue (from delivered orders only)
	database.DB.Model(&models.Order{}).Where("status = ?", "delivered").
		Select("COALESCE(SUM(total_amount), 0)").Scan(&stats.TotalRevenue)

	// Total orders
	database.DB.Model(&models.Order{}).Count(&stats.TotalOrders)

	// Total customers
	database.DB.Model(&models.User{}).Where("role = ?", "user").Count(&stats.TotalCustomers)

	// Total products
	database.DB.Model(&models.Product{}).Count(&stats.TotalProducts)

	// Orders by status
	database.DB.Model(&models.Order{}).Where("status = ?", "pending").Count(&stats.PendingOrders)
	database.DB.Model(&models.Order{}).Where("status = ?", "processing").Count(&stats.ProcessingOrders)
	database.DB.Model(&models.Order{}).Where("status = ?", "delivered").Count(&stats.DeliveredOrders)

	// Active users
	database.DB.Model(&models.User{}).Where("is_active = ? AND role = ?", true, "user").Count(&stats.ActiveUsers)

	// Today's stats (only today, not 2 days)
	today := time.Now().Format("2006-01-02")

	database.DB.Model(&models.Order{}).Where("DATE(created_at) = ? AND status = ?", today, "delivered").
		Select("COALESCE(SUM(total_amount), 0)").Scan(&stats.TodayRevenue)
	database.DB.Model(&models.Order{}).Where("DATE(created_at) = ?", today).Count(&stats.TodayOrders)
	database.DB.Model(&models.User{}).Where("DATE(created_at) = ? AND role = ?", today, "user").Count(&stats.TodayCustomers)

	// Stock stats
	database.DB.Model(&models.Product{}).Where("stock > 0 AND stock < 20 AND is_active = ?", true).Count(&stats.LowStockProducts)
	database.DB.Model(&models.Product{}).Where("stock = 0 AND is_active = ?", true).Count(&stats.OutOfStockProducts)

	return c.JSON(stats)
}

// GetRecentOrders returns recent orders for dashboard
// @Summary Get recent orders
// @Description Get recent orders for dashboard display
// @Tags dashboard
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param limit query int false "Number of orders to return" default(5)
// @Success 200 {object} map[string]interface{}
// @Router /admin/dashboard/recent-orders [get]
func GetRecentOrders(c *fiber.Ctx) error {
	limit, _ := strconv.Atoi(c.Query("limit", "5"))
	if limit > 20 {
		limit = 20
	}

	var orders []models.Order
	if err := database.DB.Preload("User").
		Order("created_at DESC").
		Limit(limit).
		Find(&orders).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch recent orders",
		})
	}

	return c.JSON(orders)
}

// GetTopProducts returns top selling products
// @Summary Get top selling products
// @Description Get top selling products by revenue
// @Tags dashboard
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param limit query int false "Number of products to return" default(5)
// @Success 200 {object} map[string]interface{}
// @Router /admin/dashboard/top-products [get]
func GetTopProducts(c *fiber.Ctx) error {
	limit, _ := strconv.Atoi(c.Query("limit", "5"))
	if limit > 20 {
		limit = 20
	}

	type TopProduct struct {
		ProductID    uint   `json:"product_id"`
		Name         string `json:"name"`
		TotalSales   int64  `json:"total_sales"`
		TotalRevenue int64  `json:"total_revenue"`
	}

	var topProducts []TopProduct
	if err := database.DB.Table("order_items").
		Select("products.id as product_id, products.name, SUM(order_items.quantity) as total_sales, SUM(order_items.total_price) as total_revenue").
		Joins("JOIN products ON order_items.product_id = products.id").
		Joins("JOIN orders ON order_items.order_id = orders.id").
		Where("orders.status = ?", "delivered").
		Group("products.id, products.name").
		Order("total_revenue DESC").
		Limit(limit).
		Scan(&topProducts).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch top products",
		})
	}

	return c.JSON(topProducts)
}

// GetSalesChart returns sales data for chart visualization
// @Summary Get sales chart data
// @Description Get sales data for the last N days for chart visualization
// @Tags dashboard
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param days query int false "Number of days" default(7)
// @Success 200 {array} SalesData
// @Failure 500 {object} map[string]interface{}
// @Router /protected/admin/dashboard/sales-chart [get]
func GetSalesChart(c *fiber.Ctx) error {
	days := 7
	if c.Query("days") != "" {
		if d, err := strconv.Atoi(c.Query("days")); err == nil && d > 0 && d <= 365 {
			days = d
		}
	}

	type SalesData struct {
		Date    string `json:"date"`
		Revenue int64  `json:"revenue"`
		Orders  int64  `json:"orders"`
	}

	// Generate date range for the last N days
	var salesData []SalesData
	for i := days - 1; i >= 0; i-- {
		date := time.Now().AddDate(0, 0, -i).Format("2006-01-02")
		salesData = append(salesData, SalesData{
			Date:    date,
			Revenue: 0,
			Orders:  0,
		})
	}

	// Get actual sales data
	var actualData []SalesData
	startDate := time.Now().AddDate(0, 0, -6).Format("2006-01-02") // 6 days ago to include today

	log.Printf("Chart query - startDate: %s", startDate)

	// First, let's debug by looking at raw orders data
	var rawOrders []struct {
		ID          int64  `json:"id"`
		OrderNumber string `json:"order_number"`
		Status      string `json:"status"`
		TotalAmount int64  `json:"total_amount"`
		CreatedAt   string `json:"created_at"`
		UpdatedAt   string `json:"updated_at"`
	}

	if err := database.DB.Raw(`
		SELECT id, order_number, status, total_amount, created_at, updated_at
		FROM orders 
		ORDER BY created_at DESC
		LIMIT 10
	`).Scan(&rawOrders).Error; err != nil {
		log.Printf("Raw orders query failed: %v", err)
	} else {
		log.Printf("Raw orders data: %+v", rawOrders)
	}

	// Try the chart query with all orders
	if err := database.DB.Raw(`
		SELECT 
			DATE(created_at) as date,
			COALESCE(SUM(total_amount), 0) as revenue,
			COUNT(*) as orders
		FROM orders 
		WHERE DATE(created_at) >= ?
		GROUP BY DATE(created_at)
		ORDER BY date ASC
	`, startDate).Scan(&actualData).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch sales chart data",
		})
	}

	// Convert date format to YYYY-MM-DD only
	for i := range actualData {
		if len(actualData[i].Date) > 10 {
			actualData[i].Date = actualData[i].Date[:10] // Take first 10 chars: YYYY-MM-DD
		}
	}

	log.Printf("Chart query result (all orders): %+v", actualData)

	// If still no data, try without DATE function
	if len(actualData) == 0 {
		log.Printf("No data found, trying without DATE function...")
		var altData []SalesData
		if err := database.DB.Raw(`
			SELECT 
				DATE_TRUNC('day', created_at)::date as date,
				COALESCE(SUM(total_amount), 0) as revenue,
				COUNT(*) as orders
			FROM orders 
			WHERE created_at >= ?
			GROUP BY DATE_TRUNC('day', created_at)::date
			ORDER BY date ASC
		`, time.Now().AddDate(0, 0, -6)).Scan(&altData).Error; err != nil {
			log.Printf("Alternative query failed: %v", err)
		} else {
			log.Printf("Alternative query result: %+v", altData)
			actualData = altData
		}
	}

	// Merge actual data with generated date range
	dataMap := make(map[string]SalesData)
	for _, data := range actualData {
		dataMap[data.Date] = data
	}

	for i, data := range salesData {
		if actual, exists := dataMap[data.Date]; exists {
			salesData[i] = actual
		}
	}

	return c.JSON(salesData)
}

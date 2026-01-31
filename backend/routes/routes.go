package routes

import (
	"ecommerce-backend/handlers"

	"github.com/gofiber/fiber/v2"
)

// PublicRoutes handles public routes (no authentication required)
func PublicRoutes(app fiber.Router) {
	// Authentication routes
	auth := app.Group("/auth")
	auth.Post("/register", handlers.Register)
	auth.Post("/login", handlers.Login)

	// Product routes (public access)
	products := app.Group("/products")
	products.Get("/", handlers.GetProducts)
	products.Get("/:id", handlers.GetProduct)

	// Category routes
	app.Get("/categories", handlers.GetCategories)
}

// ProtectedRoutes handles authenticated routes
func ProtectedRoutes(app fiber.Router) {
	// Auth routes (authenticated)
	auth := app.Group("/auth")
	auth.Get("/profile", handlers.GetProfile)

	// Cart routes
	cart := app.Group("/cart")
	cart.Get("/", handlers.GetCart)
	cart.Get("/summary", handlers.GetCartSummary)
	cart.Post("/add", handlers.AddToCart)
	cart.Put("/items/:id", handlers.UpdateCartItem)
	cart.Delete("/items/:id", handlers.RemoveFromCart)
	cart.Delete("/clear", handlers.ClearCart)

	// Checkout routes
	checkout := app.Group("/checkout")
	checkout.Post("/", handlers.Checkout)
	checkout.Get("/history", handlers.GetOrderHistory)
	checkout.Get("/orders/:id", handlers.GetOrderDetails)
	checkout.Put("/orders/:id/cancel", handlers.CancelOrder)
}

// AdminRoutes handles admin-only routes
func AdminRoutes(app fiber.Router) {
	// Dashboard
	dashboard := app.Group("/dashboard")
	dashboard.Get("/stats", handlers.GetDashboardStats)
	dashboard.Get("/recent-orders", handlers.GetRecentOrders)
	dashboard.Get("/top-products", handlers.GetTopProducts)
	dashboard.Get("/sales-chart", handlers.GetSalesChart)

	// Product management
	products := app.Group("/products")
	products.Get("/", handlers.GetAdminProducts)
	products.Post("/", handlers.CreateProduct)
	products.Put("/:id", handlers.UpdateProduct)
	products.Delete("/:id", handlers.DeleteProduct)

	// User management
	users := app.Group("/users")
	users.Get("/", handlers.GetAdminUsers)
	users.Get("/:id", handlers.GetAdminUser)
	users.Post("/", handlers.CreateUser)
	users.Put("/:id", handlers.UpdateUser)
	users.Delete("/:id", handlers.DeleteUser)

	// Order management
	orders := app.Group("/orders")
	orders.Get("/", handlers.GetAdminOrders)
	orders.Get("/stats", handlers.GetOrderStats)
	orders.Get("/:id", handlers.GetAdminOrder)
	orders.Put("/:id/status", handlers.UpdateOrderStatus)
	orders.Put("/:id/payment", handlers.UpdatePaymentStatus)
}

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
}

// AdminRoutes handles admin-only routes
func AdminRoutes(app fiber.Router) {
	// Product management
	products := app.Group("/products")
	products.Post("/", handlers.CreateProduct)
	products.Put("/:id", handlers.UpdateProduct)
	products.Delete("/:id", handlers.DeleteProduct)
}

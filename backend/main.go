package main

import (
	"log"

	_ "ecommerce-backend/docs"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"

	"ecommerce-backend/config"
	"ecommerce-backend/database"
	"ecommerce-backend/middleware"
	"ecommerce-backend/routes"
)

// @title E-Commerce API
// @version 1.0
// @description This is a sample e-commerce API server.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize database
	database.ConnectDB()
	database.ConnectRedis()

	// Create Fiber app
	app := fiber.New(fiber.Config{
		ErrorHandler: middleware.ErrorHandler,
	})

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New())

	// CORS configuration
	app.Use(cors.New(cors.Config{
		AllowOrigins:     config.GetString("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174"),
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		ExposeHeaders:    "Content-Length",
		AllowCredentials: true,
	}))

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "E-Commerce API is running",
		})
	})

	// Root route
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "E-Commerce API v1.0",
			"version": "1.0",
			"endpoints": fiber.Map{
				"health": "/health",
				"api":    "/api/v1",
				"docs":   "/swagger/index.html",
			},
		})
	})

	// Swagger documentation - serve static files
	app.Static("/swagger", "./docs")

	// API routes
	api := app.Group("/api/v1")

	// Public routes
	routes.PublicRoutes(api)

	// Protected routes
	protected := api.Group("/protected")
	protected.Use(middleware.JWTProtected())
	routes.ProtectedRoutes(protected)

	// Admin routes
	admin := protected.Group("/admin")
	admin.Use(middleware.AdminProtected())
	routes.AdminRoutes(admin)

	// Start server
	port := config.GetString("PORT", "8080")
	log.Printf("Server starting on port %s", port)
	log.Printf("Swagger documentation available at http://localhost:%s/swagger/index.html", port)

	if err := app.Listen(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

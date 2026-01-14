package database

import (
	"log"

	"ecommerce-backend/models"
	"golang.org/x/crypto/bcrypt"
)

// seedData initializes the database with sample data
func seedData() {
	// Check if admin user already exists
	var adminCount int64
	DB.Model(&models.User{}).Where("role = ?", "admin").Count(&adminCount)
	
	if adminCount == 0 {
		// Create admin user
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		admin := models.User{
			FirstName: "Admin",
			LastName:  "User",
			Email:     "admin@ecommerce.com",
			Password:  string(hashedPassword),
			Role:      "admin",
			IsActive:  true,
		}
		DB.Create(&admin)
		log.Println("Admin user created")
	}

	// Check if categories already exist
	var categoryCount int64
	DB.Model(&models.Category{}).Count(&categoryCount)
	
	if categoryCount == 0 {
		// Create sample categories
		categories := []models.Category{
			{Name: "Electronics", Description: "Electronic devices and gadgets"},
			{Name: "Clothing", Description: "Fashion and apparel"},
			{Name: "Books", Description: "Books and literature"},
			{Name: "Home & Garden", Description: "Home improvement and garden supplies"},
			{Name: "Sports", Description: "Sports equipment and accessories"},
		}
		DB.Create(&categories)
		log.Println("Sample categories created")
	}

	// Check if products already exist
	var productCount int64
	DB.Model(&models.Product{}).Count(&productCount)
	
	if productCount == 0 {
		// Create sample products
		products := []models.Product{
			{
				Name:        "Laptop Pro 15",
				Description: "High-performance laptop with 16GB RAM and 512GB SSD",
				Price:       15999000,
				Stock:       50,
				CategoryID:  1,
				Image:       "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?w=300&h=300&fit=crop&fm=webp&q=70",
				SKU:         "LAPTOP-PRO-15",
				IsActive:    true,
			},
			{
				Name:        "Wireless Headphones",
				Description: "Premium noise-cancelling wireless headphones",
				Price:       2499000,
				Stock:       100,
				CategoryID:  1,
				Image:       "https://images.pexels.com/photos/610945/pexels-photo-610945.jpeg?w=300&h=300&fit=crop&fm=webp&q=70",
				SKU:         "HEADPHONE-WL-001",
				IsActive:    true,
			},
			{
				Name:        "Smart Watch Ultra",
				Description: "Advanced fitness tracking and health monitoring smartwatch",
				Price:       4999000,
				Stock:       75,
				CategoryID:  1,
				Image:       "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?w=300&h=300&fit=crop&fm=webp&q=70",
				SKU:         "WATCH-ULTRA-001",
				IsActive:    true,
			},
			{
				Name:        "Designer T-Shirt",
				Description: "Premium cotton designer t-shirt",
				Price:       299000,
				Stock:       200,
				CategoryID:  2,
				Image:       "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?w=300&h=300&fit=crop&fm=webp&q=70",
				SKU:         "TSHIRT-DSG-001",
				IsActive:    true,
			},
			{
				Name:        "Running Shoes",
				Description: "Professional running shoes with advanced cushioning",
				Price:       1299000,
				Stock:       150,
				CategoryID:  5,
				Image:       "https://images.pexels.com/photos/1124466/pexels-photo-1124466.jpeg?w=300&h=300&fit=crop&fm=webp&q=70",
				SKU:         "SHOES-RUN-001",
				IsActive:    true,
			},
			{
				Name:        "Programming Book",
				Description: "Complete guide to modern programming",
				Price:       450000,
				Stock:       80,
				CategoryID:  3,
				Image:       "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=300&h=300&fit=crop&fm=webp&q=70",
				SKU:         "BOOK-PROG-001",
				IsActive:    true,
			},
			{
				Name:        "Garden Tool Set",
				Description: "Complete garden tool set with 10 essential tools",
				Price:       899000,
				Stock:       60,
				CategoryID:  4,
				Image:       "https://images.pexels.com/photos/5529583/pexels-photo-5529583.jpeg?w=300&h=300&fit=crop&fm=webp&q=70",
				SKU:         "TOOLS-GDN-001",
				IsActive:    true,
			},
			{
				Name:        "Yoga Mat Premium",
				Description: "Extra thick yoga mat with carrying strap",
				Price:       350000,
				Stock:       120,
				CategoryID:  5,
				Image:       "https://images.pexels.com/photos/4327014/pexels-photo-4327014.jpeg?w=300&h=300&fit=crop&fm=webp&q=70",
				SKU:         "YOGA-MAT-001",
				IsActive:    true,
			},
		}
		DB.Create(&products)
		log.Println("Sample products created")
	}
}

package database

import (
	"log"
	"time"

	"ecommerce-backend/models"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// SeedData initializes the database with sample data (exported function)
func SeedData() {
	seedData()
}

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

	// Check if regular users already exist
	var userCount int64
	DB.Model(&models.User{}).Where("role = ?", "user").Count(&userCount)

	if userCount == 0 {
		// Create sample users
		users := []models.User{
			{
				FirstName: "John",
				LastName:  "Doe",
				Email:     "john.doe@example.com",
				Password:  "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
				Phone:     "+62812345678",
				Role:      "user",
				IsActive:  true,
			},
			{
				FirstName: "Jane",
				LastName:  "Smith",
				Email:     "jane.smith@example.com",
				Password:  "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
				Phone:     "+62887654321",
				Role:      "user",
				IsActive:  true,
			},
		}
		DB.Create(&users)
		log.Println("Sample users created")
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

	// Check if orders already exist
	var orderCount int64
	DB.Model(&models.Order{}).Count(&orderCount)

	if orderCount == 0 {
		// Create sample orders with consistent dates
		now := time.Now()
		today := now.Format("2006-01-02")

		// Parse today's date at specific times
		todayMorning, _ := time.Parse("2006-01-02 15:04:05", today+" 09:30:00")
		todayAfternoon, _ := time.Parse("2006-01-02 15:04:05", today+" 14:15:00")
		yesterday, _ := time.Parse("2006-01-02 15:04:05", now.AddDate(0, 0, -1).Format("2006-01-02")+" 16:45:00")

		orders := []models.Order{
			{
				UserID:          2, // John Doe
				OrderNumber:     "ORD-" + uuid.New().String()[:8],
				Status:          "delivered",
				Subtotal:        15999000,
				Tax:             1599900,
				ShippingCost:    50000,
				TotalAmount:     17648900,
				PaymentMethod:   "bank_transfer",
				PaymentStatus:   "paid",
				ShippingAddress: "123 Main St, Jakarta, Indonesia",
				TrackingNumber:  "TRK123456789",
				Notes:           "Delivered successfully",
				CreatedAt:       yesterday,
				UpdatedAt:       yesterday.Add(time.Hour),
			},
			{
				UserID:          3, // Jane Smith
				OrderNumber:     "ORD-" + uuid.New().String()[:8],
				Status:          "delivered",
				Subtotal:        11350000,
				Tax:             1135000,
				ShippingCost:    60000,
				TotalAmount:     12545000,
				PaymentMethod:   "cod",
				PaymentStatus:   "paid",
				ShippingAddress: "456 Oak Ave, Bandung, Indonesia",
				TrackingNumber:  "TRK987654321",
				Notes:           "Delivered this morning",
				CreatedAt:       todayMorning,
				UpdatedAt:       todayMorning.Add(2 * time.Hour),
			},
			{
				UserID:          4, // New user
				OrderNumber:     "ORD-" + uuid.New().String()[:8],
				Status:          "delivered",
				Subtotal:        10500000,
				Tax:             1050000,
				ShippingCost:    45600,
				TotalAmount:     11555600,
				PaymentMethod:   "bank_transfer",
				PaymentStatus:   "paid",
				ShippingAddress: "789 Pine Rd, Surabaya, Indonesia",
				TrackingNumber:  "TRK456789123",
				Notes:           "Delivered this afternoon",
				CreatedAt:       todayAfternoon,
				UpdatedAt:       todayAfternoon.Add(time.Hour),
			},
		}
		DB.Create(&orders)
		log.Println("Sample orders created")

		// Create order items for the orders
		orderItems := []models.OrderItem{
			// Order 1 items (John's delivered order)
			{
				OrderID:    1,
				ProductID:  1, // Laptop Pro 15
				Quantity:   1,
				UnitPrice:  15999000,
				TotalPrice: 15999000,
			},
			// Order 2 items (Jane's processing order)
			{
				OrderID:    2,
				ProductID:  2, // Wireless Headphones
				Quantity:   1,
				UnitPrice:  2499000,
				TotalPrice: 2499000,
			},
			{
				OrderID:    2,
				ProductID:  8, // Yoga Mat Premium
				Quantity:   1,
				UnitPrice:  350000,
				TotalPrice: 350000,
			},
			// Order 3 items (John's pending order)
			{
				OrderID:    3,
				ProductID:  7, // Garden Tool Set
				Quantity:   1,
				UnitPrice:  899000,
				TotalPrice: 899000,
			},
		}
		DB.Create(&orderItems)
		log.Println("Sample order items created")
	}
}

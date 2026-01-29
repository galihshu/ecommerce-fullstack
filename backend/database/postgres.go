package database

import (
	"fmt"
	"log"

	"ecommerce-backend/config"
	"ecommerce-backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// ConnectDB initializes the database connection
func ConnectDB() {
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		config.GetString("DB_HOST", "localhost"),
		config.GetString("DB_PORT", "5432"),
		config.GetString("DB_USER", "postgres"),
		config.GetString("DB_PASSWORD", "1337"),
		config.GetString("DB_NAME", "db_ecommerce"),
		config.GetString("DB_SSLMODE", "disable"),
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connected successfully")

	// Auto migrate all models
	err = DB.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Product{},
		&models.Cart{},
		&models.CartItem{},
		&models.Order{},
		&models.OrderItem{},
		&models.Review{},
		&models.Address{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Database migration completed")

	// Seed initial data
	seedData()
}

// GetDB returns the database connection
func GetDB() *gorm.DB {
	return DB
}

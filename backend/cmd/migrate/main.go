package main

import (
	"log"

	"ecommerce-backend/database"
)

func main() {
	log.Println("Starting database migration...")
	
	// Connect to database
	database.ConnectDB()
	
	log.Println("Migration completed successfully!")
	log.Println("Database tables created and sample data seeded!")
}

package database

import (
	"context"
	"fmt"
	"log"

	"ecommerce-backend/config"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

// ConnectRedis initializes the Redis connection
func ConnectRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", config.GetString("REDIS_HOST", "localhost"), config.GetString("REDIS_PORT", "6379")),
		Password: config.GetString("REDIS_PASSWORD", ""),
		DB:       config.GetInt("REDIS_DB", 0),
	})

	// Test the connection
	ctx := context.Background()
	_, err := RedisClient.Ping(ctx).Result()
	if err != nil {
		log.Printf("Failed to connect to Redis: %v", err)
		return
	}

	log.Println("Redis connected successfully")
}

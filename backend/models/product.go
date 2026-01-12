package models

import (
	"time"

	"gorm.io/gorm"
)

type Category struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name" gorm:"uniqueIndex;not null"`
	Description string         `json:"description"`
	Image       string         `json:"image"`
	IsActive    bool           `json:"is_active" gorm:"default:true"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Products []Product `json:"products,omitempty" gorm:"foreignKey:CategoryID"`
}

type Product struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name" gorm:"not null"`
	Description string         `json:"description"`
	Price       int64          `json:"price" gorm:"not null"`
	Stock       int            `json:"stock" gorm:"default:0"`
	CategoryID  uint           `json:"category_id" gorm:"not null"`
	Image       string         `json:"image"`
	Images      []string       `json:"images" gorm:"type:text[]"`
	SKU         string         `json:"sku" gorm:"uniqueIndex"`
	Weight      float64        `json:"weight"`
	Dimensions  string         `json:"dimensions"`
	IsActive    bool           `json:"is_active" gorm:"default:true"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Category    Category     `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
	CartItems   []CartItem   `json:"cart_items,omitempty" gorm:"foreignKey:ProductID"`
	OrderItems  []OrderItem  `json:"order_items,omitempty" gorm:"foreignKey:ProductID"`
	Reviews     []Review     `json:"reviews,omitempty" gorm:"foreignKey:ProductID"`
}

type Review struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	UserID     uint      `json:"user_id" gorm:"not null"`
	ProductID  uint      `json:"product_id" gorm:"not null"`
	Rating     int       `json:"rating" gorm:"not null;check:rating >= 1 AND rating <= 5"`
	Comment    string    `json:"comment"`
	IsVerified bool      `json:"is_verified" gorm:"default:false"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	// Relationships
	User    User    `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Product Product `json:"product,omitempty" gorm:"foreignKey:ProductID"`
}

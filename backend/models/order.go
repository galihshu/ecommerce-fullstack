package models

import (
	"time"

	"gorm.io/gorm"
)

type Order struct {
	ID            uint           `json:"id" gorm:"primaryKey"`
	UserID        uint           `json:"user_id" gorm:"not null"`
	OrderNumber   string         `json:"order_number" gorm:"uniqueIndex;not null"`
	Status        string         `json:"status" gorm:"default:pending"` // pending, processing, shipped, delivered, cancelled
	Subtotal      int64          `json:"subtotal"`
	Tax           int64          `json:"tax"`
	ShippingCost  int64          `json:"shipping_cost"`
	TotalAmount   int64          `json:"total_amount"`
	PaymentMethod string         `json:"payment_method"`
	PaymentStatus string         `json:"payment_status" gorm:"default:pending"` // pending, paid, failed, refunded
	ShippingAddress string       `json:"shipping_address"`
	TrackingNumber string        `json:"tracking_number"`
	Notes         string         `json:"notes"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	User       User        `json:"user,omitempty" gorm:"foreignKey:UserID"`
	OrderItems []OrderItem `json:"order_items,omitempty" gorm:"foreignKey:OrderID"`
}

type OrderItem struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	OrderID     uint      `json:"order_id" gorm:"not null"`
	ProductID   uint      `json:"product_id" gorm:"not null"`
	Quantity    int       `json:"quantity" gorm:"not null"`
	UnitPrice   int64     `json:"unit_price"`
	TotalPrice  int64     `json:"total_price"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	// Relationships
	Order   Order   `json:"order,omitempty" gorm:"foreignKey:OrderID"`
	Product Product `json:"product,omitempty" gorm:"foreignKey:ProductID"`
}

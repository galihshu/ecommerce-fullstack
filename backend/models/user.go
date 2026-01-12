package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	FirstName string         `json:"first_name" gorm:"not null"`
	LastName  string         `json:"last_name" gorm:"not null"`
	Email     string         `json:"email" gorm:"uniqueIndex;not null"`
	Password  string         `json:"-" gorm:"not null"`
	Phone     string         `json:"phone"`
	Role      string         `json:"role" gorm:"default:user"`
	IsActive  bool           `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Addresses []Address `json:"addresses,omitempty" gorm:"foreignKey:UserID"`
	Carts     []Cart    `json:"carts,omitempty" gorm:"foreignKey:UserID"`
	Orders    []Order   `json:"orders,omitempty" gorm:"foreignKey:UserID"`
	Reviews   []Review  `json:"reviews,omitempty" gorm:"foreignKey:UserID"`
}

type Address struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id" gorm:"not null"`
	Type      string    `json:"type"` // home, work, other
	Address   string    `json:"address" gorm:"not null"`
	City      string    `json:"city" gorm:"not null"`
	Province  string    `json:"province" gorm:"not null"`
	PostalCode string   `json:"postal_code" gorm:"not null"`
	IsDefault bool      `json:"is_default" gorm:"default:false"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

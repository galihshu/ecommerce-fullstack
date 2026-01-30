package middleware

import (
	"github.com/gofiber/fiber/v2"
)

// ErrorHandler handles errors in a consistent way across the application
func ErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
	}
	return c.Status(code).JSON(fiber.Map{
		"error": err.Error(),
	})
}

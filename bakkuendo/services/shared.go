package services

import (
	"os"
)

var isOffline bool

func init() {
	if os.Getenv("IS_OFFLINE") == "true" {
		isOffline = true
	}
}

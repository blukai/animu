package config

import (
	"os"
	"strings"

	"github.com/spf13/viper"
)

func init() {
	viper.SetEnvPrefix("animu")
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv()

	if os.Getenv("IS_OFFLINE") == "true" {
		setTestingDefaults()
	}
}

func setTestingDefaults() {
	viper.SetDefault("offline", true)

	viper.SetDefault("s3.bucket.name", "AnimuTest")
	viper.SetDefault("s3.endpoint", "http://0.0.0.0:9091")
}

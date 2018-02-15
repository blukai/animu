package main

import (
	"bytes"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/blukai/animu/bakkuendo/internal/apis/anidb"
	_ "github.com/blukai/animu/bakkuendo/internal/config"
	"github.com/blukai/animu/bakkuendo/internal/services/s3"
	"github.com/blukai/animu/bakkuendo/internal/utils"
)

func dumper() error {
	anititles, err := anidb.GetDump()
	if err != nil {
		return err
	}

	jsonized, err := json.Marshal(anititles)
	if err != nil {
		return fmt.Errorf("could not jsonize: %v", err)
	}

	compressed, err := utils.Compress(jsonized)
	if err != nil {
		return fmt.Errorf("could not compress: %v", err)
	}

	s3svc := s3.New()

	input := &s3manager.UploadInput{
		Key:             aws.String("anime-titles.json.gz"),
		ContentType:     aws.String("application/json"),
		ContentEncoding: aws.String("gzip"),
		Body:            bytes.NewReader(compressed),
	}
	if _, err := s3svc.Put(input); err != nil {
		return fmt.Errorf("failed to upload: %v", err)
	}

	return nil
}

func main() {
	lambda.Start(dumper)
}

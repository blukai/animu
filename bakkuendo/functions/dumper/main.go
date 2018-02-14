package main

import (
	"bytes"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/blukai/animu/bakkuendo/datasources/anidb"
	"github.com/blukai/animu/bakkuendo/services"
)

func dumper() error {
	dump, err := anidb.Dump()
	if err != nil {
		return err
	}

	data, err := json.Marshal(dump)
	if err != nil {
		return fmt.Errorf("could not jsonize: %v", err)
	}

	s3svc := services.NewS3()

	compressed, err := s3svc.Compress(data)
	if err != nil {
		return fmt.Errorf("could not compress: %v", err)
	}

	input := &s3manager.UploadInput{
		Key:             aws.String("anime-titles.json.gz"),
		ContentType:     aws.String("application/json"),
		ContentEncoding: aws.String("gzip"),
		Body:            bytes.NewReader(compressed),
	}
	if _, err := s3svc.Upload(input); err != nil {
		return fmt.Errorf("failed to upload: %v", err)
	}

	return nil
}

func main() {
	lambda.Start(dumper)
}

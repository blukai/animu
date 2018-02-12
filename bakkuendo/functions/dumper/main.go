package main

import (
	"bytes"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/blukai/animu/bakkuendo/constants"
	"github.com/blukai/animu/bakkuendo/pkg/datasources/anidb"
)

func dumper() error {
	dump, err := anidb.Dump()
	if err != nil {
		return err
	}

	jd, err := json.Marshal(dump)
	if err != nil {
		return fmt.Errorf("could not jsonize anidb's anime titles: %v", err)
	}

	uploader := s3manager.NewUploader(session.Must(session.NewSession()))

	input := &s3manager.UploadInput{
		Bucket:      aws.String(fmt.Sprintf("%s-x", constants.PREFIX)),
		Key:         aws.String("anime-titles.json"),
		ContentType: aws.String("application/json"),
		Body:        bytes.NewReader(jd),
	}

	if _, err := uploader.Upload(input); err != nil {
		return fmt.Errorf("failed to upload dump: %v", err)
	}

	return nil
}

func main() {
	lambda.Start(dumper)
}

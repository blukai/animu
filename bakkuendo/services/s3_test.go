package services

import (
	"bytes"
	"testing"

	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

func TestS3(t *testing.T) {
	key := "secrit.txt"
	body := []byte("¯\\_(ツ)_/¯")

	svc := NewS3()

	// ----

	if _, err := svc.Upload(&s3manager.UploadInput{
		Key:  &key,
		Body: bytes.NewReader(body),
	}); err != nil {
		t.Fatal(err)
	}

	// ----

	res, err := svc.Download(&s3.GetObjectInput{
		Key: &key,
	})
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(res, body) {
		t.Fatalf("smth went wrong.\nexpected: %s\n     got: %s", string(body), string(res))
	}
}

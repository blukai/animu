package s3

import (
	"bytes"
	"testing"

	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

func TestPutGet(t *testing.T) {
	key := "secrit.txt"
	body := []byte("¯\\_(ツ)_/¯")

	svc := New()

	// ----

	if _, err := svc.Put(&s3manager.UploadInput{
		Key:  &key,
		Body: bytes.NewReader(body),
	}); err != nil {
		t.Fatal(err)
	}

	// ----

	res, err := svc.Get(&s3.GetObjectInput{
		Key: &key,
	})
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(res, body) {
		t.Fatalf("\nexpected: %s\n     got: %s", string(body), string(res))
	}
}

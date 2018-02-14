package services

import (
	"bytes"
	"io/ioutil"
	"testing"

	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

var svc S3

func init() {
	svc = NewS3()
}

func TestS3UpDown(t *testing.T) {
	key := "secrit.txt"
	body := []byte("¯\\_(ツ)_/¯")

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

func TestS3Compression(t *testing.T) {
	data, err := ioutil.ReadFile("../testdata/anime-titles.xml")
	if err != nil {
		t.Fatal(err)
	}

	compressed, err := svc.Compress(data)
	if err != nil {
		t.Fatal(err)
	}
	if c, r := len(compressed), len(data); c >= r {
		t.Errorf("compressed data (%d) should not be bigger than raw (%d)", c, r)
	}

	uncompressed, err := svc.Uncompress(compressed)
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(data, uncompressed) {
		t.Error("oops, something went wrong")
	}
}

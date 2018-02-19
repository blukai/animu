package testutils

import (
	"bytes"
	"io/ioutil"
	"testing"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/blukai/animu/bakkuendo/internal/apis/anidb"
	"github.com/blukai/animu/bakkuendo/internal/services/s3"
	"github.com/blukai/animu/bakkuendo/internal/utils"
)

func PrepareAnititlesTestdata(t *testing.T) {
	anititles, err := ioutil.ReadFile("../../testdata/anime-titles.json")
	if err != nil {
		t.Fatal(err)
	}

	compressed, err := utils.Compress(anititles)
	if err != nil {
		t.Fatalf("could not compress: %v", err)
	}

	s3svc := s3.New()

	input := &s3manager.UploadInput{
		Key:  aws.String("anime-titles.json.gz"),
		Body: bytes.NewReader(compressed),
	}
	if _, err := s3svc.Put(input); err != nil {
		t.Fatalf("failed to upload: %v", err)
	}
}

func CheckAnititles(t *testing.T, at *[]anidb.Anititle) {
	if len(*at) == 0 {
		t.Fatal("got nothing")
	}

	for _, anime := range *at {
		if anime.ID <= 0 {
			t.Error("no id")
		}

		for _, title := range anime.Titles {
			if title.Lang == "" {
				t.Error("no lang")
			}
			if title.Type == "" {
				t.Error("no type")
			}
			if title.Text == "" {
				t.Error("no text")
			}
		}
	}
}

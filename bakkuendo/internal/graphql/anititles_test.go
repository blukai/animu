package graphql

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"testing"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/blukai/animu/bakkuendo/internal/apis/anidb"
	"github.com/blukai/animu/bakkuendo/internal/services/s3"
	"github.com/blukai/animu/bakkuendo/internal/testutils"
	"github.com/blukai/animu/bakkuendo/internal/utils"
)

func prepareAnititlesTestdata() error {
	anititles, err := ioutil.ReadFile("../../testdata/anime-titles.json")
	if err != nil {
		return err
	}

	compressed, err := utils.Compress(anititles)
	if err != nil {
		return fmt.Errorf("could not compress: %v", err)
	}

	s3svc := s3.New()

	input := &s3manager.UploadInput{
		Key:  aws.String("anime-titles.json.gz"),
		Body: bytes.NewReader(compressed),
	}
	if _, err := s3svc.Put(input); err != nil {
		return fmt.Errorf("failed to upload: %v", err)
	}

	return nil
}

func TestAnitltes(t *testing.T) {
	if err := prepareAnititlesTestdata(); err != nil {
		t.Errorf("could not prepare test data: %v", err)
	}

	// ----

	res := exec(`
{
	anititles(afterID: 10000) {
		id
		titles {
			type
			lang
			text
		}
	}
}
`)
	if len(res.Errors) > 0 {
		t.Fatalf("%+v", res.Errors)
	}

	var at struct {
		Anititles []anidb.Anititle `json:"anititles"`
	}
	if err := json.Unmarshal(res.Data, &at); err != nil {
		t.Errorf("could not unmarshal: %v", err)
	}

	testutils.CheckAnititles(t, &at.Anititles)
}

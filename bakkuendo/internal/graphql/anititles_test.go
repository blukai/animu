package graphql

import (
	"encoding/json"
	"testing"

	"github.com/blukai/animu/bakkuendo/internal/apis/anidb"
	"github.com/blukai/animu/bakkuendo/internal/testutils"
)

func TestAnitltes(t *testing.T) {
	testutils.PrepareAnititlesTestdata(t)

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

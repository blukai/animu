package testutils

import (
	"testing"

	"github.com/blukai/animu/bakkuendo/internal/apis/anidb"
)

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

package anidb

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetDump(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Encoding", "gzip")

		data, err := ioutil.ReadFile("../../../testdata/anime-titles.xml.gz")
		if err != nil {
			t.Fatal(err)
		}

		_, err = w.Write(data)
		if err != nil {
			t.Fatal(err)
		}
	}))
	defer ts.Close()

	// ----

	anititles, err := GetDump(ts.URL)
	if err != nil {
		t.Fatal(err)
	}

	if len(anititles) == 0 {
		t.Fatal("got nothing")
	}

	for _, anime := range anititles {
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

package main

import (
	"bytes"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestAniDBDumper(t *testing.T) {
	// create http server to simulate endpoint
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Encoding", "gzip")

		data, err := ioutil.ReadFile("./testdata/anime-titles.xml.gz")
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

	dump := new(AniDB)

	// - Get

	raw, err := dump.get(ts.URL)
	if err != nil {
		t.Fatal(err)
	}

	exp, err := ioutil.ReadFile("./testdata/anime-titles.xml")
	if err != nil {
		t.Fatal(err)
	}

	if !bytes.Equal(raw, exp) {
		t.Fatal("oops, something went wrong, got unexpected result")
	}

	// - Parse

	parsed, err := dump.parse(raw)
	if err != nil {
		t.Fatal(err)
	}

	// t.Logf("%+v", parsed)

	// - Filter

	dump.filter(parsed, map[string]bool{"en": true})

	// t.Logf("%+v", filtered)

	// ¯\_(ツ)_/¯
}

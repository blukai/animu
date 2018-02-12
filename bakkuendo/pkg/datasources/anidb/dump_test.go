package anidb

import (
	"bytes"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

var ts *httptest.Server

func init() {
	// create http server to simulate endpoint
	ts = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Encoding", "gzip")

		data, err := ioutil.ReadFile("../../../testdata/anime-titles.xml.gz")
		if err != nil {
			panic(err)
		}

		_, err = w.Write(data)
		if err != nil {
			panic(err)
		}
	}))
}

func TestMethods(t *testing.T) {
	at := new(dump)

	// get

	if err := at.get(ts.URL); err != nil {
		t.Fatal(err)
	}

	exp, err := ioutil.ReadFile("../../../testdata/anime-titles.xml")
	if err != nil {
		t.Fatal(err)
	}

	if !bytes.Equal(at.raw, exp) {
		t.Fatal("oops, something went wrong, got unexpected result")
	}

	// parse

	if err := at.parse(); err != nil {
		t.Fatal(err)
	}

	for _, anime := range at.parsed {
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

func TestDump(t *testing.T) {
	dump, err := Dump(ts.URL)
	if err != nil {
		t.Fatal(err)
	}

	if len(dump) <= 0 {
		t.Fatal("no anime 😳")
	}
}

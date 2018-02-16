package anidb_test

// testutils imports the anidb.Anititle type, so package name of this file
// contains the _test suffix to avoid the import cycle

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/blukai/animu/bakkuendo/internal/apis/anidb"
	"github.com/blukai/animu/bakkuendo/internal/testutils"
)

func TestGetAnititles(t *testing.T) {
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

	anititles, err := anidb.GetAnititles(ts.URL)
	if err != nil {
		t.Fatal(err)
	}

	testutils.CheckAnititles(t, &anititles)
}

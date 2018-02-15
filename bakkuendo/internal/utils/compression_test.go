package utils

import (
	"bytes"
	"io/ioutil"
	"testing"
)

func TestCompression(t *testing.T) {
	data, err := ioutil.ReadFile("../../testdata/anime-titles.xml")
	if err != nil {
		t.Fatal(err)
	}

	compressed, err := Compress(data)
	if err != nil {
		t.Fatal(err)
	}
	if c, r := len(compressed), len(data); c >= r {
		t.Errorf("compressed data (%d) should not be bigger than raw (%d)", c, r)
	}

	uncompressed, err := Uncompress(compressed)
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(data, uncompressed) {
		t.Error("oops, something went wrong")
	}
}

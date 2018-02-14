package anidb

import (
	"encoding/xml"
	"fmt"
	"io/ioutil"
	"net/http"
)

const dumpURL = "http://anidb.net/api/anime-titles.xml.gz"

// ----

// DumpAnime is an anime in AniDB's anime titles dump
type DumpAnime struct {
	ID     int64            `xml:"aid,attr" json:"id,omitempty"`
	Titles []DumpAnimeTitle `xml:"title" json:"titles,omitempty"`
}

// DumpAnimeTitle represents the title and its attributes
type DumpAnimeTitle struct {
	Type string `xml:"type,attr" json:"type,omitempty"`
	Lang string `xml:"lang,attr" json:"lang,omitempty"`
	Text string `xml:",chardata" json:"text,omitempty"`
}

// ----

type dump struct {
	raw    []byte
	parsed []DumpAnime
}

func (x *dump) get(urls ...string) error {
	da := dumpURL
	if len(urls) > 0 {
		da = urls[0]
	}

	res, err := http.Get(da)
	if err != nil {
		return fmt.Errorf("could not get dump: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return fmt.Errorf(res.Status)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return fmt.Errorf("could not read body: %v", err)
	}

	x.raw = data

	return nil
}

func (x *dump) parse() error {
	var v struct {
		Anime []DumpAnime `xml:"anime"`
	}
	if err := xml.Unmarshal(x.raw, &v); err != nil {
		return fmt.Errorf("could not parse xml: %v", err)
	}

	x.parsed = v.Anime

	return nil
}

// ----

// ----

// Dump creates a dump of the anime titles, provided by AniDB
// urls is an optional argument, only the first index will be used,
// if it is provided, to download dump
func Dump(urls ...string) ([]DumpAnime, error) {
	dump := new(dump)
	if err := dump.get(urls...); err != nil {
		return nil, err
	}
	if err := dump.parse(); err != nil {
		return nil, err
	}

	return dump.parsed, nil
}

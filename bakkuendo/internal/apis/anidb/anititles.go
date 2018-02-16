package anidb

import (
	"encoding/xml"
	"fmt"
	"net/http"
)

// Anititle is an anime in AniDB's anime titles dump
type Anititle struct {
	ID     int32        `xml:"aid,attr" json:"id"`
	Titles []AnimeTitle `xml:"title" json:"titles"`
}

// GetAnititles gets a daily updated dump of anime titles.
// `urls` is an optional argument, only the first index will be used,
// if it is provided, to download dump.
func GetAnititles(uris ...string) ([]Anititle, error) {
	uri := "https://anidb.net/api/anime-titles.xml.gz"
	if len(uris) > 0 {
		uri = uris[0]
	}

	res, err := http.Get(uri)
	if err != nil {
		return nil, fmt.Errorf("could not get dump: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf(res.Status)
	}

	var v struct {
		Anime []Anititle `xml:"anime"`
	}
	if err := xml.NewDecoder(res.Body).Decode(&v); err != nil {
		return nil, fmt.Errorf("could not decode dump: %v", err)
	}

	return v.Anime, nil
}

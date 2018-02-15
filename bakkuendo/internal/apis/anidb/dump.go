package anidb

import (
	"encoding/xml"
	"fmt"
	"net/http"
)

const dumpURL = "https://anidb.net/api/anime-titles.xml.gz"

// DumpAnime is an anime in AniDB's anime titles dump
type DumpAnime struct {
	ID     int32            `xml:"aid,attr" json:"id"`
	Titles []DumpAnimeTitle `xml:"title" json:"titles"`
}

// DumpAnimeTitle represents the title and its attributes
type DumpAnimeTitle struct {
	Type string `xml:"type,attr" json:"type"`
	Lang string `xml:"lang,attr" json:"lang"`
	Text string `xml:",chardata" json:"text"`
}

// GetDump gets a daily updated dump of anime titles.
// `urls` is an optional argument, only the first index will be used,
// if it is provided, to download dump.
func GetDump(urls ...string) ([]DumpAnime, error) {
	da := dumpURL
	if len(urls) > 0 {
		da = urls[0]
	}

	res, err := http.Get(da)
	if err != nil {
		return nil, fmt.Errorf("could not get dump: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf(res.Status)
	}

	var v struct {
		Anime []DumpAnime `xml:"anime"`
	}
	if err := xml.NewDecoder(res.Body).Decode(&v); err != nil {
		return nil, fmt.Errorf("could not decode dump: %v", err)
	}

	return v.Anime, nil
}

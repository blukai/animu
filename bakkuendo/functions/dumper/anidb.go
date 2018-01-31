package main

import (
	"encoding/xml"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/blukai/animu/bakkuendo/types"
)

// Specification: http://wiki.anidb.net/w/User:Eloyard/anititles_dump

type AniDB struct{}

func (*AniDB) get(urls ...string) ([]byte, error) {
	var url string
	if len(urls) > 0 {
		url = urls[0]
	} else {
		url = "http://anidb.net/api/anime-titles.xml.gz"
	}

	res, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("could not get anime titles: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf(res.Status)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("could not read body: %v", err)
	}

	return data, nil
}

func (*AniDB) parse(in []byte) ([]types.AniDBDump_Anime, error) {
	var v struct {
		Anime []types.AniDBDump_Anime `xml:"anime"`
	}
	if err := xml.Unmarshal(in, &v); err != nil {
		return nil, fmt.Errorf("could not unmarshal xml: %v", err)
	}

	return v.Anime, nil
}

func (*AniDB) filter(in []types.AniDBDump_Anime, langs map[string]bool) []types.AniDBDump_Anime {
	out := in
	for ai, anime := range in {
		titles := []types.AniDBDump_AnimeTitle{}
		for _, title := range anime.Titles {
			if langs[strings.ToLower(title.Lang)] {
				titles = append(titles, title)
			}
		}
		if len(titles) > 0 {
			out[ai].Titles = titles
		}
	}
	return out
}

func (x *AniDB) Dump(langs map[string]bool) ([]types.AniDBDump_Anime, error) {
	raw, err := x.get()
	if err != nil {
		return nil, err
	}

	parsed, err := x.parse(raw)
	if err != nil {
		return nil, err
	}

	return x.filter(parsed, langs), nil
}

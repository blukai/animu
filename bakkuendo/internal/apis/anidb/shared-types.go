package anidb

// shared because it may be used in anime request in future
// otherwise I'll move it to anititles.go

// AnimeTitle represents the anime title object
type AnimeTitle struct {
	Type string `xml:"type,attr" json:"type"`
	Lang string `xml:"lang,attr" json:"lang"`
	Text string `xml:",chardata" json:"text"`
}

package anidb

// AnimeTitle represents the anime title object
type AnimeTitle struct {
	Type string `xml:"type,attr" json:"type"`
	Lang string `xml:"lang,attr" json:"lang"`
	Text string `xml:",chardata" json:"text"`
}

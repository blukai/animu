package types

type AniDBDump_Anime struct {
	ID     int64                  `xml:"aid,attr" json:"id,omitempty"`
	Titles []AniDBDump_AnimeTitle `xml:"title" json:"titles,omitempty"`
}

type AniDBDump_AnimeTitle struct {
	Type string `xml:"type,attr" json:"type,omitempty"`
	Lang string `xml:"lang,attr" json:"lang,omitempty"`
	Text string `xml:",chardata" json:"text,omitempty"`
}

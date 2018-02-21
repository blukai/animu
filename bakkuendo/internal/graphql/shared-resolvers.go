package graphql

import "github.com/blukai/animu/bakkuendo/internal/apis/anidb"

// shared because it may be used in anime query in future
// otherwise I'll move it to anititles.go

// AnimeTitle is the base type for anime title
type AnimeTitle anidb.AnimeTitle

// TYPE resolves type for the title
func (t *AnimeTitle) TYPE() string {
	return t.Type
}

// LANG resolves lang for the title
func (t *AnimeTitle) LANG() string {
	return t.Lang
}

// TEXT resolves text for the title
func (t *AnimeTitle) TEXT() string {
	return t.Text
}

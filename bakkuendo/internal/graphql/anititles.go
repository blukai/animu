package graphql

import (
	"encoding/json"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/blukai/animu/bakkuendo/internal/apis/anidb"
	s3service "github.com/blukai/animu/bakkuendo/internal/services/s3"
	"github.com/blukai/animu/bakkuendo/internal/utils"
)

// Anititles resolves the anititles query
func (*Resolver) Anititles(args struct{ AfterID int32 }) ([]*Anititle, error) {
	svc := s3service.New()

	compressed, err := svc.Get(&s3.GetObjectInput{
		Key: aws.String("anime-titles.json.gz"),
	})
	if err != nil {
		return nil, err
	}

	uncompressed, err := utils.Uncompress(compressed)
	if err != nil {
		return nil, err
	}

	var anititles []*anidb.Anititle
	if err := json.Unmarshal(uncompressed, &anititles); err != nil {
		return nil, err
	}

	var ats []*Anititle
	for _, anime := range anititles {
		if anime.ID > args.AfterID {
			ats = append(ats, &Anititle{anime})
		}
	}

	return ats, nil
}

// ----

// Anititle is the base type for dumped anime
type Anititle struct {
	data *anidb.Anititle
}

// ID resolves the anime id
func (a *Anititle) ID() int32 {
	return a.data.ID
}

// TITLES resolves the anime titles
func (a *Anititle) TITLES() (titles []*AnimeTitle) {
	for _, title := range a.data.Titles {
		t := AnimeTitle(title)
		titles = append(titles, &t)
	}
	return titles
}

package graphql

import (
	graphql "github.com/neelance/graphql-go"
)

// SCHEMA is a definition of graphql schema
const SCHEMA = `
schema {
	query: RootQuery
  }

  type RootQuery {
	# anititles represents anime titles provided by AniDB.
	# Required for updating local listing of anime titles
	# that serves to ensure quick anime search in the app.
	anititles(afterID: Int!): [Anititle!]!
  }

  # ----

  type Anititle {
	id: Int!
	titles: [AnimeTitle!]!
  }

  type AnimeTitle {
	type: String!
	lang: String!
	text: String!
  }
`

// Resolver is the root resolver
type Resolver struct{}

// New initializes a new schema
func New() (*graphql.Schema, error) {
	return graphql.MustParseSchema(string(SCHEMA), &Resolver{}), nil
}

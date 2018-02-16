package graphql

import (
	"io/ioutil"

	graphql "github.com/neelance/graphql-go"
)

// Resolver is the root resolver
type Resolver struct{}

// New initializes a new schema
func New() (*graphql.Schema, error) {
	schema, err := ioutil.ReadFile("./schema.gql")
	if err != nil {
		return nil, err
	}

	return graphql.MustParseSchema(string(schema), &Resolver{}), nil
}

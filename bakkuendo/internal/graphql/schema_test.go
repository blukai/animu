package graphql

import (
	"context"
	"io/ioutil"

	graphql "github.com/neelance/graphql-go"
)

var schema *graphql.Schema

func init() {
	s, err := ioutil.ReadFile("./schema.gql")
	if err != nil {
		panic(err)
	}

	schema = graphql.MustParseSchema(string(s), &Resolver{})
}

func exec(query string, variables ...map[string]interface{}) *graphql.Response {
	var vars map[string]interface{}
	if len(variables) > 0 {
		vars = variables[0]
	}
	return schema.Exec(context.Background(), query, "", vars)
}

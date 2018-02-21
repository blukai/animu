package graphql

import (
	"context"

	graphql "github.com/neelance/graphql-go"
)

var schema *graphql.Schema

func init() {
	schema = New()
}

func exec(query string, variables ...map[string]interface{}) *graphql.Response {
	var vars map[string]interface{}
	if len(variables) > 0 {
		vars = variables[0]
	}
	return schema.Exec(context.Background(), query, "", vars)
}

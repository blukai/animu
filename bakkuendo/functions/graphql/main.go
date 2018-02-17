package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/blukai/animu/bakkuendo/internal/graphql"
)

// GraphQLRequest represents a GraphQL request
type GraphQLRequest struct {
	QueryString   string                 `json:"query"`
	OperationName string                 `json:"operationName,omitempty"`
	Variables     map[string]interface{} `json:"variables,omitempty"`
}

func handle(ctx context.Context, req events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	var payload GraphQLRequest
	if err := json.Unmarshal([]byte(req.Body), &payload); err != nil {
		return nil, fmt.Errorf("could not unmarshal body: %v", err)
	}

	schema, err := graphql.New()
	if err != nil {
		return nil, fmt.Errorf("could not create a schema: %v", err)
	}

	executionResult := schema.Exec(ctx, payload.QueryString, payload.OperationName, payload.Variables)
	responseBody, err := json.Marshal(executionResult)
	if err != nil {
		return nil, fmt.Errorf("could not marshal execution result: %v", err)
	}

	return &events.APIGatewayProxyResponse{Body: string(responseBody), StatusCode: 200}, nil
}

func main() {
	lambda.Start(handle)
}

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

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

type badResponse struct {
	Error string `json:"error"`
}

func createBadResponse(err string) string {
	br, _ := json.Marshal(badResponse{err})
	return string(br)
}

func handle(ctx context.Context, req events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	response := &events.APIGatewayProxyResponse{
		Headers: map[string]string{
			"Access-Control-Allow-Origin":  "*",
			"Access-Control-Allow-Headers": "Content-Type,X-Api-Key",
			"Access-Control-Allow-Methods": "POST,OPTIONS",
		},
	}

	if req.HTTPMethod == "OPTIONS" {
		response.StatusCode = http.StatusOK
		return response, nil
	}

	if req.HTTPMethod != "POST" {
		response.StatusCode = http.StatusMethodNotAllowed
		return response, nil
	}

	var payload GraphQLRequest
	if err := json.Unmarshal([]byte(req.Body), &payload); err != nil {
		response.Body = createBadResponse(fmt.Sprintf("could not unmarshal body: %v", err))
		response.StatusCode = http.StatusBadRequest
		return response, nil
	}

	schema, err := graphql.New()
	if err != nil {
		response.Body = createBadResponse(fmt.Sprintf("could not create a schema: %v", err))
		response.StatusCode = http.StatusInternalServerError
		return response, nil
	}

	executionResult := schema.Exec(ctx, payload.QueryString, payload.OperationName, payload.Variables)
	responseBody, err := json.Marshal(executionResult)
	if err != nil {
		response.Body = createBadResponse(fmt.Sprintf("could not marshal execution result: %v", err))
		response.StatusCode = http.StatusInternalServerError
		return response, nil
	}

	response.Body = string(responseBody)
	response.StatusCode = http.StatusOK
	return response, nil
}

func main() {
	lambda.Start(handle)
}

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

// graphQLRequest represents a GraphQL request
type graphQLRequest struct {
	QueryString   string                 `json:"query"`
	OperationName string                 `json:"operationName,omitempty"`
	Variables     map[string]interface{} `json:"variables,omitempty"`
}

func createBadResponse(err string) string {
	res := struct {
		Error string `json:"error"`
	}{err}
	br, _ := json.Marshal(res)
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

	// request checks

	if req.HTTPMethod == "OPTIONS" {
		response.StatusCode = http.StatusOK
		return response, nil
	}

	if req.HTTPMethod != "POST" {
		response.StatusCode = http.StatusMethodNotAllowed
		return response, nil
	}

	if req.Body == "" {
		response.Body = createBadResponse("no body provided")
		response.StatusCode = http.StatusBadRequest
		return response, nil
	}

	// execution

	var payload graphQLRequest
	if err := json.Unmarshal([]byte(req.Body), &payload); err != nil {
		response.Body = createBadResponse(fmt.Sprintf("could not unmarshal body: %v", err))
		response.StatusCode = http.StatusBadRequest
		return response, nil
	}

	schema := graphql.New()
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

package main

import (
	"context"
	"net/http"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/blukai/animu/bakkuendo/internal/testutils"
)

var testcases = []struct {
	req                events.APIGatewayProxyRequest
	expectedStatusCode int
}{
	{
		req: events.APIGatewayProxyRequest{
			HTTPMethod: "ANY",
		},
		expectedStatusCode: http.StatusMethodNotAllowed,
	},
	{
		req: events.APIGatewayProxyRequest{
			HTTPMethod: "OPTIONS",
		},
		expectedStatusCode: http.StatusOK,
	},
	{
		req: events.APIGatewayProxyRequest{
			HTTPMethod: "POST",
		},
		expectedStatusCode: http.StatusBadRequest,
	},
	{
		req: events.APIGatewayProxyRequest{
			HTTPMethod: "POST",
			Body: `
			{
				"query": "query($id: Int!) { anititles(afterID: $id) { id } }",
				"variables": {
					"id": 13600
				}
			}
			`,
		},
		expectedStatusCode: http.StatusOK,
	},
}

func TestHandler(t *testing.T) {
	testutils.PrepareAnititlesTestdata(t)

	for _, testcase := range testcases {
		res, err := handle(context.Background(), testcase.req)
		if err != nil {
			t.Fatal(err)
		}

		if res.StatusCode != testcase.expectedStatusCode {
			t.Fatalf("unexpected status code: %d != %d", res.StatusCode, testcase.expectedStatusCode)
		}
	}
}

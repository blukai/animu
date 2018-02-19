package main

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/blukai/animu/bakkuendo/internal/testutils"
)

func TestQuery(t *testing.T) {
	testutils.PrepareAnititlesTestdata(t)

	// ----

	req := GraphQLRequest{
		QueryString: `
			query($aid: Int!) {
				anititles(afterID: $aid) {
					id
				}
			 }
		`,
		Variables: map[string]interface{}{
			"aid": 13600,
		},
	}
	body, err := json.Marshal(req)
	if err != nil {
		t.Fatal(err)
	}

	input := events.APIGatewayProxyRequest{
		HTTPMethod: "POST",
		Body:       string(body),
	}
	res, err := handle(context.Background(), input)
	if err != nil {
		t.Fatal(err)
	}

	if !strings.Contains(res.Body, "13691") {
		t.Fatalf("expected result to contain id of Zokuowarimonogatari - 13691\n%s", res.Body)
	}
}

func TestMethods(t *testing.T) {
	for _, testcase := range []struct {
		method             string
		expectedStatusCode int
	}{
		{"OPTIONS", http.StatusOK},
		{"ANY", http.StatusMethodNotAllowed},
	} {
		input := events.APIGatewayProxyRequest{
			HTTPMethod: testcase.method,
		}
		res, err := handle(context.Background(), input)
		if err != nil {
			t.Fatal(err)
		}

		if res.StatusCode != testcase.expectedStatusCode {
			t.Fatalf("unexpected status code: %d != %d", res.StatusCode, testcase.expectedStatusCode)
		}
	}
}

package main

import (
	"context"
	"encoding/json"
	"strings"
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

func TestMain(t *testing.T) {
	req := GraphQLRequest{
		QueryString: `{ anititles(afterID: 13600) { id } }`,
	}
	body, err := json.Marshal(req)
	if err != nil {
		t.Fatal(err)
	}

	input := events.APIGatewayProxyRequest{
		Body: string(body),
	}
	res, err := handle(context.Background(), input)
	if err != nil {
		t.Fatal(err)
	}

	if !strings.Contains(res.Body, "13691") {
		t.Fatalf("expected result to contain id of Zokuowarimonogatari - 13691\n%s", res.Body)
	}
}

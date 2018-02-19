resource "aws_api_gateway_rest_api" "animu" {
  name = "animu"
}

# graphql proxy

resource "aws_api_gateway_resource" "graphql" {
  rest_api_id = "${aws_api_gateway_rest_api.animu.id}"
  parent_id   = "${aws_api_gateway_rest_api.animu.root_resource_id}"
  path_part   = "graphql"
}

resource "aws_api_gateway_method" "graphql" {
  rest_api_id   = "${aws_api_gateway_rest_api.animu.id}"
  resource_id   = "${aws_api_gateway_resource.graphql.id}"
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "graphql" {
  rest_api_id             = "${aws_api_gateway_rest_api.animu.id}"
  resource_id             = "${aws_api_gateway_resource.graphql.id}"
  http_method             = "${aws_api_gateway_method.graphql.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${var.apex_function_graphql}/invocations"
}

resource "aws_lambda_permission" "graphql" {
  action        = "lambda:InvokeFunction"
  function_name = "${var.apex_function_graphql}"
  principal     = "apigateway.amazonaws.com"
  statement_id  = "AllowExecutionFromAPIGateway"
  source_arn    = "arn:aws:execute-api:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.animu.id}/*/*/*"
}

# ----

resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [
    "aws_api_gateway_integration.graphql",
  ]

  rest_api_id = "${aws_api_gateway_rest_api.animu.id}"
  stage_name  = "${var.apex_environment}"

  # This is important, it will cause the stage to get deployed if this file is changed.
  # If it is not present the stage will not get updated.
  stage_description = "${base64sha256(file("./api.tf"))}"
}

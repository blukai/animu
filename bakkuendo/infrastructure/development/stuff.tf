# variables

variable "aws_region" {}

variable "apex_function_graphql" {}

variable "apex_environment" {}

# data

data "aws_iam_role" "animu" {
  # from project.json
  name = "animu_lambda_function"
}

data "aws_caller_identity" "current" {}

# outputs

output "display_invoke_url" {
  value = "Invoke URL: ${aws_api_gateway_deployment.deployment.invoke_url}${aws_api_gateway_resource.graphql.path}"
}

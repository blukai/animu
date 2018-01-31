# variables

variable "prefix" {
	default = "animu"
}

variable "aws_region" {}

# data

data "aws_iam_role" "animu" {
  # from project.json
  name = "animu_lambda_function"
}

resource "aws_s3_bucket" "animux" {
  bucket = "animux"
}

# ----

resource "aws_iam_role_policy" "s3" {
  name = "animu_s3"
  role = "${data.aws_iam_role.animu.id}"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
POLICY
}

resource "aws_s3_bucket_policy" "anime_titles" {
  bucket = "${aws_s3_bucket.animux.id}"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": ["s3:GetObject"],
      "Effect": "Allow",
      "Resource": "${aws_s3_bucket.animux.arn}/anime-titles.json.gz",
      "Principal": "*"
    }
  ]
}
POLICY
}

resource "aws_s3_bucket" "x" {
  bucket = "${var.prefix}-x"
  acl    = "public-read"
}

# ----

// allow lambdas to put objects
resource "aws_iam_role_policy" "s3" {
  name = "${var.prefix}_s3"
  role = "${data.aws_iam_role.animu.id}"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": ["s3:PutObject"],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
POLICY
}

// grant public access to anime titles dump
resource "aws_s3_bucket_policy" "anime_titles" {
  bucket = "${aws_s3_bucket.x.id}"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Id": "xAnimeTitles",
  "Statement": [
    {
      "Sid": "AnimeTitles",
      "Action": ["s3:GetObject"],
      "Effect": "Allow",
      "Resource": "${aws_s3_bucket.x.arn}/anime-titles.json",
      "Principal": "*"
    }
  ]
}
POLICY
}

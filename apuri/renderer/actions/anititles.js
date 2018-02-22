export const getAll = ({
  fetch,
  process: { env: { S3_URL, S3_BUCKET } }
}) => () =>
  fetch(`${S3_URL}/${S3_BUCKET}/anime-titles.json.gz`).then(res => res.json())

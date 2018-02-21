test:
	IS_OFFLINE=true \
	AWS_ACCESS_KEY_ID=fak3d AWS_SECRET_ACCESS_KEY=fak3dx2 \
	S3_ENDPOINT=http://0.0.0.0:4567 S3_BUCKET=TestBucket \
	go test -v -race ./...

deploy-dumper:
	apex deploy dumper --env-file environment.json

deploy-graphql:
	apex deploy graphql --env-file environment.json

deploy: deploy-dumper deploy-graphql

# notes

#### apex

* Don't even try to deploy from windows. Build hook requires to set vars, even with `cross-env` usage, another problem with execution appears - permission `/var/task/main: permission denied`.

#### s3

* Bucket names for the tests should be CamelCased, otherwise it will attempt to connect to `http: //somenotcamel-casedname.127.0.0.1:9091/`. But online only lowercase alphanumeric characters and hyphens allowed.

package services

import (
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

// S3 is a simplified s3manager
type S3 interface {
	Session() *session.Session
	Upload(*s3manager.UploadInput) (*s3manager.UploadOutput, error)
	Download(*s3.GetObjectInput) ([]byte, error)
}

// NewS3 creates a new instance of simplified s3manager
// to upload or download stuff
func NewS3() S3 {
	conf := aws.NewConfig()
	if isOffline {
		// see docker-compose.yml for port
		conf.Endpoint = aws.String("http://127.0.0.1:9091")
		// region does not matter
		conf.Region = aws.String("fakes3")
	}

	return S3(&s3impl{
		session: session.Must(session.NewSession(conf)),
	})
}

// ----

type s3impl struct {
	session    *session.Session
	uploader   *s3manager.Uploader
	downloader *s3manager.Downloader
}

func (i *s3impl) Session() *session.Session {
	return i.session
}

// ----

func (i *s3impl) getBucketName() *string {
	if isOffline {
		return aws.String("Test")
	}

	return aws.String(os.Getenv("ANIMU_S3_BUCKET"))
}

func (i *s3impl) Upload(in *s3manager.UploadInput) (*s3manager.UploadOutput, error) {
	if i.uploader == nil {
		i.uploader = s3manager.NewUploader(i.session)
	}

	if in.Bucket == nil {
		in.Bucket = i.getBucketName()
	}

	return i.uploader.Upload(in)
}

func (i *s3impl) Download(in *s3.GetObjectInput) ([]byte, error) {
	if i.downloader == nil {
		i.downloader = s3manager.NewDownloader(i.session)
	}

	if in.Bucket == nil {
		in.Bucket = i.getBucketName()
	}

	buff := new(aws.WriteAtBuffer)
	if _, err := i.downloader.Download(buff, in); err != nil {
		return nil, err
	}

	return buff.Bytes(), nil
}

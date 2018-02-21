package s3

import (
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/kelseyhightower/envconfig"
)

// Service is a simplified s3manager
type Service interface {
	Put(*s3manager.UploadInput) (*s3manager.UploadOutput, error)
	Get(*s3.GetObjectInput) ([]byte, error)
}

// New creates a new s3 service
func New() Service {
	var svcConf config
	envconfig.MustProcess("", &svcConf)

	var awsConf aws.Config
	if os.Getenv("IS_OFFLINE") == "true" {
		awsConf.Endpoint = svcConf.Endpoint
		// region does not really matter
		awsConf.Region = aws.String("fakes3")
	}

	return &handler{
		session: session.Must(session.NewSession(&awsConf)),
		c:       &svcConf,
	}
}

// ----

type config struct {
	Bucket   *string `envconfig:"S3_BUCKET"`
	Endpoint *string `envconfig:"S3_ENDPOINT"`
}

type handler struct {
	session    *session.Session
	uploader   *s3manager.Uploader
	downloader *s3manager.Downloader
	c          *config
}

func (h *handler) Put(in *s3manager.UploadInput) (*s3manager.UploadOutput, error) {
	if h.uploader == nil {
		h.uploader = s3manager.NewUploader(h.session)
	}

	if in.Bucket == nil && h.c.Bucket != nil {
		in.Bucket = h.c.Bucket
	}

	return h.uploader.Upload(in)
}

func (h *handler) Get(in *s3.GetObjectInput) ([]byte, error) {
	if h.downloader == nil {
		h.downloader = s3manager.NewDownloader(h.session)
	}

	if in.Bucket == nil && h.c.Bucket != nil {
		in.Bucket = h.c.Bucket
	}

	var buff aws.WriteAtBuffer
	if _, err := h.downloader.Download(&buff, in); err != nil {
		return nil, err
	}

	return buff.Bytes(), nil
}

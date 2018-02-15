package s3

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	_ "github.com/blukai/animu/bakkuendo/internal/config" // inits the config if it was forgoten xd
	"github.com/spf13/viper"
)

// S3 simplifies the s3manager
type S3 interface {
	Put(*s3manager.UploadInput) (*s3manager.UploadOutput, error)
	Get(*s3.GetObjectInput) ([]byte, error)
}

// New creates a new instance of S3
func New() S3 {
	conf := aws.NewConfig()
	if viper.GetBool("offline") {
		conf.Endpoint = aws.String(viper.GetString("s3.endpoint"))
		// region does not really matter
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

func (i *s3impl) Put(in *s3manager.UploadInput) (*s3manager.UploadOutput, error) {
	if i.uploader == nil {
		i.uploader = s3manager.NewUploader(i.session)
	}

	if in.Bucket == nil {
		in.Bucket = aws.String(viper.GetString("s3.bucket.name"))
	}

	return i.uploader.Upload(in)
}

func (i *s3impl) Get(in *s3.GetObjectInput) ([]byte, error) {
	if i.downloader == nil {
		i.downloader = s3manager.NewDownloader(i.session)
	}

	if in.Bucket == nil {
		in.Bucket = aws.String(viper.GetString("s3.bucket.name"))
	}

	var buff aws.WriteAtBuffer
	if _, err := i.downloader.Download(&buff, in); err != nil {
		return nil, err
	}

	return buff.Bytes(), nil
}

package utils

import (
	"bytes"
	"compress/gzip"
)

// Compress compresses provided data with gzip
func Compress(data []byte) ([]byte, error) {
	var buff bytes.Buffer
	w := gzip.NewWriter(&buff)

	if _, err := w.Write(data); err != nil {
		return nil, err
	}

	if err := w.Close(); err != nil {
		return nil, err
	}

	return buff.Bytes(), nil
}

// Uncompress uncompresses provided data that was compressed with gzip format
func Uncompress(data []byte) ([]byte, error) {
	r, err := gzip.NewReader(bytes.NewBuffer(data))
	if err != nil {
		return nil, err
	}

	var buff bytes.Buffer
	if _, err := buff.ReadFrom(r); err != nil {
		return nil, err
	}

	if err := r.Close(); err != nil {
		return nil, err
	}

	return buff.Bytes(), nil
}

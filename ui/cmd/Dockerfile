FROM golang:1.11.0
WORKDIR /src

# Let vendor in our dependencies.. copy over the minimum number of files needed to
# do the vendoring.
COPY go.mod /src/go.mod
COPY go.sum /src/go.sum
COPY apicurito.go /src/apicurito.go
RUN go mod vendor
RUN go get github.com/go-bindata/go-bindata/go-bindata@v1.0.0

COPY . /src
RUN go-bindata -o bindata_assetfs.go -prefix dist dist/...
RUN CGO_ENABLED=0 go build -mod=vendor -o /main *.go


ASSET_FILES=$(shell find ../dist/ -type f)

# To enable debug:
#BUILD_FLAGS=-gcflags "all=-N -l"

all: ../target/go/linux-amd64/apicurito-ui \
     ../target/go/darwin-amd64/apicurito-ui \
     ../target/go/windows-amd64/apicurito-ui.exe

../target/go-bindata:
	go get github.com/go-bindata/go-bindata/go-bindata@v1.0.0
	go build -o ../target/go-bindata github.com/go-bindata/go-bindata/go-bindata

bindata_assetfs.go: ../target/go-bindata $(ASSET_FILES)
	../target/go-bindata -prefix ../dist -o $@ ../dist/...

../target/go/linux-amd64/apicurito-ui: Makefile bindata_assetfs.go apicurito.go
	GOOS=linux GOARCH=amd64 go build $(BUILD_FLAGS) -o $@ *.go

../target/go/darwin-amd64/apicurito-ui: Makefile bindata_assetfs.go apicurito.go
	GOOS=darwin GOARCH=amd64 go build $(BUILD_FLAGS) -o $@ *.go

../target/go/windows-amd64/apicurito-ui.exe: Makefile bindata_assetfs.go apicurito.go
	GOOS=windows GOARCH=amd64 go build $(BUILD_FLAGS) -o $@ *.go

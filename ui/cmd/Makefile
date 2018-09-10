ASSET_FILES=$(shell find ../target/classes/ -type f)

# To enable debug:
#BUILD_FLAGS=-gcflags "all=-N -l" 

all: ../target/go/linux-amd64/apicurito-ui \
     ../target/go/darwin-amd64/apicurito-ui \
     ../target/go/windows-amd64/apicurito-ui.exe

$(GOBIN)/go-bindata:
	 go get github.com/go-bindata/go-bindata/go-bindata@v1.0.0

bindata_assetfs.go: $(GOBIN)/go-bindata $(ASSET_FILES)
	go-bindata -prefix ../target/classes -o $@ ../target/classes

../target/go/linux-amd64/apicurito-ui: Makefile *.go
	GOOS=linux GOARCH=amd64 go build $(BUILD_FLAGS) -o $@ *.go

../target/go/darwin-amd64/apicurito-ui: Makefile *.go
	GOOS=darwin GOARCH=amd64 go build $(BUILD_FLAGS) -o $@ *.go

../target/go/windows-amd64/apicurito-ui.exe: Makefile *.go
	GOOS=windows GOARCH=amd64 go build $(BUILD_FLAGS) -o $@ *.go

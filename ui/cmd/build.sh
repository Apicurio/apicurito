#!/bin/bash
set -e 

export BINARY_NAME=apicurito-ui
echo ===========================================
echo Running go build via a docker build
echo ===========================================
mkdir -p ../target/docker-builder
rsync --delete -a ./ ../target/docker-builder/
rsync --delete -a ../dist/ ../target/docker-builder/dist/
cd ../target/docker-builder 
docker build -t ${BINARY_NAME}-builder .
cd -

echo ===========================================
echo Extracting go binary from the Docker image
echo ===========================================
mkdir -p ../target/go/linux-amd64/
docker run ${BINARY_NAME}-builder cat /main > ../target/go/linux-amd64/${BINARY_NAME}
chmod a+x ../target/go/linux-amd64/${BINARY_NAME}


FROM alpine

# This refers to the files copied by assembly configuration in pom.xml
# Change this to e.g. "dist" if running the dockerfile from top-level e.g.
# docker build --build-arg SRC_DIR=dist --build-arf CONTEXT_DIR=docker -f docker/Dockerfile
ARG SRC_DIR="maven/target/go/linux-amd64"

LABEL maintainer="Apicurito Authors <apicurio@lists.jboss.org>" \
      vendor="Apicurito Authors" \
      version="1.0.0" \
      release="1" \
      summary="Apicurito" \
      description="Design beautiful, functional APIs with zero coding, using a visual designer for OpenAPI documents."

### Required labels above - recommended below
LABEL url="https://github.com/Apicurio/apicurito" \
      io.k8s.display-name="Apicurito" \
      io.openshift.expose-services="http:8080" \
      io.openshift.tags="apicurito"

# Copy licenses
USER 998
EXPOSE 8080 

COPY licenses /licenses
COPY ${SRC_DIR}/apicurito-ui /apicurito-ui
CMD [  "/apicurito-ui", "--port", "8080", "--path", "/html", "--spa", "--etags"]



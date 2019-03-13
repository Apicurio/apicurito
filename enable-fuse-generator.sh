#!/bin/bash

# Lets replace the apicurito-ui-config 

FUSE_GENERATOR_HOST=$(oc get route fuse-apicurito-generator --template={{.spec.host}})

oc replace --force -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: apicurito-ui-config
  labels:
    app: apicurito
data:
  config.js: |
    var ApicuritoConfig = {
        "generators": [
            {
                "name":"Fuse Camel Project",
                "url":"http://${FUSE_GENERATOR_HOST}/api/v1/generate/camel-project.zip"
            }
        ]
    }
EOF

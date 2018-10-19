#!/bin/sh

yarn install
mkdir -p src/config

cat <<EOF > src/config/config.js
var ApicuritoConfig = {
  "generators": []
};
EOF

cat <<EOF > src/version.js
var ApicuritoInfo = {
  "version": "DEV",
  "builtOn": new Date(),
  "projectUrl": "https://www.apicur.io/"
};
EOF


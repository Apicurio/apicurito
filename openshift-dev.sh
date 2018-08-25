#!/bin/bash
is='apicurito-ui'
replace_kind='{"op": "replace", "path": "/spec/tags/0/from/kind", "value": "ImageStreamTag"}'
replace_name="{\"op\": \"replace\", \"path\": \"/spec/tags/0/from/name\", \"value\": \"$is:latest\"}"
remove_import_policy='{"op": "remove", "path": "/spec/tags/0/importPolicy"}'
oc patch is $is --type json -p="[$replace_kind, $replace_name, $remove_import_policy]"

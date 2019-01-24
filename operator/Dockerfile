FROM REPLACE_BASE_IMAGE
ADD watches.yaml /opt/helm/watches.yaml
ADD helm-charts /helm-charts
ENTRYPOINT ["/usr/local/bin/helm-app-operator"]

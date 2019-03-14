FROM lgarciaac/helm-app-operator:v0.0.1
ADD watches.yaml /opt/helm/watches.yaml
ADD helm-charts /helm-charts
ENTRYPOINT ["/usr/local/bin/helm-app-operator"]

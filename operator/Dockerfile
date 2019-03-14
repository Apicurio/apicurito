FROM apicurio/apicurito-helm-app-operator
ADD watches.yaml /opt/helm/watches.yaml
ADD helm-charts /helm-charts
ENTRYPOINT ["/usr/local/bin/helm-app-operator"]

## Helm app operator
Based on: https://github.com/operator-framework/helm-app-operator-kit

### Dependencies
- git
- docker
- maven
- access to a kubernetes cluster
- access to a docker registry

### How to use
Checkout the latest code:
```
$ git clone https://github.com/Apicurio/apicurito.git \
   && cd apicurito
```

Build the apicurito image following the instructions in the [original repository](https://github.com/Apicurio/apicurito):
```
$ export APP_IMAGE=mydomain/apicurito-ui
$ mvn clean install -P image -Dfabric8.mode=kubernetes
$ docker tag apicurio/apicurito-ui $APP_IMAGE \
   && docker push $APP_IMAGE
```
Create the namespace / openshift project where the operator and apicurito will be installed and replace the placeholder in values.yaml:
```
$ cd operator
$ export $NAMESPACE_NAME=ns-apicurito
$ oc new-project $NAMESPACE_NAME
$ sed -i "s|REPLACE_NAMESPACE|$NAMESPACE_NAME|" helm-charts/apicurito/values.yaml
$ sed -i "s|REPLACE_APP_IMAGE|$APP_IMAGE|" helm-charts/apicurito/values.yaml
```

You need a _base_ sdk image. You can follow the instructions in [helm app operator](https://github.com/operator-framework/helm-app-operator-kit/tree/master/helm-app-operator) to build one, or use the existing one at `lgarciaac/helm-app-operator`
```
$ export BASE_IMAGE=lgarciaac/helm-app-operator
$ sed -i "s|REPLACE_BASE_IMAGE|$BASE_IMAGE|" Dockerfile
```

Build the operator image:
```
$ export OPERATOR_IMAGE=mydomain/myapp-operator
$ docker build -t $OPERATOR_IMAGE . \
   && docker push $OPERATOR_IMAGE
$ sed -i "s|REPLACE_OPERATOR_IMAGE|$OPERATOR_IMAGE|" deploy/operator.yaml
=======
```

Deploy your operator:
```
# As a simple deployment
$ kubectl create -f deploy/crd.yaml
$ kubectl create -n $NAMESPACE_NAME -f deploy/rbac.yaml
$ kubectl create -n $NAMESPACE_NAME -f deploy/operator.yaml
```

At this point the operator is deployed in the choosen namespace.

Create an instance of the Helm Chart
```                                                                 
$ kubectl create -n $$NAMESPACE_NAME -f deploy/cr.yaml
```

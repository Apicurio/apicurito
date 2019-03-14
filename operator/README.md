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

Create the namespace / openshift project where the operator and apicurito will be installed and replace the placeholder in values.yaml:
```
$ cd operator
$ export NAMESPACE_NAME=ns-apicurito
$ oc new-project $NAMESPACE_NAME
$ sed -i "s|REPLACE_NAMESPACE|$NAMESPACE_NAME|" helm-charts/apicurito/values.yaml
$ sed -i "s|REPLACE_NAMESPACE|$NAMESPACE_NAME|" deploy/rbac.yaml
```

Deploy your operator:
```
# As a simple deployment
$ kubectl create -f deploy/crd.yaml
$ kubectl create -f deploy/rbac.yaml
$ kubectl create -n $NAMESPACE_NAME -f deploy/operator.yaml
```

At this point the operator is deployed in the choosen namespace.

Create an instance of the Helm Chart
```                                                                 
$ kubectl create -n $NAMESPACE_NAME -f deploy/cr.yaml
```
### Development
If you wish to use different sdk or operator images, you can:

 * Follow the instructions in [helm app operator](https://github.com/operator-framework/helm-app-operator-kit/tree/master/helm-app-operator) to build the base sdk image and change Dockerfile

 * Build the operator image and change in deploy/operator.yaml:
```
$ export OPERATOR_IMAGE=mydomain/myapp-operator
$ docker build -t $OPERATOR_IMAGE . \
   && docker push $OPERATOR_IMAGE
$ sed -i "s|REPLACE_OPERATOR_IMAGE|$OPERATOR_IMAGE|" deploy/operator.yaml
=======
```

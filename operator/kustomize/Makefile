#
# Make Options
#
MK_OPTIONS := -s

#
# Vars
#

#
# Vars that can be overridden by external env vars
#
DEBUG ?= false
KUBE_USER ?= developer
NAMESPACE ?= apicurito
IMAGE ?=  apicurio/apicurito-operator
TAG ?= latest

.PHONY: kustomize setup operator app product

kubectl:
ifeq (, $(shell which kubectl))
$(error "No kubectl found in PATH. Please install and re-run")
endif

#
# Setup the installation by installing crds, roles and granting
# privileges for the installing user.
#
setup: kubectl
	$(MAKE) $(MK_OPTIONS) -C bases/crd init
	$(MAKE) $(MK_OPTIONS) -C bases/role init
	#@ Must be invoked by a user with cluster-admin privileges
ifeq ($(DEBUG), false)
	kubectl apply -k setup
else
	kubectl kustomize setup
endif

#
# Install the operator deployment and related resources
#
operator: kubectl
	$(MAKE) $(MK_OPTIONS) -C bases/deployment init
	#@ Must be invoked by a user previously granted permissions using `KUBE_USER=<user> make setup`
ifeq ($(DEBUG), false)
	kubectl apply -k operator
else
	kubectl kustomize operator
endif

#
# Installs the operator deployment and in addition installs a default CR
#
app: kubectl
	$(MAKE) $(MK_OPTIONS) -C bases/deployment init
	$(MAKE) $(MK_OPTIONS) -C app init
	#@ Must be invoked by a user previously granted permissions using `KUBE_USER=<user> make setup`
ifeq ($(DEBUG), false)
	kubectl apply -k app
else
	kubectl kustomize app
endif

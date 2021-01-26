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
KUBE_USER ?= developer

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
	$(MAKE) $(MK_OPTIONS) -C bases/crd
	$(MAKE) $(MK_OPTIONS) -C bases/role
	#@ Must be invoked by a user with cluster-admin privileges
	kubectl apply -k setup

#
# Install the operator deployment and related resources
#
operator: kubectl
	$(MAKE) $(MK_OPTIONS) -C bases/deployment
	#@ Must be invoked by a user previously granted permissions using `KUBE_USER=<user> make install-setup`
	kubectl apply -k operator

#
# Installs the operator deployment and in addition installs a default CR
#
app: kubectl
	$(MAKE) $(MK_OPTIONS) -C bases/deployment
	$(MAKE) $(MK_OPTIONS) -C app
	#@ Must be invoked by a user previously granted permissions using `KUBE_USER=<user> make install-setup`
	kubectl apply -k app

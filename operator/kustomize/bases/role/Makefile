ASSETS := ../../../deploy
TMPL := tmpl
YAML := yaml
NAMESPACE_VAR := {NAMESPACE}
USER_VAR := {KUBE_USER}

RBAC := ./rbac.gen
RBAC_USER := ./rbac-user.gen

KUBE_USER ?= developer
NAMESPACE ?= apicurito

.PHONY: sync init

#
# start-sync
#
# Copy the template from the src directory
# Convert the template to a formatted yaml file:
#
sync:
	cp $(ASSETS)/rbac.yaml $(RBAC).$(TMPL)
	sed -i 's/REPLACE_NAMESPACE/$(NAMESPACE_VAR)/' $(RBAC).$(TMPL)
	cp ./rbac-user.tmpl $(RBAC_USER).$(TMPL)
# end-sync

init: sync
	for resource in $(RBAC) $(RBAC_USER); do \
		cp $${resource}.$(TMPL) $${resource}.$(YAML); \
		sed -i 's/$(NAMESPACE_VAR)/$(NAMESPACE)/' $${resource}.$(YAML); \
		sed -i 's/$(USER_VAR)/$(KUBE_USER)/' $${resource}.$(YAML); \
	done

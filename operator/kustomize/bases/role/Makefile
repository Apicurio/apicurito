ASSETS := ../../../deploy
RBAC := ./rbac.yml
RBAC_USER := ./rbac-user.yml

KUBE_USER ?= developer

.PHONY: sync

#
# Copy the deploy template from the deploy directory
#
sync:
	cp $(ASSETS)/rbac.yaml $(RBAC)
	cp ./rbac-user.yaml $(RBAC_USER)
	sed -i 's/{{.User}}/$(KUBE_USER)/' $(RBAC_USER)

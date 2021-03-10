ASSETS := ../../../deploy
TMPL := tmpl
YAML := yaml

CRD := apicurito-crd.gen

.PHONY: sync init

# start-sync
#
# Copy the template from the src directory
#
sync:
	cp $(ASSETS)/crd.yaml $(CRD).$(TMPL)
# end-sync

init: sync
	cp $(CRD).$(TMPL) $(CRD).$(YAML)

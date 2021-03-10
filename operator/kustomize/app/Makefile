ASSETS := ../../deploy
TMPL := tmpl
YAML := yaml

CR := ./apicurio-cr.gen

.PHONY: sync init

# start-sync
#
# Copy the template from the src directory
# Convert the template to a formatted yaml file:
# - Remove any range/end sections (not required)
#
sync:
	cp $(ASSETS)/cr.yaml $(CR).$(TMPL)
# end-sync

init: sync
	cp $(CR).$(TMPL) $(CR).$(YAML)

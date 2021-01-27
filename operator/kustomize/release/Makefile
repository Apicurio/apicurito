
VERSION := 1.0.0

#
# Make Options
#
MK_OPTIONS := -s

.PHONY: $(SUBDIRS)

SYNCDIRS := ../app ../bases/crd ../bases/deployment ../bases/grant ../bases/role

sync:
	for dir in $(SYNCDIRS); do \
    $(MAKE) $(MK_OPTIONS) -C $$dir; \
  done

INSTALLDIR := apicurito-install
RELEASEDIRS := ../app ../bases ../operator ../setup

create:
	#@ Make a new apicurito builddirectory
	mkdir -p $(INSTALLDIR)
	#@ Copy directories into build directory
	for dir in $(RELEASEDIRS); do \
    cp -rf $$dir $(INSTALLDIR)/; \
  done
	#@ Remove sync rules from Makefiles
	for f in `find $(INSTALLDIR) -name Makefile`; do \
		echo -e "sync:\n  #@ Not required in release" > $$f; \
	done
	#@ Copy the root Makefile into build directory
	cp -f ../Makefile $(INSTALLDIR)/

release: sync create
ifndef VERSION
	$(error VERSION is not set)
endif
	tar zcvf apicurito-install-release-$(VERSION).tar.gz $(INSTALLDIR)
	#@ Hand off to the release script
	./release.sh $(VERSION)

clean:
	rm -rf apicurito *.tar.gz

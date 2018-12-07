[![CircleCI](https://circleci.com/gh/Apicurio/apicurito.svg?style=svg)](https://circleci.com/gh/Apicurio/apicurito)

# Apicurito (Apicurio Lite)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.8.

## Development server

Before running the dev server you must install `node` and `yarn`. Once these tools are installed
you must run `yarn install` to download all of the project's dependencies from `ui` folder.

Run `ng serve` from `ui` folder for a dev server. Navigate to `http://localhost:4200/`. The app will automatically 
reload if you change any of the source files.

To run on a different port, try `ng serve --port 8888` for example. And if you want AOT enabled, 
you can run `ng serve --aot --port 8888`.


## Running On Openshift

This will try to pull down the Apicurito image from container registries:

    oc replace --force  -f openshift.yml

But if you want that configuration changed so that it uses local builds, run:

    ./openshift-dev.sh

And build the image using:

    mvn install -P image    

And if you have deployed the [fuse-apicurito-generator](https://github.com/jboss-fuse/fuse-apicurito-generator) 
into the current project, then run the following to configure Apicurito to use it.

	./enable-fuse-generator.sh 

## Publishing the Image

    mvn clean install -P image -Dfabric8.mode=kubernetes
    docker push apicurio/apicurito-ui:latest

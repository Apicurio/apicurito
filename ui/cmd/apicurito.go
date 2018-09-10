/*
 * Copyright (C) 2018 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package main

import (
	"fmt"
	"github.com/elazarl/go-bindata-assetfs"
	"github.com/jboss-fuse/simble/v1/cmd/http"
	"github.com/jboss-fuse/simble/v1/pkg/simble/static"
	"os"
)

//go:generate go-bindata-assetfs -prefix ../dist ../dist/...

func main() {
	static.DefaultAssetFS = &assetfs.AssetFS{Asset: Asset, AssetDir: AssetDir, AssetInfo: AssetInfo, Prefix: ""}
	// Lets update our root command be named what the
	// executable is actually called
	http.Command.Use = os.Args[0]
	if err := http.Command.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

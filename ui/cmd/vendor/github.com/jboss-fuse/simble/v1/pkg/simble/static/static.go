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
package static

import (
	"crypto/sha1"
	"fmt"
	"github.com/elazarl/go-bindata-assetfs"
	"github.com/jboss-fuse/simble/v1/pkg/simble"
	simecho "github.com/jboss-fuse/simble/v1/pkg/simble/echo"
	"github.com/labstack/echo"
	"io"
	"net/http"
	"path"
	"strings"
)

type StaticContext struct {
	IncludeHiddenFiles bool
	URLPath            string
	DirPath            string
	AssetFS            *assetfs.AssetFS
	SinglePageAppMode  bool
	ETags			   bool
}

var DefaultAssetFS *assetfs.AssetFS = nil

type FileSystemList []http.FileSystem

func (this FileSystemList) Open(name string) (http.File, error) {
	var lastError error = nil
	for _, fs := range this {
		file, err := fs.Open(name)
		lastError = err
		if (err == nil) {
			return file, nil
		}
	}
	return nil, lastError
}

func init() {
	simble.AddPlugin(simecho.InitEchoRoutesPhase, func(server *simble.Simble) (error) {
		static, found := server.Context(&StaticContext{}).(*StaticContext);
		if (found) {
			ctx := server.Context(&simecho.EchoContext{}).(*simecho.EchoContext);
			if static.AssetFS == nil {
				static.AssetFS = DefaultAssetFS
			}
			fsList := FileSystemList{}
			if static.DirPath != "" {
				ctx.Echo.Logger.Info("Serving static content from: ", static.DirPath)
				fsList = append(fsList, http.Dir(static.DirPath))
			}
			if static.AssetFS != nil {
				ctx.Echo.Logger.Info("Serving static content from embedded resources")
				fsList = append(fsList, static.AssetFS)
			}
			if (len(fsList) > 0) {
				if static.SinglePageAppMode {
					ctx.Echo.Use(fsList.singlePageAppHandler)
				}
				if static.ETags {
					ctx.Echo.Use(fsList.eTagHandler)
				}
				handler := echo.WrapHandler(http.FileServer(fsList))
				ctx.Echo.GET(path.Join(static.URLPath, "*"), handler)
			}
		}
		return nil
	})
}

func (fsList *FileSystemList) singlePageAppHandler(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		url := c.Request().URL
		asset := strings.TrimPrefix(url.Path, "/")
		if !fsList.canServe(asset) {
			// the static content handler redirects /index.html to /
			// so rewrite to / to avoid a redirect.
			url.Path = "/"
		}
		return next(c)
	}
}

func (fsList *FileSystemList) canServe(asset string) bool {
	file, err := fsList.Open(asset)
	if  err!=nil {
		return false
	}
	defer file.Close()
	info, err := file.Stat()
	if err!=nil {
		return false
	}
	if( info.IsDir() ) {
		return fsList.canServe(path.Join(asset, "index.html"))
	}
	return true
}

func (fsList *FileSystemList) eTagHandler(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		url := c.Request().URL
		res := c.Response()
		asset := strings.TrimPrefix(url.Path, "/")

		if (asset == "") {
			asset = "index.html"
		}

		file, err := fsList.Open(asset)
		if err!=nil {
			return next(c)
		}
		defer file.Close()

		info, err := file.Stat();
		if err!=nil {
			return next(c)
		}

		sum := sha1.New()
		_, err = io.Copy(sum, file)
		if err!=nil {
			return next(c)
		}

		etag := fmt.Sprintf("%x-%x", sum.Sum(nil), info.ModTime().Unix())
		res.Header().Set("Etag", etag)

		ifNoneMatch := c.Request().Header.Get("If-None-Match")
		if ifNoneMatch == etag {
			c.NoContent(http.StatusNotModified)
			return nil;
		}

		return next(c)
	}
}

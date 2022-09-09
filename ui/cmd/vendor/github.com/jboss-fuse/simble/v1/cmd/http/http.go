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
package http

import (
	"github.com/jboss-fuse/simble/v1/pkg/simble"
	"github.com/jboss-fuse/simble/v1/pkg/simble/echo"
	"github.com/jboss-fuse/simble/v1/pkg/simble/static"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

func init() {

	// Define the command options.
	Command.Flags().Int("port", 3000, "The port the server accepts connections on")
	Command.Flags().String("path", "", "The directory path to serve files from")
	Command.Flags().String("prefix", "/", "The URL prefix to serve from")
	Command.Flags().Bool("spa", false, "Run in Single Page App mode.")
	Command.Flags().Bool("etags", false, "Calculate ETag headers to assist caching")

	// Support using env vars to configure command options.
	viper.BindPFlag("port", Command.Flags().Lookup("port"))
	viper.BindPFlag("path", Command.Flags().Lookup("path"))
	viper.BindPFlag("prefix", Command.Flags().Lookup("prefix"))
	viper.BindPFlag("spa", Command.Flags().Lookup("spa"))
	viper.BindPFlag("etags", Command.Flags().Lookup("etags"))
	viper.SetEnvPrefix(Command.Use)
	viper.AutomaticEnv()
}

var (
	Command = &cobra.Command{
		Use: "http",
		Short: "Starts an http server for serving static content",
		RunE: func(cmd *cobra.Command, args []string) error {
			server := simble.New()
			server.AddContext(&echo.EchoContext{
				Port: viper.GetInt("port"),
			})
			server.AddContext(&static.StaticContext{
				URLPath: viper.GetString("prefix"),
				DirPath: viper.GetString("path"),
				SinglePageAppMode: viper.GetBool("spa"),
				ETags: viper.GetBool("etags"),
			})
			return server.Run();
		},
	}
)

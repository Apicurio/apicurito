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
package simble

import (
	"reflect"
	"sort"
)

/**
 * simble uses a list of server plugins which get run in order.
 *
 * You enable plugins by importing their packages into the build. For example,
 * to enable the static file serving plugin:
 *
 *     import ( _ "github.com/jboss-fuse/simble/pkg/simble/static" )
 *
 * Since the server is just a list of plugins, it can be extended to implement
 * any kind of service.
 */
type plugin struct {
	phase int
	init  func(*Simble) (error)
}

var plugins []plugin
func AddPlugin(phase int, initFunc func(*Simble) error ) {
	plugins = append(plugins, plugin{phase, initFunc})
}

type Simble struct {
	Contexts map[reflect.Type]interface{}
}

/**
 * Creates a new Simble server object.
 */
func New() *Simble {
	server := &Simble{}
	server.Contexts = map[reflect.Type]interface{}{}
	return server
}

func (server *Simble) Run() error {
	// Sort the plugins by phase.
	sort.Slice(plugins, func(i, j int) bool {
		return plugins[i].phase < plugins[j].phase
	})
	for _, p := range plugins {
		err := p.init(server)
		if err != nil {
			return err
		}
	}
	return nil
}

func (server *Simble) AddContext(context interface{}) {
	t := reflect.ValueOf(context).Type()
	server.Contexts[t] = context
}

func (server *Simble) Context(c interface{}) interface{} {
	t := reflect.ValueOf(c).Type()
	return server.Contexts[t]
}

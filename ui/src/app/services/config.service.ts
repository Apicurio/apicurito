/**
 * @license
 * Copyright 2018 Red Hat
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import {Injectable} from "@angular/core";
import {WindowRef} from "./window-ref.service";

export interface GeneratorConfig {
    name: string;
    url: string;
}
export interface Config {
    generators: Array<GeneratorConfig>;
}

/**
 * Holds the application config.
 */
@Injectable()
export class ConfigService implements Config {
    
    generators: GeneratorConfig[] = [{
        name: "Fuse Camel Project",
        url: "http://localhost:8080/api/v1/generate/camel-project.zip"
    }];

    constructor(private windowRef: WindowRef) {
        let serverConfig: any = windowRef.window["ApicuritoConfig"]

        if (serverConfig) {
            console.info("[ConfigService] Loaded config from server.");
            this.generators = serverConfig.generators;
        } else {
            console.warn("[ConfigService] Could not load config from server, using defaults.");
        }
    }
}
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

export interface AppInfo {
    version: string;
    builtOn: Date;
    projectUrl: string;
}

/**
 * Holds the application config.
 */
@Injectable()
export class AppInfoService implements AppInfo {

    version: string = "DEV";
    builtOn: Date = new Date();
    projectUrl: string = "https://www.apicur.io/";

    constructor(private windowRef: WindowRef) {
        var src = windowRef.window  ["ApicuritoInfo"]
        if (src) {
            console.info("[NavHeaderComponent] Found app info: %o", src);
            this.version = src.version;
            this.builtOn = new Date(src.builtOn);
            this.projectUrl = src.projectUrl;
        } else {
            console.info("[NavHeaderComponent] App info not found.");
        }
    }
}
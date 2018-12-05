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
import {ApiDefinition} from "apicurio-design-studio";


const API_DEF_KEY: string = "apicurito.StorageService.api-definition";


/**
 * Implements a Storage service that is used to store API content in local storage
 * so that it can be restored in the case where the browser crashes or is closed.
 */
@Injectable()
export class StorageService {

    constructor(private window: WindowRef) {}

    /**
     * Stores the definition in local storage for later restoration.  Should get called
     * either whenever a change is made or perhaps periodically.
     * @param definition
     */
    public store(definition: ApiDefinition): void {
        console.info("[StorageService] Storing the definition in local storage");
        this.window.window.localStorage.setItem(API_DEF_KEY, JSON.stringify(definition));
    }

    /**
     * Called to reover the definition currently stored in local storage.
     */
    public recover(): ApiDefinition {
        let content: string = this.window.window.localStorage.getItem(API_DEF_KEY);
        if (!content) {
            return null;
        }
        let def: ApiDefinition = JSON.parse(content);
        return def;
    }

    /**
     * Clears any definition from local storage - should be called when the user
     * intentionally closes the editor or downloads the API definition.
     */
    public clear(): void {
        console.info("[StorageService] Clearing local storage");
        this.window.window.localStorage.removeItem(API_DEF_KEY);
    }

    /**
     * Returns true if there is an API currently in local storage.
     */
    public exists(): boolean {
        console.info("[StorageService] Checking for data in local storage");
        return this.window.window.localStorage.getItem(API_DEF_KEY) !== null;
    }
}
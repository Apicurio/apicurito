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
import {WindowRef} from './window-ref.service';
import {safeLoad as parseYaml} from 'js-yaml';

/**
 * Implements an API Definition File service that is used to manage the active API definition file
 */
@Injectable()
export class ApiDefinitionFileService {

    constructor(private windowRef: WindowRef) { }

    public get fileSystemAccessApiAvailable() {
        return 'showOpenFilePicker' in this.windowRef.window;
    }

    private async readFile(file: File): Promise<string> {
        // This is a new API which is not yet available on Safari.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/Blob/text#Browser_compatibility
        if ('text' in file) {
            return await file.text()
        }

        return new Promise((resolve, reject) => {
            const reader: FileReader = new FileReader();

            reader.onload = (fileLoadedEvent) => {
                resolve(fileLoadedEvent.target.result.toString());
            };

            reader.onerror = (e) => {
                console.error("Error reading file: ", e);
                throw new Error("Error reading file.");
            };

            reader.readAsBinaryString(file);
        });
    }

    public async load(file?: File): Promise<any> {
        if (!file) {
            if (!this.fileSystemAccessApiAvailable) {
                throw new Error('When file system access API is unavailable, a file must be specified.');
            }

            let fileHandle: FileSystemFileHandle;
            try {
                const fileHandles = await globalThis.showOpenFilePicker({
                    multiple: false,
                    types: [
                        {
                            description: 'OAS file',
                            accept: {
                                'application/json': ['.json'],
                                'application/x-yaml': ['.yaml', '.yml']
                            }
                        }
                    ]
                });
                fileHandle = fileHandles[0];
            } catch (e) {
                throw new Error("No file selected.");
            }

            // TODO: Save `fileHandle` for later

            file = await fileHandle.getFile();
        }

        const contents = await this.readFile(file);

        let data: any;
        try {
            data = parseYaml(contents);
        } catch (e) {
            console.error("Error parsing file: ", e);
            throw new Error("Error parsing OpenAPI file. Perhaps it is not valid YAML or JSON?");
        }

        return data;
    }

    public async save(data: any): Promise<void> {
        throw new Error("Not implemented");
    }
}

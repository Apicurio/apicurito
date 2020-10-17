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


import {ElementRef, Injectable} from "@angular/core";

export interface FileResult {
    file: File;
    contents: string;
}

/**
 * Implements a File service that is used to load and save files from and to the disk
 */
@Injectable()
export class FilesService {

    constructor() { }

    private get fileSystemAccessApiAvailable() {
        return 'showOpenFilePicker' in globalThis;
    }

    public async readFile(file: File): Promise<FileResult> {
        // This is a new API which is not yet available on Safari.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/Blob/text#Browser_compatibility
        if ('text' in file) {
            return {
                file,
                contents: await file.text()
            }
        }

        return new Promise((resolve, reject) => {
            const reader: FileReader = new FileReader();

            reader.onload = (fileLoadedEvent) => {
                resolve({
                    file,
                    contents: fileLoadedEvent.target.result.toString()
                });
            };

            reader.onerror = reject;

            reader.readAsBinaryString(file);
        });
    }

    private async loadFileWithElement(fileInputRef: ElementRef<HTMLInputElement>): Promise<FileResult> {
        return new Promise((resolve, reject) => {
            fileInputRef.nativeElement.onchange = (event: Event) => {
                const file: File = (event.target as HTMLInputElement).files[0];
                this.readFile(file).then(resolve).catch(reject);
            };
            fileInputRef.nativeElement.click();
        });
    }

    public async loadFile(fileInputRef: ElementRef<HTMLInputElement>): Promise<FileResult> {
        if (!this.fileSystemAccessApiAvailable) {
            return this.loadFileWithElement(fileInputRef);
        }

        const [fileHandle] = await globalThis.showOpenFilePicker({
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

        const file: File = await fileHandle.getFile();
        return this.readFile(file);
    }

}
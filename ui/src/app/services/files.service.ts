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
import {WindowRef} from "./window-ref.service";

export interface FileResult {
    type: string;
    name: string;
    contents: string;
}

/**
 * Implements a File service that is used to load and save files from and to the disk
 */
@Injectable()
export class FilesService {

    constructor(private windowRef: WindowRef) { }

    private get fileSystemAccessApiAvailable() {
        return 'showOpenFilePicker' in this.windowRef.window
    }

    public async loadFileFromHandle(fileHandle: File): Promise<FileResult> {
        return new Promise((resolve, reject) => {
            const reader: FileReader = new FileReader();

            reader.onload = (fileLoadedEvent) => {
                resolve({
                    type: fileHandle.type,
                    name: fileHandle.name,
                    contents: fileLoadedEvent.target.result.toString()
                });
            };

            reader.onerror = reject;

            reader.readAsBinaryString(fileHandle);
        });
    }

    private async loadFileWithElement(fileInputRef: ElementRef<HTMLInputElement>): Promise<FileResult> {
        return new Promise((resolve, reject) => {
            fileInputRef.nativeElement.onchange = (event: Event) => {
                const fileHandle: File = (event.target as HTMLInputElement).files[0];
                this.loadFileFromHandle(fileHandle).then(resolve).catch(reject);
            };
            fileInputRef.nativeElement.click();
        });
    }

    public async loadFile(fileInputRef: ElementRef<HTMLInputElement>): Promise<FileResult> {
        // if (!this.fileSystemAccessApiAvailable) {
            return this.loadFileWithElement(fileInputRef);
        // }

        // TODO: Load without element
    }

}
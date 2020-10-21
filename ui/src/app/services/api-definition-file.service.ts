/**
 * @license
 * Copyright 2020 Red Hat
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
import {safeLoad as parseYaml, safeDump as stringifyYaml} from 'js-yaml';
import {DownloaderService} from './downloader.service';

export type FileFormat = "json" | "yaml" | undefined;

interface SaveOptions {
    mode: "save" | "save-as";
    format?: FileFormat;
}

/**
 * Implements an API Definition File service that is used to manage the active API definition file
 */
@Injectable()
export class ApiDefinitionFileService {
    public static filePickerAcceptTypes: FilePickerAcceptType[] = [
        {
            description: 'OpenAPI Spec File',
            accept: {
                "application/json": [".json"],
                "application/x-yaml": [".yaml", ".yml"]
            }
        }
    ];

    public static getFileFormat(file: File): FileFormat {
        const isJson = file.type === "application/json" || file.name.endsWith(".json");
        const isYaml = file.name.endsWith(".yaml") || file.name.endsWith(".yml");
        return isJson ? "json" : isYaml ? "yaml" : undefined;
    }

    private fileHandle: FileSystemFileHandle;

    constructor(private windowRef: WindowRef, private downloader: DownloaderService) { }

    public get fileSystemAccessApiAvailable() {
        return 'showOpenFilePicker' in this.windowRef.window;
    }

    public get hasFileHandle() {
        return Boolean(this.fileHandle);
    }

    private async readFile(file: File): Promise<string> {
        // This is a new API which is not yet available on Safari.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/Blob/text#Browser_compatibility
        if ('text' in (file as any)) {
            return await (file as any).text();
        }

        return new Promise((resolve, reject) => {
            const reader: FileReader = new FileReader();

            reader.onload = (fileLoadedEvent) => {
                resolve((fileLoadedEvent.target as FileReader).result.toString());
            };

            reader.onerror = (e) => {
                console.error("Error reading file: ", e);
                throw new Error("Error reading file.");
            };

            reader.readAsBinaryString(file);
        });
    }

    public async load(file?: File | FileSystemFileHandle): Promise<any> {
        // We cannot just use `file instanceof FileSystemFileHandle` because it will throw an
        // exception if that type is not defined (in browsers that do not support the feature)
        if (this.fileSystemAccessApiAvailable && file instanceof FileSystemFileHandle) {
            this.fileHandle = file;
            file = await this.fileHandle.getFile();
        }

        if (!file) {
            if (!this.fileSystemAccessApiAvailable) {
                throw new Error('When file system access API is unavailable, a file must be specified.');
            }

            let fileHandles: FileSystemFileHandle[];
            try {
                fileHandles = await this.windowRef.window.showOpenFilePicker({
                    multiple: false,
                    types: ApiDefinitionFileService.filePickerAcceptTypes
                });
            } catch (e) {
                throw new Error("No file selected.");
            }

            this.fileHandle = fileHandles[0];
            file = await this.fileHandle.getFile();
        }

        const contents = await this.readFile(file as File);

        let spec: any;
        try {
            spec = parseYaml(contents);
        } catch (e) {
            console.error("Error parsing file: ", e);
            throw new Error("Error parsing OpenAPI file. Perhaps it is not valid YAML or JSON?");
        }

        return spec;
    }

    private getContents(spec: any, format: "json" | "yaml"): string {
        let contents: string = spec;
        if (typeof spec === "object") {
            const indentCount = 4;
            if (format === "json") {
                contents = JSON.stringify(spec, null, indentCount);
            } else if (format === "yaml") {
                contents = stringifyYaml(spec, {
                    indent: indentCount,
                    lineWidth: 110,
                    noRefs: true
                });
            }
        }
        return contents;
    }

    public async save(spec: any, options: SaveOptions): Promise<void> {
        let { mode, format } = options;

        const defaultFormat: "json" | "yaml" = "yaml";
        if (this.hasFileHandle) {
            let contents: string;

            if (mode === 'save-as') {
                this.fileHandle = await this.windowRef.window.showSaveFilePicker({
                    types: ApiDefinitionFileService.filePickerAcceptTypes
                });
            }

            format = ApiDefinitionFileService.getFileFormat(await this.fileHandle.getFile());

            contents = this.getContents(spec, format || defaultFormat);

            const writable = await this.fileHandle.createWritable();
            await writable.write(contents);
            await writable.close();
        } else {
            const contents = this.getContents(spec, format || defaultFormat);
            const contentType: string = "application/json";
            const fileName: string = `openapi-spec.${format}`;
            await this.downloader.downloadToFS(contents, contentType, fileName);
        }
    }
}

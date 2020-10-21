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

import {Component, ElementRef, EventEmitter, Output, ViewChild} from "@angular/core";
import {NewApiTemplates} from "./empty-state.data";
import {StorageService} from "../services/storage.service";
import {ApiDefinitionFileService} from "../services/api-definition-file.service";
import {ApiDefinition} from "apicurio-design-studio";

@Component({
    moduleId: module.id,
    selector: "empty-state",
    templateUrl: "empty-state.component.html",
    styleUrls: [ "empty-state.component.css" ]
})
export class EmptyStateComponent {

    @ViewChild('loadfile') loadFileRef: ElementRef<HTMLInputElement>;

    @Output() onOpen: EventEmitter<any> = new EventEmitter<any>();

    dragging: boolean;
    error: string = null;
    templates: NewApiTemplates = new NewApiTemplates();

    constructor(private storage: StorageService, private apiDefinitionFile: ApiDefinitionFileService) {}

    public hasRecoverableApi(): boolean {
        return this.storage.exists();
    }

    public reoverApi(): void {
        console.info("[EmptyStateComponent] Recovering an API definition that was in-progress");
        let apiDef: ApiDefinition = this.storage.recover();
        let api: any = apiDef.spec;
        this.onOpen.emit(api);
    }

    public createNewApi(version: string = "3.0.2"): void {
        this.error = null;
        let api: any = JSON.parse(this.templates.EMPTY_API_30);
        if (version == "2.0") {
            api = JSON.parse(this.templates.EMPTY_API_20);
        }
        this.onOpen.emit(api);
    }

    public openExistingApi(): void {
        this.error = null;

        if (this.apiDefinitionFile.fileSystemAccessApiAvailable) {
            this.loadFile();
        } else {
            this.loadFileRef.nativeElement.click();
        }
    }

    public onFileOpened(event: Event): void {
        this.error = null;

        const file: File = (event.target as HTMLInputElement).files[0];
        const fileFormat = ApiDefinitionFileService.getFileFormat(file);

        if (!fileFormat) {
            this.error = "Only JSON and YAML files are supported.";
            return;
        }

        this.loadFile(file);
    }

    public async loadFile(file?: File | FileSystemFileHandle): Promise<void> {
        this.error = null;

        try {
            const spec = await this.apiDefinitionFile.load(file);
            this.onOpen.emit(spec);
        } catch (e) {
            console.log(e);
            this.error = e.message;
        }
    }

    public onDragOver(event: DragEvent): void {
        if (!this.dragging) {
            this.dragging = true;
        }
        event.preventDefault();
    }

    public async onDrop(event: DragEvent): Promise<void> {
        this.dragging = false;
        event.preventDefault();

        const items: DataTransferItemList = event.dataTransfer.items;
        if (!items || items.length < 1) {
            return;
        }

        const item = items[0];
        let file: FileSystemFileHandle | File;
        if (this.apiDefinitionFile.fileSystemAccessApiAvailable) {
            const fileHandle = await item.getAsFileSystemHandle()
            if (fileHandle.kind === "file") {
                file = fileHandle;
            }
        } else {
            file = item.getAsFile();
        }

        if (file) {
            await this.loadFile(file);
        } else {
            this.error = "Only files are supported.";
        }
    }

    public onDragEnd(event: DragEvent): void {
        this.dragging = false;
    }

}

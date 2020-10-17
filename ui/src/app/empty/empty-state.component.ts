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
import * as YAML from 'js-yaml';
import {StorageService} from "../services/storage.service";
import {FileResult, FilesService} from "../services/files.service";
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

    constructor(private storage: StorageService, private files: FilesService) {}

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

    public async openExistingApi(): Promise<void> {
        this.error = null;
        
        let file: FileResult;
        try {
            file = await this.files.loadFile(this.loadFileRef);
        } catch (e) {
            console.error("Error detected: ", e);
            this.error = "Error reading file.";
        }

        this.loadFile(file);
    }

    public loadFile(fileResult: FileResult): void {
        let isJson: boolean = fileResult.file.type === "application/json";
        let isYaml: boolean = fileResult.file.name.endsWith(".yaml") || fileResult.file.name.endsWith(".yml");

        if (!isJson && !isYaml) {
            this.error = "Only JSON and YAML files are supported.";
            return;
        }

        let jsObj: any;
        if (isJson) {
            try {
                jsObj = JSON.parse(fileResult.contents);
                this.onOpen.emit(jsObj);
            } catch (e) {
                console.error("Error parsing file.", e);
                this.error = "Error parsing OpenAPI file. Perhaps it is not valid JSON?";
            }
        } else if (isYaml) {
            try {
                jsObj = YAML.safeLoad(fileResult.contents);
                this.onOpen.emit(jsObj);
            } catch (e) {
                console.error("Error parsing file.", e);
                this.error = "Error parsing OpenAPI file. Perhaps it is not valid YAML?";
            }
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

        let files: FileList = event.dataTransfer.files;
        if (files && files.length == 1) {
            console.info("[ImportApiFormComponent] File was dropped.");
            let file: FileResult;
            try {
                file = await this.files.readFile(files[0]);
            } catch (e) {
                console.error("Error detected: ", e);
                this.error = "Error reading file.";
            }
            this.loadFile(file);
        } else {
            this.error = "Only files are supported.";
        }
    }

    public onDragEnd(event: DragEvent): void {
        this.dragging = false;
    }

}

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

import {Component, EventEmitter, Output} from "@angular/core";
import {NewApiTemplates} from "./empty-state.data";
import * as YAML from 'js-yaml';
import {StorageService} from "../services/storage.service";
import {ApiDefinition} from "apicurio-design-studio";

@Component({
    moduleId: module.id,
    selector: "empty-state",
    templateUrl: "empty-state.component.html",
    styleUrls: [ "empty-state.component.css" ]
})
export class EmptyStateComponent {

    @Output() onOpen: EventEmitter<any> = new EventEmitter<any>();

    dragging: boolean;
    error: string = null;
    templates: NewApiTemplates = new NewApiTemplates();

    constructor(private storage: StorageService) {}

    public hasRecoverableApi(): boolean {
        return this.storage.exists();
    }

    public reoverApi(): void {
        console.info("[EmptyStateComponent] Recovering an API definition that was in-progress");
        let apiDef: ApiDefinition = this.storage.recover();
        let api: any = apiDef.spec;
        this.onOpen.emit(api);
    }

    public createNewApi(): void {
        this.error = null;
        let api: any = JSON.parse(this.templates.EMPTY_API);
        this.onOpen.emit(api);
    }

    public onFileLoaded(event): void {
        this.error = null;
        let theFile: any = event.target.files[0];
        this.loadFile(theFile);
    }

    public loadFile(theFile: any): void {
        let isJson: boolean = theFile.type === "application/json";
        let isYaml: boolean = theFile.name.endsWith(".yaml") || theFile.name.endsWith(".yml");

        if (!isJson && !isYaml) {
            this.error = "Only JSON and YAML files are supported.";
            return;
        }

        let reader: FileReader = new FileReader();
        let content: any = null;
        let me: EmptyStateComponent = this;
        let jsObj: any = null;
        reader.onload = function(fileLoadedEvent) {
            content = fileLoadedEvent.target["result"];
            if (isJson) {
                try {
                    jsObj = JSON.parse(content);
                    me.onOpen.emit(jsObj);
                } catch (e) {
                    console.error("Error parsing file.", e);
                    me.error = "Error parsing OpenAPI file.  Perhaps it is not valid JSON?";
                }
            } else {
                try {
                    //jsObj = YAML.parse(content);
                    jsObj = YAML.safeLoad(content);
                    me.onOpen.emit(jsObj);
                } catch (e) {
                    console.error("Error parsing file.", e);
                    me.error = "Error parsing OpenAPI file.  Perhaps it is not valid YAML?";
                }
            }
        };
        reader.onerror = function(e) {
            console.info("Error detected: ", e);
            me.error = "Error reading file.";
        }
        reader.readAsBinaryString(theFile);
    }

    public onDragOver(event: DragEvent): void {
        if (!this.dragging) {
            this.dragging = true;
        }
        event.preventDefault();
    }

    public onDrop(event: DragEvent): void {
        this.dragging = false;
        event.preventDefault();

        let files: FileList = event.dataTransfer.files;
        if (files && files.length == 1) {
            console.info("[ImportApiFormComponent] File was dropped.");
            let file: any = files[0];
            this.loadFile(file);
        } else {
            this.error = "Only files are supported.";
        }
    }

    public onDragEnd(event: DragEvent): void {
        this.dragging = false;
    }

}

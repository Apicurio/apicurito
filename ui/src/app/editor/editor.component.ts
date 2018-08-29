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

import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {ApiDefinition, ApiEditorComponent} from "apicurio-design-studio";
import {DownloaderService} from "../services/downloader.service";
import {ConfigService, GeneratorConfig} from "../services/config.service";

@Component({
    moduleId: module.id,
    selector: "editor",
    templateUrl: "editor.component.html",
    styleUrls: [ "editor.component.css" ]
})
export class EditorComponent {

    private _api: ApiDefinition;
    private _originalContent: any;
    @Input()
    set api(apiDef: ApiDefinition) {
        this._api = apiDef;
        this._originalContent = apiDef.spec;
    }
    get api(): ApiDefinition {
        return this._api;
    }

    @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild("apiEditor") apiEditor: ApiEditorComponent;
    generating: boolean = false;
    generateError: string = null;

    constructor(private downloader: DownloaderService, public config:ConfigService) {}

    public save(): void {
        console.info("[EditorComponent] Saving the API definition.");
        this.generateError = null;
        let spec: any = this.apiEditor.getValue().spec;
        if (typeof spec === "object") {
            spec = JSON.stringify(spec, null, 4);
        }
        let content: string = spec;
        let ct: string = "application/json";
        let filename: string = "openapi-spec.json";
        this.downloader.downloadToFS(content, ct, filename);
    }

    public reset(): void {
        console.info("[EditorComponent] Resetting the editor.");
        this.generateError = null;
        this.onClose.emit();
    }

    public generate(gconfig: GeneratorConfig): void {
        console.info("[EditorComponent] Generating project: ", gconfig);
        this.generateError = null;
        let spec: any = this.apiEditor.getValue().spec;
        if (typeof spec === "object") {
            spec = JSON.stringify(spec, null, 4);
        }
        let content: string = spec;
        let filename: string = "camel-project.zip";
        this.generating = true;
        this.downloader.generateAndDownload(gconfig, content, filename).then( () => {
            this.generating = false;
        }).catch( error => {
            console.error("[EditorComponent] Error generating project: ", error);
            this.generating = false;
            this.generateError = error.message;
        });
    }

}

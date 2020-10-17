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
import * as YAML from 'js-yaml';
import {StorageService} from "../services/storage.service";
import {
    IValidationSeverityRegistry,
    Library,
    Oas20Document,
    Oas30Document,
    ValidationProblemSeverity
} from "apicurio-data-models";
import {ApiDefinitionFileService} from '../services/api-definition-file.service';

export class DisableValidationRegistry implements IValidationSeverityRegistry {

    public lookupSeverity(): ValidationProblemSeverity {
        return ValidationProblemSeverity.high;
    }

}


@Component({
    moduleId: module.id,
    selector: "editor",
    templateUrl: "editor.component.html",
    styleUrls: [ "editor.component.css" ]
})
export class EditorComponent {

    @Input() api: ApiDefinition;

    @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild("apiEditor") apiEditor: ApiEditorComponent;
    generating: boolean = false;
    generateError: string = null;

    showSuccessToast: boolean = false;
    showErrorToast: boolean = false;
    toastTimeoutId: number = null;

    persistenceTimeout: number;

    validation: IValidationSeverityRegistry = null;

    converting: boolean = false;

    /**
     * Constructor.
     * @param downloader
     * @param config
     * @param storage
     */
    constructor(private downloader: DownloaderService, public config: ConfigService,
                private storage: StorageService, public apiDefinitionFile: ApiDefinitionFileService) {}

    /**
     * Called whenever the API definition is changed by the user.
     */
    public documentChanged(): any {
        console.info("[EditorComponent] Detected a document change, scheduling disaster recovery persistence");
        if (this.persistenceTimeout) {
            clearTimeout(this.persistenceTimeout);
            this.persistenceTimeout = null;
        }
        this.persistenceTimeout = setTimeout( () => {
            this.storage.store(this.apiEditor.getValue());
            this.persistenceTimeout = null;
        }, 5000);
    }

    /**
     * Called to convert from OpenAPI 2 to 3.
     */
    public convert(): void {
        this.converting = true;

        const me: EditorComponent = this;
        let currentApi: ApiDefinition = me.apiEditor.getValue();

        // Do this work in a timer to workaround this bug:  https://github.com/Apicurio/apicurio-studio/issues/1031
        // Once that bug is fixed, we can remove this workaround.
        setTimeout(() => {
            console.debug("[EditorComponent] Converting from OpenAPI 2 to 3!");
            let doc20: Oas20Document = <Oas20Document> Library.readDocument(currentApi.spec);
            let doc30: Oas30Document = Library.transformDocument(doc20);

            let api30: ApiDefinition = new ApiDefinition();
            api30.spec = Library.writeNode(doc30);
            api30.type = "OpenAPI30";
            api30.name = currentApi.name;
            api30.createdBy = currentApi.createdBy;
            api30.createdOn = currentApi.createdOn;
            api30.description = currentApi.description;
            api30.id = currentApi.id;
            api30.tags = currentApi.tags;

            me.api = api30;
            me.converting = false;
        }, 500);
    }

    public async save(mode: "save" | "save-as" = "save", format?: "json" | "yaml"): Promise<void> {
        console.info("[EditorComponent] Saving the API definition.");
        this.generateError = null;

        await this.apiDefinitionFile.save(this.apiEditor.getValue().spec, {
            mode,
            format
        });

        this.storage.clear();
    }

    public close(): void {
        console.info("[EditorComponent] Closing the editor.");
        this.generateError = null;
        this.storage.clear();
        this.onClose.emit();
    }

    public async saveAndClose(): Promise<void> {
        console.info("[EditorComponent] Saving and then closing the editor.");
        await this.save();
        this.close();
    }

    public generate(gconfig: GeneratorConfig): void {
        console.info("[EditorComponent] Generating project: ", gconfig);

        this.generateError = null;
        this.showErrorToast = false;
        this.showSuccessToast = false;

        let spec: any = this.apiEditor.getValue().spec;
        if (typeof spec === "object") {
            spec = JSON.stringify(spec, null, 4);
        }
        let content: string = spec;
        let filename: string = "camel-project.zip";
        this.generating = true;
        this.downloader.generateAndDownload(gconfig, content, filename).then( () => {
            this.generating = false;
            this.showSuccessToast = true;
            this.toastTimeoutId = setTimeout(() => {
                this.showSuccessToast = false;
            }, 5000);
        }).catch( error => {
            console.error("[EditorComponent] Error generating project: ", error);
            this.generating = false;
            this.generateError = error.message;
            this.showErrorToast = true;
            // Only fade-away automatically for successful generation.  Error stays until dismissed.
            // this.toastTimeoutId = setTimeout(() => {
            //     this.showErrorToast = false;
            // }, 5000);
        });
    }

    public closeSuccessToast(): void {
        this.showSuccessToast = false;
        clearTimeout(this.toastTimeoutId);
    }

    public closeErrorToast(): void {
        this.showErrorToast = false;
        clearTimeout(this.toastTimeoutId);
    }

    public setValidation(enabled: boolean): void {
        if (enabled) {
            this.validation = null;
        } else {
            this.validation = new DisableValidationRegistry();
        }
    }

    public isOpenAPI2(): boolean {
        console.info(this.api.type);
        return this.api.type == "OpenAPI20";
    }

}

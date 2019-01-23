/**
 * @license
 * Copyright 2019 JBoss Inc
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

import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";


@Component({
    moduleId: module.id,
    selector: "configure-validation-dialog",
    templateUrl: "configure-validation.dialog.html",
    styleUrls: [ "configure-validation.dialog.css" ]
})
export class ConfigureValidationComponent {

    @ViewChildren("configureValidationModal") configureValidationModal: QueryList<ModalDirective>;

    @Input() validationEnabled: boolean;
    @Output() onChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    protected _isOpen: boolean = false;
    protected value: boolean;

    /**
     * Called to open the wizard.
     */
    public open(): void {
        this._isOpen = true;
        this.value = this.validationEnabled;
        this.configureValidationModal.changes.subscribe( thing => {
            if (this.configureValidationModal.first) {
                this.configureValidationModal.first.show();
            }
        });
    }

    /**
     * Called to close the wizard.
     */
    public close(): void {
        this._isOpen = false;
    }

    /**
     * The user clicked the "OK" button to accept the setting.
     */
    protected ok(): void {
        this.onChange.emit(this.value);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.configureValidationModal.first.hide();
    }

    /**
     * Returns true if the wizard is open.
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    public enableValidation(): void {
        this.value = true;
    }

    public disableValidation(): void {
        this.value = false;
    }

    /**
     * Returns true if the user has changed the validation profile setting.
     */
    public isDirty(): boolean {
        return this.value !== this.validationEnabled;
    }

}

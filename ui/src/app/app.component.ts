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

import {Component} from '@angular/core';
import {ApiDefinition} from 'apicurio-design-studio';
import {WindowRef} from './services/window-ref.service';
import {AppInfoService} from "./services/app-info.service";
import {CrossNavApp, navigateToApp} from "@rh-uxd/integration-core";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    helpExpanded: boolean = false;
    showAbout: boolean = false;
    crossConsoleExpanded: boolean = false;
    showCrossConsole = false;

    apiDef: ApiDefinition = null;

    constructor(private winRef: WindowRef, public appInfo: AppInfoService) {
    }

    public navigate(url: string): void {
        window.location.href = url;
    }

    public openEditor(content: any): void {
        this.apiDef = new ApiDefinition();
        this.apiDef.createdBy = 'user';
        this.apiDef.createdOn = new Date();
        this.apiDef.tags = [];
        this.apiDef.description = '';
        this.apiDef.id = 'api-1';
        this.apiDef.spec = content;
        this.apiDef.type = "OpenAPI30";
        if (content && content.swagger && content.swagger == "2.0") {
            this.apiDef.type = "OpenAPI20";
        }
    }
}

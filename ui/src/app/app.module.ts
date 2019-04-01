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

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ApicurioCommonComponentsModule, ApicurioEditorModule} from 'apicurio-design-studio';

import {AppComponent} from './app.component';
import {BsDropdownModule, ModalModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {WindowRef} from './services/window-ref.service';
import {EmptyStateComponent} from "./empty/empty-state.component";
import {EditorComponent} from "./editor/editor.component";
import {DownloaderService} from "./services/downloader.service";
import {HttpClientModule} from "@angular/common/http";
import {AppInfoService} from './services/app-info.service';
import {ConfigService} from './services/config.service';
import {StorageService} from "./services/storage.service";
import {ConfigureValidationComponent} from "./editor/configure-validation.dialog";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ApicurioEditorModule,
        ApicurioCommonComponentsModule,
        ModalModule.forRoot(),
        BsDropdownModule.forRoot()
    ],
    declarations: [
        AppComponent, 
        EmptyStateComponent,
        EditorComponent,
        ConfigureValidationComponent
    ],
    providers: [WindowRef, AppInfoService, ConfigService, DownloaderService, StorageService],
    bootstrap: [AppComponent]
})
export class AppModule {
}

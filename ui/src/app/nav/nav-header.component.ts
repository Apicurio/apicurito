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

import {Component, OnInit} from "@angular/core";

@Component({
    moduleId: module.id,
    selector: "nav-header",
    templateUrl: "nav-header.component.html",
    styleUrls: [ "nav-header.component.css" ]
})
export class NavHeaderComponent implements OnInit {

    version: string = "N/A";
    builtOn: Date = new Date();
    projectUrl: string = "http://www.apicur.io/";

    constructor() {
        let w: any = window;
        if (w["ApicurioStudioInfo"]) {
            console.info("[NavHeaderComponent] Found app info: %o", w["ApicurioStudioInfo"]);
            this.version = w["ApicurioStudioInfo"].version;
            this.builtOn = new Date(w["ApicurioStudioInfo"].builtOn);
            this.projectUrl = w["ApicurioStudioInfo"].url;
        } else {
            console.info("[NavHeaderComponent] App info not found.");
        }
    }

    ngOnInit(): void {
    }

}

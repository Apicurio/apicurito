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


import {Inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {WindowRef} from "./window-ref.service";
import {HttpClient} from "@angular/common/http";
import {GeneratorConfig} from "./config.service";

/**
 * Implements a Downloader service that helps download content to the user's local file
 * system without making a server call.
 */
@Injectable()
export class DownloaderService {

    constructor(@Inject(DOCUMENT) private document: any, private window: WindowRef, private http: HttpClient) {}

    /**
     * Called to download some content as a file to the user's local filesystem.
     * @param content
     * @param contentType
     * @param filename
     */
    public downloadToFS(content: string, contentType: string, filename: string): Promise<boolean> {
        console.info("[DownloaderService] Downloading an API definition.");
        let window: any = this.window.window;

        if (window.chrome !== undefined) {
            // Chrome version
            let link = document.createElement('a');
            let blob = new Blob([content], { type: contentType });
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        } else if (window.navigator !== undefined && window.navigator.msSaveBlob !== undefined) {
            // IE version
            let blob = new Blob([content], { type: contentType });
            window.navigator.msSaveBlob(blob, filename);
        } else {
            // Firefox version
            let file = new File([content], filename, { type: 'application/force-download' });
            window.open(URL.createObjectURL(file));
        }
        // Not async right now - so just resolve to true
        return Promise.resolve(true);
    }

    /**
     * Called to generate a project and download the result.
     * @param gconfig
     * @param content
     * @param filename
     */
    public generateAndDownload(gconfig: GeneratorConfig, content: string, filename: string): Promise<void> {
        console.info("[DownloaderService] Generating and downloading project: ", gconfig);
        let generateApiUrl: string = gconfig.url;
        let window: any = this.window.window;
        return this.http.post(generateApiUrl, content, {
            headers: {
                "Content-Type": "application/json",
                "Accept" : "application/octet-stream"
            },
            reportProgress: false,
            responseType: "blob"
        }).toPromise().then( data => {
            if (window.chrome !== undefined) {
                // Chrome version
                let link = document.createElement('a');
                let blob = data;
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                link.click();
            } else if (window.navigator !== undefined && window.navigator.msSaveBlob !== undefined) {
                // IE version
                let blob = data;
                window.navigator.msSaveBlob(blob, filename);
            } else {
                // Firefox version
                let file = new File([data], filename, { type: 'application/force-download' });
                window.open(URL.createObjectURL(file));
            }
        });
    }
}
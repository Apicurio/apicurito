/**
 * @license
 * Copyright 2018 JBoss Inc
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

export class NewApiTemplates {

    public EMPTY_API_20: string = `
{
  "swagger": "2.0",
  "info": {
    "title": "New API",
    "description": "A brand new API with no content.  Go nuts!",
    "version": "1.0.0"
  },
  "paths": {
  },
  "consumes": [ "application/json" ],
  "produces": [ "application/json" ]
}`;

    public EMPTY_API_30: string = `
{
  "openapi": "3.0.2",
  "info": {
    "title": "New API",
    "description": "A brand new API with no content.  Go nuts!",
    "version": "1.0.0"
  },
  "paths": {
  }
}
`;

}

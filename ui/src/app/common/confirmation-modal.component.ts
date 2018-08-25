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
 import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'confirmation-modal',
  template: `
<div class="modal-header">
  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
      <span class="pficon pficon-close"></span>
  </button>
</div>
<div class="modal-body">
  <h1 class="about-title">{{ title }}</h1>
    <div>
      <ng-content></ng-content>
    </div>
  </div>
  <div class="modal-footer">
    <button type="button"
            class="btn btn-default"
            (click)="onModalClick(false)"
            data-dismiss="modal">
      {{ cancelText }}
    </button>
    <button type="button"
            class="btn btn-danger"
            (click)="onModalClick(true)"
            data-dismiss="modal">
      {{ okText }}
    </button>
  </div>
  `
})
export class ConfirmationModalComponent {
  @Input() title = 'Warning';
  @Input() okText = 'OK';
  @Input() cancelText = 'Cancel';
  @Output() confirmation = new EventEmitter<boolean>();

  onModalClick(confirmation: boolean): void {
    this.confirmation.emit(confirmation);
  }
}

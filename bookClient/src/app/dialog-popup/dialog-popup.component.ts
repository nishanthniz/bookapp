import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var $;
@Component({
  selector: 'app-dialog-popup',
  templateUrl: './dialog-popup.component.html',
  styleUrls: ['./dialog-popup.component.css']
})
export class DialogPopupComponent implements OnInit {
  @Input() popupHeader = 'Information';
  @Input() popupMessage = '';
  @Input() popupModalId = 'dialogModal';
  @Input() popupSuccessBtn = 'Ok';
  @Input() popupFailureBtn = '';

  @Output() sucessEvt = new EventEmitter<any>();
  @Output() failureEvt = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {

  }

}

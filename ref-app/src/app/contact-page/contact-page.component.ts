import { Component, OnInit } from '@angular/core';
import {AppStore} from "../app.store";
import {ContactActions} from "../actions/contact.actions";

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent {
  searchStr: string;

  constructor(private appStore: AppStore, private contactActions: ContactActions) { }

  get contacts() {
    return this.appStore.getState().contacts;
  }

  filter() {
    this.appStore.dispatch(this.contactActions.filter(this.searchStr));
  }

  onKeyDown($event: KeyboardEvent) {
    if($event.which == 13) {
      this.filter();
    }
  }
}

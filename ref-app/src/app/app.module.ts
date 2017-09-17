import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import {AppStore, appStore} from "./app.store";
import {ContactActions} from "./actions/contact.actions";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    ContactPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [
    {provide: AppStore, useValue: appStore},
    ContactActions,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

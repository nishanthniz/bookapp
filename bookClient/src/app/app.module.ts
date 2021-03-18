import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

// Angular Materials
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BookListComponent } from './book-list/book-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { DialogPopupComponent } from './dialog-popup/dialog-popup.component';
import { HttpHelperService } from './service/http-helper.service';
import { LoaderComponent } from './loader/loader.component';
import { AuthGuardService } from './service/auth-guard.service';
import { SessionService } from './service/session.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    BookListComponent,
    HeaderComponent,
    DialogPopupComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    HeaderComponent,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [HttpHelperService, AuthGuardService, SessionService],
  bootstrap: [AppComponent]
})
export class AppModule { }

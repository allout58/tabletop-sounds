import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AddSourceComponent} from './add-source/add-source.component';
import {PlayBarComponent} from './component/play-bar/play-bar.component';
import {PlaylistComponent} from './playlist/playlist.component';
import {SettingsComponent} from './settings/settings.component';
import {MatButtonModule, MatListModule, MatSidenavModule, MatStepperModule, MatToolbarModule} from "@angular/material";
import {routes} from "./routes";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [AppComponent, AddSourceComponent, PlayBarComponent, PlaylistComponent, SettingsComponent],
  imports: [
    MatStepperModule,
    MatButtonModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    BrowserModule,
    RouterModule.forRoot(routes, {initialNavigation: 'enabled', anchorScrolling: "enabled"}),
    FontAwesomeModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AddSourceComponent} from './add-source/add-source.component';
import {PlayBarComponent} from './component/play-bar/play-bar.component';
import {PlaylistComponent} from './playlist/playlist.component';
import {SettingsComponent} from './settings/settings.component';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatSidenavModule,
  MatStepperModule,
  MatToolbarModule
} from "@angular/material";
import {routes} from "./routes";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

import {library} from '@fortawesome/fontawesome-svg-core'
import {faSpotify} from "@fortawesome/free-brands-svg-icons";
import {faFileAudio} from "@fortawesome/pro-solid-svg-icons";

library.add(faSpotify);
library.add(faFileAudio);

@NgModule({
  declarations: [AppComponent, AddSourceComponent, PlayBarComponent, PlaylistComponent, SettingsComponent],
  imports: [
    BrowserAnimationsModule,
    MatStepperModule,
    MatButtonModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserModule,
    RouterModule.forRoot(routes, {initialNavigation: 'enabled', anchorScrolling: "enabled"}),
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

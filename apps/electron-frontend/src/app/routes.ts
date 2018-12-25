import {Routes} from "@angular/router";
import {AddSourceComponent} from "./add-source/add-source.component";
import {PlaylistComponent} from "./playlist/playlist.component";

export const routes: Routes = [
  {
    path: 'add',
    component: AddSourceComponent
  },
  {
    path: 'playlist',
    component: PlaylistComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'add'
  }
];

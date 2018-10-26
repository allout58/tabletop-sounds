import {Routes} from "@angular/router";
import {AddSourceComponent} from "./add-source/add-source.component";

export const routes: Routes = [
  {
    path: 'add',
    component: AddSourceComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'add'
  }
];

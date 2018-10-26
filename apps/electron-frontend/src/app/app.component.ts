import {Component} from '@angular/core';
import {faBars} from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'tabletop-sounds-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'electron-frontend';

  faBars = faBars;
}

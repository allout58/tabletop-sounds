import {Component, OnInit} from '@angular/core';
import {SEARCH_TRACK_REQUEST, SEARCH_TRACK_RESPONSE, TransferWrapper} from '@tabletop-sounds/ipc-channels';
import {ElectronService} from '../service/electron.service';

@Component({
             selector: 'tabletop-sounds-add-source',
             templateUrl: './add-source.component.html',
             styleUrls: ['./add-source.component.scss']
           })
export class AddSourceComponent implements OnInit {

  constructor(private electron: ElectronService) {
    this.electron.ipcRenderer.on(SEARCH_TRACK_RESPONSE, (event, params: TransferWrapper<any>) => {
      console.log('Event', event, 'Params', params);
      if (params.error) {
        console.error(params.error);
      } else {
        console.log(params.result);
      }
    });
  }

  ngOnInit() {
  }

  search() {
    this.electron.ipcRenderer.send(SEARCH_TRACK_REQUEST, 'search me');
  }
}

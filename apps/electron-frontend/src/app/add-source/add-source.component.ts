import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ADD_TAGS_TO_TRACK_REQUEST,
  ADD_TRACK_REQUEST,
  AddTrackRequest,
  SEARCH_TAG_REQUEST,
  SEARCH_TAG_RESPONSE,
  TRACK_METADATA_REQUEST,
  TRACK_METADATA_RESPONSE,
  TransferWrapper
} from '@tabletop-sounds/ipc-channels';
import {ElectronService} from '../service/electron.service';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {BehaviorSubject} from "rxjs";
import {FormControl} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatVerticalStepper} from "@angular/material";

@Component({
  selector: 'tabletop-sounds-add-source',
  templateUrl: './add-source.component.html',
  styleUrls: ['./add-source.component.scss']
})
export class AddSourceComponent implements OnInit {

  tagSeperatorKeyCodes = [ENTER, COMMA];
  searchedResult$ = new BehaviorSubject<string[]>([]);
  tagControl = new FormControl();
  tags: string[] = [];

  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('stepper') matStepper: MatVerticalStepper;


  fileMetadata: AddTrackRequest = null;

  constructor(private electron: ElectronService) {
    this.electron.ipcRenderer.on(TRACK_METADATA_RESPONSE, (event, param: TransferWrapper<AddTrackRequest>) => {
      console.log('Event', event, 'Params', param);
      if (param.error) {
        console.error(param.error);
      } else {
        this.fileMetadata = param.result;
      }
    });

    this.electron.ipcRenderer.on(SEARCH_TAG_RESPONSE, (event, param: TransferWrapper<string[]>) => {
      if (param.error) {
        console.error(param.error);
      } else {
        this.searchedResult$.next(param.result);
      }
    });

    this.tagControl.valueChanges.subscribe(x => {
      this.electron.ipcRenderer.send(SEARCH_TAG_REQUEST, x == null ? '' : x);
    });
  }

  ngOnInit() {
  }

  addTag(event: MatChipInputEvent): void {
    // Add tag only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.tags.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.tagControl.setValue(null);
    }
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selectTag(event: MatAutocompleteSelectedEvent) {
    this.tags.push(event.option.value);
    this.tagControl.setValue(null);
  }

  saveTrack() {
    this.electron.ipcRenderer.send(ADD_TRACK_REQUEST, this.fileMetadata);
    this.electron.ipcRenderer.send(ADD_TAGS_TO_TRACK_REQUEST, {file: this.fileMetadata, tags: this.tags});
  }


  fileChanged($event) {
    const fileList: FileList = $event.target.files;
    const firstFile = fileList[0];
    this.electron.ipcRenderer.send(TRACK_METADATA_REQUEST, firstFile.path);
    this.matStepper.next();
  }


}

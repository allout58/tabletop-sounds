import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddSourceComponent} from './add-source.component';

describe('AddSourceComponent', () => {
  let component: AddSourceComponent;
  let fixture: ComponentFixture<AddSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSourceComponent ]
    })
    // .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});

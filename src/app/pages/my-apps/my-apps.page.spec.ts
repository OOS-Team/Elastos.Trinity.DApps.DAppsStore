import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAppsPage } from './my-apps.page';

describe('MyAppsPage', () => {
  let component: MyAppsPage;
  let fixture: ComponentFixture<MyAppsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAppsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAppsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

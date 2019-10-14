import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DappsPage } from './dapps.page';

describe('DappsPage', () => {
  let component: DappsPage;
  let fixture: ComponentFixture<DappsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DappsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DappsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DappDetailPage } from './dapp-detail.page';

describe('DappDetailPage', () => {
  let component: DappDetailPage;
  let fixture: ComponentFixture<DappDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DappDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DappDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

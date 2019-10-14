import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTypePage } from './category-type.page';

describe('CategoryTypePage', () => {
  let component: CategoryTypePage;
  let fixture: ComponentFixture<CategoryTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryTypePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

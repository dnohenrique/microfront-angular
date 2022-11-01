import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleryImagesComponent } from './galery-images.component';

describe('GaleryImagesComponent', () => {
  let component: GaleryImagesComponent;
  let fixture: ComponentFixture<GaleryImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaleryImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaleryImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

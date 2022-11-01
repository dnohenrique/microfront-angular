import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryThumbComponent } from './gallery-thumb.component';

describe('GalleryThumbComponent', () => {
  let component: GalleryThumbComponent;
  let fixture: ComponentFixture<GalleryThumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryThumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryThumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

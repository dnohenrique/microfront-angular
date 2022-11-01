import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotsiteDetailComponent } from './hotsite-detail.component';

describe('HotsiteDetailComponent', () => {
  let component: HotsiteDetailComponent;
  let fixture: ComponentFixture<HotsiteDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotsiteDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotsiteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

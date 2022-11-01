import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotsiteFilterComponent } from './hotsite-filter.component';

describe('HotsiteFilterComponent', () => {
  let component: HotsiteFilterComponent;
  let fixture: ComponentFixture<HotsiteFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotsiteFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotsiteFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

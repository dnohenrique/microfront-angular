import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotsiteListComponent } from './hotsite-list.component';

describe('HotsiteListComponent', () => {
  let component: HotsiteListComponent;
  let fixture: ComponentFixture<HotsiteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotsiteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotsiteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

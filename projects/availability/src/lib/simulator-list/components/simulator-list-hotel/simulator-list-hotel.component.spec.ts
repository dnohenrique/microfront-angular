import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorListHotelComponent } from './simulator-list-hotel.component';

describe('SimulatorListHotelComponent', () => {
  let component: SimulatorListHotelComponent;
  let fixture: ComponentFixture<SimulatorListHotelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulatorListHotelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorListHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

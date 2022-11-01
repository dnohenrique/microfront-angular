import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorFilterComponent } from './simulator-filter.component';

describe('SimulatorFilterComponent', () => {
  let component: SimulatorFilterComponent;
  let fixture: ComponentFixture<SimulatorFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulatorFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

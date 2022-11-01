import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticListComponent } from './static-list.component';

describe('StaticListComponent', () => {
  let component: StaticListComponent;
  let fixture: ComponentFixture<StaticListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaticListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

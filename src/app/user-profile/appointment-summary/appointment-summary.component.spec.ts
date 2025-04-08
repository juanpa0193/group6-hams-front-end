import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSummaryComponent } from './appointment-summary.component';

describe('AppointmentSummaryComponent', () => {
  let component: AppointmentSummaryComponent;
  let fixture: ComponentFixture<AppointmentSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

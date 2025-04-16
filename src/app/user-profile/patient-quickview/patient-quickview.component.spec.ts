import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientQuickviewComponent } from './patient-quickview.component';

describe('PatientQuickviewComponent', () => {
  let component: PatientQuickviewComponent;
  let fixture: ComponentFixture<PatientQuickviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientQuickviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientQuickviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

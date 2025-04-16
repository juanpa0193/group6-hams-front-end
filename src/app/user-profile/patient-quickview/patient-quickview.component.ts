import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'patient-quickview',
  imports: [],
  templateUrl: './patient-quickview.component.html',
  styleUrl: './patient-quickview.component.css'
})
export class PatientQuickviewComponent {

  @Output() dismissPatientQuickView = new EventEmitter<boolean>();

  closePatientQuickview() {
    this.dismissPatientQuickView.emit(false);
  }
}

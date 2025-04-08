import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'quick-actions-toolbar',
  imports: [],
  templateUrl: './quick-actions-toolbar.component.html',
  styleUrl: './quick-actions-toolbar.component.css'
})
export class QuickActionsToolbarComponent {

  @Output() scheduleAppointmentMode= new EventEmitter<boolean>();

  enableAppointmentMode(): void {
    this.scheduleAppointmentMode.emit(true);
}

}

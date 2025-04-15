import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'user-info',
  imports: [],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {
  @Output() edit = new EventEmitter<void>();
  @Input() user: any;

  ngOnChanges() {
    console.log('User data received in user-info:', this.user); // Debugging log
  }

  onEdit() {
    console.log('Edit button clicked'); // Debugging log
    this.edit.emit();
  }
}

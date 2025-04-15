import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  public currentUser: any = null;

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        const userId = user.userId;
        const token = localStorage.getItem('token'); // assumes token is stored here

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        Promise.all([
          this.http.get(`http://localhost:8010/users/${userId}`, { headers }).toPromise(),
          this.http.get(`http://localhost:8010/users/patientInfo/${userId}`, { headers }).toPromise()
        ])
        .then(([userInfo, patientInfo]: any) => {
          this.currentUser = {
            id: userInfo.id,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            phoneNumber: userInfo.phoneNumber,
            email: userInfo.email,
            userType: userInfo.type,
            dateOfBirth: patientInfo?.dateOfBirth ?? '',
            bloodType: patientInfo?.bloodType ?? '',
            gender: patientInfo?.gender ?? '',
            address: patientInfo?.address ?? '',
            emergencyContactName: patientInfo?.emergencyContactName ?? '',
            emergencyContactRelation: patientInfo?.emergencyContactRelation ?? '',
            emergencyContactPhone: patientInfo?.emergencyContactPhone ?? ''
          };
          console.log('Full Profile:', this.currentUser);
        })
        .catch(error => {
          console.error('Error fetching user or patient info:', error);
        });
      }
    });
  }
}










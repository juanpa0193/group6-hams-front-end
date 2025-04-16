import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import {Patient} from "../models/patient.model";
import { UserService } from '../../services/user.service';
import {map, switchMap} from "rxjs";
import {Doctor} from "../models/doctor.model";

@Component({
  selector: 'user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  public currentUser: any = null;
  public currentPatient: Patient | null = null;
  public currentDoctor: Doctor | null = null;

  constructor(private authService: AuthService, private userService: UserService,) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {

      if (user) {
        this.currentUser = user;
        switch (this.currentUser.userType) {
          case 'Patient':
            this.getCurrentPatientInfo();
            break;
          case 'Doctor':
            this.getCurrentDoctorInfo();
            break;
        }
      }

    });
  }

  getCurrentPatientInfo(){

    // First get user-level data
    this.userService.getUserById(this.currentUser.userId)
        .pipe(
            switchMap( userData => {
              // Once we have user data, get patient-level data
              return this.userService.getPatientInfo(this.currentUser.userId).pipe(
                  // combine results
                  map(patientData => {
                    return {
                      userData: userData,
                      patientData: patientData
                    }
                  })
              )

            })
        )
        .subscribe( combinedData => {

          const { userData, patientData } = combinedData;

          return this.currentPatient = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber,
            email: userData.email,
            dateOfBirth: patientData.dateOfBirth,
            bloodType: patientData.bloodType,
            gender: patientData.gender,
            address: patientData.address,
            emergencyContactName: patientData.emergencyContactName,
            emergencyContactRelationship: patientData.emergencyContactRelationship,
            emergencyContactPhoneNumber: patientData.emergencyContactPhoneNumber
          }
    }, error => {
          console.error('Error fetching patient data',error);
        })

  }

  getCurrentDoctorInfo(){

    // First get user-level data
    this.userService.getUserById(this.currentUser.userId)
        .pipe(
            switchMap( userData => {
              // Once we have user data, get patient-level data
              return this.userService.getDoctorInfo(this.currentUser.userId).pipe(
                  // combine results
                  map(doctorData => {
                    return {
                      userData: userData,
                      doctorData: doctorData
                    }
                  })
              )

            })
        )
        .subscribe( combinedData => {

          const { userData, doctorData } = combinedData;

          return this.currentDoctor = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber,
            email: userData.email,
            specialty: doctorData.specialty,
            department: doctorData.department,
            licenseNumber: doctorData.licenseNumber,
            biography: doctorData.biography,
            education: doctorData.education,
            imageUrl: doctorData.imageUrl,
            rating: doctorData.rating,
            reviewCount: doctorData.reviewCount
          }
        }, error => {
          console.error('Error fetching doctor data',error);
        })


  }

}










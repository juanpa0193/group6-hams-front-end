# Healthcare Appointment Management System (HAMS)
This is the frontend application Healthcare Appointment Management System (HAMS), developed with Angular. 

It provides patients and healthcare providers a seamless interface to schedule appointments, view medical records, and manage their profiles with modern web technology and responsive UI.

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation & Build Instructions](#-installation--build-instructions)
- [Environment Configuration](#-environment-configuration)
- [Available Scripts](#-available-scripts)
- [Authors & Contributors](#-Authors--&--Contributors)
- [Contact](#-Contact)

---

## Features
- **Secure login & registration**
- **Appointment scheduling and summary**
- **Access medical records**
- **User profile management**
- **API service abstraction with Angular DI**
- **Fully responsive layout**
- **Configurable API base URLs via environment.ts**

---

## Tech Stack
- Angular 17+
- TypeScript
- RxJS
- Angular Router
- SCSS/CSS
- RESTful API Integration (via Angular Services)
- Jasmine + Karma (for unit testing)

## Project Structure
Overview of important folders and components:

- src/app/home	                  Landing and home page components
- src/app/login-form	            Login UI and logic
- src/app/signup/signup-form	    Signup interface and service integration
- src/app/user-profile	          User dashboard including info, toolbar, and profile sections
- src/app/appointment-scheduler	  Schedule appointments and view appointment calendar
- src/app/appointment-summary	    Summary component for viewing past and upcoming appointments
- src/app/medical-records	        View and manage medical documents
- src/app/services	              API service layer (Auth, Appointments, Doctors, Signup, Config)
- src/app/models	                Data models for Users and Appointments
- src/app/test-files	            Misc test/demo components for development or A/B testing
- src/environments	              Environment configurations for prod/dev\

---

## Installation & Build Instructions

### Prerequisites
- Node.js (v18+ recommended)
- Angular CLI (v17+):
  ```bash
  npm install -g @angular/cli

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/hams-frontend.git
   cd hams-frontend
   
2. **Clone the repository:**
   ```bash
   npm install
   
3. **Clone the repository:**
   ```bash
   export const environment = {
   production: false,
   apiBaseUrl: 'https://your-api-url.com/api'
   };

4. **Clone the repository:**
   ```bash
   ng serve
   
Navigate to `http://localhost:4200` in your browser.

### Build for Production
  ```bash
  ng build --configuration=production

---

## Testing
Run unit tests with:
  ```bash
  ng test
The tests are configured using Jasmine and Karma. Each component/service has its own `.spec.ts` file.

---

## Deployment
Project can be hosted on any static file server:
- Firebase Hosting
- Netlify
- AWS S3 + CloudFront
- NGINX / Apache

---

## Authors & Contributors
- **Bosco Silva**
- **Diego Bautista**
- **Mark-Anthony Delva**
- **Craig Forbes**
- **Manuel Velasquez**
- **Juan Villa**

---

## Contact
For questions, issues, or collaboration inquiries, feel free to reach out to our team at:

HealthHub API — HAMS Inc.
Healthcare Technology Division
1234 Brickell Plaza, Suite 900
Miami, FL 33131, USA

- Email: support@healthhub-hams.org
- Phone: +1 (305) 555-6677
- Website: https://www.healthhub-hams.org

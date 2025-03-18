import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HomeComponentTest} from './test-files/home/home-component-test.component';
import {HomeComponent} from './home/home.component';
import {LoginFormComponent} from './home/login-form/login-form.component';
import {provideHttpClient, withFetch} from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'health-hub';
}

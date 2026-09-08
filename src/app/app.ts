import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./features/auth/login/login";
import { Spinner } from './shared/spinner/spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Spinner],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CRM_Web');
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/layout/sidebar/sidebar.component';
import { AlertComponent } from './shared/components/ui/alert/alert.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, AlertComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}

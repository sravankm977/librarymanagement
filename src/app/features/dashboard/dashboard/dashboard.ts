import { Component } from '@angular/core';
import { LayoutModule } from '../../../layout/layout/layout.module';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [LayoutModule, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}

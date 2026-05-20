import { Component } from '@angular/core';
import { LayoutModule } from '../layout/layout.module';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [LayoutModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(private router: Router) {}

  onClickNavItem(url: string) {
    this.router.navigateByUrl(url);
  }
}

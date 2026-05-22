import { Component } from '@angular/core';
import { LayoutModule } from '../../../layout/layout/layout.module';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Book } from '../../books/models/books.interface';
import { Member } from '../../members/models/member.interface';
import { HoverZoomDirective } from '../../../shared/directives/hover-zoom-directive';
import { AllowDragCardDirective } from '../../../shared/directives/allow-drag-card-directive';
import { AppCard } from '../../../shared/components/app-card/app-card';

@Component({
  selector: 'app-dashboard',
  imports: [LayoutModule, RouterOutlet, HoverZoomDirective, AllowDragCardDirective, AppCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  booksData$!: Observable<Book[]>;
  membersData$!: Observable<Member[]>;

  constructor() {}

  ngOnInit() {}
}

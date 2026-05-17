import { Component } from '@angular/core';
import { BookService } from './services/book.service';

@Component({
  selector: 'app-book-list',
  imports: [],
  providers: [BookService],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList {}

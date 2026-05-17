import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { Book } from '../book-list/models/books.interface';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BookService } from '../book-list/services/book.service';

@Component({
  selector: 'app-add-book',
  imports: [ReactiveFormsModule, AsyncPipe, DatePipe],
  providers: [BookService],
  templateUrl: './add-book.html',
  styleUrl: './add-book.css',
})
export class AddBook {
  addBookForm!: FormGroup;
  booksData$!: Observable<Book[]>;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private bookService: BookService
  ) {}

  ngOnInit() {
    this.initializeBookForm();
    this.loadBooks();
  }

  initializeBookForm() {
    this.addBookForm = this.fb.group({
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      category: [''],
      isbn: ['', [Validators.required]],
      quantity: [''],
      publishedDate: [''],
    });
  }

  loadBooks() {
    this.booksData$ = this.bookService.getBooks();

    console.log(
      'Books data loaded:',
      this.booksData$.subscribe((data) => console.log(data))
    );
  }

  onSubmit() {
    if (!this.addBookForm.valid) {
      console.error('Form is invalid. Please correct the errors and try again.');
    } else if (this.addBookForm.valid) {
      const newBook: Book = this.addBookForm.value;
      this.bookService.addBook(newBook).subscribe(
        (response) => {
          console.log('Book added successfully:', response);
          this.loadBooks(); // Refresh the book list after adding a new book
          this.addBookForm.reset(); // Reset the form after successful submission
        },
        (error) => {
          console.error('Error adding book:', error);
        }
      );
    }
  }
}

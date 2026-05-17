import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { Book } from '../../models/books.interface';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BookService } from '../../services/book.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  mode = 'add';

  book = {
    id: '',
    title: '',
    author: '',
    category: '',
    isbn: '',
    quantity: '',
    publishedDate: '',
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private bookService: BookService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initializeBookForm();
    this.loadBooks();
  }

  initializeBookForm() {
    this.addBookForm = this.fb.group({
      id: [''],
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

  onEditBook(book: Book) {
    this.mode = 'edit';
    this.router.navigate(['/books/edit', book.id]);
    this.addBookForm.patchValue(book);
  }

  onDeleteBook(book: Book) {}

  onSubmit() {
    if (!this.addBookForm.valid) {
      console.error('Form is invalid. Please correct the errors and try again.');
    } else if (this.addBookForm.valid) {
      if (this.mode === 'add') {
        const newBook: Book = this.addBookForm.value;
        this.bookService.addBook(newBook).subscribe(
          (response) => {
            console.log('Book added successfully:', response);
            alert('Book added successfully');
            this.loadBooks(); // Refresh the book list after adding a new book
            this.addBookForm.reset(); // Reset the form after successful submission
          },
          (error) => {
            console.error('Error adding book:', error);
          }
        );
      } else if (this.mode === 'edit') {
        const updateBook: Book = this.addBookForm.value;
        console.log(updateBook);
        this.bookService.updateBook(updateBook).subscribe(
          (response) => {
            console.log('Book updated successfully:', response);
            this.loadBooks(); // Refresh the book list after updating the book
            this.addBookForm.reset(); // Reset the form after successful submission
            this.mode = 'add'; // Reset mode to 'add' after editing
          },
          (error) => {
            console.error('Error updating book:', error);
          }
        );
      }
    }
  }
}

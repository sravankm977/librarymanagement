import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { Book } from '../../models/books.interface';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BookService } from '../../services/book.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  imports: [ReactiveFormsModule, AsyncPipe],
  providers: [BookService],
  templateUrl: './add-book.html',
  styleUrl: './add-book.css',
})
export class AddBook {
  addBookForm!: FormGroup;
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
  booksData$!: Observable<Book[]>;
  filteredBooks$!: Observable<Book[]>;
  searchControl = new FormControl('');

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
    this.setupFilter();
  }

  setupFilter() {
    const search$ = this.searchControl.valueChanges.pipe(startWith(''));

    // combineLatest is used to combine two observables: the list of books and the search query.
    // Whenever either of these changes, the map function will be triggered to filter the books based on the search query.
    this.filteredBooks$ = combineLatest([this.booksData$, search$]).pipe(
      map(([books, query]) => {
        const q = (query ?? '').toLowerCase().trim();
        if (!q) return books; // empty query → show all

        return books.filter(
          (book) =>
            book.title?.toLowerCase().includes(q) ||
            book.author?.toLowerCase().includes(q) ||
            book.category?.toLowerCase().includes(q)
        );
      })
    );
  }

  onEditBook(book: Book) {
    this.mode = 'edit';
    this.router.navigate(['/books/edit', book.id]);
    this.addBookForm.patchValue(book);
  }

  onDeleteBook(book: Book) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(book).subscribe(
        () => {
          this.loadBooks(); // Reload books after successful deletion
        },
        (error) => {
          console.error('Error deleting book:', error);
        }
      );
    }
  }

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

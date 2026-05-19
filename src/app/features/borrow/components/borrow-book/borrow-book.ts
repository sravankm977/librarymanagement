import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { Book } from '../../../books/models/books.interface';
import { Member } from '../../../members/models/member.interface';
import { BookService } from '../../../books/services/book.service';
import { MemberService } from '../../../members/services/member-service';
import { Borrow } from '../../models/borrow.interface';
import { BorrowService } from '../../services/borrow-service';

@Component({
  selector: 'app-borrow-book',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, AsyncPipe],
  providers: [BookService, MemberService, BorrowService, AsyncPipe],
  templateUrl: './borrow-book.html',
  styleUrl: './borrow-book.css',
})
export class BorrowBook {
  borrowBookForm!: FormGroup;
  booksData$!: Observable<Book[]>;
  membersData$!: Observable<Member[]>;
  borrowData$!: Observable<Borrow[]>;

  selectedBook: Book | null = null;
  selectedMember: Member | null = null;

  books: Book[] = [];
  members: Member[] = [];
  borrows: Borrow[] = [];

  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private bookService: BookService,
    private memberService: MemberService,
    private borrowService: BorrowService
  ) {}

  ngOnInit() {
    this.initializeBorrowBookForm();
    this.fetchBooks();
    this.fetchMembers();
    this.fetchBorrows();
  }

  initializeBorrowBookForm() {
    this.borrowBookForm = this.fb.group({
      memberId: [''],
      bookId: [''],
      borrowDate: [new Date().toISOString().split('T')[0]],
      returnDate: [''],
    });
  }

  fetchBooks() {
    this.booksData$ = this.bookService.getBooks();
  }

  fetchMembers() {
    this.membersData$ = this.memberService.getMembers();
  }

  fetchBorrows() {
    this.borrowService.getBorrows().subscribe({
      next: (data) => (this.borrows = data),
      error: (err) => console.error('Failed to fetch borrows:', err),
    });
  }

  onSelectBook(book: Book) {
    // ✅ Condition: quantity > 0 guard (belt-and-suspenders beyond [disabled])
    if (book.quantity === 0) {
      this.errorMessage = `"${book.title}" is currently unavailable.`;
      return;
    }
    this.successMessage = '';
    this.errorMessage = '';
    this.selectedBook = book;
    this.borrowBookForm.patchValue({ bookId: book.id });
  }

  onSelectMember(member: Member) {
    this.successMessage = '';
    this.errorMessage = '';
    this.selectedMember = member;
    this.borrowBookForm.patchValue({ memberId: member.id });
  }

  submit() {
    this.successMessage = '';
    this.errorMessage = '';
    if (!this.borrowBookForm.valid) {
      return;
    } else if (!this.selectedBook || !this.selectedMember) {
      this.errorMessage = 'please select the member and book to borrow.';
      return;
    } else if (!this.selectedBook || this.selectedBook.quantity <= 0) {
      this.errorMessage = 'Selected book is no longer available.';
      return;
    } else if (this.selectedBook.quantity > 0 && this.borrowBookForm.valid) {
      const book = this.selectedBook;
      const member = this.selectedMember;
      const borrowData = this.borrowBookForm.value;
      console.log('Borrowing data:', borrowData);

      const updatedBook: Book = {
        ...book,
        quantity: book.quantity - 1,
      };

      const newBorrow: Borrow = {
        bookId: book.id,
        bookTitle: book.title,
        memberId: member.id,
        memberName: member.name,
        borrowDate: borrowData.borrowDate,
        returnDate: borrowData.returnDate,
      };

      forkJoin({
        updatedBook: this.bookService.updateBook(updatedBook),
        borrow: this.borrowService.addBorrow(newBorrow),
      }).subscribe({
        next: ({ borrow }) => {
          // ✅ Update the book quantity directly in the array
          this.books = this.books.map((b) => (b.id === updatedBook.id ? updatedBook : b));

          // ✅ Append new borrow record to the table
          this.borrows = [...this.borrows, borrow];

          this.successMessage = `"${book.title}" borrowed successfully by ${member.name}!`;
          this.resetForm();
        },
        error: (err) => {
          console.error('Failed to borrow book:', err);
          this.errorMessage = 'Something went wrong. Please try again.';
        },
      });
    }
  }

  resetForm() {
    this.borrowBookForm.reset({
      memberId: '',
      bookId: '',
      borrowDate: new Date().toISOString().split('T')[0],
      returnDate: '',
    });
    this.selectedBook = null;
    this.selectedMember = null;
    this.successMessage = '';
  }
}

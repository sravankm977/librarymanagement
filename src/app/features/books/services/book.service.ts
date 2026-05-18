import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from '../models/books.interface';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private http: HttpClient) {}

  getBooks() {
    return this.http.get<Book[]>('http://localhost:3000/Books');
  }

  addBook(book: Book) {
    return this.http.post<Book[]>('http://localhost:3000/Books', book);
  }

  deleteBook(book: Book) {
    return this.http.delete(`http://localhost:3000/Books/${book.id}`);
  }

  updateBook(book: Book) {
    return this.http.put(`http://localhost:3000/Books/${book.id}`, book);
  }
}

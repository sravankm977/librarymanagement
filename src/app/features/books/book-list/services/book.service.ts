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

  addBook(newBook: Book) {
    return this.http.post<Book[]>('http://localhost:3000/Books', newBook);
  }

  deleteBook() {
    return this.http.delete('http://localhost:3000/Books?id');
  }

  updateBook() {
    return this.http.put('http://localhost:3000/Books?id', {});
  }
}

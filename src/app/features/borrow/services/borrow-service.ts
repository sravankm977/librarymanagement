import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Borrow } from '../models/borrow.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BorrowService {
  constructor(private http: HttpClient) {}

  getBorrows() {
    // Implement logic to fetch borrowed books from the backend
    return this.http.get<Borrow[]>('http://localhost:3000/borrows');
  }

  addBorrow(borrow: Borrow): Observable<Borrow> {
    // ✅ return type must be Observable<Borrow>
    return this.http.post<Borrow>('http://localhost:3000/borrows', borrow); // ✅ generic must be <Borrow>
  }
}

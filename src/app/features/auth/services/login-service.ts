import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/login.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User | null> {
    // ✅ Fetch all users and find matching email + password
    return this.http.get<User[]>('http://localhost:3000/users').pipe(
      map((users) => {
        const user = users.find((u) => u.email === email && u.password === password);
        return user ?? null;
      })
    );
  }

  saveSession(user: User) {
    localStorage.setItem('loggedInUser', JSON.stringify(user)); // ✅ persist session
  }

  getSession(): User | null {
    const userJson = localStorage.getItem('loggedInUser');
    return userJson ? JSON.parse(userJson) : null; // ✅ retrieve session
  }

  logout() {
    localStorage.removeItem('loggedInUser'); // ✅ clear session
  }

  isLoggedIn(): boolean {
    return this.getSession() !== null; // ✅ check if session exists
  }
}

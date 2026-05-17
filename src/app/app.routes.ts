import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { BookList } from './features/books/book-list/book-list';
import { AddBook } from './features/books/add-book/add-book';
import { MemberList } from './features/members/member-list/member-list';
import { BorrowBook } from './features/borrow/borrow-book/borrow-book';
import { Login } from './features/auth/login/login';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      { path: 'dashboard', component: Dashboard },

      { path: 'books', component: BookList },

      { path: 'books/add', component: AddBook },

      { path: 'members', component: MemberList },

      { path: 'borrow', component: BorrowBook },

      { path: 'login', component: Login },
    ],
  },
];

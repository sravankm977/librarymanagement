import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { BookList } from './features/books/components/book-list/book-list';
import { AddBook } from './features/books/components/add-book/add-book';
import { MemberList } from './features/members/components/member-list/member-list';
import { BorrowBook } from './features/borrow/components/borrow-book/borrow-book';
import { Login } from './features/auth/components/login/login';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'layout',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'books', component: BookList },
      { path: 'books/add', component: AddBook },
      { path: 'books/edit/:id', component: AddBook },
      { path: 'members', component: MemberList },
      { path: 'members/edit/:id', component: MemberList },
      { path: 'borrow', component: BorrowBook },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

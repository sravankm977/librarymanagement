import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../models/member.interface';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  constructor(private http: HttpClient) {}

  getMembers() {
    // Implement logic to fetch members from the backend API
    return this.http.get<Member[]>('http://localhost:3000/Members');
  }

  addMember(member: any) {
    // Implement logic to add member to the backend API
    return this.http.post<Member[]>('http://localhost:3000/Members', member);
  }

  updateMember(member: any) {
    // Implement logic to update member details in the backend API
    return this.http.put<Member[]>(`http://localhost:3000/Members/${member.id}`, member);
  }

  deleteMember(member: any) {
    // Implement logic to delete member from the backend API
    return this.http.delete(`http://localhost:3000/Members/${member.id}`);
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Member } from '../../models/member.interface';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { MemberService } from '../../services/member-service';
import { Router } from '@angular/router';
import { TextHighlight } from '../../../../shared/directives/text-highlight.directive';
import { FormStyleDirective } from '../../../../shared/directives/form-style-directive';

@Component({
  selector: 'app-member-list',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe,
    CommonModule,
    TextHighlight,
    FormStyleDirective,
  ],
  providers: [MemberService],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList {
  memberForm!: FormGroup;
  membersData$!: Observable<Member[]>;

  mode = 'add';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private memberService: MemberService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeMemberForm();
    this.loadMembers();
  }

  initializeMemberForm() {
    this.memberForm = this.fb?.group({
      id: [''],
      name: [''],
      email: [''],
      membershipDate: [''],
    });
  }

  loadMembers() {
    this.membersData$ = this.memberService.getMembers();
  }

  onEdit(member: Member) {
    // this.router.navigate([`/members/edit/${member.id}`]);
    this.mode = 'edit';
    this.memberForm.patchValue(member);
  }

  onDelete(member: Member) {
    if (!member.id) {
      console.error('Invalid member ID');
      return;
    }
    this.memberService.deleteMember(member).subscribe(() => {
      this.loadMembers();
    });
  }

  Submit() {
    if (!this.memberForm.valid) {
      return;
    } else {
      const memberData: Member = this.memberForm.value;
      if (this.mode === 'add') {
        this.memberService.addMember(memberData).subscribe(() => {
          this.loadMembers();
          this.memberForm.reset();
        });
      } else if (this.mode === 'edit') {
        this.memberService.updateMember(memberData).subscribe(() => {
          this.loadMembers();
          this.memberForm.reset();
          this.mode = 'add';
          this.router.navigate(['/members']);
        });
      }
    }
  }
}

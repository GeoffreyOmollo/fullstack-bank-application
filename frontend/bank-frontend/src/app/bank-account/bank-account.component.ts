import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BankAccountService } from './../shared/bank-account.service';
import { BankService } from '../shared/bank.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bank-account',
  standalone: true,  // Marks this component as standalone
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ],
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.css']
})
export class BankAccountComponent implements OnInit, OnDestroy {

  bankAccountForms: FormArray<FormGroup>;  // Typed FormArray to hold FormGroup elements
  bankList: { bankID: number; bankName: string }[] = [];  // Properly type the bankList array
  notification: { class: string, message: string } | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private bankService: BankService,
    private service: BankAccountService
  ) {
    // Explicitly typing the FormArray
    this.bankAccountForms = this.fb.array<FormGroup>([]);
  }

  ngOnInit() {
    const bankListSub = this.bankService.getBankList()
      .subscribe(res => this.bankList = res as { bankID: number; bankName: string }[]);

    const bankAccountListSub = this.service.getBankAccountList().subscribe(
      (res: any[]) => {
        if (res.length === 0) {
          this.addBankAccountForm();
        } else {
          res.forEach((bankAccount: any) => {
            this.bankAccountForms.push(this.fb.group({
              bankAccountID: [bankAccount.bankAccountID],
              accountNumber: [bankAccount.accountNumber, Validators.required],
              accountHolder: [bankAccount.accountHolder, Validators.required],
              bankID: [bankAccount.bankID, Validators.min(1)],
              IFSC: [bankAccount.ifsc, Validators.required]
            }));
          });
        }
      }
    );

    this.subscriptions.push(bankListSub, bankAccountListSub);
  }

  addBankAccountForm() {
    this.bankAccountForms.push(this.fb.group({
      bankAccountID: [0],
      accountNumber: ['', Validators.required],
      accountHolder: ['', Validators.required],
      bankID: [0, Validators.min(1)],
      IFSC: ['', Validators.required]
    }));
  }

  recordSubmit(fg: FormGroup) {
    if (fg.value.bankAccountID === 0) {
      this.service.postBankAccount(fg.value).subscribe(
        (res: any) => {
          fg.patchValue({ bankAccountID: res.bankAccountID });
          this.showNotification('insert');
        });
    } else {
      this.service.putBankAccount(fg.value).subscribe(
        () => {
          this.showNotification('update');
        });
    }
  }

  onDelete(bankAccountID: number, i: number) {
    if (bankAccountID === 0) {
      this.bankAccountForms.removeAt(i);
    } else if (confirm('Are you sure to delete this record?')) {
      this.service.deleteBankAccount(bankAccountID).subscribe(
        () => {
          this.bankAccountForms.removeAt(i);
          this.showNotification('delete');
        });
    }
  }

  showNotification(category: 'insert' | 'update' | 'delete') {
    switch (category) {
      case 'insert':
        this.notification = { class: 'text-success', message: 'Saved!' };
        break;
      case 'update':
        this.notification = { class: 'text-primary', message: 'Updated!' };
        break;
      case 'delete':
        this.notification = { class: 'text-danger', message: 'Deleted!' };
        break;
    }
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

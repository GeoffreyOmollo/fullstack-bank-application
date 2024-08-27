import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  constructor(private http: HttpClient) { }

  // Type 'formData' as any or with the specific type/interface if available
  postBankAccount(formData: any) {
    return this.http.post<any>(`${environment.apiBaseURI}/BankAccount`, formData);
  }

  putBankAccount(formData: any) {
    return this.http.put<any>(`${environment.apiBaseURI}/BankAccount/${formData.bankAccountID}`, formData);
  }

  deleteBankAccount(id: number) {
    return this.http.delete(`${environment.apiBaseURI}/BankAccount/${id}`);
  }

  getBankAccountList() {
    return this.http.get<any[]>(`${environment.apiBaseURI}/BankAccount`);
  }
}

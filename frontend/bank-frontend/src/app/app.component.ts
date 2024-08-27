import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BankAccountComponent } from './bank-account/bank-account.component';  // Import the BankAccountComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BankAccountComponent],  // Add BankAccountComponent to the imports array
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Corrected from 'styleUrl' to 'styleUrls'
})
export class AppComponent {
  title = 'bank-frontend';
}

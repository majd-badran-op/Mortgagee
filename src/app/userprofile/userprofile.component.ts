import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Correct import
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule

@Component({
  selector: 'app-userprofile',
  standalone: true,
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class UserProfileComponent {
  mortgageForm: FormGroup;
  monthlyRepayment: string = '';
  totalRepayment: string = '';
  showResults: boolean = false

  constructor(private fb: FormBuilder) {
    this.mortgageForm = this.fb.group({
      mortgageAmount: ['', [Validators.required, Validators.min(1)]],
      mortgageTerm: ['', [Validators.required, Validators.min(1)]],
      interestRate: ['', [Validators.required, Validators.min(0)]],
      mortgageType: ['', Validators.required]
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-UK', {
      style: 'currency',
      currency: 'GBP'
    }).format(value);
  }

  calculateRepayment(): void {
    if (this.mortgageForm.invalid) {
      return;
    }

    const { mortgageAmount, mortgageTerm, interestRate, mortgageType } = this.mortgageForm.value;

    // Ensuring proper typecasting
    const mortgageAmountValue = Number(mortgageAmount);
    const mortgageTermValue = Number(mortgageTerm);
    const interestRateValue = Number(interestRate);

    const monthlyInterest = interestRateValue / 100 / 12;
    const totalMonths = mortgageTermValue * 12;
    let monthlyPayment: number;
    let totalRepayment: number;

    if (mortgageType === 'repayment') {
      const factor = Math.pow(1 + monthlyInterest, totalMonths);
      monthlyPayment = (mortgageAmountValue * monthlyInterest * factor) / (factor - 1);
      totalRepayment = monthlyPayment * totalMonths;
    } else {
      monthlyPayment = mortgageAmountValue * monthlyInterest;
      totalRepayment = mortgageAmountValue + (monthlyPayment * totalMonths);
    }

    this.monthlyRepayment = this.formatCurrency(monthlyPayment);
    this.totalRepayment = this.formatCurrency(totalRepayment);

    this.showResults = true;
  }
  clearForm(): void {
    this.mortgageForm.reset();
    this.monthlyRepayment = '';
    this.totalRepayment = '';
  }
}

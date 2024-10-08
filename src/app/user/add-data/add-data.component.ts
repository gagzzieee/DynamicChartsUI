import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-data',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,],
  templateUrl: './add-data.component.html',
  styleUrl: './add-data.component.scss'
})
export class AddDataComponent {
  products = [
    { id: 1, name: 'Smartphone' },
    { id: 2, name: 'Laptop' },
    { id: 3, name: 'Headphones' },
    { id: 4, name: 'Smartwatch' },
    { id: 5, name: 'Tablet' },
    { id: 6, name: 'Camera' },
    { id: 7, name: 'Monitor' },
    { id: 8, name: 'Keyboard' },
    { id: 9, name: 'Mouse' },
    { id: 10, name: 'Printer' }
  ];

  countries = [
    { id: 1, name: 'United States' },
    { id: 2, name: 'Canada' },
    { id: 3, name: 'United Kingdom' },
    { id: 4, name: 'Germany' },
    { id: 5, name: 'France' },
    { id: 6, name: 'Australia' },
    { id: 7, name: 'Italy' },
    { id: 8, name: 'Spain' },
    { id: 9, name: 'Netherlands' },
    { id: 10, name: 'Sweden' }
  ];

  sources = [
    { id: 1, name: 'Direct' },
    { id: 2, name: 'Social' },
    { id: 3, name: 'Email' },
    { id: 4, name: 'Referral' },
    { id: 5, name: 'Other' }
  ];

  orderForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private apiService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      productId: [null, Validators.required],
      orderDate: [null, [Validators.required, this.futureDateValidator]],
      quantity: [null, [Validators.required, this.negativeNumberValidator]],
      sourceId: [null, Validators.required],
      countryId: [null, Validators.required]
    });
  }

  // Custom validator to check if the quantity is not negative
  negativeNumberValidator(control: AbstractControl): ValidationErrors | null {
    return control.value <= 0 ? { negativeNumber: true } : null;
  }

  // Custom validator to check if the order date is not in the future
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    const selectedDate = new Date(control.value);
    return selectedDate > today ? { futureDate: true } : null;
  }

  onSubmit() {
    if (this.orderForm.valid) {
      this.apiService.addOrder(this.orderForm.value).subscribe({
        next: (response) => {
          this.toastr.success('Order added successfully', response.message);
          this.router.navigate(['/user/dashboard']);
        },
        error: (error) => {
          this.toastr.error('Error adding order', error.message);
        }
      });
    }
  }


}

import { Directive, Input, ElementRef, Renderer2, OnInit, Injector } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, NgControl } from '@angular/forms';

@Directive({
  selector: '[appCustomValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true }]
})
export class CustomValidatorDirective implements Validator, OnInit {
  @Input('appCustomValidator') validationType: string;
  private control: NgControl;

  constructor(private el: ElementRef, private renderer: Renderer2, private injector: Injector) {}

  ngOnInit() {
    console.log('CustomValidatorDirective initialized with validationType:', this.validationType);
    if (!this.validationType) {
      throw new Error('Validation type is required');
    }

    this.control = this.injector.get(NgControl);
    if (!this.control) {
      throw new Error('NgControl is not available');
    }

    // Listen for blur and input events to determine when to show errors
    this.renderer.listen(this.el.nativeElement, 'blur', () => this.setError(this.control.errors));
    this.renderer.listen(this.el.nativeElement, 'input', () => this.setError(this.control.errors));
  }

  validate(control: AbstractControl): ValidationErrors | null {
    console.log('Validating:', control.value, 'with type:', this.validationType);

    if (!control.value) {
      this.removeError();
      // return null;
    }

    let error: ValidationErrors | null = null;

    switch (this.validationType) {
      case 'Email':
        error = this.validateEmail(control.value) ? null : { 'invalidEmail': true };
        break;
      case 'firstName':
        error = this.validateName(control.value) ? null : { 'invalidFirstName': true };
        break;
     
      case 'middleName':
        error = this.validateName(control.value) ? null : { 'invalidMiddleName': true };
        break;
      case 'lastName':
        error = this.validateName(control.value) ? null : { 'invalidLastName': true };
        break;
      case 'agentFirstName':
        error = this.validateName(control.value) ? null : { 'invalidAgentFirstName': true };
        break;
      case 'agentLastName':
        error = this.validateName(control.value) ? null : { 'invalidAgentLastName': true };
        break;
      case 'phoneNumber':
        error = this.validatePhoneNumber(control.value) ? null : { 'invalidPhoneNumber': true };
        break;
      case 'agentCompany':
        error = this.validateCompanyName(control.value) ? null : { 'invalidAgentCompany': true };
        break;
      case 'alternateCompanyName':
        error = this.validateCompanyName(control.value) ? null : { 'invalidAlternateCompanyName': true };
        break;
      case 'companyWebsite':
          error = this.validateCompanyName(control.value) ? null : { 'invalidCompanyWebsite': true };
          break;
      case 'agentMiddleName':
        error = this.validateName(control.value) ? null : { 'invalidAgentMiddleName': true };
        break;

      case 'password':
        error = this.validatePassword(control.value) ? null : { 'invalidPassword': true };
        break;
      case 'gender':
        error = this.validateGender(control.value) ? null : { 'invalidGender': true };
        break;
      case 'address':
        error = this.validateAddress(control.value) ? null : { 'invalidAddress': true };
        break;
      case 'adminRole':
        error = this.validateName(control.value) ? null : { 'invalidAdminRole': true };
          break;
     
      default:
        console.warn('Unknown validation type:', this.validationType);
        error = null;
    }

    console.log('Validation Error:', error);

    // Only show error if the control is touched or dirty
    if (this.control.touched || this.control.dirty) {
      this.setError(error);
    } else {
      this.removeError();
    }

    return error;
  }

  validateEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  validateName(value: string): boolean {
    const nameRegex = /^[a-zA-Z]+$/;
    return nameRegex.test(value);
  }

  validatePhoneNumber(value: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,10}$/;
    return phoneRegex.test(value);
  }

  validateCompanyName(value: string): boolean {
    // Example validation logic for company name, can be adjusted as per requirements
    return value && value.length > 2;
  }

  validatePassword(value: string): boolean {
    // Example validation logic for password: minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(value);
  }

  validateGender(value: string): boolean {
    // Example validation logic for gender: must be 'male', 'female', or 'other'
    const validGenders = ['male', 'female', 'other'];
    return validGenders.includes(value.toLowerCase());
  }

  validateAddress(value: string): boolean {
    // Example validation logic for address: must be at least 10 characters
    return value && value.length >= 10;
  }

  setError(error: ValidationErrors | null) {
    this.removeError();
    if (error) {
      const errorMessage = this.getErrorMessage(error);
      const errorNode = this.renderer.createElement('div');
      const text = this.renderer.createText(errorMessage);
      this.renderer.appendChild(errorNode, text);
      this.renderer.setStyle(errorNode, 'color', 'red');
      this.renderer.setStyle(errorNode, 'font-size', '12px');
      this.renderer.setStyle(errorNode, 'margin-top', '5px');
      this.renderer.setAttribute(errorNode, 'class', 'validation-error');
      this.renderer.appendChild(this.el.nativeElement.parentElement, errorNode);
    }
  }

  removeError() {
    const parent = this.el.nativeElement.parentElement;
    const errorNode = parent.querySelector('.validation-error');
    if (errorNode) {
      this.renderer.removeChild(parent, errorNode);
    }
  }

  getErrorMessage(error: ValidationErrors): string {
    if (error['invalidEmail']) {
      return 'Invalid Email';
    }
    if (error['invalidFirstName']) {
      return 'Invalid First Name';
    }
    if (error['invalidMiddleName']) {
      return 'Invalid Middle Name';
    }
    if (error['invalidLastName']) {
      return 'Invalid Last Name';
    }
    if (error['invalidAgentFirstName']) {
      return 'Invalid Agent First Name';
    }
    if (error['invalidAgentLastName']) {
      return 'Invalid Agent Last Name';
    }
    if (error['invalidPhoneNumber']) {
      return 'Invalid Phone Number';
    }
    if (error['invalidAgentCompany']) {
      return 'Invalid Agent Company';
    }
    if (error['invalidPassword']) {
      return 'Invalid Password';
    }
    if (error['invalidGender']) {
      return 'Invalid Gender';
    }
    if (error['invalidAddress']) {
      return 'Invalid Address';
    }
    if (error['invalidAlternateCompanyName']) {
      return 'Invalid Alternate Company Name';
    }
    if (error['invalidCompanyWebsite']) {
      return 'Invalid Company Website';
    }
    if (error['invalidAgentMiddleName']) {
      return 'Invalid Agent Middle Name';
    }
    if (error['invalidAdminRole']) {
      return 'Invalid Admin Role';
    }
    return 'Invalid Value';
  }
}

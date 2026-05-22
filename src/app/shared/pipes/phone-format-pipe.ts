import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true,
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Remove all non-digit characters
    const digits = value.toString().replace(/\D/g, '');

    if (digits.length !== 10) {
      return value.toString(); // Return original value if it doesn't have 10 digits
    }

    // Format the digits into (XXX) XXX-XXXX
    const formatted = digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    return formatted;
  }
}

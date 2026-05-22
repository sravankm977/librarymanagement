import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'availability',
  standalone: true,
})
export class AvailabilityPipe implements PipeTransform {
  transform(quantity: number): string {
    if (quantity === null || quantity === undefined) return 'Unknown';

    if (quantity > 0) {
      return 'Available';
    } else {
      return 'Unavailable';
    }
  }
}

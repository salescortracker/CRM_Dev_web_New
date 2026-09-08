import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
})
export class StatusPipe implements PipeTransform {
  transform(value: number): string {

    switch (value) {
      case 1:
        return 'Active';

      case 0:
        return 'Inactive';

      case 2:
        return 'Pending';

      default:
        return 'Unknown';
    }
  }
}

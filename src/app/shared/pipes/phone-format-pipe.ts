import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string): string {

    if (!value || value.length !== 10) {
      return value;
    }

    return `${value.slice(0,5)}-${value.slice(5)}`;
  }
}

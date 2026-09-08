import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
   transform(
    value: any,
    format: string = 'dd-MM-yyyy'
  ): string {

    return new DatePipe('en-US')
      .transform(value, format) || '';
  }
  
}

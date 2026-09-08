import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
})
export class AgePipe implements PipeTransform {
  transform(dateOfBirth: string): number {

    const dob = new Date(dateOfBirth);

    const diff =
      Date.now() -
      dob.getTime();

    return Math.floor(
      diff /
      (1000 * 60 * 60 * 24 * 365.25)
    );
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDateFormat',
  standalone: true
})
export class CustomDateFormatPipe implements PipeTransform {
  transform(value: string): string {
    let date: Date;

    date = value ? new Date(value) : new Date();

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear().toString().slice(-2);

    return `${day} ${month} ${year}`;
  }
}

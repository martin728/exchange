import { CommonModule } from '@angular/common';
import { Component, forwardRef, Injector, Inject, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Rate } from '../../shared/models';

@Component({
  selector: 'currency-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './currency-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencySelectComponent),
      multi: true,
    },
  ],
})
export class CurrencySelectComponent implements ControlValueAccessor {
  control = new FormControl();
  @Input() exchangeRates!: Rate;
  private _onChange!: (value: any) => void;
  private _onTouched!: () => void;

  constructor(@Inject(Injector) private injector: Injector) {}

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(value: any): void {
    this.control.setValue(value, { emitEvent: false });
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this._onChange(value);
  }

  onBlur(): void {
    this._onTouched();
  }
}

import { CommonModule } from '@angular/common';
import { Component, forwardRef, Injector, Inject } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'amount-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './amount-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmountInputComponent),
      multi: true,
    },
  ],
})
export class AmountInputComponent implements ControlValueAccessor {
  control = new FormControl();

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

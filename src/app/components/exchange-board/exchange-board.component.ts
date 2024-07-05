import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  DEFAULT_GET_CURRENCY,
  DEFAULT_GIVE_CURRENCY,
  MAX_AMOUNT,
} from '../../shared/constants';
import { Rate } from '../../shared/models';

@Component({
  selector: 'app-exchange',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './exchange-board.component.html',
})
export class ExchangeComponent implements OnInit {
  form!: FormGroup;
  @Input() exchangeRates: Rate = {};
  @Input() hasRates: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      giveAmount: new FormControl(null, [Validators.maxLength(MAX_AMOUNT)]),
      giveCurrency: new FormControl(DEFAULT_GIVE_CURRENCY),
      getAmount: new FormControl(null, [Validators.maxLength(MAX_AMOUNT)]),
      getCurrency: new FormControl(DEFAULT_GET_CURRENCY),
    });

    this.form.get('giveAmount')?.setValue(0);
    this.updateAmount(true);
  }

  updateAmount(isGiveUpdate: boolean) {
    const giveAmountControl = this.getFormValue('giveAmount');
    const getAmountControl = this.getFormValue('getAmount');
    const giveCurrency = this.getFormValue('giveCurrency')?.value as string;
    const getCurrency = this.getFormValue('getCurrency')?.value as string;

    let rate = 1;
    if (giveCurrency !== getCurrency) {
      rate = isGiveUpdate
        ? this.exchangeRates[getCurrency] / this.exchangeRates[giveCurrency]
        : this.exchangeRates[giveCurrency] / this.exchangeRates[getCurrency];
    }

    const firstControl = isGiveUpdate ? giveAmountControl : getAmountControl;
    const secondControl = isGiveUpdate ? getAmountControl : giveAmountControl;
    const firstValue = parseFloat(firstControl?.value as string);

    secondControl?.setValue((firstValue * rate).toFixed(2), {
      emitEvent: false,
    });
  }

  recount() {
    this.updateAmount(false);
    this.updateAmount(true);
  }

  reset() {
    this.form.reset({
      giveAmount: 0,
      giveCurrency: DEFAULT_GIVE_CURRENCY,
      getAmount: 0,
      getCurrency: DEFAULT_GET_CURRENCY,
    });
  }

  swap() {
    const giveCurrency = this.getFormValue('giveCurrency')?.value;
    const getCurrency = this.getFormValue('getCurrency')?.value;

    this.form.patchValue({
      giveCurrency: getCurrency,
      getCurrency: giveCurrency,
    });
    this.updateAmount(true);
  }

  getFormValue(value: string) {
    return this.form.get(value);
  }
}

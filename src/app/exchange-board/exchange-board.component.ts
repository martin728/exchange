import { KeyValuePipe, NgForOf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  DEFAULT_GET_CURRENCY,
  DEFAULT_GIVE_CURRENCY,
  Rate,
} from '../constants';

@Component({
  selector: 'app-exchange',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, NgForOf, KeyValuePipe],
  templateUrl: './exchange-board.component.html',
})
export class ExchangeComponent implements OnInit {
  form!: FormGroup;
  @Input() exchangeRates!: Rate;

  ngOnInit() {
    this.form = this.fb.group({
      giveAmount: new FormControl(null),
      giveCurrency: new FormControl(DEFAULT_GIVE_CURRENCY),
      getAmount: new FormControl(null),
      getCurrency: new FormControl(DEFAULT_GET_CURRENCY),
    });

    this.form.get('giveAmount')?.setValue(0);
    this.updateGive();
  }

  updateAmount(isGiveUpdate: boolean) {
    const firstKey = isGiveUpdate ? 'giveAmount' : 'getAmount';
    const secondKey = isGiveUpdate ? 'getAmount' : 'giveAmount';
    const firstValue = parseFloat(this.form.get(firstKey)?.value);
    const giveCurrency = this.form.get('giveCurrency')?.value as string;
    const getCurrency = this.form.get('getCurrency')?.value as string;

    let rate = 1;

    if (giveCurrency !== getCurrency) {
      rate = isGiveUpdate
        ? this.exchangeRates[getCurrency] / this.exchangeRates[giveCurrency]
        : this.exchangeRates[giveCurrency] / this.exchangeRates[getCurrency];
    }

    this.form
      .get(secondKey)
      ?.setValue((firstValue * rate).toFixed(2), { emitEvent: false });
  }

  updateGive() {
    this.updateAmount(true);
  }

  updateGet() {
    this.updateAmount(false);
  }

  resetForm() {
    this.form.controls['giveAmount'].setValue(0);
    this.form.controls['getAmount'].setValue(0);
  }

  constructor(private fb: FormBuilder) {}
}

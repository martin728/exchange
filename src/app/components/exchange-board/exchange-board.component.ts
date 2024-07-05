import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import {
  DEFAULT_GET_CURRENCY,
  DEFAULT_GIVE_CURRENCY,
  MAX_AMOUNT,
} from '../../shared/constants';
import { Rate } from '../../shared/models';
import { AmountInputComponent } from '../amount-input/amount-input.component';
import { CurrencySelectComponent } from '../currency-select/currency-select.component';

@Component({
  selector: 'app-exchange',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    AmountInputComponent,
    CurrencySelectComponent,
  ],
  templateUrl: './exchange-board.component.html',
})
export class ExchangeComponent implements OnInit, AfterViewInit, OnDestroy {
  form!: FormGroup;
  @Input() exchangeRates: Rate = {};
  @Input() hasRates: boolean = false;
  private readonly onDestroy = new Subject<void>();
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      giveAmount: new FormControl(null, [Validators.maxLength(MAX_AMOUNT)]),
      giveCurrency: new FormControl(DEFAULT_GIVE_CURRENCY),
      getAmount: new FormControl(null, [Validators.maxLength(MAX_AMOUNT)]),
      getCurrency: new FormControl(DEFAULT_GET_CURRENCY),
    });
  }

  ngAfterViewInit() {
    this.subscribeToFormControl('giveAmount', () => this.updateAmount(true));
    this.subscribeToFormControl('getAmount', () => this.updateAmount(false));
    this.subscribeToFormControl('giveCurrency', this.recount);
    this.subscribeToFormControl('getCurrency', this.recount);
  }

  private subscribeToFormControl(
    controlName: string,
    callback: () => void
  ): void {
    this.form.controls[controlName].valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(callback);
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
    this.updateAmount(true);
  }

  reset() {
    this.form.setValue(
      {
        giveAmount: 0,
        giveCurrency: DEFAULT_GIVE_CURRENCY,
        getAmount: 0,
        getCurrency: DEFAULT_GET_CURRENCY,
      },
      { emitEvent: false }
    );

    this.recount();
  }

  swap() {
    const giveCurrency = this.getFormValue('giveCurrency')?.value;
    const getCurrency = this.getFormValue('getCurrency')?.value;

    this.form.patchValue(
      {
        giveCurrency: getCurrency,
        getCurrency: giveCurrency,
      },
      { emitEvent: false }
    );

    this.recount();
  }
  getFormValue(value: string) {
    return this.form.get(value);
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}

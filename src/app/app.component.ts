import { KeyValuePipe, NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomDateFormatPipe } from './date.pipe';
import { ExchangeComponent } from './exchange-board/exchange-board.component';
import { DEFAULT_GIVE_CURRENCY } from './constants';
import { CurrencyService } from './currency.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    ExchangeComponent,
    ReactiveFormsModule,
    FormsModule,
    KeyValuePipe,
    CustomDateFormatPipe,
    NgForOf,
  ],
  providers: [CurrencyService],
})
export class AppComponent implements OnInit {
  exchangeRates!: { [key: string]: number };
  today!: string;
  currency: string = DEFAULT_GIVE_CURRENCY;
  selectedCurrency: string = DEFAULT_GIVE_CURRENCY;
  private subscription: Subscription = new Subscription();

  constructor(private service: CurrencyService) {}

  ngOnInit(): void {
    this.getRates(this.selectedCurrency || this.currency);
  }

  updateCurrency(event: Event) {
    this.selectedCurrency = (event.target as HTMLSelectElement).value;
    this.getRates(this.selectedCurrency);
  }

  getRates(currency: string) {
    this.subscription.add(
      this.service.getExchangeRates(currency).subscribe(
        (data) => {
          this.exchangeRates = data.rates;
          this.today = data.date;
        },
        (error) => {
          throw new Error('Error fetching exchange rates: ' + error);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

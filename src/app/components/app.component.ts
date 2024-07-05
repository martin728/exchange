import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Rate } from '../shared/models';
import { CustomDateFormatPipe } from '../pipes/date.pipe';
import { ExchangeComponent } from './exchange-board/exchange-board.component';
import { DEFAULT_GIVE_CURRENCY } from '../shared/constants';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    ExchangeComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomDateFormatPipe,
  ],
  providers: [CurrencyService],
})
export class AppComponent implements OnInit {
  exchangeRates: Rate = {};
  today: string = '';
  noRates: boolean = true;
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
          this.noRates = this.hasRates(data.rates);
        },
        (error) => {
          throw new Error('Error fetching exchange rates: ' + error);
        }
      )
    );
  }

  hasRates(exchangeRates: Rate) {
    for (let rate in exchangeRates) {
      if (exchangeRates.hasOwnProperty(rate)) return true;
    }
    return false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

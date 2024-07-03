import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { CurrencyDataResponse } from './constants';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private apiUrl = 'https://api.exchangerate-api.com/v4/latest/';

  constructor(private http: HttpClient) {}

  getExchangeRates(baseCurrency: string): Observable<CurrencyDataResponse> {
    const url = `${this.apiUrl}${baseCurrency}`;
    return this.http.get<CurrencyDataResponse>(url).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}

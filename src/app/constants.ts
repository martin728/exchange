export const DEFAULT_GIVE_CURRENCY = 'USD';
export const DEFAULT_GET_CURRENCY = 'UAH';
export const MAX_AMOUNT = 1000000;

export interface CurrencyDataResponse {
  rates: Rate;
  date: string;
}

export interface Rate {
  [key: string]: number;
}

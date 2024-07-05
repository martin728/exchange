export interface Rate {
  [key: string]: number;
}

export interface CurrencyDataResponse {
  rates: Rate | {};
  date: string;
}

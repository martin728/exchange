export const DEFAULT_GIVE_CURRENCY = 'USD';
export const DEFAULT_GET_CURRENCY = 'UAH';
export const MAX_AMOUNT = 1000000;

export interface CurrencyDataResponse {
  WARNING_UPGRADE_TO_V6: string;
  base: string;
  provider: string;
  terms: string;
  rates: Rate;
  time_last_update: string;
  date: string;
}

export interface Rate {
  [key: string]: number;
}

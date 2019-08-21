// Type definitions for virtuaaliviivakoodi 1.0.3
// Project: https://github.com/akselinurmio/virtuaaliviivakoodi

export = virtuaaliviivakoodi;

declare function virtuaaliviivakoodi(opts: virtuaaliviivakoodi.Options): string;

declare namespace virtuaaliviivakoodi {
  export interface Options {
    iban: string;
    reference: number;
    amount: number;
    due: string
  }
}

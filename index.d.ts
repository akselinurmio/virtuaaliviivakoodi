// Type definitions for virtuaaliviivakoodi 1.0.3
// Project: https://github.com/akselinurmio/virtuaaliviivakoodi

export = virtuaaliviivakoodi;

declare function virtuaaliviivakoodi(opts: virtuaaliviivakoodi.Options): string;

declare namespace virtuaaliviivakoodi {
  export interface Options {
    /**
     * Recipient IBAN
     */
    iban: string;
    /**
     * Valid Finnish bank reference or ISO 11649 Creditor Reference
     */
    reference: number|string;
    /**
     * Amount in EUR
     */
    amount?: number;
    /**
     * Due date in format YYMMDD
     */
    due?: string
  }
}

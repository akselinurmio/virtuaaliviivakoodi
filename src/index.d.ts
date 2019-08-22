// Type definitions for virtuaaliviivakoodi 1.0.3
// Project: https://github.com/akselinurmio/virtuaaliviivakoodi

export = virtuaaliviivakoodi

declare function virtuaaliviivakoodi(opts: virtuaaliviivakoodi.Options): string

declare namespace virtuaaliviivakoodi {
  interface BaseOptions {
    /** Recipient IBAN */
    iban: string

    /** Valid Finnish bank reference or ISO 11649 Creditor Reference */
    reference: number | string

    /** Due date in format YYMMDD */
    due?: string
  }

  interface OptionsWithCents extends BaseOptions {
    /** Amount in cents (1/100 euros) */
    cents?: number
  }

  interface OptionsWithAmount extends BaseOptions {
    /** Amount in EUR
     * @deprecated Use `cents` instead
     */
    amount?: number
  }

  export type Options = OptionsWithCents | OptionsWithAmount
}

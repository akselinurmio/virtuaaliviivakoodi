// Type definitions for virtuaaliviivakoodi 2.0.0
// Project: https://github.com/akselinurmio/virtuaaliviivakoodi

export = virtuaaliviivakoodi

declare function virtuaaliviivakoodi(opts: virtuaaliviivakoodi.Options): string

declare namespace virtuaaliviivakoodi {
  export type Options = {
    /** Recipient IBAN */
    iban: string

    /** Valid Finnish bank reference or ISO 11649 Creditor Reference */
    reference: number | string

    /** Amount in cents (1/100 euros) */
    cents?: number

    /** Due date in format YYMMDD */
    due?: string
  }
}

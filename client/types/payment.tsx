export interface IPayment {
  credit_card_number: string
  expiration_month: string
  expiration_year: string
  cvv: string
  amount: number
}

export interface IPaymentError {
  credit_card_number: string | null
  expiration_month: string | null
  expiration_year: string |null
  cvv: string | null
  amount: string | null
}
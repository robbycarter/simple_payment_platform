import { IPayment, IPaymentError } from '@/types/payment'
import axios from 'axios'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

const Home: NextPage = () => {

  const initialPayment: IPayment = {
    amount: 0,
    credit_card_number: "",
    cvv: "",
    expiration_month: "",
    expiration_year: ""
  }
  const [payment, setPayment] = useState<IPayment>(initialPayment)

  const initialPaymentError: IPaymentError = {
    amount: null,
    credit_card_number: null,
    cvv: null,
    expiration_month: null,
    expiration_year: null
  }
  const [paymentError, setPaymentError] = useState<IPaymentError>(initialPaymentError)

  const [allowPayment, setAllowPayment] = useState<boolean>(false)

  const handleValidation = (field: string, value: string) => {

    if (field == "credit_card_number") {
      if (value.length != 16) {
        setPaymentError(prev => {
          return {
            ...prev,
            credit_card_number: "Credit Card length must be 16"
          }
        })
      } else {
        setPaymentError(prev => {
          return {
            ...prev,
            credit_card_number: null
          }
        })
      }
    }

    if (field == "MM") {
      if (new RegExp(/^(0[1-9]|1[0-2])$/).test(value)) {
        setPaymentError(prev => {
          return {
            ...prev,
            expiration_month: "Invalid Month Format."
          }
        })
      } else {
        setPaymentError(prev => {
          return {
            ...prev,
            expiration_month: null
          }
        })
      }
    }

    if (field == "YYYY") {
      if (value.length != 4) {
        setPaymentError(prev => {
          return {
            ...prev,
            expiration_year: "Year must be of lenth 4"
          }
        })
      } else {
        setPaymentError(prev => {
          return {
            ...prev,
            expiration_year: null
          }
        })
      }
    }

    if (field == "cvv") {
      if (value.length != 3) {
        setPaymentError(prev => {
          return {
            ...prev,
            cvv: "CVC must be of lenth 3"
          }
        })
      } else {
        setPaymentError(prev => {
          return {
            ...prev,
            cvv: null
          }
        })
      }
    }

    if (field == "amount") {
      if (value.length == 0) {
        setPaymentError(prev => {
          return {
            ...prev,
            amount: "Amount cannot be to 0"
          }
        })
      } else {
        setPaymentError(prev => {
          return {
            ...prev,
            amount: null
          }
        })
      }
    }

    setPayment(prev => {
      return {
        ...prev,
        [field]: value
      }
    })
  }

  const handlePayment = async () => {

    const body = {
      "CardNumber": payment.credit_card_number,
      ExpDate: `${payment.expiration_month}/${payment.expiration_year}`,
      Cvv: payment.cvv,
      Amount: payment.amount
    }

    const { data, status } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/make-payment`,
      body
    );

    alert(data)

    if (status == 200) {
      setAllowPayment(false)
      setPayment(initialPayment)
      setPaymentError(initialPaymentError)
    }
  }

  useEffect(() => {

    let errors = Object.fromEntries(
      Object.entries(paymentError).filter(([_, v]) => v != null)
    )

    if (Object.keys(errors).length != 0) {
      setAllowPayment(false)
    }

    let payment_data = Object.fromEntries(
      Object.entries(payment).filter(([_, v]) => v != null && v != '')
    )

    if (Object.keys(errors).length == 0 && Object.keys(payment_data).length == 5) {
      setAllowPayment(true)
    }

  }, [paymentError, payment])

  return (
    <div className="w-full m-auto max-w-xs">
      <form className="flex flex-col gap-5 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" >
            Credit Card
          </label>
          <input
            className="border rounded w-full py-2 px-3 text-gray-700"
            type="number"
            placeholder="Credit Card"
            onChange={(e) => handleValidation("credit_card_number", e.target.value)}
          />
          {paymentError.credit_card_number ?
            <span>{paymentError.credit_card_number}</span> : ""}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" >
            Expiry Date
          </label>
          <div className='flex flex-row gap-2'>
            <input
              className="border rounded w-full py-2 px-3 text-gray-700"
              type="number"
              placeholder="MM"
              minLength={2}
              maxLength={2}
              onChange={(e) => handleValidation("MM", e.target.value)}
            />
            <input
              className="border rounded w-full py-2 px-3 text-gray-700"
              type="number"
              placeholder="YYYY"
              onChange={(e) => handleValidation("YYYY", e.target.value)}
            />
          </div>
          {paymentError.expiration_month ?
            <span>{paymentError.expiration_month}</span> : ""}
          {paymentError.expiration_year ?
            <span>{paymentError.expiration_year}</span> : ""}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" >
            CVV
          </label>
          <input
            className="border rounded w-full py-2 px-3 text-gray-700"
            type="number"
            placeholder="cvv"
            minLength={3}
            maxLength={3}
            onChange={(e) => handleValidation("cvv", e.target.value)}
          />
          {paymentError.cvv ?
            <span>{paymentError.cvv}</span> : ""}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" >
            Amount
          </label>
          <input
            className="border rounded w-full py-2 px-3 text-gray-700"
            type="number"
            placeholder="Amount"
            onChange={(e) => handleValidation("amount", e.target.value)}
          />
          {paymentError.amount ?
            <span>{paymentError.amount}</span> : ""}
        </div>


        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => {
              if (allowPayment) {
                handlePayment()
              }
            }}>
            Pay
          </button>
        </div>
      </form>
    </div>
  )
}

export default Home

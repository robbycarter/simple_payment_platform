const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.json());

if (!process.env.NODE_ENV) {
  const result = dotenv.config();

  if (result.error) {
    console.log(result.error)
    throw result.error;
  }
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(
  () => {
    console.log(`Database Connected at URL`);
  },
  err => {
    console.log(err)
    console.log(`Error connecting Database instance`);
    // throw new Error("Database Not Connected")
  }
);


// Validators
const {
  paymentValidate
} = require("./validators/payment.joi")
// Modal
const PaymentCollection = require("./modal/payment")

app.post('/payment', async (req, res) => {
  try {

    let payment_body = await paymentValidate(req.body);

    let payment = await new PaymentCollection(payment_body).save();

    return res.send({
      RequestId: payment._id,
      Amount: payment.Amount
    })

  } catch (err) {
    if (err.name == "ValidationError") {
      return res.status(400).send({
        error: err.details || err.message
      })
    }

    return res.status(500).send({
      error: err.name + "-" + err.message
    })
  }
})

const PORT = process.env.POST || 8080;

app.listen(PORT, function () {
  console.log('Server Started on http://localhost:' + PORT);
});
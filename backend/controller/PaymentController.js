const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const stripe = require("stripe")('sk_test_51M8w5VSH4cJrjY3mD0ExAjVdmR34Ef2wzHXqjsdyk6ZBHx10idg6p9hHTFeYBaqfzCvKjAkkdguz0OAdfS2ZS3oO005EMUjETA');

exports.Payment = catchAsyncErrors(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
    metadata: {
      company: "MERN",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});

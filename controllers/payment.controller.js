//manejo desde el frontend
const {
  createCardToken,
  createUser,
  makePyament,
} = require('../utils/payment.service');
const Payment = require('../models/payment');
const { updateUser, addBillingCustomerId } = require('../controllers/users');
const get = require('lodash/get');

const createCardTokenHandler = async (req, res) => {
  const { cardnumber, cardExp_year, cardExp_month, cardCvc } = req.body;
  const creditinfo = {
    'card[number]': cardnumber,
    'card[exp_year]': cardExp_year,
    'card[exp_month]': cardExp_month,
    'card[cvc]': cardCvc,
  };

  try {
    const { card, id, status } = await createCardToken(creditinfo);
    const user = req.user;

    const creditCards = get(user, 'billing.creditCards', []);

    const customer = {
      billing: {
        creditCards: creditCards.concat({
          expMonth: card.exp_month,
          expyear: card.exp_year,
          name: card.name,
          mask: card.mask,
          tokenId: id,
        }),
      },
    };

    await updateUser(req.user._id, customer);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: ' Epayco token card error', error });
  }
};

const createCustomerHandler = async (req, res) => {
  try {
    const { user } = req;
    const { data } = await createUser(user);
    await addBillingCustomerId(user, data.customerId);

    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
  }
};

const createPaymentHandler = async (req, res) => {
  try {
    const { user, body: payment } = req;
    const { data, success } = await makePyament(user, payment);

    if (!success) {
      return res.status(400).json(data);
    }
    if (!user.billing.customerId) {
      //registrar ususario
      //1.regsitrar tarjeta
    }

    await Payment.create({
      userId: user._id,
      refId: data.recibo,
      bill: payment.bill,
      description: payment.description,
      value: payment.value,
      tax: payment?.tax,
      taxBase: payment?.taxbase,
    });

    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  createCardTokenHandler,
  createCustomerHandler,
  createPaymentHandler,
};

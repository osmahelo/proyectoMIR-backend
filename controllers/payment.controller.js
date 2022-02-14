//manejo desde el frontend
const {
  createCardToken,
  createUser,
  makePayment,
} = require('../utils/payment.service');
const Payment = require('../models/payment');
const { updateUser, addBillingCustomerId } = require('../controllers/users');
const get = require('lodash/get');

const createCardTokenHandler = async (req, res) => {
  const {
    numberCard: cardnumber,
    expYear: cardExp_year,
    expMonth: cardExp_month,
    cvc: cardCvc,
  } = req.body;
  console.log(req.body);
  const creditinfo = {
    'card[number]': cardnumber,
    'card[exp_year]': cardExp_year,
    'card[exp_month]': cardExp_month,
    'card[cvc]': cardCvc,
  };

  try {
    const { card, id, status } = await createCardToken(creditinfo);
    console.log('tokenId', id);
    const user = req.user;

    const creditCards = get(user, 'billing.creditCards', []);

    const customer = {
      billing: {
        creditCards: creditCards.concat({
          expMonth: card.exp_month,
          expYear: card.exp_year,
          name: card.name,
          mask: card.mask,
          tokenId: id,
        }),
      },
    };

    await updateUser(req.user._id, customer);
    console.log(status);
    res.status(200).json(status);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: ' Epayco token card error', error });
  }
};

const createCustomerHandler = async (req, res) => {
  try {
    const { user } = req;
    const { data } = await createUser(user);
    console.log(data);
    await addBillingCustomerId(user, data.customerId);
    console.log(data);
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
  }
};

const createPaymentHandler = async (req, res) => {
  console.log(req.user);
  console.log(req.body);
  try {
    const { user, body: payment } = req;
    const { data, success } = await makePayment(user, payment);

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
      bill: data.factura,
      description: data.descripcion,
      value: data.valor,
      tax: data.iva,
      taxBase: data.valorneto,
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

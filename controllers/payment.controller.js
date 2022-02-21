//manejo desde el frontend
const {
  createCardToken,
  createUser,
  makePayment,
} = require('../utils/payment.service');
const Payment = require('../models/payment');
const User = require('../models/users');
const Collaborator = require('../models/collaborator');
const {
  updateUser,
  updateCollab,
  addBillingCustomerId,
} = require('../controllers/users');
const get = require('lodash/get');
const { StatusCodes } = require('http-status-codes');

const getCreditCards = async (req, res) => {
  const { user } = req;
  if (!user.billing.creditCards) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Usuario sin Tarjetas de Credito' });
  } else {
    return res.status(StatusCodes.OK).json(user.billing.creditCards);
  }
};
const createCardTokenHandler = async (req, res) => {
  const {
    numberCard: cardnumber,
    expYear: cardExp_year,
    expMonth: cardExp_month,
    cvc: cardCvc,
    holder,
  } = req.body;
  console.log(req.body);
  const creditinfo = {
    'card[number]': cardnumber,
    'card[exp_year]': cardExp_year,
    'card[exp_month]': cardExp_month,
    'card[cvc]': cardCvc,
  };

  try {
    const cardRegistered = await createCardToken(creditinfo);
    const { card, id, data } = cardRegistered;
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
          holderCard: holder,
        }),
      },
    };

    await updateUser(req.user._id, customer);
    res.status(200).json({ status: true });
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
  const { user } = req;
  const { payment } = req.body;
  try {
    const { data, success } = await makePayment(user, payment);
    if (!success) {
      return res.status(400).json(data);
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
    await User.updateOne(
      { _id: user._id, 'payment.idService': payment.idService },
      { $set: { 'request.$[id].payment': true } },
      { arrayFilters: [{ 'id.idService': payment.idService }] }
    );
    await Collaborator.updateOne(
      { _id: payment.idCollab, 'payment.idService': payment.idService },
      { $set: { 'request.$[id].payment': true } },
      { arrayFilters: [{ 'id.idService': payment.idService }] }
    );
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
  getCreditCards,
};

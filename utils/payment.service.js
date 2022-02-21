const { v4: uuidv4 } = require('uuid');
const { get } = require('lodash');

const epayco = require('epayco-sdk-node')({
  apiKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  lang: 'ES',
  test: true,
});

const createCardToken = async (creditCardInfo) => {
  const cardRegistered = await epayco.token.create(creditCardInfo);
  return cardRegistered;
};
const createUser = async (user) => {
  console.log(
    `🤖 ~ file: payment.service.js ~ line 15 ~ createUser ~ user`,
    user
  );
  debugger;
  const customerInfo = {
    token_card: user?.billing?.creditCards?.[0]?.tokenId,
    name: user.name,
    last_name: user.lastName,
    email: user.email,
    default: true,
  };

  return await epayco.customers.create(customerInfo);
};
const makePayment = async (user, payment) => {
  const bill = uuidv4();
  const defaultTokenId = get(user, 'billing.creditCards[0].tokenId');
  const customerId = get(user, 'billing.customerId');

  const paymentInfo = {
    token_card: defaultTokenId,
    customer_id: customerId,
    doc_type: get(payment, 'doc_type'),
    doc_number: get(payment, 'docNumber'),
    name: get(payment, 'name', user.name),
    last_name: get(payment, 'lastName', user.lastName),
    email: get(payment, 'email', user.email),
    city: get(payment, 'city'),
    address: get(payment, 'address', 'Calle 53 # 9D - 75'),
    phone: get(payment, 'phone'),
    cell_phone: get(payment, 'cellPhone'),
    bill,
    description: 'Pago de servicio FixHogar',
    value: get(payment, 'value'),
    tax: get(payment, 'tax', '0'),
    tax_base: get(payment, 'taxBase'),
    currency: get(payment, 'currency', 'COP'),
    dues: get(payment, 'dues', '12'),
  };
  console.log('Payment Info', paymentInfo);

  return await epayco.charge.create(paymentInfo);
};

module.exports = {
  createCardToken,
  createUser,
  makePayment,
};

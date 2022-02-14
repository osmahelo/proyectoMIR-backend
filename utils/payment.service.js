const { v4: uuidv4 } = require('uuid');
const { get } = require('lodash');

const epayco = require('epayco-sdk-node')({
  apiKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  lang: 'ES',
  test: true,
});

const createCardToken = async (creditCardInfo) => {
  return await epayco.token.create(creditCardInfo);
};
const createUser = async (user) => {
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
    doc_type: get(payment, 'docType'),
    doc_number: get(payment, 'docNumber'),
    name: get(payment, 'name', user.name),
    last_name: get(payment, 'lastName', user.lastName),
    email: get(payment, 'email', user.email),
    city: get(payment, 'city'),
    address: get(payment, 'address', 'Calle 53 # 9D - 75'),
    phone: get(payment, 'phone'),
    cell_phone: get(payment, 'cellPhone'),
    bill: get(payment, 'bill', bill),
    description: get(payment, 'description'),
    value: get(payment, 'value'),
    tax: get(payment, 'tax'),
    tax_base: get(payment, 'taxBase'),
    currency: get(payment, 'currency', 'COP'),
    dues: get(payment, 'dues', '12'),
  };

  return await epayco.charge.create(paymentInfo);
};

module.exports = {
  createCardToken,
  createUser,
  makePayment,
};

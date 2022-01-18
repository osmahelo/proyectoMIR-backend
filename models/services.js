const moongose = require('mongoose');

const serviceSchema = new moongose.Schema({
  description: { type: String, required: true },
  price: { type: String, required: true },
  city: { type: String, required: true },
  services: {
    type: String,
    enum: {
      values: [
        'Instalación TV',
        'Instalación Nevera',
        'Carpintería',
        'Plomería',
        'Pintura de Interiores',
        'Mantenimiento Lavadora',
        'Jardinería',
        'Reparación de Tuberías',
      ],
      msg: 'Value is not suported',
    },
  },
  createdBy: { type: String, required: true },
});

module.exports = moongose.model('Services', serviceSchema);

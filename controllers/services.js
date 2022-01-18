const Service = require('../models/services');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const CreateServices = async (req, res) => {
  const { description, price, city, services, createdBy } = req.body;
  if (!description || !price || !city || !services || !createdBy) {
    throw new BadRequestError(
      'Please provide Service, descripction, city, price, createdBy'
    );
  }

  const service = await Service.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ service });
};

const GetServices = async (req, res) => {
  const { services } = req.body;
  const service = await Service.find({ services: services });
  res.status(StatusCodes.OK).json({ service });
};
const UpdateService = async (req, res) => {
  const { id: serviceId } = req.body;
  res.status(200).json({ msg: 'Update Services' });
};
const DeleteService = async (req, res) => {
  res.status(200).json({ msg: 'Delete Services' });
};

module.exports = {
  CreateServices,
  GetServices,
  UpdateService,
  DeleteService,
};

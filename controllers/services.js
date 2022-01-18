const Service = require('../models/services');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const CreateServices = async (req, res) => {
  const { description, price, city, services, createdBy } = req.body;
  if (!description || !price || !city || !services || !createdBy) {
    throw new BadRequestError('Please provide name, lastname, email,password');
  }

  const service = await Service.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ service });
};

const GetServices = async (req, res) => {
  const { service } = req.body;
  const services = await Service.find({ service });
  res.status(StatusCodes.CREATED).json({ services });
};
const UpdateServices = async (req, res) => {
  res.status(200).json({ msg: 'Update Services' });
};
const DeleteServices = async (req, res) => {
  res.status(200).json({ msg: 'Delete Services' });
};

module.exports = {
  CreateServices,
  GetServices,
  UpdateServices,
  DeleteServices,
};

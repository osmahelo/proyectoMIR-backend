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
  if (!service) {
    throw new BadRequestError('Service not found');
  }
  res.status(StatusCodes.OK).json({ service });
};
const UpdateService = async (req, res) => {
  const { id: serviceId } = req.params;
  const service = await Service.findOneAndUpdate({ _id: serviceId }, req.body, { new: true });
  if (!service) {
    throw new BadRequestError('Service ID not found');
  } 
  res.status(StatusCodes.OK).json({msg:'Service Updated', service });
};
const DeleteService = async (req, res) => {
  const { id: serviceId } = req.params;
  const service = await Service.findByIdAndDelete({ _id: serviceId });
  if (!service) {
    throw new BadRequestError('Service ID not found, service could no be deleted');
  } 
  res.status(StatusCodes.OK).json({msg:'Service Deleted'}); 
};

module.exports = {
  CreateServices,
  GetServices,
  UpdateService,
  DeleteService,
};

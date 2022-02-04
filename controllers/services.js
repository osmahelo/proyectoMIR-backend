const Service = require('../models/services');
const Collaborator = require('../models/collaborator');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const CreateServices = async (req, res) => {
  const collab = await Collaborator.findById(req.collab);
  const { description, price, city, services } = req.body;
  if (!description || !price || !city || !services) {
    throw new BadRequestError(
      'Please provide Service, descripction, city, price'
    );
  }

  const service = await Service.create({ ...req.body, createdBy: collab._id });
  res.status(StatusCodes.CREATED).json({ service });
};

const GetServices = async (req, res) => {
  const { services } = req.body;
  const service = await Service.find({ services: services });
  if (!service) {
    throw new NotFoundError('Service not found');
  }
  res.status(StatusCodes.OK).json({ service });
};

const GetServicesByCollab = async (req, res) => {
  const { id: collabId } = req.params;
  const service = await Service.find({ createdBy: collabId });
  res.status(StatusCodes.OK).json({ service });
};

const UpdateService = async (req, res) => {
  const { id: serviceId } = req.params;
  const service = await Service.findOneAndUpdate({ _id: serviceId }, req.body, {
    new: true,
  });
  if (!service) {
    throw new NotFoundError('Service ID not found');
  }
  res.status(StatusCodes.OK).json({ msg: 'Service Updated', service });
};

const DeleteService = async (req, res) => {
  const { id: serviceId } = req.params;
  const service = await Service.findByIdAndDelete({ _id: serviceId });
  if (!service) {
    throw new NotFoundError(
      'Service ID not found, service could no be deleted'
    );
  }
  res.status(StatusCodes.OK).json({ msg: 'Service Deleted' });
};

const SearchServices = async (req, res) => {
  const { serviceName } = req.query;
  const servByCollab = await Service.find({ services: serviceName })
    .populate({
      path: 'createdBy',
      select: 'name -_id',
    })
    .select({
      price: 1,
      city: 1,
      name: 1,
      _id: 0,
    });
  res.status(200).json({ servByCollab });
};


module.exports = {
  CreateServices,
  GetServices,
  UpdateService,
  DeleteService,
  GetServicesByCollab,
  SearchServices,
};

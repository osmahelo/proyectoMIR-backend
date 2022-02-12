const Service = require('../models/services');
const Collaborator = require('../models/collaborator');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const CreateServices = async (req, res) => {
  try {
    const { description, price, services } = req.body;
    if (!description || !price || !services) {
      throw new BadRequestError(
        'Please provide Service, descripction, city, price'
      );
    }

    const service = await Service.create({
      ...req.body,
      city: req.collab.city,
      createdBy: req.collab._id,
    });
    const collaborator = await Collaborator.findByIdAndUpdate(
      req.collab.id,
      {
        services: service,
      },
      { new: true }
    );
    res.status(StatusCodes.CREATED).json({ service, collaborator });
  } catch (error) {
    console.log(error);
  }
};

const GetServices = async (req, res) => {
  const service = await Service.find({}, { services: 1, _id: 0 }).distinct(
    'services'
  );
  if (!service) {
    throw new NotFoundError('Service not found');
  }
  res.status(StatusCodes.OK).json({ service });
};

const GetCitys = async (req, res) => {
  const { service } = req.query;
  const cityService = await Service.find(
    { services: service },
    { city: 1, _id: 0 }
  ).distinct('city');
  if (!cityService) {
    throw new NotFoundError('City not found');
  }
  res.status(StatusCodes.OK).json({ cityService });
};

const GetServicesByCollab = async (req, res) => {
  const { _id: collabId } = req.collab;
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
  const { service, city } = req.query;
  const servByCollab = await Service.find({ services: service, city })
    .populate({
      path: 'createdBy',
      select: 'name lastName image _id',
    })
    .select({
      price: 1,
      _id: 0,
    });
  res.status(200).json({ servByCollab });
};

module.exports = {
  CreateServices,
  GetServices,
  GetCitys,
  UpdateService,
  DeleteService,
  GetServicesByCollab,
  SearchServices,
};

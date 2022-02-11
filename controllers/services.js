const Service = require("../models/services");
const Collaborator = require("../models/collaborator");
const requestService = require("../models/services");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const CreateServices = async (req, res) => {
  const collab = await Collaborator.findById(req.collab);
  const { description, price, city, services } = req.body;
  if (!description || !price || !city || !services) {
    throw new BadRequestError(
      "Please provide Service, descripction, city, price"
    );
  }

  const service = await Service.create({ ...req.body, createdBy: collab._id });
  res.status(StatusCodes.CREATED).json({ service });
};

const GetServices = async (req, res) => {
  const service = await Service.find({}, { services: 1, _id: 0 }).distinct(
    "services"
  );
  if (!service) {
    throw new NotFoundError("Service not found");
  }
  res.status(StatusCodes.OK).json({ service });
};

const GetCitys = async (req, res) => {
  const { service } = req.query;
  const cityService = await Service.find(
    { services: service },
    { city: 1, _id: 0 }
  ).distinct("city");
  if (!cityService) {
    throw new NotFoundError("City not found");
  }
  res.status(StatusCodes.OK).json({ cityService });
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
    throw new NotFoundError("Service ID not found");
  }
  res.status(StatusCodes.OK).json({ msg: "Service Updated", service });
};

const DeleteService = async (req, res) => {
  const { id: serviceId } = req.params;
  const service = await Service.findByIdAndDelete({ _id: serviceId });
  if (!service) {
    throw new NotFoundError(
      "Service ID not found, service could not be deleted"
    );
  }
  res.status(StatusCodes.OK).json({ msg: "Service Deleted" });
};

const SearchServices = async (req, res) => {
  const { service, city } = req.query;
  const servByCollab = await Service.find({ services: service, city })
    .populate({
      path: "createdBy",
      select: "name lastName image _id",
    })
    .select({
      price: 1,
      _id: 1,
    });
  res.status(200).json({ servByCollab });
};

const scheduleServiceHandler = async (req, res) => {
  const { idService } = req.body;
  const { _id: idUser } = req.user;
  const service = await requestService.create({ idService, idUser });
  const collabId = await Service.findById({ _id: idService }).populate({
    path: "createdBy",
    select: "_id",
  });

  // const emailSend = {
  //   to: user.email,
  //   subject: "Servicio Agendado",
  //   template_id: process.env.TEMPLATE_ID,
  //   dynamic_template_data: {
  //     name: user.name,
  //   },
  // };
  // sendEmailSendGrid(emailSend);
  res.status(StatusCodes.CREATED).json({ collabId });
};

module.exports = {
  CreateServices,
  GetServices,
  GetCitys,
  UpdateService,
  DeleteService,
  GetServicesByCollab,
  SearchServices,
  scheduleServiceHandler,
};

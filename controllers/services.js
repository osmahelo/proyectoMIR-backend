const Service = require('../models/services');
const User = require('../models/users');
const Collaborator = require('../models/collaborator');
const { updateUser, updateCollab } = require('../controllers/users');
const { StatusCodes } = require('http-status-codes');
const { sendEmailSendGrid } = require('../utils/send_email');
const { BadRequestError, NotFoundError } = require('../errors');
const get = require('lodash/get');

const CreateServices = async (req, res) => {
  const { _id } = req.collab;
  try {
    const { description, price, services } = req.body;
    // if (!description || !price || !services) {
    //   res
    //     .status(StatusCodes.BAD_REQUEST)
    //     .json({ msg: 'Todos los campos son requeridos' });
    //   return;
    // }

    const serviceExist = await Service.find({});
    for (let i = 0; i <= serviceExist.length - 1; i++) {
      if (
        serviceExist[i].services === services &&
        serviceExist[i].createdBy.toString() === _id.toString()
      ) {
        console.log('Ambos Existen');
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: 'Ya has Credado un servicio para esa Categoria' });
        return;
      }
    }
    console.log('Creando servicio diferente');
    const service = await Service.create({
      ...req.body,
      city: req.collab.city,
      createdBy: req.collab._id,
    });
    await Collaborator.findByIdAndUpdate(
      req.collab.id,
      {
        services: service,
      },
      { new: true }
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: 'Servicio creado con exito' });
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
  const { id } = req.body;
  const service = await Service.findByIdAndDelete({ _id: id });
  if (!service) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: 'No se encontro el Servicio' });
    return;
  }
  res.status(StatusCodes.OK).json({ msg: 'Servicio Eliminado' });
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
      _id: 1,
    });
  res.status(200).json({ servByCollab });
};

const scheduleServiceHandler = async (req, res) => {
  const { schedule } = req.body;
  try {
    const { idService } = schedule;
    const { user } = req;
    const { _id: idUser } = req.user;
    const service = await Service.findById(idService);
    const collab = await Collaborator.findById(service.createdBy);
    const requestByCollab = get(collab, 'request', []);

    const request = {
      idService: idService,
      idCollab: collab._id,
      addressUser: schedule.address,
      date: schedule.date,
      phoneUser: schedule.phone,
    };

    const userUpdated = await User.updateOne(
      { _id: idUser, 'request.idService': { $nin: [request.idService] } },
      { $push: { request: request } },
      { upsert: false }
    );

    if (userUpdated.modifiedCount === 1) {
      const emailSend = {
        to: user.email,
        subject: 'Servicio Agendado',
        template_id: process.env.TEMPLATE_REQUEST,
        dynamic_template_data: {
          name: user.name,
          service: service.services,
          price: service.price,
        },
      };
      sendEmailSendGrid(emailSend);
      const infoByCollab = {
        request: requestByCollab.concat({
          idUser,
          idService,
          addressUser: schedule.address,
          date: schedule.date,
          phoneUser: schedule.phone,
        }),
      };
      await updateCollab(service.createdBy, infoByCollab);
      const emailCollab = {
        to: collab.email,
        subject: 'Servicio Agendado',
        template_id: process.env.TEMPLATE_REQUEST,
        dynamic_template_data: {
          name: collab.name,
          service: service.services,
          price: service.price,
        },
      };
      sendEmailSendGrid(emailCollab);
      console.log('Servicio agendado');
      return res
        .status(StatusCodes.CREATED)
        .json({ msg: 'El Servicio fue Agendado Correctamente' });
    } else if (userUpdated.modifiedCount === 0) {
      console.log('Servicio Existente');
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'El Servicio ya se encuentra Agendado' });
    }
  } catch (error) {
    console.log(error);
  }
};

const GetServicesRequests = async (req, res) => {
  try {
    if (req.user) {
      const { request: requestUser } = req.user;
      let id = [];
      const service = [];
      for (let i = 0; i <= requestUser.length - 1; i++) {
        const { idService } = requestUser[i];
        const serviceRequest = await Service.findById(idService);
        let requestService = {};
        id = requestUser[i];
        const { name, lastName } = await Collaborator.findById(id.idCollab);
        requestService = {
          name,
          lastName,
          service: serviceRequest.services,
          idService,
          price: serviceRequest.price,
          address: requestUser[i].addressUser,
          date: requestUser[i].date.toISOString().substring(0, 10),
          payment: requestUser[i].payment,
          idCollab: id.idCollab,
        };
        service.push(requestService);
      }
      return res.status(201).json(service);
    }
    if (req.collab) {
      const { request: requestCollab } = req.collab;
      let id = [];
      const service = [];
      for (let i = 0; i <= requestCollab.length - 1; i++) {
        const { idService } = requestCollab[i];
        const serviceRequest = await Service.findById(idService);
        let requestService = {};
        id = requestCollab[i];
        const { name, lastName } = await User.findById(id.idUser);
        requestService = {
          name,
          lastName,
          service: serviceRequest.services,
          price: serviceRequest.price,
          address: requestCollab[i].addressUser,
          date: requestCollab[i].date.toISOString().substring(0, 10),
          phone: requestCollab[i].phoneUser,
          payment: requestCollab[i].payment,
        };
        service.push(requestService);
      }
      return res.status(201).json(service);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  CreateServices,
  GetServices,
  GetCitys,
  UpdateService,
  DeleteService,
  GetServicesByCollab,
  GetServicesRequests,
  SearchServices,
  scheduleServiceHandler,
};

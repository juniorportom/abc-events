'use strict'
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Event = require('../models/event');
var User = require('../models/user');

function prueba(req, res) {
    res.status(200).send({ message: 'Prueba en controlador de publicaciones' });

}

function saveEvent(req, res) {
    var params = req.body;

    var event = new Event();
    event.name = params.name;
    event.category = params.category;
    event.place = params.place;
    event.address = params.address;
    event.type = params.type;
    event.start_date = params.start_date;
    event.end_date = params.end_date;
    event.user = params.user;
    event.create_at = moment().unix();

    event.save((error, eventStored) => {
        if (error) return res.status(500).send({ message: 'Error al guardar la publicación' });

        if (!eventStored) return res.status(404).send({ message: 'La publicación no ha sido guardada' });

        return res.status(200).send({ event: eventStored });
    });
}

function getEvents(req, res) {
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Follow.find({ user: req.user.sub }).populate('followed').exec((error, follows) => {
        if (error) return res.sttua(500).send({ message: 'Error obteniendo los seguimientos' });

        var eventClean = [];

        follows.forEach((follow) => {
            eventClean.push(follow.followed);
        })

        eventClean.push(req.user.sub);

        Event.find({ user: { '$in': eventClean } }).sort([
                ['created_at', -1]
            ]).populate('user')
            .paginate(page, itemsPerPage, (error, events, total) => {
                if (error) return res.status(500).send({ message: 'Error obteniendo las publicaciones' });

                if (!events) return res.status(404).send({ message: 'No hay publicaciones' });

                return res.status(200).send({
                    events,
                    totalItems: total,
                    page: page,
                    pages: Math.ceil(total / itemsPerPage),
                    itemsPerPage: itemsPerPage
                });
            });
    });
}

function getEventsUser(req, res) {
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var user = req.params.user;
    // if (req.params.user) {
    //     user = req.params.user;
    // }

    var itemsPerPage = 100;

    Event.find({ user: user }).sort([
            ['created_at', -1]
        ]).populate('user')
        .paginate(page, itemsPerPage, (error, events, total) => {
            if (error) return res.status(500).send({ message: 'Error obteniendo los eventos' });

            if (!events) return res.status(404).send({ message: 'No hay eventos' });

            return res.status(200).send({
                events,
                totalItems: total,
                page: page,
                pages: Math.ceil(total / itemsPerPage),
                itemsPerPage: itemsPerPage
            });
        });
}

function getEvent(req, res) {
    var EvemtId = req.params.id;

    Event.findById(evemtId, (error, event) => {
        if (error) return res.status(500).send({ message: 'Error al obtener la publicación' });

        if (!event) return res.status(404).send({ message: 'La publicación no existe!!!' });

        return res.status(200).send({ event });
    });
}

function deleteEvent(req, res) {
    var eventId = req.params.id;

    Event.find({ '_id': eventId }).remove(error => {
        if (error) return res.status(500).send({ message: 'Error eliminando el evento' });

        return res.status(200).send({ message: 'Evento eliminado correctamente' });
    });
}

function updateEvent(req, res) {
    var eventId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(eventId, update, { new: true }, (error, eventUpdated) => {
        if (error) return res.status(500).send({ message: 'Error en la petición' });

        if (!eventUpdated) return res.status(404).send({ message: 'No se ha podido actualizar el event' });

        return res.status(200).send({ event: eventUpdated });
    });
}

module.exports = {
    prueba,
    saveEvent,
    getEvents,
    getEvent,
    deleteEvent,
    getEventsUser,
    updateEvent
}
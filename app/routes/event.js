'use strict'

var express = require('express');

var EventController = require('../controllers/event');

var api = express.Router();

api.get('/prueba-publication', EventController.prueba);
api.post('/event', EventController.saveEvent);
api.get('/events/:page?', EventController.getEvents);
api.get('/events-user/:user/:page?', EventController.getEventsUser);
api.get('/event/:id', EventController.getEvent);
api.delete('/event/:id', EventController.deleteEvent);
api.put('/event/:id', EventController.updateEvent);

module.exports = api;
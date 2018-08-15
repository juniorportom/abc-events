'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var eventSchema = Schema({
    name: String,
    category: String,
    place: String,
    address: String,
    type: String,
    startDate: String,
    endDate: String,
    create_at: String,
    user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Event', eventSchema);
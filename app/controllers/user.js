'use strict'

var User = require('../models/user');

var bcrypt = require('bcrypt-nodejs');

//var jwt = require('../services/jwt');

var mongoosePaginate = require('mongoose-pagination');

//var fs = require('fs');  // Libreria de file systemn de Node

//var path = require('path');  //Libreria para el manejo de rutas

function home(req, res) {
    res.status(200).send({
        message: 'Hola mundo desde el servidor de NodeJS'
    });
}

function pruebas(req, res) {
    //console.log(res.body);
    res.status(200).send({
        message: 'Acción de pruebas en el servidor de NodeJS'
    });
}


// Registro de usuarios
function saveUser(req, res) {
    var params = req.body;
    var user = new User();

    if (params.name && params.surname &&
        params.email && params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;

        // Controlar usuarios duplicados

        User.find({
            email: user.email.toLowerCase()
        }).exec((error, users) => {
            if (error) return res.status(500).send({ message: 'Error en la petición de usuarios' });

            if (users && users.length > 0) {
                return res.status(200).send({ message: 'El usuario que intentas registrar ya existe !!' });
            } else {
                // Cifrado de contraseña y almacenamiento de usuario
                bcrypt.hash(params.password, null, null, (error, hash) => {
                    user.password = hash;

                    user.save((error, userStored) => {
                        if (error) return res.status(500).send({ message: 'Error al guardar el usuario' });

                        if (userStored) {
                            res.status(200).send({
                                user: userStored
                            });
                        } else {
                            res.status(404).send({
                                message: 'No se ha registrado el usuario'
                            });
                        }
                    });

                })
            }

        });

    } else {
        res.status(200).send({
            message: 'Envia todos los campos necesarios!!'
        });
    }
}


//Login de usuario
function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email }, (error, user) => {
        if (error) return res.status(500).send({ message: 'Error en la petición' });

        if (user) {
            bcrypt.compare(password, user.password, (error, check) => {
                if (check) {
                    //devolver datos de usurio
                    user.password = undefined; // Eliminar propiedades de la respuesta
                    res.status(200).send({ user });
                } else {
                    res.status(404).send({ message: 'El usuario no se ha podido identificar' });
                }
            });
        } else {
            res.status(404).send({ message: 'El usuario no se ha podido identificar !!' });
        }
    });
}

// Conseguir datos del usuario
function getUser(req, res) {
    var userId = req.params.id;

    User.findById(userId, (error, user) => {
        if (error) return res.status(500).send({ message: 'Error en la petición' });

        if (!user) return res.status(404).send({ message: 'Usuario no existe' });

        followThisUser(req.user.sub, userId).then((value) => {
            //console.log(value);
            user.password = undefined;
            return res.status(200).send({
                user,
                following: value.following,
                followed: value.followed
            });

        });
    });
}

// Edición de datos de usuario
function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;
    var userIsset = false;

    // Borrar propiedad password
    delete update.password;
    if (userId != req.user.sub)
        return res.status(500).send({
            message: 'No tienes permiso para actualizar los datos del usuario'
        });

    User.find({
        $or: [
            { email: update.email.toLowerCase() },
            { nick: update.nick.toLowerCase() }
        ]
    }).exec((error, users) => {
        users.forEach((user) => {
            if (user && user._id != userId) userIsset = true;
        });

        if (userIsset)
            return res.status(500).send({ message: 'Los datos ya estan en uso' });


        User.findByIdAndUpdate(userId, update, { new: true }, (error, userUpdated) => {
            if (error) return res.status(500).send({ message: 'Error en la petición' });

            if (!userUpdated) return res.status(404).sebd({ message: 'No se ha podido actualizar el usuario' });

            return res.status(200).send({ user: userUpdated });
        });
    });
}



module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    updateUser
}
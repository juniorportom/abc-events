'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = 8080;


//Conexion DataBase
mongoose.Promise = global.Promise;
//mongoose.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true });
mongoose.connect('mongodb://localhost:27017/ABCEvents', { /*useMongoClient: true*/ })
    .then(() => {
        console.log('La conexion de la base de datos ABCEvents se realizo de forma correcta.')

        //Crear servidor
        app.listen(port, () => {
            console.log('Servidor corriendo en http://localhost:' + port);
        });
    }).catch(err => console.log(err));

//Conexion DataBase
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/curso_mean_social', { /*useMongoClient: true */ })
//     .then(() => {
//         console.log('La conexion de la base de datos curso_mean_social se realizo de forma correcta. prueba')

//         //Crear servidor
//         app.listen(port, () => {
//             console.log('Servidor corriendo en http://localhost:3800');
//         });
//     }).catch(err => console.log(err));
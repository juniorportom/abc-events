var express = require('express');
var app = express();

/*app.use('/', function(req, res) {
    res.send('hola nundo');
});*/

app.use(express.static(__dirname = './app'));

app.get('/contacts', function(req, res) {
    console.log('I receive a Get request');
    var contacts = [
        { name: 'Reinaldo', email: 'prueba@correo.com', number: '(111) 111-1111' },
        { name: 'Junior', email: 'prueba2@correo.com', number: '(222) 222-2222' },
        { name: 'Jhon', email: 'prueba3@correo.com', number: '(333) 333-3333' }
    ];

    res.json(contacts);
});

app.listen(8080);
console.log('servidor ejeutandose en http://localhost:3000/');

module.exports = app;
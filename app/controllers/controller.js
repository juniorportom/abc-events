/*var myApp = angular.module('ABCEvents', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");
}]);
*/
//'use strict'
//var require = new require();
//var User = require('../models/user');

var ABCEvents = angular.module('ABCEvents', ['ngRoute']);


// configure our routes
ABCEvents.config(function($routeProvider) {
    $routeProvider

    // route for the home page
        .when('/', {
        templateUrl: 'views/home.html',
        controller: 'mainController'
    })

    // route for the about page
    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginController'
    })

    // route for the contact page
    .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'registerController'
    })

    .when('/event', {
        templateUrl: 'views/event.html',
        controller: 'eventController'
    })

    .when('/eventList', {
        templateUrl: 'views/eventList.html',
        controller: 'eventListController'
    })

    ;
});

ABCEvents.controller('AppCtrl', function($scope, $http) {
    console.log("Hello World from controller");
    $http.get('/contacts').then(function onSuccess(response) {
        console.log('I got the data');
        console.log(response);
        $scope.contacts = response.data;
    });

});

// create the controller and inject Angular's $scope
ABCEvents.controller('mainController', function($scope) {
    // create a message to display in our view
    $scope.message = 'Bienvenidos a eventos ABC!';
});

ABCEvents.controller('registerController', function($scope, $http) {
    $scope.title = 'Registrar Usuario';
    $scope.status = '';
    //$scope.required = true;
    $scope.user = {
        name: '',
        surname: '',
        email: '',
        password: ''
    };

    $scope.addUser = function(isValid) {
        if (isValid) {
            $http.post('/register', $scope.user).then(function onSuccess(response) {
                console.log(response);
                $scope.user = response.data;
                if (response.status == 200) {
                    $scope.status = 'success';
                } else {
                    $scope.status = 'fail';
                }
            }).catch(function onError(response) {
                console.log(response);
                $scope.status = 'fail';
            });
        } else {
            $scope.status = 'incomplete';
        }
    };
});

ABCEvents.controller('loginController', function($scope, $http) {
    $scope.title = 'Ingresar';
    $scope.status = '';
    $scope.message = '';
    //$scope.required = true;
    $scope.user = {
        name: '',
        surname: '',
        email: '',
        password: ''
    };

    $scope.login = function(isValid) {
        if (isValid) {
            $http.post('/login', $scope.user).then(function onSuccess(response) {
                console.log(response);
                $scope.user = response.data;
                if (response.status == 200) {
                    $scope.status = 'success';
                } else {
                    $scope.status = 'fail';
                }
            }).catch(function onError(response) {
                console.log(response);
                $scope.status = 'fail';
            });
        } else {
            $scope.status = 'incomplete';
        }
    };
});


ABCEvents.controller('eventController', function($scope, $http) {
    $scope.title = 'Crear Evento';
    $scope.status = '';
    $scope.categories = ['Conferencia', 'Seminario', 'Congreso', 'Curso'];
    $scope.types = ['Presencial', 'Virtual']
        //$scope.required = true;
    $scope.event = {
        name: '',
        category: '',
        place: '',
        address: '',
        type: '',
        startDate: '',
        endDate: '',
        user: '5b70f0f4559b1661413f74fa'
    };

    $scope.addEvent = function(isValid) {
        if (isValid) {
            $http.post('/event', $scope.event).then(function onSuccess(response) {
                console.log(response);
                $scope.event = response.data;
                if (response.status == 200) {
                    $scope.status = 'success';
                } else {
                    $scope.status = 'fail';
                }
            }).catch(function onError(response) {
                console.log(response);
                $scope.status = 'fail';
            });
        } else {
            $scope.status = 'incomplete';
        }

    };
});


ABCEvents.controller('eventListController', function($scope, $http) {
    $scope.title = 'Listar Eventos';
    $scope.status = '';
    //$scope.required = true;
    $scope.init = function() {
        $http.get('/events-user/5b70f0f4559b1661413f74fa').then(function onSuccess(response) {
            console.log(response);
            $scope.events = response.data.events;
            if (response.status == 200) {
                $scope.status = 'success';
            }
        }).catch(function onError(response) {
            console.log(response);
        });
    };

    $scope.delete = function(id) {
        $http.delete('/event/' + id).then(function onSuccess(response) {
            console.log(response);
            if (response.status == 200) {
                $scope.status = 'success';
                $scope.init();
            } else {
                $scope.status = 'fail';
            }
        }).catch(function onError(response) {
            console.log(response);
            $scope.status = 'fail';
        });

    }

    //$scope.onInit();



});








/*$http(...)
  .then(function onSuccess(response) {
    // Handle success
    var data = response.data;
    var status = response.status;
    var statusText = response.statusText;
    var headers = response.headers;
    var config = response.config;
    ...
  }).catch(function onError(response) {
    // Handle error
    var data = response.data;
    var status = response.status;
    var statusText = response.statusText;
    var headers = response.headers;
    var config = response.config;
    ...
  });*/
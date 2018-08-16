/*var myApp = angular.module('ABCEvents', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");
}]);
*/
//'use strict'
//var require = new require();
//var User = require('../models/user');

var ABCEvents = angular.module('ABCEvents', ['ngRoute', 'ngStorage']);

ABCEvents.factory('EventId', function() {

    var persistObject = [];

    function set(objectName, data) {
        persistObject[objectName] = data;
    }

    function get(objectName) {
        return persistObject[objectName];
    }

    return {
        set: set,
        get: get
    }
});

ABCEvents.factory('UserId', function() {

    var persistObject = [];

    function set(objectName, data) {
        persistObject[objectName] = data;
    }

    function get(objectName) {
        return persistObject[objectName];
    }

    return {
        set: set,
        get: get
    }
});

ABCEvents.factory('IsUser', function() {

    var persistObject = [];

    function set(objectName, data) {
        persistObject[objectName] = data;
    }

    function get(objectName) {
        return persistObject[objectName];
    }

    return {
        set: set,
        get: get
    }
});


// configure our routes
ABCEvents.config(function($routeProvider) {
    $routeProvider

    // route for the about page
        .when('/', {
        templateUrl: 'views/login.html',
        controller: 'loginController'
    })

    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginController'
    })

    // route for the home page
    .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'mainController'
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

    .when('/editEvent', {
        templateUrl: 'views/editEvent.html',
        controller: 'editEventController'
    })

    .when('/eventDetail', {
        templateUrl: 'views/eventDetail.html',
        controller: 'eventDetailController'
    })

    .when('/logout', {
        templateUrl: 'views/login.html',
        controller: 'mainController'
    }).
    otherwise({
        redirectTo: '/'
    });

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
ABCEvents.controller('mainController', function($scope, UserId, IsUser) {
    // create a message to display in our view
    $scope.message = 'Bienvenidos a eventos ABC!';
    $scope.userId = '';
    $scope.isUser = false;

    $scope.initUser = function() {
        $scope.userId = UserId.get('user_id');
        $scope.isUser = IsUser.get('is_user');
    }();


});

ABCEvents.controller('registerController', function($scope, $http, UserId, IsUser) {
    $scope.title = 'Registrar Usuario';
    $scope.status = '';
    //$scope.required = true;
    $scope.user = {
        name: '',
        surname: '',
        email: '',
        password: ''
    };

    $scope.userId = '';
    $scope.isUser = false;

    $scope.initUser = function() {
        $scope.userId = UserId.get('user_id');
        $scope.isUser = IsUser.get('is_user');
    }();

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

ABCEvents.controller('loginController', function($scope, $http, $location, $localStorage, UserId, IsUser) {
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

    $scope.userId = '';
    $scope.isUser = false;

    $scope.initUser = function() {
        $scope.userId = UserId.get('user_id');
        $scope.isUser = IsUser.get('is_user');
    }();

    $scope.login = function(isValid) {
        $scope.isUser = false;
        if (isValid) {
            $http.post('/login', $scope.user).then(function onSuccess(response) {
                console.log(response);
                $scope.user = response.data.user;
                if (response.status == 200) {
                    $scope.status = 'success';
                    $scope.isUser = true;
                    UserId.set('user_id', response.data.user._id);
                    IsUser.set('is_user', true);
                    $localStorage.userLogin = response.data.user._id;
                    this.reload
                    $location.path('/eventList');
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

    $scope.logout = function() {
        $scope.isUser = false;
        UserId.set('user_id', '');
        IsUser.set('is_user', false);
        $location.path('/login');
    }
});


ABCEvents.controller('eventController', function($scope, $http, UserId, IsUser) {
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
        user: ''
    };

    $scope.userId = '';
    $scope.isUser = false;

    $scope.initUser = function() {
        $scope.userId = UserId.get('user_id');
        $scope.isUser = IsUser.get('is_user');
    }();

    $scope.addEvent = function(isValid) {
        if (isValid) {
            $scope.event.user = $scope.userId;
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


ABCEvents.controller('eventListController', function($scope, $http, EventId, UserId, IsUser) {
    $scope.title = 'Listar Eventos';
    $scope.status = '';
    //$scope.required = true;

    $scope.userId = '';
    $scope.isUser = false;

    $scope.initUser = function() {
        $scope.userId = UserId.get('user_id');
        $scope.isUser = IsUser.get('is_user');
        console.log('este es el userId:  ' + $scope.userId);
        console.log('este es el userId: ' + $scope.isUser);
    }();

    $scope.init = function() {
        $http.get('/events-user/' + $scope.userId).then(function onSuccess(response) {
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
    };

    $scope.edit = function(id) {
        EventId.set('event_id', id);
        //$location.path('/editEvent');
    }

    $scope.detail = function(id) {
        EventId.set('event_id', id);
        //$location.path('/editEvent');
    }

});


ABCEvents.controller('editEventController', function($scope, $http, $location, EventId, UserId, IsUser) {
    $scope.title = 'Editar Evento';
    $scope.status = '';
    $scope.categories = ['Conferencia', 'Seminario', 'Congreso', 'Curso'];
    $scope.types = ['Presencial', 'Virtual']
        //$scope.required = true;

    $scope.userId = '';
    $scope.isUser = false;

    $scope.initUser = function() {
        $scope.userId = UserId.get('user_id');
        $scope.isUser = IsUser.get('is_user');
    }();

    $scope.init = function() {
        console.log('id: ' + EventId.get('event_id'));
        $http.get('/event/' + EventId.get('event_id')).then(function onSuccess(response) {
            console.log(response);
            $scope.event = response.data.event;
        }).catch(function onError(response) {
            console.log(response);
        });
    };



    $scope.update = function(isValid) {
        console.log('ejecuto boto');

        $scope.userId = '';
        $scope.isUser = false;

        $scope.initUser = function() {
            $scope.userId = UserId.get('user_id');
            $scope.isUser = IsUser.get('is_user');
        }();

        if (isValid) {
            $http.put('/event/' + $scope.event._id, $scope.event).then(function onSuccess(response) {
                console.log(response);
                if (response.status == 200) {
                    $scope.status = 'success';
                    $scope.event = response.data.event;
                    $location.path('/eventList');
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


ABCEvents.controller('eventDetailController', function($scope, $http, EventId, UserId, IsUser) {
    $scope.title = 'Detalle Evento';
    $scope.status = '';

    $scope.userId = '';
    $scope.isUser = false;

    $scope.initUser = function() {
        $scope.userId = UserId.get('user_id');
        $scope.isUser = IsUser.get('is_user');
    }();
    //$scope.required = true;
    $scope.init = function() {
        console.log('id: ' + EventId.get('event_id'));
        $http.get('/event/' + EventId.get('event_id')).then(function onSuccess(response) {
            console.log(response);
            $scope.event = response.data.event;
        }).catch(function onError(response) {
            console.log(response);
        });
    };

});
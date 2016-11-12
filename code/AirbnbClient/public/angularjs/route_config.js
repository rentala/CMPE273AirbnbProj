

var app = angular.module('airbnbApp', [ 'ui.router' ]);
app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('login', {
        url : '/login',
        views : {
            'header' : {
                templateUrl : 'templates/authentication/login_header.html',
            },
            'content' : {
                templateUrl : 'templates/authentication/login_page.html',
            }
        },
        controller : 'loginSignupController'
    });

    $stateProvider.state('home', {
        url : '/home',
        views : {
            'header' : {
                templateUrl : 'templates/home/home_header.html',
            },
            'content' : {
                templateUrl : 'templates/home/home.html',
            }
        },
        controller : 'homeController'
    });

    /*$stateProvider.state('msg_disp', {
        url : '/msgDisp/:msg',
        views : {
            'header' : {
                templateUrl : 'templates/home_header.html',
                controller : 'headerCntrl'
            },
            'content' : {
                templateUrl : 'templates/list_msg_display.html',
                controller : 'homeCntrl',
                params :['msg']
            }
        }

    });*/

    $urlRouterProvider.otherwise('/login');
});

app.run([ '$state', function($state) {
    $state.transitionTo('login');
} ]);
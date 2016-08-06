(function(){
    var app = angular.module('cashes',[
        'ngRoute',
        'btford.socket-io',
        'ngSanitize',
        'cashes.controllers',
        'crud.services',
        'routes',
        'ui.bootstrap'
    ]);
})();
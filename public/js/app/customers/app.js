(function(){
    var app = angular.module('customers',[
        'ngRoute',
        'btford.socket-io',
        'ngSanitize',
        'customers.controllers',
        'crud.services',
        'routes',
        'ui.bootstrap'
    ]);
     angular.module('ui.bootstrap').controller('ModalInstanceCtrl2', function ($scope, $modalInstance, crudService) {

        $scope.createLine = function () {
            //$modalInstance.close($scope.selected.item);
            //$scope.atribut.estado = 1;
            if ($scope.TtypeCreateForm.$valid) {
                var $btn = $('#btn_generateLinea').button('loading');
                crudService.create($scope.Ttype, 'types').then(function (data) {

                    if (data['estado'] == true) {
                        $scope.success = data['nombres'];
                        alert('grabado correctamente');
                        $modalInstance.dismiss('cancel');
                        //$location.path('/types');

                    } else {
                        $scope.errors = data;
                        $btn.button('reset');

                    }
                });
            }
        };

        $scope.cancelLine = function () {
            $modalInstance.dismiss('cancel');
        };
    });
})();

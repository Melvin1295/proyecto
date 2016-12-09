(function(){
    angular.module('customers.controllers',[])
        .controller('CustomerController',['$scope', '$routeParams','$location','crudService','socketService' ,'$filter','$route','$log','$modal',
            function($scope, $routeParams,$location,crudService,socket,$filter,$route,$log,$modal){
                $scope.customers = [];
                $scope.customer = {};
                $scope.generos = [{name:'Masculino'},{name:'Femenino'}];
                $scope.errors = null;
                $scope.success;
                $scope.customer.autogenerado = true;
                $scope.query = '';

                $scope.toggle = function () {
                    $scope.show = !$scope.show;
                };

                $scope.pageChanged = function() {
                    if ($scope.query.length > 0) {
                        crudService.search('customers',$scope.query,$scope.currentPage).then(function (data){
                        $scope.customers = data.data;
                    });
                    }else{
                        crudService.paginate('customers',$scope.currentPage).then(function (data) {
                            $scope.customers = data.data;
                        });
                    }
                };


                var id = $routeParams.id;

                if(id)
                {
                    crudService.byId(id,'customers').then(function (data) {
                        $log.log(data);
                        if(data.fechaNac != null) {
                            if (data.fechaNac.length > 0) {
                                data.fechaNac = new Date(data.fechaNac);
                            }
                        }

                        $scope.customer = data;
                        $scope.customer.autogenerado = false;
                    });
                }else{
                    crudService.paginate('customers',1).then(function (data) {
                        $scope.customers = data.data;
                        $scope.maxSize = 5;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                        $scope.itemsperPage = 15;

                    });
                }

                socket.on('customer.update', function (data) {
                    $scope.customers=JSON.parse(data);
                });

                $scope.searchCustomer = function(){
                if ($scope.query.length > 0) {
                    crudService.search('customers',$scope.query,1).then(function (data){
                        $scope.customers = data.data;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                    });
                }else{
                    crudService.paginate('customers',1).then(function (data) {
                        $scope.customers = data.data;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                    });
                }
                    
                };

                $scope.createCustomer = function(){

                    if ($scope.customerCreateForm.$valid) {
                        var f = document.getElementById('customerImage').files[0] ? document.getElementById('customerImage').files[0] : null;
                        //alert(f);

                        var r = new FileReader();
                        r.onloadend = function(e) {
                            $scope.customer.imagen = e.target.result;
                           // alert("aqui estoy");
                            crudService.create($scope.customer, 'customers').then(function (data) {

                                if (data['estado'] == true) {
                                    $scope.success = data['nombres'];
                                    alert('Grabado correctamente');
                                    $location.path('/customers');

                                } else {
                                    $scope.errors = data;

                                }
                            });
                        }
                       
                       if(!document.getElementById('customerImage').files[0]){
                            crudService.create($scope.customer, 'customers').then(function (data) {
                           
                            if (data['estado'] == true) {
                                $scope.success = data['nombres'];
                                alert('grabado correctamente');
                                $location.path('/customers');

                            } else {
                                $scope.errors = data;

                            }
                        });
                       }
                       if(document.getElementById('customerImage').files[0]){
                            r.readAsDataURL(f);
                        }
                    }
                }
                $scope.createcashMonthlysss = function(){
                    alert("Hola");
                };

                $scope.editCustomer = function(row){
                    $location.path('/customers/edit/'+row.id);
                };
                $scope.editModal=function(id){
                    alert("hola");
                     crudService.byId(id,'customers').then(function (data) {
                        $scope.customer = data;
                        if(data.fechaNac=='0000-00-00 00:00:00'){
                                $scope.customer.fechaNac='';
                        }else{
                        var fech= new Date(data.fechaNac);
                       $scope.customer.fechaNac=fech.getDate()+'/'+
                       (fech.getMonth()+1)+'/'+fech.getFullYear();
                                 }   

                        
                    });
                    

                    
                }
                $scope.updateCustomer = function(){
                    /*if ($scope.customerCreateForm.$valid) {
                        crudService.update($scope.customer,'customers').then(function(data)
                        {
                            if(data['estado'] == true){
                                $scope.success = data['nombres'];
                                alert('editado correctamente');
                                $location.path('/customers');
                            }else{
                                $scope.errors =data;
                            }
                        });
                    }*/
                     if ($scope.customerCreateForm.$valid) {
                        var f = document.getElementById('customerImage').files[0] ? document.getElementById('customerImage').files[0] : null;
                        //alert(f);

                        var r = new FileReader();
                        r.onloadend = function(e) {
                            $scope.customer.imagen = e.target.result;
                           // alert("aqui estoy");
                            crudService.update($scope.customer, 'customers').then(function (data) {

                                if (data['estado'] == true) {
                                    $scope.success = data['nombres'];
                                    alert('Editado correctamente');
                                    $location.path('/customers');

                                } else {
                                    $scope.errors = data;

                                }
                            });
                        }
                       
                       if(!document.getElementById('customerImage').files[0]){
                            crudService.update($scope.customer, 'customers').then(function (data) {
                           
                            if (data['estado'] == true) {
                                $scope.success = data['nombres'];
                                alert('Editado correctamente');
                                $location.path('/customers');

                            } else {
                                $scope.errors = data;

                            }
                        });
                       }
                       if(document.getElementById('customerImage').files[0]){
                            r.readAsDataURL(f);
                        }
                    }
                };

                $scope.deleteCustomer = function(row){
                    $scope.customer = row;
                    $scope.cliente=$scope.customer.id;
                }

                $scope.cancelCustomer = function(){
                    $scope.customer = {};
                    $scope.cliente = 0;
                }

                $scope.destroyCustomer = function(){
                    crudService.destroy($scope.customer,'customers').then(function(data)
                    {
                        if(data['estado'] == true){
                            $scope.success = data['nombre'];
                            $scope.customer = {};
                            //alert('hola');
                            $route.reload();

                        }else{
                            $scope.errors = data;
                        }
                    });
                }
            }]);
})();

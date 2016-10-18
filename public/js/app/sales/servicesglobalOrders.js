(function(){
    angular.module('crud.services.orders',[])
        .factory('crudServiceOrders',['$http', '$q','$location','$route', function($http, $q,$location,$route){

            $oPresentacion = {}; 

            function all(uri)
            {
                var deferred = $q.defer();
                $http.get('/api/'+uri+'/all')
                    .success(function (data) {
                        deferred.resolve(data);
                    });

                return deferred.promise;
            }

            function paginate(uri,page)
            {
                var deferred = $q.defer();
                $http.get('/api/'+uri+'/paginate/?page='+page).success(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            }

            function create(area,uri)
            {
                var deferred = $q.defer();
                $http.post( '/api/'+uri+'/create', area )
                    .success(function (data)
                    {
                        deferred.resolve(data);
                    }).error(function(data)
                {
                    alert('No se puede Agregar');
                });
                return deferred.promise;
            }
            function create1(area,uri)
            {
                var deferred = $q.defer();
                $http.post( '/api/'+uri+'/create', area )
                    .success(function (data)
                    {
                        deferred.resolve(data);
                    }).error(function(data)
                {
                    $route.reload(); 
                    alert('No se puede Agregar');
                });
                return deferred.promise;
            }

            function update(area,uri)
            {
                var deferred = $q.defer();
                $http.put('/api/'+uri+'/edit', area )
                    .success(function(data)
                    {
                        deferred.resolve(data);
                    }
                );
                return deferred.promise;
            }

            function destroy(area,uri)
            {
                var deferred = $q.defer();
                $http.post('/api/'+uri+'/destroy', area )
                    .success(function(data)
                    {
                        deferred.resolve(data);
                    }
                ).error(function(data)
                {
                    alert('Item en USO');
                });
                return deferred.promise;
            }
            function byforeingKey(uri,fx,id){
               var deferred = $q.defer();
               $http.get('/api/'+uri+'/'+fx+'/'+id)
                .success(function(data){
                     deferred.resolve(data);
                });
                return deferred.promise;
            }

            function byId(id,uri) {
                var deferred = $q.defer();
                $http.get('/api/'+uri+'/find/'+id)
                    .success(function(data)
                    {
                        deferred.resolve(data);
                    }
                );
                return deferred.promise;
            }

            function editFavoritoId(area,uri)
            {
                var deferred = $q.defer();
                $http.put('/api/'+uri+'/editFavorito', area )
                    .success(function(data)
                    {
                        deferred.resolve(data);
                    }
                );
                return deferred.promise;
            }

            function search(uri,query,page){
                var deferred = $q.defer();
                var result = $http.get('/api/'+uri+'/search/'+query+'/?page='+page);

                result.success(function(data){
                        deferred.resolve(data);
                });
                return deferred.promise;
            }

            function searchMes(uri,mes,year,conc,page){
                var deferred = $q.defer();
                var result = $http.get('/api/'+uri+'/search/'+mes+'/'+year+'/'+conc+'/?page='+page);


                result.success(function(data){
                        deferred.resolve(data);
                });
                return deferred.promise;
            }


            function reportPro(uri,id){
                var deferred = $q.defer();
                $http.get('/api/'+uri+'/'+id);
            }

            function reportcliente(uri,fecIn,fecFin){
                var deferred = $q.defer();
                $http.get('/api/'+uri+'/'+fecIn+'/'+fecFin);
            }

            function reportProWare(uri,idStore,idWerehouse,val){
                var deferred = $q.defer();
                //alert(val);
                $http.get('/api/'+uri+'/misDatos/'+idStore+'/'+idWerehouse+'/'+val)
                    .success(function (data) {
                        deferred.resolve(data);
                    });

                return deferred.promise;
            }
            function confirmarVariante(id,fecha){
                var deferred = $q.defer();
                //alert(val);
                $http.get('/api/sales/confirmarVariante/'+id+'/'+fecha)
                    .success(function (data) {
                        deferred.resolve(data);
                    });

                return deferred.promise;
            }
            function buquedarapida(uri,idStore,idWerehouse,val,type,brand,product,page){
                var deferred = $q.defer();
                //alert(val);
                $http.get('/api/'+uri+'/misDatos/'+idStore+'/'+idWerehouse+'/'+val+'/'+type+'/'+brand+'/'+product+'/?page='+page)
                    .success(function (data) {
                        deferred.resolve(data);
                    });

                return deferred.promise;
            }

            function select(uri,select)
            {
                var deferred = $q.defer();
                $http.get('/api/'+uri+'/'+select)
                    .success(function (data) {
                        deferred.resolve(data);
                    });

                return deferred.promise;
            }

            function getPres()
            {
                return $oPresentacion;
            }

            function setPres(oPres)
            {
                $oPresentacion = oPres;
            }
            function numeracion(uri,tipo,id){
                var deferred = $q.defer();
                //alert(val);
                $http.get('/api/'+uri+'/numeracion/'+tipo+'/'+id)
                    .success(function (data) {
                        deferred.resolve(data);
                    });

                return deferred.promise;
            }
             function imprimir_factura(area)
            {
                var deferred = $q.defer();
                $http.post( '/api/ImprimirTiket/create/', area )
                    .success(function (data)
                    {
                        deferred.resolve(data);
                    }).error(function(data)
                {
                    $route.reload(); 
                    alert('No se puede Agregar');
                });
                return deferred.promise;
            }
            function factura(uri,id){
                var deferred = $q.defer();
                //alert(val);
                $http.get('/api/'+uri+'/factura/'+id)
                    .success(function (data) {
                        deferred.resolve(data);
                    });

                return deferred.promise;
            }
            function Comprueba_caj_for_user()
            {
                var deferred = $q.defer();
                $http.get('api/cashes/cajas_for_user').success(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            }
            function Datos_Por_Caja()
            {
                var deferred = $q.defer();
                $http.get('api/cashes/Datos_Por_Caja').success(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            }
            function DatosVarinatAgrupado(val)
            {
                var deferred = $q.defer();
                $http.get('api/productaddVariant/DatosVarinatAgrupado/'+val).success(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            }
             function TreerCamtidadesDisponible(id)
            {
                var deferred = $q.defer();
                $http.get('api/variantname/TreerCamtidadesDisponible/'+id).success(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            }
            function variantsenPromocion(id,descri)
            {
                var deferred = $q.defer();
                $http.get('api/variants/variantsenPromocion/'+id+'/'+descri).success(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            }
            function FavoritosCabecera()
            {
                var deferred = $q.defer();
                $http.get('api/productsFavoritos/FavoritosCabecera').success(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            }
            return {
                all: all,
                paginate: paginate,
                FavoritosCabecera: FavoritosCabecera,
                numeracion: numeracion,
                Datos_Por_Caja: Datos_Por_Caja,
                Comprueba_caj_for_user: Comprueba_caj_for_user,
                factura: factura,
                create:create,
                create1:create1,
                variantsenPromocion: variantsenPromocion,
                DatosVarinatAgrupado: DatosVarinatAgrupado,
                TreerCamtidadesDisponible: TreerCamtidadesDisponible,
                byId:byId,
                update:update,
                destroy:destroy,
                search: search,
                select:select,
                byforeingKey: byforeingKey,
                searchMes,searchMes,
                reportPro,reportPro,
                reportProWare,reportProWare,
                getPres, setPres,
                editFavoritoId,editFavoritoId,
                reportcliente,reportcliente,
                buquedarapida,buquedarapida,
                confirmarVariante:confirmarVariante,
                imprimir_factura: imprimir_factura
            }
        }])
        .factory('socketService', function ($rootScope) {
            var host = window.location.hostname;
            //var host = '192.168.0.26';
            var socket = io.connect('http://'+host+':3001');
            return {
                on: function (eventName, callback) {
                    socket.on(eventName, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            callback.apply(socket, args);
                        });
                    });
                },
                emit: function (eventName, data, callback) {
                    socket.emit(eventName, data, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback.apply(socket, args);
                            }
                        });
                    })
                }
            };
        });
})();

(function(){
    angular.module('orderPurchases.controllers',[])
        .controller('OrderPurchaseController',['$window','$scope','ngProgressFactory','$routeParams','$location','crudPurchase','socketService' ,'$filter','$route','$http','$log',
            function($window,$scope,ngProgressFactory, $routeParams,$location,crudPurchase,socket,$filter,$route , $http,$log){
                $scope.progressbar = ngProgressFactory.createInstance();
                $scope.orderPurchases = [];
                $scope.orderPurchase = {};
                $scope.products = [];
                $scope.product = {};
                $scope.detailOrderPurchases = [];
                $scope.detailOrderPurchase = {};
                $scope.errors = null;
                $scope.success;
                $scope.query = '';
                $scope.warehouses;
                $scope.orderPurchase.fechaPedido=new Date();
                $scope.date=new Date();
                $scope.variants=[];
                $scope.variant={};
                $scope.payments=[];
                $scope.payment={};
                $scope.atributes=[];
                $scope.atribute={};
                //$scope.detPayments=[];
                $scope.cantidad;
                $scope.detPayment={};
                $scope.suppliers;
                $scope.orderPurchase.montoBruto=0;
                $scope.orderPurchase.montoTotal=0;
                $scope.orderPurchase.descuento=0;
                $scope.codigoTemporalP=0;
                $scope.indexmodificar;
                $scope.mostrarVariantes=false;
                $scope.ActivarEdicion=false;
                $scope.idtemporalP;
                $scope.counts=[];
                $scope.master=true;
                $scope.cheked2=false;
                $scope.orderPurchase.checkIgv=true;
                $scope.orderPurchase.tCambio="sol";
                $scope.orderPurchase.igv=0.18;
                $scope.variants.id;
                $scope.companies=[];
                $scope.company={};



                $scope.pageChanged = function() {
                    if ($scope.query.length > 0) {
                        crudPurchase.search('orderPurchases',$scope.query,$scope.currentPage).then(function (data){
                        $scope.orderPurchases = data.data;
                    });
                    }else{
                        crudPurchase.paginate('orderPurchases',$scope.currentPage).then(function (data) {
                            $scope.orderPurchases = data.data;
                        });
                    }
                };


                var id = $routeParams.id;

                if(id)
                {

                   if($location.path() == '/orderPurchases/show/'+$routeParams.id) {
                        
                        $scope.detPayment.fecha=new Date();
                        crudPurchase.byId(id,'payments').then(function (data){
                                 $scope.payment = data;
                                 $scope.totAnterior=$scope.payment.Acuenta
                                 $scope.payment.idpayment=$scope.payment.id;
                                 $scope.payment.PorPagado=((Number($scope.payment.Acuenta)*100)/(Number($scope.payment.MontoTotal))).toFixed(2);
                                 $scope.codPaymenTempo=data.id; 
                        crudPurchase.byId($scope.payment.id,'detPayments').then(function (data) {
                                 $scope.detPayments = data;
                                 
                          }); 
                   
                        crudPurchase.byId(id,'orderPurchases').then(function (data) {
                                  $scope.purchase=data;
                                  $scope.alamcenId=data.warehouses_id;
                                  $scope.payment.purchase_id=data.id;
                                  crudPurchase.byId(data.supplier_id,'suppliers').then(function (data) {
                                      $scope.supplier=data;
                                      $scope.payment.supplier_id=data.id;
                                      crudPurchase.paginateDPedido(data.id,'counts').then(function (data) {
                                           $scope.counts=data;
                                      });
                                  });
                                  crudPurchase.listaCashes('cashHeaders',$scope.alamcenId).then(function (data) {
                                      $scope.cashHeaders = data;
                                  });
                                      if($scope.codPaymenTempo==null){
                                          $scope.payment.montoTotal=$scope.purchase.montoTotal;
                                          $scope.payment.MontoTotal=$scope.purchase.montoTotal;
                                          $scope.payment.orderPurchase_id=$scope.purchase.id;
                                          $scope.totAnterior=0;
                                          $scope.payment.Saldo=$scope.purchase.montoTotal;
                                          $scope.payment.PorPagado=0;
                                       }
                        });
                        crudPurchase.paginate('methodPayments',1).then(function (data) {
                               $scope.methodPayments = data.data;
                               $scope.maxSize = 5;
                               $scope.totalItems = data.total;
                               $scope.currentPage = data.current_page;
                               $scope.itemsperPage = 15;
                         });
                      }); 
                       //$scope.detPayment.fecha=new Date();
                }
                if($location.path() == '/orderPurchases/edit/'+$routeParams.id) {

                    crudPurchase.byId(id,'orderPurchases').then(function (data) {
                        $scope.orderPurchase = data;
                        $scope.codigoTemporalP=data.id;
                        $scope.orderPurchase.estados=data.Estado;
                        if(data.fechaPedido != null) {
                            if (data.fechaPedido.length > 0) {
                                data.fechaPedido = new Date(data.fechaPedido);
                            }
                        }
                        if(data.fechaPrevista != null) {
                            if (data.fechaPrevista.length > 0) {
                                data.fechaPrevista = new Date(data.fechaPrevista);
                            }
                        }
                        crudPurchase.byId(data.warehouses_id,'warehouses').then(function (data) {
                        $scope.warehouses=data;
                    });
                     $scope.dd=$scope.orderPurchase.fechaPrevista.getDate();
                     $scope.mm=$scope.orderPurchase.fechaPrevista.getMonth();
                     $scope.yyyy=$scope.orderPurchase.fechaPrevista.getFullYear();
                     $scope.dd1=$scope.orderPurchase.fechaPedido.getDate();
                     $scope.mm1=$scope.orderPurchase.fechaPedido.getMonth();
                     $scope.yyyy1=$scope.orderPurchase.fechaPedido.getFullYear();
                     //alert($scope.mm);
                     if($scope.dd<10){$scope.dd="0"+$scope.dd;} else{$scope.dd=$scope.dd;}
                     if($scope.mm<9){$scope.mm="0"+(parseInt($scope.mm)+1);}else{$scope.mm=$scope.mm+1;}
                     $scope.orderPurchase.fechaPrevist=$scope.dd+"-"+$scope.mm+"-"+$scope.yyyy;
                     if($scope.dd1<10){$scope.dd1="0"+$scope.dd1;} else{$scope.dd1=$scope.dd1;}
                     if($scope.mm1<9){$scope.mm1="0"+(parseInt($scope.mm1)+1);}else{$scope.mm1=$scope.mm1+1;}
                     $scope.orderPurchase.fechaPedid=$scope.dd1+"-"+$scope.mm1+"-"+$scope.yyyy1;
                       if(data.checkIgv==1){
                          $scope.orderPurchase.checkIgv=true;
                       }else{$scope.orderPurchase.checkIgv=false;}
                       $scope.orderPurchase.montoBruto=Number(data.montoBruto);
                        $scope.orderPurchase.montoTotal=Number(data.montoTotal);
                        $scope.orderPurchase.descuento=Number(data.descuento); 
                        $scope.orderPurchase.montoBrutoDolar=Number(data.montoBrutoDolar);
                        $scope.orderPurchase.montoTotalDolar=Number(data.montoTotalDolar);                   
                        $scope.orderPurchase.tasaDolar=Number(data.tasaDolar);
                        $scope.orderPurchase.igv=Number(data.igv);
                        $scope.orderPurchase.igvDolar=Number(data.igvDolar);
                        $scope.orderPurchase.montoBase=Number(data.montoBase);
                        $scope.orderPurchase.montoBaseDolar=Number(data.montoBaseDolar);
                        if(($scope.orderPurchase.montoBase+$scope.orderPurchase.igv)==$scope.orderPurchase.montoTotal)
                        {
                          $scope.orderPurchase.checkIgv=true;
                        }else{
                          $scope.orderPurchase.checkIgv=false;
                        }
                        $scope.idtemporalP=data.supplier_id;
                        crudPurchase.traerEmpresa($scope.idtemporalP).then(function (data) { 
                        $scope.orderPurchase.empresa = data.empresa;
                    });
                       // alert(data.id);
                    crudPurchase.paginateDPedido(data.id,'detailOrderPurchases').then(function (data) {
                        $scope.detailOrderPurchases = data.data;
                        $log.log($scope.detailOrderPurchases);
                        $scope.detailOrderPurchase.unidades=Number(data.cantidad);
                        $scope.maxSize = 5;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                        $scope.itemsperPage = 15;
                        $scope.p=$scope.detailOrderPurchases.length;
                    for(var n=0;n<$scope.detailOrderPurchases.length;n++){
                        $scope.p=$scope.p+1;
                        if($scope.detailOrderPurchases[n].Cantidad_Ll>0){
                           $scope.ActivarEdicion=true;
                           //alert("oye ya cambie estado");
                           break;
                        }else{
                            if($scope.p==(n+1)){
                             $scope.ActivarEdicion=false;   
                            }
                        }
                    }
                       
                    });

                    });
                    crudPurchase.select('warehouses','select').then(function(data){
                        $scope.warehouses = data;
                    });
                   

                    }

                }else{
                    
                    crudPurchase.paginate('orderPurchases',1).then(function (data) {
                        $scope.orderPurchases = data.data;
                        $scope.maxSize = 5;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                        $scope.itemsperPage = 15;

                    });
                   
                    crudPurchase.select('warehouses','select').then(function(data){
                        $scope.warehouses = data;
                    });

                     
                }
                //=========================================
               
              // if($location.path()=='/orderPurchases/create/' || $location.path()=='/orderPurchases/edit/'){
                      crudPurchase.autocomplit('products',1).then(function (data) {
                        $scope.products = data.data;
                      });
                      crudPurchase.paginatVariants("variants").then(function (data){
                        $scope.variants1=data;
                      });
                      crudPurchase.paginate('suppliers',1).then(function (data) {
                        $scope.suppliers = data.data;
                      });
                      crudPurchase.paginate('methodPayments',1).then(function (data) {
                        $scope.methodPayments = data.data;
                      });//}
                    //=========================================
            $scope.desactivarCuentas=false;
             
             $scope.validarCuenta2=function(){
                  if($scope.detPayment.NumCuenta!=null){
                     $scope.desactivarCuentas=false;
                   }else{
                     $scope.desactivarCuentas=true;
                   }
             }

                    $scope.TraerPorSku=function(sku){
                       crudPurchase.autocomplitVar('variants',sku).then(function (data) {
                        $scope.product.proId = data;
                        //alert(data.varCodigo);
                         
             if($scope.product.proId.varCodigo!=null){

                        $scope.Listo=true;
                        $scope.activarCampCantidad=false;
                        $scope.codigoVarP=$scope.product.proId.varCodigo;
                        $scope.detailOrderPurchase.Codigovar=$scope.product.proId.varid;
                        $scope.detailOrderPurchase.CodigoPCompra=$scope.product.proId.varcode;
                        $scope.detailOrderPurchase.codigoEspecifico=$scope.product.proId.varCodigo;
                        $scope.detailOrderPurchase.esbase=$scope.product.proId.esBase;
                        $scope.detailOrderPurchase.equivalecia=$scope.product.proId.equivalecia;
                               //$scope.detailOrderPurchase.nombre=$scope.product.proId.proNombre;
                        crudPurchase.paginateDPedido($scope.product.proId.varid,'detpres').then(function (data) {
                               $scope.detPres=data.data;
                               
                       
                      if($scope.detPres.length<2){
                         $scope.mostrardetalles=true;
                           crudPurchase.select('detpres',$scope.product.proId.varid).then(function (data) {
                                    $scope.detailOrderPurchase.esbase=data.esbase;
                                    $scope.detailOrderPurchase.detPres_id=data.detpresen_id;
                                    $scope.detailOrderPurchase.preProducto=Number(data.precioProduct);
                                    $scope.detailOrderPurchase.preCompra=Number(data.precioProduct);
                                    $scope.detailOrderPurchase.preProductoDolar=Number(data.precioDolar);
                                    $scope.detailOrderPurchase.preCompraDolar=Number(data.precioDolar);

                               $scope.detailOrderPurchase.Codigovar=$scope.product.proId.varid;
                                    if($scope.product.proId.NombreAtributos!=null){
                                      $scope.detailOrderPurchase.producto=$scope.product.proId.proNombre+"("+$scope.product.proId.NombreAtributos+")";
                                       }else{
                                          $scope.detailOrderPurchase.producto=$scope.product.proId.proNombre+"("+$scope.product.proId.varCodigo+")";
                                       } 
                                        $scope.detailOrderPurchase.CodigoPCompra=$scope.product.proId.varcode;
                                        $scope.detailOrderPurchase.nombre=$scope.product.proId.proNombre;
                                        //$scope.variant.sku=$scope.product.proId.varcode; 
                                       // $scope.detailOrderPurchase.detPres_id=$scope.product.proId.presid;
                                        //alert("codigo det Pres"+$scope.detailOrderPurchase.detPres_id);
                                        $scope.detailOrderPurchase.Codigovar=$scope.product.proId.varid;
                                        $scope.detailOrderPurchase.CodigoPCompra=$scope.product.proId.varcode;
                                        $scope.detailOrderPurchase.nombre=$scope.product.proId.proNombre;
                                              //$scope.detailOrderPurchase.preCompra=Number($scope.product.proId.precioCompra);
                                             // $scope.detailOrderPurchase.preProducto=Number($scope.product.proId.precioCompra);
                                             //  alert($scope.detailOrderPurchase.preCompra);
                                                //$scope.mostrarPresentacion=false;
                                        $scope.variant.sku=$scope.product.proId.varcode; 
                                        $scope.detailOrderPurchase.CodigoPCompra=$scope.product.proId.varcode;
                                        $scope.detailOrderPurchase.nombre=$scope.product.proId.proNombre;
                                       
                          });
                      }else{
                        $scope.mostrardetalles=false;
                      }
                    });
                    
                 }else{
                    $scope.mostrardetalles=true;
                    $scope.variant.sku='';
                    $scope.detailOrderPurchase.preCompra='';
                    alert("no coinsiden los resultados");
                 }});
}
                     

                socket.on('orderPurchase.update', function (data) {
                    $scope.orderPurchases=JSON.parse(data);
                });
                $scope.ProvandoEdicion=function(){
                    $scope.show = !$scope.show;
                    crudPurchase.select('warehouses','select').then(function(data){
                        $scope.warehouses = data;
                    });   
                }
                 $scope.toggle = function () {
                    $scope.show = !$scope.show;
                
                };
                $scope.asignarEmpresa=function(){
                    $scope.orderPurchase.supplier_id=$scope.orderPurchase.empresa.id;
                    $scope.orderPurchase.empresa=$scope.orderPurchase.empresa.empresa;
                }
                $scope.total20;
               
                
                  
                $scope.sacarRow=function(index,total){
                  $scope.moreIGV=0;
                    if(confirm("Esta segura de querer eliminar este Producto de la lista!!!") == true){
                      $scope.detailOrderPurchases.splice(index,1);
                      if($scope.orderPurchase.tCambio=="sol"){
                          if($scope.orderPurchase.checkIgv==true){
                               $scope.orderPurchase.montoBruto=Number((Number($scope.orderPurchase.montoBruto) - Number(total)).toFixed(2));
                               $scope.moreIGV=Number(($scope.orderPurchase.montoBruto+(($scope.orderPurchase.montoBruto)*0.18)).toFixed(2));
                               $scope.orderPurchase.montoTotal=Number((Number($scope.moreIGV)-((Number($scope.moreIGV)*Number($scope.orderPurchase.descuento))/100)).toFixed(2));
                               $scope.orderPurchase.montoBrutoDolar=Number((Number($scope.orderPurchase.montoBruto)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                               $scope.orderPurchase.montoTotalDolar=Number((Number($scope.orderPurchase.montoTotal)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                               $scope.activIgvtotal();
                          }else{
                               $scope.orderPurchase.montoBruto=Number((Number($scope.orderPurchase.montoBruto) - Number(total)).toFixed(2));
                               $scope.orderPurchase.montoTotal=Number((Number($scope.orderPurchase.montoBruto)-((Number($scope.orderPurchase.montoBruto)*Number($scope.orderPurchase.descuento))/100)).toFixed(2));
                               $scope.orderPurchase.montoBrutoDolar=Number((Number($scope.orderPurchase.montoBruto)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                               $scope.orderPurchase.montoTotalDolar=Number((Number($scope.orderPurchase.montoTotal)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                               $scope.activIgvtotal();
                          }
                       }else{
                          if($scope.orderPurchase.checkIgv==true){
                               $scope.orderPurchase.montoBrutoDolar=Number((Number($scope.orderPurchase.montoBrutoDolar) - Number(total)).toFixed(2));
                               $scope.moreIGV=Number(($scope.orderPurchase.montoBrutoDolar+(($scope.orderPurchase.montoBrutoDolar)*0.18)).toFixed(2));
                               $scope.orderPurchase.montoTotalDolar=Number((Number($scope.moreIGV)-((Number($scope.moreIGV)*Number($scope.orderPurchase.descuento))/100)).toFixed(2));
                               $scope.orderPurchase.montoBruto=Number((Number($scope.orderPurchase.montoBrutoDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                               $scope.orderPurchase.montoTotal=Number((Number($scope.orderPurchase.montoTotalDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                               $scope.activIgvtotal();
                          }else{
                               $scope.orderPurchase.montoBrutoDolar=Number((Number($scope.orderPurchase.montoBrutoDolar) - Number(total)).toFixed(2));
                               $scope.orderPurchase.montoTotalDolar=Number((Number($scope.orderPurchase.montoBrutoDolar)-((Number($scope.orderPurchase.montoBrutoDolar)*Number($scope.orderPurchase.descuento))/100)).toFixed(2));
                               $scope.orderPurchase.montoBruto=Number((Number($scope.orderPurchase.montoBrutoDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                               $scope.orderPurchase.montoTotal=Number((Number($scope.orderPurchase.montoTotalDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                               $scope.activIgvtotal();
                          }
                       }
                    }

                         
                }
                 
                  $scope.chekedval;
                  $scope.item={};
                  $scope.jajjajaja;
                 
                  $scope.n=0;
                  
                  $scope.badera=true;
                  $scope.cantidad=[];
                  $scope.quitarTalla=function(index,talla,estado){
                    //alert(talla+"/"+estado);
                    if(estado==false){
                    var t=0;
                    for(var n=0;n<$scope.companies.length;n++){
                        t++;
                        //alert($scope.companies[n].talla);
                        if($scope.companies[n].talla==('TL:'+String(talla))){
                            $scope.detailOrderPurchase.cantidad=Number((Number($scope.detailOrderPurchase.cantidad)-Number($scope.companies[n].cantidad)).toFixed(2));
                            $scope.n=$scope.detailOrderPurchase.cantidad;
                            //alert($scope.companies[n].montoBruto);
                            $scope.detailOrderPurchase.montoBruto=Number((Number($scope.detailOrderPurchase.montoBruto)-Number($scope.companies[n].montoBruto)).toFixed(2));
                            $scope.detailOrderPurchase.montoTotal=Number((Number($scope.detailOrderPurchase.montoTotal)-Number($scope.companies[n].montoTotal)).toFixed(2)); 
                            $scope.detailOrderPurchase.preCompra=Number((Number($scope.detailOrderPurchase.montoTotal)/Number($scope.detailOrderPurchase.cantidad)).toFixed(2));
                            $scope.companies.splice(t-1,1);
                            $scope.cantidad[index]='';
                            break;
                        }
                    }
                    
                }
                   // alert("hola"+t);
                  }

                  $scope.calCantidad=function(atributos,sku,varCodigo,can,talla,TieneVariante){
                   //alert("hoye estamos llenado obcional"+precioProducto);

                  // alert("hola com esgasd"+atributos);
                      if(can>0){
                        $scope.Listo=true;
                        $scope.company.producto=$scope.company.producto+"/TL:"+talla;
                     if($scope.companies[0]!=undefined){
                      for(var n=0;n<$scope.companies.length;n++){
                        if($scope.companies[n].talla==('TL:'+String(talla))){
                            //alert($scope.n);
                            $scope.detailOrderPurchase.cantidad=Number($scope.n)-Number($scope.companies[n].cantidad);
                            $scope.n=Number($scope.detailOrderPurchase.cantidad);
                            $scope.detailOrderPurchase.montoBruto=$scope.detailOrderPurchase.montoBruto-Number(($scope.companies[n].cantidad * $scope.companies[n].preCompra).toFixed(2));
                            $scope.detailOrderPurchase.montoTotal=$scope.detailOrderPurchase.montoBruto; 
                            $scope.companies[n].cantidad=can;
                            $scope.companies[n].montoBruto=Number((Number($scope.companies[n].preProducto)*Number(can)).toFixed(2));
                            $scope.companies[n].montoTotal=$scope.companies[n].montoBruto;
                            //alert(can);
                            $scope.detailOrderPurchase.cantidad=Number((Number(can)+Number($scope.n)).toFixed(2));
                            $scope.n=Number($scope.detailOrderPurchase.cantidad);
                            $scope.detailOrderPurchase.montoBruto=Number(($scope.detailOrderPurchase.montoBruto+Number(($scope.companies[n].cantidad * $scope.companies[n].preCompra).toFixed(2))).toFixed(2));
                            $scope.detailOrderPurchase.montoTotal=$scope.detailOrderPurchase.montoBruto; 
                            $scope.detailOrderPurchase.preCompra=Number($scope.detailOrderPurchase.montoTotal)/Number($scope.detailOrderPurchase.cantidad);
                            
                            $scope.badera=false;                      
                        }
                      }}
                      if($scope.badera){
                        //alert(precioProducto);
                      
                      //$scope.detailOrderPurchase.preCompra=Number(($scope.detailOrderPurchase.preProducto).toFixed(2));
                      //====================Traendo Presentacion==============================
                      crudPurchase.select('detpres',varCodigo).then(function (data) {
                                    //$scope.detPres=data;
                                   // alert(data.esbase);
                                   $scope.detailOrderPurchase.preProducto=Number(data.precioProduct);
                                    //$scope.detailOrderPurchase.preCompra=Number(data.precioProduct);
                                    $scope.company.equivalencia=data.equivalencia;
                                    $scope.company.esbase=data.esbase;
                                    $scope.company.detPres_id=data.detpresen_id;
                                    $scope.company.preProducto=Number(data.precioProduct);
                                    $scope.company.preCompra=Number(data.precioProduct);
                                    $scope.company.talla='TL:'+String(talla);
                                  if(atributos!=null){
                                       // alert("estoy aqui");
                                    $scope.company.producto=$scope.detailOrderPurchase.proNombre+"("+atributos+")";
                                   }else{
                                     $scope.company.producto=$scope.detailOrderPurchase.proNombre+"("+$scope.product.proId.varCodigo+")";
                                   }
                                    $scope.company.Codigovar=varCodigo;
                                    $scope.company.CodigoPCompra=sku;
                                    $scope.company.nombre=$scope.detailOrderPurchase.nombre;
                     // $scope.company.preCompra=precioProducto;
                                    $scope.company.taco=$scope.detailOrderPurchase.taco;
                      //$scope.company.preProducto=precioProducto;
                                    $scope.company.codigoEspecifico=$scope.detailOrderPurchase.codigoEspecifico;
                                    $scope.company.cantidad=can;
                                    $scope.company.pendiente=can;
                                    $scope.company.orderPurchases_id=$scope.codigoTemporalP;                      
                                    $scope.company.montoBruto=Number($scope.company.preCompra)*Number(can);
                                    $scope.company.montoTotal=$scope.company.montoBruto;
                                    if($scope.detailOrderPurchase.montoBruto==null){$scope.detailOrderPurchase.montoBruto=0;};
                                    $scope.detailOrderPurchase.montoBruto=Number((Number($scope.detailOrderPurchase.montoBruto)+(Number(can)*Number($scope.company.preCompra))).toFixed(2));
                                    $scope.detailOrderPurchase.montoTotal=$scope.detailOrderPurchase.montoBruto; 
                                    $scope.companies.push($scope.company);
                                    $scope.company={};
                      
                      //-----------------------------------------------------------------
                                    $scope.detailOrderPurchase.cantidad=Number(can)+$scope.n;
                                    $scope.detailOrderPurchase.preCompra=Number($scope.detailOrderPurchase.montoTotal)/Number($scope.detailOrderPurchase.cantidad);
                                    $scope.n=Number($scope.detailOrderPurchase.cantidad);
                                    $scope.detailOrderPurchase.orderPurchases_id=$scope.codigoTemporalP;
                                    
                                    
                        });
                      //====================Fin========================================
                     //$scope.detailOrderPurchases.push($scope.detailOrderPurchase); 
                     }
                     }else{
                        alert("Ingrese Cantidad mayor a cero!!!!");
                     }
                  }
                  $scope.codigoVarP;
                  $scope.mostrardetalles=true;
                  $scope.mostrarDetalles=function(){
                    alert();
                  }
                  $scope.mostrarTallas=function(taco){
                    //alert($scope.codigoVarP+"/el taco es/"+taco);
                    if(taco!=null){
                    $scope.company.producto=$scope.company.producto+"/TC:"+taco;
                    crudPurchase.MostrarTallas($scope.codigoVarP,taco).then(function (data) {
                    $scope.atributes=data.data;
                         if($scope.atributes.length>1){$scope.Listo=false;
                             $scope.mostrarPresentacion=false;
                         }else{
                          alert("este producto solo esta disponible en una sola talla");
                          $scope.activarCampCantidad=false;
                          crudPurchase.select('detpres',$scope.product.proId.varid).then(function (data) {
                                                      $scope.detailOrderPurchase.equivalencia=data.equivalencia;
                                                      $scope.detailOrderPurchase.esbase=data.esbase;
                                                      $scope.detailOrderPurchase.detPres_id=data.detpresen_id;
                                                      $scope.detailOrderPurchase.preProducto=Number(data.precioProduct);
                                                      $scope.detailOrderPurchase.preCompra=Number(data.precioProduct);
                              });
                          $scope.Listo=true;
                          $scope.mostrarPresentacion=true;
                        }
                              
                    });
                    //$scope.mostrarPresentacion=false;
                } else{
                    alert("Selecciones un numero de Taco!!!")
                }
                  }
                  $scope.editCamEstadosJ=function(){
                    //alert($scope.check);
                    if($scope.check==true){
                        $scope.check1=false;
                     }else{
                         $scope.check=true;
                     }
                     // $scope.check1=!$scope.check1;
                   }
                    $scope.mostrarPresentacion=true;
                    $scope.tieneTaco=null;
                    $scope.Listo=true;
                    $scope.activarCampCantidad=true;
                    $scope.check1;;
                    $scope.asignarProduc1=function(){
                       //alert($scope.check1);
                        $scope.companies=[];
                        $scope.company={};
                        $scope.detailOrderPurchase={};
                        $scope.mostrarPresentacion=true;
                        $scope.mostrardetalles=true;
                        $scope.detailOrderPurchase.marca=$scope.product.proId.BraName;
                        $scope.detailOrderPurchase.material=$scope.product.proId.Mnombre;
                        $scope.detailOrderPurchase.tipo=$scope.product.proId.TName;
                        $scope.detailOrderPurchase.proNombre=$scope.product.proId.proNombre;
                        $scope.codigoVarP=$scope.product.proId.varCodigo;
                        $scope.detailOrderPurchase.Codigovar=$scope.product.proId.varid;
                        $scope.detailOrderPurchase.CodigoPCompra=$scope.product.proId.varcode;
                        $scope.detailOrderPurchase.codigoEspecifico=$scope.product.proId.varCodigo;
                        if($scope.product.proId.NombreAtributos!=null){
                           $scope.detailOrderPurchase.producto=$scope.detailOrderPurchase.proNombre+"("+$scope.product.proId.NombreAtributos+")";
                        }else{
                           $scope.detailOrderPurchase.producto=$scope.detailOrderPurchase.proNombre+"("+$scope.product.proId.proCodigo+")";
                        }

                           $scope.detailOrderPurchase.nombre=$scope.product.proId.proNombre;
       // alert($scope.check1);
                       /* if($scope.check1==true)
                        {  */           
                           $scope.activarCampCantidad=true;
                    //alert($scope.product.proId.varid);
                           $scope.Listo=true;
                        crudPurchase.paginateDPedido($scope.product.proId.varid,'detpres').then(function (data) {
                               $scope.detPres=data.data;
                               
                       
                        if($scope.detPres.length<2){
                                $scope.activarCampCantidad=false;
                                crudPurchase.select('detpres',$scope.product.proId.varid).then(function (data) {
                                    $scope.detailOrderPurchase.esbase=data.esbase;
                                    $scope.detailOrderPurchase.detPres_id=data.detpresen_id;
                                    $scope.detailOrderPurchase.preProductoDolar=Number(data.precioDolar);
                                    $scope.detailOrderPurchase.preCompraDolar=Number(data.precioDolar);
                                    $scope.detailOrderPurchase.preProducto=Number(data.precioProduct);
                                    $scope.detailOrderPurchase.preCompra=Number(data.precioProduct);
                                });
                         }else{
                            $scope.mostrardetalles=false;
                         }
                         });
                
            }
                   
                    $scope.valor=21;
                    $scope.aumentarValor=function(){
                        if($scope.valor<42){
                           $scope.valor=$scope.valor+1;
                        }else{
                            alert("no existe talla mayor");
                        }
                    }
                    $scope.bajarValor=function(){
                        if($scope.valor>21){
                           $scope.valor=$scope.valor-1;
                        }else{
                           alert("no existe talla menor"); 
                        }
                    }
                    $scope.tallaSelect='';
                    $scope.traerUno=function(){
                        if($scope.tallaSelect==''){
                            $scope.tallaSelect=$scope.tallaSelect+""+$scope.valor;
                        }else{
                            $scope.tallaSelect=$scope.tallaSelect+";"+$scope.valor;
                        }
                    }
                    $scope.traerTodo=function(){
                        $scope.tallaSelect='';
                        for($n=21;$n<43;$n++){
                        if($scope.tallaSelect==''){
                            $scope.tallaSelect=$scope.tallaSelect+""+$n;
                        }else{
                            $scope.tallaSelect=$scope.tallaSelect+";"+$n;
                        }
                       }
                    }
                    $scope.LimpiarDetdoc=function(){
                          //alert($scope.checkfinal) ;
                        if($scope.checkfinal==false){
                          $scope.orderPurchase.NumFactura='';
                          $scope.orderPurchase.NumSerie='';
                          $scope.orderPurchase.tipoDoc='';
                          $scope.orderPurchase.tipoDoc='';
                        }else{
                            $scope.orderPurchase.tipoDoc='F';
                        }
                    }
                    $scope.seleccionarDetPres=function(){
                       if($scope.variants.id != undefined){
                        $id=$scope.variants.id;

                        //lo nuevo
                        crudPurchase.eligirNumero($id,'detpres').then(function (data) {
                            $scope.detPres=data.data;
                            $scope.maxSize = 5;
                            $scope.totalItems = data.total;
                            $scope.currentPage = data.current_page;
                            $scope.itemsperPage = 15;

                         });
                        
                        }else{
                            alert("por favor seleccione una variante");
                        }
                    }
                    $scope.limpiarDatosAgregate=function(){
                      $scope.product.proId='';
                      $scope.companies=[];
                      $scope.cantidad=[];
                      $scope.company={};
                      $scope.mostrardetalles=true;
                      $scope.mostrarPresentacion=true;
                      $scope.detailOrderPurchase={};
                    }
                    $scope.Equivalente;
                    $scope.AsignarP=function(row){
                         $scope.detailOrderPurchase.preProductoDolar=Number(row.precioDolar);
                         $scope.detailOrderPurchase.preCompraDolar=Number(row.precioDolar);
                         $scope.detailOrderPurchase.preProducto=Number(row.precioCompra);
                         $scope.detailOrderPurchase.preCompra=Number(row.precioCompra);
                         $scope.detailOrderPurchase.detPres_id=row.iddetalleP;
                         $scope.detailOrderPurchase.equivalencia=row.equivalencia;
                         $scope.Equivalente=row.equivalencia;                             
                        // alert(row.base);
                         $scope.detailOrderPurchase.esbase=row.base;
                         $scope.mostrardetalles=true;
                         $scope.activarCampCantidad=false;
                    }
                    $scope.orderPurchase.montoBrutoDolar=0;
                    $scope.orderPurchase.montoTotalDolar=0;
                    $scope.AgregarProducto=function(){
                       $scope.igvcompra=0;
                    if($scope.Listo==true){
                    if( $scope.mostrarPresentacion==false ){
                       $scope.cantRows=$scope.companies.length;
                       $scope.detailOrderPurchase.descuento=Number($scope.detailOrderPurchase.descuento)/Number($scope.cantRows);
                            
                      for(var n=0;n<$scope.companies.length;n++){
                          $scope.companies[n].Fecha=new Date();
                          $scope.companies[n].Fecha.setUTCHours($scope.companies[n].Fecha.getHours());
                        if($scope.detailOrderPurchase.descuento>0){
                            $scope.companies[n].preCompra=Number(($scope.companies[n].preCompra - (($scope.companies[n].preCompra * $scope.detailOrderPurchase.descuento ) / 100)).toFixed(2));
                            $scope.companies[n].montoTotal=Number($scope.companies[n].cantidad)*$scope.companies[n].preCompra;
                            $scope.companies[n].descuento=$scope.detailOrderPurchase.descuento;
                        }
                        $scope.companies[n].nuevo=true;
                        $scope.orderPurchase.montoBruto=Number((Number($scope.orderPurchase.montoBruto)+Number($scope.companies[n].montoTotal)).toFixed(2));
                        $scope.orderPurchase.montoTotal=Number(($scope.orderPurchase.montoBruto - Number(($scope.orderPurchase.montoBruto*$scope.orderPurchase.descuento)/100)).toFixed(2));
                        $scope.detailOrderPurchases.push($scope.companies[n]);
                        $scope.product.proId='';
                        $scope.activarCampCantidad=true;
                      }
                      $scope.companies=[];
                    
                      $scope.detailOrderPurchase = {};
                      $scope.n=0;
                      $scope.cheked2=false;
                      $scope.mostrarPresentacion=true;
                  }else{
                       if($scope.detailOrderPurchase.detPres_id>0){
                        if($scope.detailOrderPurchase.cantidad>=1 && $scope.detailOrderPurchase.preProducto>=0 && $scope.detailOrderPurchase.montoBruto>=0 && $scope.detailOrderPurchase.montoTotal>=0){
                        $scope.detailOrderPurchase.orderPurchases_id=$scope.codigoTemporalP;
                        $scope.detailOrderPurchase.nuevo=true;
                        $scope.detailOrderPurchases.push($scope.detailOrderPurchase);
                        $scope.detailOrderPurchase.pendiente=$scope.detailOrderPurchase.cantidad;
                        $scope.orderPurchase.detailOrderPurchases=$scope.detailOrderPurchases;
                        //---------------------------------------------------------
                        if($scope.orderPurchase.tCambio=="sol"){ 
                                  $scope.orderPurchase.montoBruto= Number((Number($scope.orderPurchase.montoBruto)+Number($scope.detailOrderPurchase.montoTotal)).toFixed(2));
                                  $scope.activIgvtotal();
                          }else{
                                  $scope.orderPurchase.montoBrutoDolar= Number((Number($scope.orderPurchase.montoBrutoDolar)+Number($scope.detailOrderPurchase.montoTotalDolar)).toFixed(2));
                                  $scope.activIgvtotal();
                          }
                        
                        //----------------------------------------------------
                        
                        if($scope.Equivalente!=null){
                           $scope.detailOrderPurchase.cantidad=Number((Number($scope.detailOrderPurchase.cantidad)*Number($scope.Equivalente)).toFixed(2));
                           $scope.detailOrderPurchase.preProducto=Number((Number($scope.detailOrderPurchase.montoBruto)/Number($scope.detailOrderPurchase.cantidad)).toFixed(2));
                           $scope.detailOrderPurchase.preCompra=Number((Number($scope.detailOrderPurchase.montoTotal)/Number($scope.detailOrderPurchase.cantidad)).toFixed(2));
                        }
                        $scope.orderPurchases.push($scope.orderPurchase);
                        $scope.Equivalente=null;
                        $scope.detailOrderPurchase = {};
                        $scope.variant.sku='';
                        //$scope.variants={};
                        $scope.product.proId='';
                        ///$scope.variant.sku='';
                        $scope.product.id='';
                        $scope.activarCampCantidad=true;
                    }else{
                       alert("Por favor debe ingresar una cantidad mayor a cero para poder agregar pedido");
                    }
                    }else{ alert("!!Usted Debe seleccionar un producto y una presentacion para poder agregar!!");}
                 }
               }else{alert("seleccione un Taco y una talla!!");}
             }

                    $scope.ejemplo2=null;
                    $scope.estado_fin2=0;
                    $scope.ejemplo_de2=true;
                    $scope.calcularmontoBrutoF=function(){
                        $scope.montowithIGV=0;
                        $scope.igvcompra=0;
                        if($scope.ejemplo2 != $scope.orderPurchase.montoTotal && $scope.estado_fin2 == $scope.orderPurchase.descuento){
                            if($scope.orderPurchase.tCambio=="sol"){
                                if($scope.orderPurchase.checkIgv==true){
                                          $scope.orderPurchase.descuento=Number(((($scope.orderPurchase.montoBruto - $scope.orderPurchase.montoTotal)/$scope.orderPurchase.montoBruto)*100).toFixed(2));
                                          $scope.orderPurchase.montoTotalDolar=Number((Number($scope.orderPurchase.montoTotal)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                          $scope.orderPurchase.montoBase=Number((Number($scope.orderPurchase.montoTotal)/1.18).toFixed(2));
                                          $scope.orderPurchase.igv=Number(($scope.orderPurchase.montoTotal-$scope.orderPurchase.montoBase).toFixed(2));
                                          $scope.orderPurchase.montoBaseDolar=Number((Number($scope.orderPurchase.montoBase)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                          $scope.orderPurchase.igvDolar=Number((Number($scope.orderPurchase.igv)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                          $scope.estado_fin2=$scope.orderPurchase.descuento;
                                          $scope.ejemplo_de2=false;
                                }else{
                                          /*$scope.orderPurchase.descuento=Number(((($scope.orderPurchase.montoBruto - $scope.orderPurchase.montoTotal)/$scope.orderPurchase.montoBruto)*100).toFixed(2));
                                          $scope.orderPurchase.montoTotalDolar=Number((Number($scope.orderPurchase.montoTotal)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                          $scope.estado_fin2=$scope.orderPurchase.descuento;
                                          $scope.ejemplo_de2=false;*/
                                          $scope.montowithIGV=Number((Number($scope.orderPurchase.montoTotal)+(Number($scope.orderPurchase.montoTotal)*0.18)).toFixed(2));
                                          $scope.orderPurchase.montoTotal=Number(($scope.montowithIGV).toFixed(2));
                                           $scope.orderPurchase.descuento=Number(((($scope.orderPurchase.montoBruto - $scope.orderPurchase.montoTotal)/$scope.orderPurchase.montoBruto)*100).toFixed(2));
                                           $scope.orderPurchase.montoTotalDolar=Number((Number($scope.orderPurchase.montoTotal)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                           $scope.orderPurchase.montoBase=Number(($scope.orderPurchase.montoTotal-(Number($scope.orderPurchase.montoTotal)*0.18)).toFixed(2));
                                           $scope.orderPurchase.igv=Number((Number($scope.orderPurchase.montoTotal)*0.18).toFixed(2));
                                           $scope.orderPurchase.montoBaseDolar=Number((Number($scope.orderPurchase.montoBase)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                           $scope.orderPurchase.igvDolar=Number((Number($scope.orderPurchase.igv)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                           $scope.estado_fin2=$scope.orderPurchase.descuento;
                                           $scope.ejemplo_de2=false;
                                }
                                 
                            }else{
                               if($scope.orderPurchase.checkIgv==true){
                                      $scope.orderPurchase.descuento=Number(((($scope.orderPurchase.montoBrutoDolar - $scope.orderPurchase.montoTotalDolar)/$scope.orderPurchase.montoBrutoDolar)*100).toFixed(2));
                                      $scope.orderPurchase.montoTotal=Number((Number($scope.orderPurchase.montoTotalDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                      $scope.orderPurchase.montoBaseDolar=Number((Number($scope.orderPurchase.montoTotalDolar)/1.18).toFixed(2));
                                      $scope.orderPurchase.igvDolar=Number(($scope.orderPurchase.montoTotalDolar-$scope.orderPurchase.montoBaseDolar).toFixed(2));
                                      $scope.orderPurchase.montoBase=Number((Number($scope.orderPurchase.montoBaseDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                      $scope.orderPurchase.igv=Number((Number($scope.orderPurchase.igvDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                              
                                      $scope.estado_fin2=$scope.orderPurchase.descuento;
                                      $scope.ejemplo_de2=false;
                               }else{
                                     
                                      $scope.montowithIGV=Number((Number($scope.orderPurchase.montoTotalDolar)+(Number($scope.orderPurchase.montoTotalDolar)*0.18)).toFixed(2));
                                      $scope.orderPurchase.montoTotalDolar=Number(($scope.montowithIGV).toFixed(2));
                                      $scope.orderPurchase.descuento=Number(((($scope.orderPurchase.montoBrutoDolar - $scope.orderPurchase.montoTotalDolar)/$scope.orderPurchase.montoBrutoDolar)*100).toFixed(2));
                                      $scope.orderPurchase.montoTotal=Number((Number($scope.orderPurchase.montoTotalDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                      $scope.orderPurchase.montoBaseDolar=Number((Number($scope.orderPurchase.montoTotalDolar)-(Number($scope.orderPurchase.montoTotalDolar)*0.18)).toFixed(2));
                                      $scope.orderPurchase.igvDolar=Number((Number($scope.orderPurchase.montoTotal)*0.18).toFixed(2));
                                      $scope.orderPurchase.montoBase=Number((Number($scope.orderPurchase.montoBaseDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                      $scope.orderPurchase.igv=Number((Number($scope.orderPurchase.igvDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                              
                                      $scope.estado_fin2=$scope.orderPurchase.descuento;
                                      $scope.ejemplo_de2=false;
                               }
                            }
                        }
                        if($scope.ejemplo_de2 && $scope.estado_fin2 != $scope.orderPurchase.descuento){
                              if($scope.orderPurchase.tCambio=="sol"){ 
                                if($scope.orderPurchase.checkIgv==true){
                                      $scope.orderPurchase.montoTotal=Number(($scope.orderPurchase.montoBruto - Number(($scope.orderPurchase.montoBruto*$scope.orderPurchase.descuento)/100)).toFixed(2));
                                      $scope.orderPurchase.montoTotalDolar=Number((Number($scope.orderPurchase.montoTotal)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                      $scope.orderPurchase.montoBase=Number((Number($scope.orderPurchase.montoTotal)/1.18).toFixed(2));
                                      $scope.orderPurchase.igv=Number(($scope.orderPurchase.montoTotal-$scope.orderPurchase.montoBase).toFixed(2));
                                      $scope.orderPurchase.montoBaseDolar=Number((Number($scope.orderPurchase.montoBase)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                      $scope.orderPurchase.igvDolar=Number((Number($scope.orderPurchase.igv)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                          
                                      $scope.ejemplo2=$scope.orderPurchase.montoTotal;
                                      $scope.estado_fin2=$scope.orderPurchase.descuento;
                                }else{  
                                      $scope.igvcompra= Number(($scope.orderPurchase.montoBruto - Number(($scope.orderPurchase.montoBruto*$scope.orderPurchase.descuento)/100)).toFixed(2));
                                      //$scope.igvcompra=Number(($scope.orderPurchase.montoBruto+(Number($scope.orderPurchase.montoBruto)*0.18)).toFixed(2));
                                      $scope.orderPurchase.montoTotal=Number(($scope.igvcompra+(Number($scope.igvcompra)*0.18)).toFixed(2));
                                      $scope.orderPurchase.montoTotalDolar=Number((Number($scope.orderPurchase.montoTotal)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                      $scope.orderPurchase.montoBase=Number((Number($scope.orderPurchase.montoTotal)-(Number($scope.orderPurchase.montoTotal)*0.18)).toFixed(2));
                                      $scope.orderPurchase.igv=Number((Number($scope.orderPurchase.montoTotal)*0.18).toFixed(2));
                                      $scope.orderPurchase.montoBaseDolar=Number((Number($scope.orderPurchase.montoBase)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                      $scope.orderPurchase.igvDolar=Number((Number($scope.orderPurchase.igv)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                      $scope.orderPurchase.descuento=Number(((($scope.orderPurchase.montoBruto - $scope.orderPurchase.montoTotal)/$scope.orderPurchase.montoBruto)*100).toFixed(2));    
                                      $scope.ejemplo2=$scope.orderPurchase.montoTotal;
                                      $scope.estado_fin2=$scope.orderPurchase.descuento;
                               }
                               }else{
                                 if($scope.orderPurchase.checkIgv==true){
                                       $scope.orderPurchase.montoTotalDolar=Number(($scope.orderPurchase.montoBrutoDolar - Number(($scope.orderPurchase.montoBrutoDolar*$scope.orderPurchase.descuento)/100)).toFixed(2));
                                       $scope.orderPurchase.montoTotal=Number((Number($scope.orderPurchase.montoTotalDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                       $scope.orderPurchase.montoBaseDolar=Number((Number($scope.orderPurchase.montoTotalDolar)/1.18).toFixed(2));
                                       $scope.orderPurchase.igvDolar=Number(($scope.orderPurchase.montoTotalDolar-$scope.orderPurchase.montoBaseDolar).toFixed(2));
                                       $scope.orderPurchase.montoBase=Number((Number($scope.orderPurchase.montoBaseDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                       $scope.orderPurchase.igv=Number((Number($scope.orderPurchase.igvDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                              
                                       $scope.ejemplo2=$scope.orderPurchase.montoTotalDolar;
                                       $scope.estado_fin2=$scope.orderPurchase.descuento;
                                 }else{
                                       $scope.igvcompra= Number(($scope.orderPurchase.montoBrutoDolar - Number(($scope.orderPurchase.montoBrutoDolar*$scope.orderPurchase.descuento)/100)).toFixed(2));
                                       //$scope.igvcompra=Number(($scope.orderPurchase.montoTotalDolar+(Number($scope.orderPurchase.montoTotalDolar)*0.18)).toFixed(2));
                                      // $scope.orderPurchase.montoTotalDolar=Number(($scope.igvcompra).toFixed(2));
                                       $scope.orderPurchase.montoTotalDolar=Number(($scope.igvcompra+(Number($scope.igvcompra)*0.18)).toFixed(2));
                                       $scope.orderPurchase.montoTotal=Number((Number($scope.orderPurchase.montoTotalDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                       $scope.orderPurchase.montoBaseDolar=Number((Number($scope.orderPurchase.montoTotalDolar)-(Number($scope.orderPurchase.montoTotalDolar)*0.18)).toFixed(2));
                                       $scope.orderPurchase.igvDolar=Number((Number($scope.orderPurchase.montoTotalDolar)*0.18).toFixed(2));
                                       $scope.orderPurchase.montoBase=Number((Number($scope.orderPurchase.montoBaseDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                       $scope.orderPurchase.igv=Number((Number($scope.orderPurchase.igvDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                       $scope.orderPurchase.descuento=Number(((($scope.orderPurchase.montoBrutoDolar - $scope.orderPurchase.montoTotalDolar)/$scope.orderPurchase.montoBrutoDolar)*100).toFixed(2));
                                       $scope.ejemplo2=$scope.orderPurchase.montoTotalDolar;
                                       $scope.estado_fin2=$scope.orderPurchase.descuento;
                                 }
                                 
                               }
                        }else{$scope.ejemplo_de2=true;}
                    }
                   
                    $scope.ejemplo=null;
                    $scope.ejemplo_de=null;
                    $scope.estado_fin=true;
                    $scope.calcPrecio=function(){
                      if($scope.detailOrderPurchase.cantidad>0) { 
                        if($scope.detailOrderPurchase.descuento>0 && $scope.orderPurchase.tCambio=="dolar"){                                   
                                  
                                   $scope.detailOrderPurchase.preCompraDolar=Number(($scope.detailOrderPurchase.preProductoDolar- (($scope.detailOrderPurchase.preProductoDolar * $scope.detailOrderPurchase.descuento ) / 100)).toFixed(2));
                                   $scope.detailOrderPurchase.preCompra=Number((Number($scope.detailOrderPurchase.preCompraDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                   $scope.detailOrderPurchase.montoBrutoDolar=Number(($scope.detailOrderPurchase.cantidad * Number($scope.detailOrderPurchase.preProductoDolar)).toFixed(2));
                                   $scope.detailOrderPurchase.montoBruto=Number((Number($scope.detailOrderPurchase.montoBrutoDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                   //$scope.detailOrderPurchase.descuento=Number(($scope.detailOrderPurchase.descuento).toFixed(2));
                                   $scope.detailOrderPurchase.montoTotalDolar=Number(($scope.detailOrderPurchase.montoBrutoDolar - Number(($scope.detailOrderPurchase.montoBrutoDolar*$scope.detailOrderPurchase.descuento)/100)).toFixed(2));
                                   $scope.detailOrderPurchase.montoTotal= Number(($scope.detailOrderPurchase.montoTotalDolar*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                  
                            }else {
                                  if($scope.detailOrderPurchase.descuento>0 && $scope.orderPurchase.tCambio=="sol"){
                                     //$scope.detailOrderPurchase.preCompra=Number($scope.detailOrderPurchase.preProducto);
                                     $scope.detailOrderPurchase.preCompra=Number(($scope.detailOrderPurchase.preProducto- (($scope.detailOrderPurchase.preProducto * $scope.detailOrderPurchase.descuento ) / 100)).toFixed(2));
                                     $scope.detailOrderPurchase.preCompraDolar=Number((Number($scope.detailOrderPurchase.preCompra)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                     $scope.detailOrderPurchase.montoBruto=Number(($scope.detailOrderPurchase.cantidad * Number($scope.detailOrderPurchase.preProducto)).toFixed(2));
                                     $scope.detailOrderPurchase.montoBrutoDolar=Number((Number($scope.detailOrderPurchase.montoBruto)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                     //$scope.detailOrderPurchase.descuento=Number(($scope.detailOrderPurchase.descuento).toFixed(2));
                                     $scope.detailOrderPurchase.montoTotal=Number((Number($scope.detailOrderPurchase.montoBruto)- Number((Number($scope.detailOrderPurchase.montoBruto)*Number($scope.detailOrderPurchase.descuento))/100)).toFixed(2));
                                     $scope.detailOrderPurchase.montoTotalDolar= Number((Number($scope.detailOrderPurchase.montoTotal)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                     
                                  }else{
                                    if($scope.orderPurchase.tCambio=="sol"){
                                         $scope.detailOrderPurchase.preCompra=Number($scope.detailOrderPurchase.preProducto);
                                         $scope.detailOrderPurchase.preCompraDolar=Number((Number($scope.detailOrderPurchase.preCompra)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                         $scope.detailOrderPurchase.montoBruto=Number(($scope.detailOrderPurchase.cantidad * Number($scope.detailOrderPurchase.preProducto)).toFixed(2));
                                         $scope.detailOrderPurchase.montoBrutoDolar=Number((Number($scope.detailOrderPurchase.montoBruto)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                         $scope.detailOrderPurchase.montoTotal=Number((Number($scope.detailOrderPurchase.montoBruto)).toFixed(2));
                                         $scope.detailOrderPurchase.montoTotalDolar= Number((Number($scope.detailOrderPurchase.montoTotal)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                    
                                    }
                                    if($scope.orderPurchase.tCambio=="dolar"){
                                           $scope.detailOrderPurchase.preCompraDolar=Number($scope.detailOrderPurchase.preProductoDolar);
                                           $scope.detailOrderPurchase.preCompra=Number((Number($scope.detailOrderPurchase.preCompraDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                           $scope.detailOrderPurchase.montoBrutoDolar=Number(($scope.detailOrderPurchase.cantidad * Number($scope.detailOrderPurchase.preProductoDolar)).toFixed(2));
                                           $scope.detailOrderPurchase.montoBruto=Number((Number($scope.detailOrderPurchase.montoBrutoDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                           $scope.detailOrderPurchase.montoTotalDolar=Number((Number($scope.detailOrderPurchase.montoBrutoDolar)).toFixed(2));
                                           $scope.detailOrderPurchase.montoTotal= Number(($scope.detailOrderPurchase.montoTotalDolar*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                           
                                           //$scope.detailOrderPurchase.descuento=Number(($scope.detailOrderPurchase.descuento).toFixed(2));
                            
                                    }
                                     
                                   }
                            }                           
                        
                        }
                    }
                    $scope.activIgvtotal=function(){
                     
                         if($scope.orderPurchase.checkIgv==true){
                            if($scope.orderPurchase.tCambio=="sol"){ 
                                  $scope.orderPurchase.montoTotal=Number((Number($scope.orderPurchase.montoBruto)-((Number($scope.orderPurchase.montoBruto)*Number($scope.orderPurchase.descuento))/100)).toFixed(2));
                                  $scope.orderPurchase.montoBase=Number((Number($scope.orderPurchase.montoTotal)/1.18).toFixed(2));
                                  $scope.orderPurchase.igv=Number(($scope.orderPurchase.montoTotal-$scope.orderPurchase.montoBase).toFixed(2));
                                  $scope.orderPurchase.montoBrutoDolar=Number((Number($scope.orderPurchase.montoBruto)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                  $scope.orderPurchase.montoTotalDolar=Number((Number($scope.orderPurchase.montoTotal)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                  $scope.orderPurchase.montoBaseDolar=Number((Number($scope.orderPurchase.montoBase)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                  $scope.orderPurchase.igvDolar=Number((Number($scope.orderPurchase.igv)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                              }else{
                                  $scope.orderPurchase.montoTotalDolar=Number((Number($scope.orderPurchase.montoBrutoDolar)-((Number($scope.orderPurchase.montoBrutoDolar)*Number($scope.orderPurchase.descuento))/100)).toFixed(2));
                                  $scope.orderPurchase.montoBaseDolar=Number((Number($scope.orderPurchase.montoTotalDolar)/1.18).toFixed(2));
                                  $scope.orderPurchase.igvDolar=Number(($scope.orderPurchase.montoTotalDolar-$scope.orderPurchase.montoBaseDolar).toFixed(2));
                                  $scope.orderPurchase.montoBruto=Number((Number($scope.orderPurchase.montoBrutoDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                  $scope.orderPurchase.montoTotal=Number((Number($scope.orderPurchase.montoTotalDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                  $scope.orderPurchase.montoBase=Number((Number($scope.orderPurchase.montoBaseDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                  $scope.orderPurchase.igv=Number((Number($scope.orderPurchase.igvDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                              
                              }
                         }else{
                             if($scope.orderPurchase.tCambio=="sol"){ 
                                  $scope.orderPurchase.montoTotal=Number((Number($scope.orderPurchase.montoBruto)-((Number($scope.orderPurchase.montoBruto)*Number($scope.orderPurchase.descuento))/100)).toFixed(2));
                                  $scope.orderPurchase.igv=Number((Number($scope.orderPurchase.montoTotal)*0.18).toFixed(2));
                                  $scope.igvcompra=Number(($scope.orderPurchase.montoTotal).toFixed(2));
                                  $scope.orderPurchase.montoBase=$scope.igvcompra;
                                  $scope.orderPurchase.montoTotal=Number((Number($scope.igvcompra)+Number($scope.orderPurchase.igv)).toFixed(2));
                                  $scope.orderPurchase.montoBrutoDolar=Number((Number($scope.orderPurchase.montoBruto)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                  $scope.orderPurchase.montoTotalDolar=Number((Number($scope.orderPurchase.montoTotal)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                  $scope.orderPurchase.montoBaseDolar=Number((Number($scope.orderPurchase.montoBase)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                  $scope.orderPurchase.igvDolar=Number((Number($scope.orderPurchase.igv)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                              
                              }else{
                                  $scope.orderPurchase.montoTotalDolar=Number((Number($scope.orderPurchase.montoBrutoDolar)-((Number($scope.orderPurchase.montoBrutoDolar)*Number($scope.orderPurchase.descuento))/100)).toFixed(2));
                                  $scope.orderPurchase.igvDolar=Number((Number($scope.orderPurchase.montoTotalDolar)*0.18).toFixed(2));
                                  $scope.igvcompra=Number(($scope.orderPurchase.montoTotalDolar).toFixed(2));
                                  $scope.orderPurchase.montoBaseDolar=$scope.igvcompra;
                                  $scope.orderPurchase.montoTotalDolar=Number((Number($scope.igvcompra)+(Number($scope.orderPurchase.igvDolar))).toFixed(2));
                                  $scope.orderPurchase.montoBruto=Number((Number($scope.orderPurchase.montoBrutoDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                  $scope.orderPurchase.montoTotal=Number((Number($scope.orderPurchase.montoTotalDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                  $scope.orderPurchase.montoBase=Number((Number($scope.orderPurchase.montoBaseDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                  $scope.orderPurchase.igv=Number((Number($scope.orderPurchase.igvDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                              
                              }

                         }
                    }
                    $scope.descuentoCalc=function(){
                         if($scope.detailOrderPurchase.cantidad>0){
                            if($scope.orderPurchase.tCambio=="dolar"){ 
                                $scope.detailOrderPurchase.preCompraDolar=Number((Number($scope.detailOrderPurchase.preProductoDolar)-((Number($scope.detailOrderPurchase.preProductoDolar)*Number($scope.detailOrderPurchase.descuento))/100)).toFixed(2));
                                $scope.detailOrderPurchase.preCompra=Number((Number($scope.detailOrderPurchase.preCompraDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                $scope.detailOrderPurchase.montoTotalDolar=Number((Number($scope.detailOrderPurchase.preCompraDolar)*Number($scope.detailOrderPurchase.cantidad)).toFixed(2));
                                $scope.detailOrderPurchase.montoTotal=Number($scope.detailOrderPurchase.montoTotalDolar)*Number($scope.orderPurchase.tasaDolar);
                                //$scope.detailOrderPurchase.descuento=$scope.detailOrderPurchase.descuento;
                            }else{
                                $scope.detailOrderPurchase.preCompra=Number((Number($scope.detailOrderPurchase.preProducto)-((Number($scope.detailOrderPurchase.preProducto)*Number($scope.detailOrderPurchase.descuento))/100)).toFixed(2));
                                $scope.detailOrderPurchase.montoTotal=Number((Number($scope.detailOrderPurchase.preCompra)*Number($scope.detailOrderPurchase.cantidad)).toFixed(2));
                                $scope.detailOrderPurchase.montoTotalDolar=Number($scope.detailOrderPurchase.montoTotal)/Number($scope.orderPurchase.tasaDolar);
                                $scope.detailOrderPurchase.preCompraDolar=Number((Number($scope.detailOrderPurchase.preCompra)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                                //$scope.detailOrderPurchase.descuento=$scope.detailOrderPurchase.descuento;
                            }
                         }
                    }
                    $scope.montofinalModif=function(){
                      if($scope.orderPurchase.tCambio=="sol"){
                            $scope.detailOrderPurchase.descuento=Number(((($scope.detailOrderPurchase.montoBruto - $scope.detailOrderPurchase.montoTotal)/$scope.detailOrderPurchase.montoBruto)*100).toFixed(2));
                            $scope.detailOrderPurchase.preCompra=Number(($scope.detailOrderPurchase.preCompra - (($scope.detailOrderPurchase.preCompra * $scope.detailOrderPurchase.descuento ) / 100)).toFixed(2));
                            $scope.detailOrderPurchase.preCompraDolar=Number($scope.detailOrderPurchase.preCompra)/Number($scope.orderPurchase.tasaDolar);
                            $scope.detailOrderPurchase.montoTotalDolar=Number($scope.detailOrderPurchase.montoTotal)/Number($scope.orderPurchase.tasaDolar);
                            //$scope.detailOrderPurchase.descuento=Number(($scope.detailOrderPurchase.descuento).toFixed(2));
                      }else{
                            $scope.detailOrderPurchase.descuento=Number(((($scope.detailOrderPurchase.montoBrutoDolar - $scope.detailOrderPurchase.montoTotalDolar)/$scope.detailOrderPurchase.montoBrutoDolar)*100).toFixed(2));
                            $scope.detailOrderPurchase.preCompraDolar=Number(($scope.detailOrderPurchase.preCompraDolar - (($scope.detailOrderPurchase.preCompraDolar * $scope.detailOrderPurchase.descuento) / 100)).toFixed(2));
                            $scope.detailOrderPurchase.preCompra=Number($scope.detailOrderPurchase.preCompraDolar)*Number($scope.orderPurchase.tasaDolar);
                            $scope.detailOrderPurchase.montoTotal=Number($scope.detailOrderPurchase.montoTotalDolar)*Number($scope.orderPurchase.tasaDolar);
                            //$scope.detailOrderPurchase.descuento=Number(($scope.detailOrderPurchase.descuento).toFixed(2));

                      }
                    }
                 
                
                $scope.CalcPrecio=function(){
                  if($scope.detailOrderPurchase.cantidad>0) { 
                       if($scope.orderPurchase.tCambio=="sol"){
                            $scope.detailOrderPurchase.descuento=Number(((Number(Number($scope.detailOrderPurchase.preProducto)-Number($scope.detailOrderPurchase.preCompra))/Number($scope.detailOrderPurchase.preProducto))*100).toFixed(2));
                            $scope.detailOrderPurchase.montoTotal= Number(($scope.detailOrderPurchase.cantidad * Number($scope.detailOrderPurchase.preCompra)).toFixed(2));
                            $scope.detailOrderPurchase.preCompraDolar=Number($scope.detailOrderPurchase.preCompra)/Number($scope.orderPurchase.tasaDolar);
                            //$scope.detailOrderPurchase.descuento=Number($scope.detailOrderPurchase.descuento);
                            $scope.detailOrderPurchase.montoTotalDolar=Number($scope.detailOrderPurchase.montoTotal)/Number($scope.orderPurchase.tasaDolar);
                      }else{
                           $scope.detailOrderPurchase.descuento=Number(((Number(Number($scope.detailOrderPurchase.preProductoDolar)-Number($scope.detailOrderPurchase.preCompraDolar))/Number($scope.detailOrderPurchase.preProducto))*100).toFixed(2));
                           $scope.detailOrderPurchase.montoTotalDolar= Number(($scope.detailOrderPurchase.cantidad * Number($scope.detailOrderPurchase.preCompraDolar)).toFixed(2));
                           $scope.detailOrderPurchase.preCompra=Number($scope.detailOrderPurchase.preCompraDolar)*Number($scope.orderPurchase.tasaDolar);
                           //$scope.detailOrderPurchase.descuento=Number($scope.detailOrderPurchase.descuento);
                           $scope.detailOrderPurchase.montoTotal=Number($scope.detailOrderPurchase.montoTotalDolar)*Number($scope.orderPurchase.tasaDolar);
                       }
                           
                        
                  }
                  
                }
                $scope.selectDolar=function(){
                   $scope.detailOrderPurchase.preProductoDolar=Number($scope.detailOrderPurchase.preProducto);
                    $scope.detailOrderPurchase.preCompraDolar=Number($scope.detailOrderPurchase.preCompra);
                    //$scope.detailOrderPurchase.descuento=Number($scope.detailOrderPurchase.descuento);
                    $scope.detailOrderPurchase.montoTotalDolar=Number($scope.detailOrderPurchase.montoTotal);
                    $scope.detailOrderPurchase.montoBrutoDolar=Number($scope.detailOrderPurchase.montoBruto);
                   
                }
                $scope.activarBusca=true;
                $scope.activarBusca2=false;
                $scope.SolDolar = function(numero){
                if($scope.orderPurchase.tasaDolar>0){
                $scope.activarBusca=false;
                $scope.activarBusca2=true;
                if($scope.detailOrderPurchase.cantidad>0){
                if($scope.orderPurchase.tCambio=="sol"){
                    $scope.detailOrderPurchase.preProductoDolar=Number($scope.detailOrderPurchase.preProducto) / Number(numero);
                    $scope.detailOrderPurchase.preCompraDolar=Number($scope.detailOrderPurchase.preCompra) / Number(numero);
                    $scope.detailOrderPurchase.montoTotalDolar=Number($scope.detailOrderPurchase.montoTotal) / Number(numero);
                    $scope.detailOrderPurchase.montoBrutoDolar=Number($scope.detailOrderPurchase.montoBruto) / Number(numero);
                  }else{
                    $scope.detailOrderPurchase.preProducto=Number($scope.detailOrderPurchase.preProductoDolar) * Number(numero);
                    $scope.detailOrderPurchase.preCompra=Number($scope.detailOrderPurchase.preCompraDolar) * Number(numero);
                    $scope.detailOrderPurchase.montoTotal=Number($scope.detailOrderPurchase.montoTotalDolar) * Number(numero);
                    $scope.detailOrderPurchase.montoBruto=Number($scope.detailOrderPurchase.montoBrutoDolar) * Number(numero);
                  
                  } // $scope.detailOrderPurchase.preCompra=
                }else{
                  if($scope.orderPurchase.tCambio=="sol"){
                       $scope.detailOrderPurchase.preCompraDolar=Number($scope.detailOrderPurchase.preCompra) / Number(numero);
                  }else{
                       $scope.detailOrderPurchase.preCompra=Number($scope.detailOrderPurchase.preCompraDolar) * Number(numero);
                  }
                }
              }else{
                alert("Ingrese un valor de cambio por favor");
                $scope.orderPurchase.tasaDolar='';
              }
                }
                $scope.paginateVariants=function(){
                  //alert("Hola quieres");
                  crudPurchase.paginatVariants("variants").then(function (data){
                    $scope.products=date;
                  });
                }
                //$scope.detailOrderPurchase.cantAnterior=null;
                $scope.addCant=function(row,index){
                    //alert(row.cantAnterior);
                    $scope.moreIGV=0;
                      if(row.cantAnterior==undefined){
                        row.cantAnterior=row.cantidad;
                      }
                      $scope.orderPurchase.montoBruto=$scope.orderPurchase.montoBruto-Number(row.montoTotal);
                      $scope.orderPurchase.montoBrutoDolar=$scope.orderPurchase.montoBrutoDolar-Number(row.montoTotalDolar);
                      row.cantidad=parseInt(row.cantidad)+1;
                      row.pendiente=parseInt(row.pendiente)+1;
                       if($scope.orderPurchase.tCambio=="sol"){
                      row.montoBruto=Number((parseInt(row.cantidad)*Number(row.preProducto)).toFixed(2));
                      row.montoTotal=Number((parseInt(row.cantidad)*Number(row.preCompra)).toFixed(2));
                      row.montoBrutoDolar=Number((parseInt(row.montoBruto)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                      row.montoTotalDolar=Number((parseInt(row.montoTotal)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                         $scope.detailOrderPurchases.splice(index,1,row);
                         $scope.orderPurchase.montoBruto=Number((($scope.orderPurchase.montoBruto)+Number(row.montoTotal)).toFixed(2));
                         $scope.activIgvtotal();      
                        
                     }else{
                      row.montoBrutoDolar=Number((parseInt(row.cantidad)*Number(row.preProductoDolar)).toFixed(2));
                      row.montoTotalDolar=Number((parseInt(row.cantidad)*Number(row.preCompraDolar)).toFixed(2));
                      row.montoBruto=Number((parseInt(row.montoBrutoDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                      row.montoTotal=Number((parseInt(row.montoTotalDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                         $scope.detailOrderPurchases.splice(index,1,row);
                         $scope.orderPurchase.montoBrutoDolar=Number((($scope.orderPurchase.montoBrutoDolar)+Number(row.montoTotalDolar)).toFixed(2));
                         $scope.activIgvtotal();      
                       
                                               
                     }
                     
                }
                $scope.lessCant=function(row,index){
                     //alert($scope.detailOrderPurchase.cantAnterior);
                     $scope.moreIGV=0;
                     if(parseInt(row.cantidad)>1){
                        if(row.cantAnterior==undefined){
                        row.cantAnterior=row.cantidad;
                      }
                      $scope.orderPurchase.montoBruto=$scope.orderPurchase.montoBruto-Number(row.montoTotal);
                      $scope.orderPurchase.montoBrutoDolar=$scope.orderPurchase.montoBrutoDolar-Number(row.montoTotalDolar);
                      row.cantidad=parseInt(row.cantidad)-1;
                      row.pendiente=parseInt(row.pendiente)-1;
                      if($scope.orderPurchase.tCambio=="sol"){
                         row.montoBruto=Number((parseInt(row.cantidad)*Number(row.preProducto)).toFixed(2));
                         row.montoTotal=Number((parseInt(row.cantidad)*Number(row.preCompra)).toFixed(2));
                         row.montoBrutoDolar=Number((parseInt(row.montoBruto)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                         row.montoTotalDolar=Number((parseInt(row.montoTotal)/Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                         $scope.detailOrderPurchases.splice(index,1,row); 
                         $scope.orderPurchase.montoBruto=Number((($scope.orderPurchase.montoBruto)+Number(row.montoTotal)).toFixed(2));
                         $scope.activIgvtotal();        
                        
                      }else{
                         row.montoBrutoDolar=Number((parseInt(row.cantidad)*Number(row.preProductoDolar)).toFixed(2));
                         row.montoTotalDolar=Number((parseInt(row.cantidad)*Number(row.preCompraDolar)).toFixed(2));
                         row.montoBruto=Number((parseInt(row.montoBrutoDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                         row.montoTotal=Number((parseInt(row.montoTotalDolar)*Number($scope.orderPurchase.tasaDolar)).toFixed(2));
                         $scope.detailOrderPurchases.splice(index,1,row);
                         $scope.orderPurchase.montoBrutoDolar=Number((($scope.orderPurchase.montoBrutoDolar)+Number(row.montoTotalDolar)).toFixed(2));
                         $scope.activIgvtotal();      
                         
                      }
                      }else{
                        alert("Usted debe tener como minimo una unidad de lo contrario elimine la este producto de la lista");
                      }
                }

                $scope.createPurchase = function(){
                if($scope.codigoTemporalP == 0){
                   if ($scope.orderPurchaseCreateForm.$valid) {
                        crudPurchase.create($scope.orderPurchase, 'orderPurchases').then(function (data) {
                          
                            if (data['estado'] == true) {
                                 $scope.success = data['nombres'];
                                 $scope.codigoTemporalP=(data['codigo']);
                                 $scope.orderPurchase.id=(data['codigo']);
                                 alert('Orden Creada correctamente');
                                //$scope.llenar();
                                 $scope.Warehouses(data['warehouse_id']);
                        } else {
                                $scope.errors = data;

                            }
                        });

                         
                    }}else{
                        $scope.Warehouses($scope.orderPurchase.warehouses_id);
                    }
                }
                $scope.validadSaldoUtilizable=function(){
                  if(Number($scope.orderPurchase.saldoDisponible)<Number($scope.orderPurchase.SaldoUtilizado))
                  {
                    $scope.orderPurchase.SaldoUtilizado='';
                    alert("Error Fatal Usted No Puede Ingresar Una cantidad Mayor Al Saldo Total");
                  }
                }
                $scope.Warehouses=function(id){
                    //alert($scope.orderPurchase.supplier_id);
            if($scope.orderPurchaseCreateForm.$valid){
                    crudPurchase.MostrarTotalDeudas($scope.orderPurchase.supplier_id).then(function (data) {
                        $scope.orderPurchase.saldoDisponible=data.total;
                    });
                    if(parseInt(id)> 0){
                    
                    crudPurchase.byId(id,'warehouses').then(function (data) {
                        $scope.warehouses=data;
                    });}
                    else{
                       crudPurchase.byId($scope.orderPurchase.warehouses_id,'warehouses').then(function (data) {
                        $scope.warehouses=data;
                    });  
                    }
                    if($scope.orderPurchase.fechaPrevista != null){
                    $scope.dd=$scope.orderPurchase.fechaPrevista.getDate();
                    $scope.mm=$scope.orderPurchase.fechaPrevista.getMonth();
                    $scope.yyyy=$scope.orderPurchase.fechaPrevista.getFullYear();
                };
                    $scope.dd1=$scope.orderPurchase.fechaPedido.getDate();
                    $scope.mm1=$scope.orderPurchase.fechaPedido.getMonth();
                    $scope.yyyy1=$scope.orderPurchase.fechaPedido.getFullYear();
                     if($scope.dd<10){$scope.dd="0"+$scope.dd;} else{$scope.dd=$scope.dd;}
                     if($scope.mm<9){$scope.mm="0"+(parseInt($scope.mm)+1);}else{$scope.mm=$scope.mm+1;}
                     $scope.orderPurchase.fechaPrevist=$scope.dd+"-"+$scope.mm+"-"+$scope.yyyy;
                     if($scope.dd1<10){$scope.dd1="0"+$scope.dd1;} else{$scope.dd1=$scope.dd1;}
                     if($scope.mm1<9){$scope.mm1="0"+(parseInt($scope.mm1)+1);}else{$scope.mm1=$scope.mm1+1;}
                     $scope.orderPurchase.fechaPedid=$scope.dd1+"-"+$scope.mm1+"-"+$scope.yyyy1;
                     $scope.activEstados=false;
                     $scope.toggle();
                   
                }
              }
                
             
                 $scope.DcreatePurchase = function(){
                    $scope.orderPurchase.detailOrderPurchases=$scope.detailOrderPurchases;
                    crudPurchase.create($scope.orderPurchase, 'detailOrderPurchases').then(function (data) {
                          $log.log($scope.orderPurchase.detailOrderPurchases);
                            if (data['estado'] == true) {
                                alert('grabado correctamente detalle');
                                $scope.updatePurchase();
                                $scope.detailOrderPurchases=[];
                            } else {
                                $scope.errors = data;

                            }
                        });
                    
                 }
                 $scope.activEstados=false;
                 $scope.activarCamposEdit=function(){
                     $scope.activEstados=true;
                 }
                
                 $scope.updateDPurchase = function(){
                   $scope.orderPurchase.detailOrderPurchases=$scope.detailOrderPurchases;
                   if ($scope.orderPurchaseCreateForm.$valid) {
                        crudPurchase.update($scope.orderPurchase,'detailOrderPurchases').then(function (data) {
                            if (data['estado'] == true) {
                                alert('Editado correctamente a la fila');
                               // $scope.updatePurchase();
                               $location.path('/orderPurchases');

                            } else {
                                $scope.errors = data;

                            }
                        });

                         
                    }
                };

                $scope.updatePurchase = function(){
                    $scope.orderPurchase.detailOrderPurchases=$scope.detailOrderPurchases;
                   
                    //$log.log($scope.orderPurchase);
                      $scope.orderPurchase.fecha=new Date();
                   if ($scope.orderPurchaseCreateForm.$valid) {
                        crudPurchase.update($scope.orderPurchase,'orderPurchases').then(function (data) {
                         
                            if (data['estado'] == true) {
                                $scope.success = data['nombres'];
                                alert('guardado correctamente');
                                $location.path('/orderPurchases');
                               // $scope.CrearCompra();
                            } else {
                                $scope.errors = data;

                            }
                        });

                         
                    }
                };


                $scope.cancelPurchase = function(){
                    $scope.orderPurchase = {};
                }
                $scope.ActiBuscSku=function(){
                  if($scope.check==true){
                    $scope.check1=false;
                  }else{
                    if($scope.check1==true){
                        $scope.check=false;
                    }
                  }  
                }
               $scope.estados=false;
               $scope.estados1=false;
                $scope.CambiarEstado=function(){
                     $scope.estados=true;
                     $scope.activarCasillas=false;
                     $scope.estados1=false;
                     $scope.MostrarEdcionStock=false;
                     $scope.mostraItemAgreagaProducto=true;
                     //$scope.llenar();
                     $scope.check1=false;
                     if($scope.orderPurchase.tasaDolar<=0 || $scope.orderPurchase.tasaDolar==undefined)
                     {
                      $scope.activarBusca=true;
                     }else{
                         $scope.activarBusca=false;
                     }
                }
                $scope.MostrarCancelar=true;
                $scope.MostrarEdcionStock=true;
                $scope.mostraItemAgreagaProducto=true;
                $scope.CambiarEstado1=function(){
                    for(var n=0;n<$scope.detailOrderPurchases.length;n++){
                        if($scope.detailOrderPurchases[n].Cantidad_Ll>0){
                           $scope.MostrarCancelar=false;
                           $scope.ActivarEdicion=true;
                           //alert("oye ya cambie estado");
                           break;
                        }
                    }
                      $scope.activarCasillas=false;
                      $scope.orderPurchase.Estado=false;
                      $scope.MostrarEdcionStock=false;
                      $scope.estados=false;
                      $scope.estados1=true;
                      $scope.mostraItemAgreagaProducto=false;
                      $scope.check1=true;
                }
                //-----------------------------------------------------------------------
                $scope.editPurchase= function(row){

                       $location.path('/orderPurchases/edit/'+row.id);

                 };
                 $scope.VerAdelantos=function(id){
                  $location.path('/orderPurchases/show/'+id);
                 }
                $scope.paymentsCalc=function(){
                    $scope.payment.Saldo=$scope.payment.montoTotal-$scope.payment.Acuenta;
                }
                 $scope.createPayments=function(){
                    
                        
                  $scope.detPayment.payment_id=$scope.idProvicional;
                  $scope.detPayment.fecha.setUTCHours($scope.detPayment.fecha.getHours());
                  $scope.payment.detPayments=$scope.detPayment;
                  
                        crudPurchase.create($scope.payment, 'detPayments').then(function (data) {
                          
                            if (data['estado'] == true) {
                                
                                alert('grabado correctamente');
                               // $scope.detPayments={};
                               $scope.totAnterior=$scope.payment.Acuenta;
                               $scope.detPayment={};
                               $scope.detPayment.fecha=new Date();
                               $scope.payment.cash_id=0; 
                               //$scope.detPayment.montoPagado='';
                                $scope.paginateDetPay();
                                //$location.path('/types');

                            } else {
                                $scope.errors = data;

                            }
                        });//}
                      
                }
                $scope.CrearCompraDirecta =function(){
                    $scope.orderPurchase.compraDirecta=1;
                    $scope.orderPurchase.fecha=new Date();
                    $scope.orderPurchase.fecha.setUTCHours($scope.orderPurchase.fecha.getHours());
                    $scope.orderPurchase.fechaEntrega=$scope.orderPurchase.fechaPedido;
                    $scope.orderPurchase.detailOrderPurchases=$scope.detailOrderPurchases
                    $scope.orderPurchase.Saldo=$scope.orderPurchase.montoTotal;
                    $scope.orderPurchases.push( $scope.orderPurchase);
                    if($scope.detailOrderPurchases.length>=1)
                    {
                     crudPurchase.create($scope.orderPurchase, 'purchases').then(function (data) {
                         
                            if (data['estado'] == true) {
                                alert('Compra directa correctamente registrada');
                                $window.location.href='/purchases';
                            } else {
                                $scope.errors = data;

                            }
                        });
                    }else{
                      alert("No puede Crear compra directa sin tener por lo menos un detalle");
                    }
                 
            }

                  
                $scope.CrearCompra =function(){
                    //alert($scope.detailOrderPurchases.length);
                if($scope.orderPurchase.cancelar){
                    if(confirm("Esta seguro de querer cancelar esta orden!!!") == true){
                                  $scope.orderPurchase.fechaEntrega=new Date();
                                  $scope.orderPurchase.fecha=new Date();
                                  //$scope.detPayment.fecha.setUTCHours($scope.detPayment.fecha.getHours());
                                  $scope.orderPurchase.estado=1;
                                  $scope.orderPurchase.orderPurchase_id=$scope.codigoTemporalP;
                                  $scope.orderPurchase.detailOrderPurchases=$scope.detailOrderPurchases;

                                  $scope.orderPurchase.Saldo=$scope.orderPurchase.montoTotal;
                                  $scope.orderPurchases.push( $scope.orderPurchase);
                                  //if($scope.orderPurchase.cancelar){
                                  $scope.orderPurchase.Estado=2;
                                  $scope.orderPurchase.estado=2;
                                 //}
                                  
                                   crudPurchase.create($scope.orderPurchase, 'purchases').then(function (data) {
                                       
                                          if (data['estado'] == true) {
                                              alert('Orden Cancelada');
                                              $location.path('/orderPurchases');
                                          } else {
                                              $scope.errors = data;
                                                        }
                                      });
                               }
                              
                }else{
                    $scope.tot=$scope.detailOrderPurchases.length;
                    for(var n=0;n<$scope.detailOrderPurchases.length;n++){
                        //alert(n);
                        //alert($scope.tot);

                        if($scope.detailOrderPurchases[n].cantidad1==undefined){
                            alert("por favor confirmar todas las filas!!");
                            break;
                        }else{
                            if($scope.tot==(n+1)){
                            // alert("ya estamos");
                                  $scope.orderPurchase.fechaEntrega=new Date();
                                  $scope.orderPurchase.fecha=new Date();
                                  $scope.orderPurchase.fecha.setUTCHours($scope.orderPurchase.fecha.getHours());
                                  $scope.orderPurchase.estado=1;
                                  $scope.orderPurchase.orderPurchase_id=$scope.codigoTemporalP;
                                  $scope.orderPurchase.detailOrderPurchases=$scope.detailOrderPurchases;

                                  $scope.orderPurchase.Saldo=$scope.orderPurchase.montoTotal;
                                  $scope.orderPurchases.push( $scope.orderPurchase);
                                  if($scope.orderPurchase.cancelar){
                                    $scope.orderPurchase.Estado=2;
                                    $scope.orderPurchase.estado=2;
                                 }
                                // alert("ya pase"+$scope.orderPurchase.Estado);
                                  if($scope.orderPurchase.Estado==1 || $scope.orderPurchase.Estado==2){

                                   crudPurchase.create($scope.orderPurchase, 'purchases').then(function (data) {
                                       
                                          if (data['estado'] == true) {
                                              alert('Compra registrada');
                                              $location.path('/orderPurchases');
                                          } else {
                                              $scope.errors = data;
                                                        }
                                      });
                               }else{
                                  $location.path('/orderPurchases');
                               }
                             }
                         }
                     }}
                   
            }
            $scope.mostrarTodos=function(){
               crudPurchase.paginate('orderPurchases',1).then(function (data) {
                        $scope.orderPurchases = data.data;
                        $scope.maxSize = 5;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                        $scope.itemsperPage = 15;

                    });
                    $scope.query='';
                    $scope.orderPurchase.fechafin=null;
                    $scope.orderPurchase.fechaini=null;
                    $scope.estado='';
                    $scope.textoBoton="Generar Reporte";
            }
            $scope.estado;
            $scope.searchEstados=function(){
                 if($scope.estado!=null){
                    if($scope.estado < 3 ){
                    crudPurchase.all('orderPurchases',$scope.estado).then(function (data) {
                        $scope.orderPurchases = data.data;
                        $scope.maxSize = 5;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                        $scope.itemsperPage = 15;
           
                    });
                    $scope.query='';
                    $scope.orderPurchase.fechafin=null;
                    $scope.orderPurchase.fechaini=null;
                    $scope.textoBoton="Generar Reporte";
                }else{
                    crudPurchase.paginate('orderPurchases',1).then(function (data) {
                        $scope.orderPurchases = data.data;
                        $scope.maxSize = 5;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                        $scope.itemsperPage = 15;

                    });
                    $scope.query='';
                    $scope.orderPurchase.fechafin=null;
                    $scope.orderPurchase.fechaini=null;
                    $scope.textoBoton="Generar Reporte";
                }
            }else{
                alert("Error seleciones un estado valido");
                }
            }
            $scope.detailOrderPurchase.unidades;
            $scope.ActualizarPartStock=function(row,index){
             // alert(row.canactual);
             if(row.canactual==null){row.canactual=row.Cantidad_Ll;row.Penrestan=row.pendiente;}
                //alert(row.cantidad_llegado);
               // if(row.cantidad1>0  && row.cantidad1<=row.Penrestan){
                if(row.Penrestan>=row.cantidad_llegado){
                  // alert("oye que paso");
                      row.fecha=new Date();
                      row.Cantidad_Ll=Number(row.canactual)+Number(row.cantidad_llegado);
                      row.pendiente=Number(row.cantidad)-Number(row.Cantidad_Ll);
                      $scope.detailOrderPurchases.splice(index,1,row);
                }else{
                    row.cantidad_llegado=0;
                    alert("ERROR: La cantidad igresada no debe superar la cantidad real");
                }
            }
           $scope.orderPurchase.generareport=false;
            $scope.ActualizarStock=function(){
             // alert($scope.orderPurchase.generareport);
                $scope.orderPurchase.fecha=new Date();
                $scope.orderPurchase.fecha.setUTCHours($scope.orderPurchase.fecha.getHours());
                $scope.orderPurchase.tipo="Compra";
                $scope.orderPurchase.eliminar=0;
                $scope.orderPurchase.detailOrderPurchases=$scope.detailOrderPurchases;
                crudPurchase.create($scope.orderPurchase, 'inputStocks').then(function (data) {
                         
                            if (data['estado'] == true) {
                                alert('Stock registrado');
                                
                                if(confirm("Desea Generar Tikets")==true){
                                 crudPurchase.reporteEstado('reporttiket',$scope.orderPurchase.id).then(function (data) {
                                    if (data!= null) {
                                      alert("tikets Generados Correctamente"+data);
                                      $scope.pdfTiketPart=data;
                                    }
                                 });
                               }else{
                                  $location.path('/orderPurchases');
                               }
                            } else {
                                $scope.errors = data;

                            }
                        });
            }
            
            $scope.Penrestan=0;
            $scope.ComprovarCantidad=function(row,index){
                if(row.cantidad1>=row.Cantidad_Ll && row.cantidad1<=row.cantidad ){
                    $scope.orderPurchase.cantidad1=row.cantidad1;
                    $scope.orderPurchases.push($scope.orderPurchase);
                }else{
                    row.cantidad1='';
                    alert("Error la cantidad debe ser superior a la cantidad de llegada e inferior a la cantidad real");
                }
                
            }
            
               $scope.searchPurchase = function(){
                if ($scope.query.length > 0) {
                    crudPurchase.search('orderPurchases',$scope.query,1).then(function (data){
                        $scope.orderPurchases = data.data;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                    });
                    $scope.orderPurchase.fechaini=null;
                        $scope.orderPurchase.fechafin=null;
                        $scope.estado='';

                }else{
                    crudPurchase.paginate('orderPurchases',1).then(function (data) {
                        $scope.orderPurchases = data.data;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                    });
                }
                    
                };
                 $scope.popover=function(row){
                        crudPurchase.bytraervar(row.detPres_id,'variants').then(function (data) {
                        $scope.variants = data;
                        crudPurchase.bytraervar(data.base,'presentations').then(function (data) {
                        $scope.presentation = data;
                        
                         });
                    });
                 }
                 ///caja no es mia XD -------------------------------------------------------------------
                $scope.cajas={};
                $scope.cashes={};

                $scope.TraerSales=function(id){
                   // alert("hola"+id);
                     crudPurchase.byId(id,'cashes').then(function (data) {
                       $scope.cashes=data;
                       // alert($scope.cashes.montoBruto);
                    
                
                    ///$scope.payment={};
                    //$scope.detPayment.detCash_id=$scope.cashes.id;
                    $scope.payment.cash_id=$scope.cashes.id; 
                    $scope.payment.fecha=$scope.date.getFullYear()+'-'+($scope.date.getMonth()+1)+'-'+$scope.date.getDate();
                    $scope.payment.hora=$scope.date.getHours()+':'+$scope.date.getMinutes()+':'+$scope.date.getSeconds();
                    $scope.payment.montoCaja=$scope.cashes.montoBruto;
                    $scope.payment.montoMovimientoTarjeta=0;
                    $scope.payment.cashMotive_id=7;
                    $scope.payment.estado=1;
                    //$scope.sale.fechaPedido=$scope.date.getFullYear()+'-'+($scope.date.getMonth()+1)+'-'+$scope.date.getDate()+' '+$scope.date.getHours()+':'+$scope.date.getMinutes()+':'+$scope.date.getSeconds();
                    //$scope.sale.detOrders=$scope.compras;
                    //$scope.sale.movimiento=$scope.payment; 
                    //$scope.sale.caja=$scope.cashfinal;
                    });
                }

    ///---------------------------------------------------------------------------------
 $scope.Saldo1=0;
 $scope.payment={};
 $scope.payment.idpayment;
 $scope.totAnterior=0;
$scope.recalPayments=function(){
               // alert($scope.cashes.montoBruto);
                
                  if($scope.Saldo1==0){$scope.Saldo1=$scope.payment.Saldo;}
                 // alert($scope.Saldo1);
                if($scope.payment.cash_id>0){
                    //alert('hola');
                    if(Number($scope.cashes.montoBruto)<=Number($scope.detPayment.montoPagado)){
                      $scope.detPayment.montoPagado=-1;
                    }
                    $scope.payment.montoMovimientoEfectivo=Number($scope.detPayment.montoPagado);
                    $scope.payment.montoFinal=Number($scope.payment.montoCaja)-$scope.payment.montoMovimientoEfectivo;
                    //$scope.cashes.gastos=Number($scope.cashes.gastos)+Number($scope.payment.montoMovimientoEfectivo); 
                    //$scope.cashes.montoBruto=$scope.payment.montoFinal;
                }     //---------------------------------------------------
                //alert($scope.payment.MontoTotal);
                if(Number($scope.Saldo1)>=Number($scope.detPayment.montoPagado) && Number($scope.payment.MontoTotal)>=Number($scope.detPayment.montoPagado) && Number($scope.detPayment.montoPagado)>0){
                    if($scope.payment.detpId>0){
                          $scope.payment.Acuenta=Number($scope.totAnterior)-Number($scope.PagoAnterior);
                          //alert("Hola estoy acuenta"+$scope.payment.Acuenta);
                          $scope.payment.Acuenta=Number($scope.payment.Acuenta)+Number($scope.detPayment.montoPagado);
                          $scope.payment.Saldo=(Number($scope.payment.MontoTotal)-Number($scope.payment.Acuenta)).toFixed(2);
                          $scope.payment.PorPagado=((Number($scope.payment.Acuenta)*100)/(Number($scope.payment.MontoTotal))).toFixed(2);
                          $scope.random();
                    }else{
                        //alert($scope.totAnterior);
                          $scope.payment.Acuenta=Number($scope.totAnterior)+Number($scope.detPayment.montoPagado);
                          $scope.payment.Saldo=(Number($scope.payment.MontoTotal)-Number($scope.payment.Acuenta)).toFixed(2);
                          $scope.payment.PorPagado=((Number($scope.payment.Acuenta)*100)/(Number($scope.payment.MontoTotal))).toFixed(2);
                          $scope.random();
                   }
                   }else{
                    $scope.detPayment.montoPagado='';
                    alert('!!Error Usted Solo Puede Ingresar una cantidad menor o igual al total!!');
                }
                }
                
              
                       
                
                $scope.desscripctiondddd="tiket";
                 $scope.createPayment = function(){
                    //alert( $scope.payment.fecha);
                    $scope.detPayment.fecha.setUTCHours($scope.detPayment.fecha.getHours());
                if($scope.detPayment.methodPayment_id!=null || $scope.detPayment.cashe_id!=null || $scope.payment.cajamensual!=null){
                    
                    $scope.payment.detPayments=$scope.detPayment;
                    $log.log($scope.payment);
                    if ($scope.paymentCreateForm.$valid){
                        crudPurchase.create($scope.payment, 'payments').then(function (data) {
                          
                            if (data['estado'] == true) {
                                $scope.success = data['nombres'];
                                $scope.detPayment.methodPayment_id='';
                                $scope.detPayment.montoPagado='';
                                $scope.Saldo1=0;
                                //$scope.paginateDetPay();
                                if(confirm("Desea Generar Comprobante de Pago!!!") == true){
                                $scope.paginateDetPay();
                                $scope.desscripctiondddd="Generando Tiket...";
                                crudPurchase.Reportes(data['id'],'ReportComprobante').then(function (data) {
                                    $scope.pdf7=data;
                                    
                                    if(data!=null){
                                      $scope.desscripctiondddd="Ver Tiket";

                                    }
                                });
                               }else{
                                     alert('grabado correctamente');
                                     $scope.paginateDetPay();
                               }
                                //$route.reload();

                            } else {
                                $scope.errors = data;

                            }
                        });}
                        }
                      else{
                        $scope.detPayment.montoPagado='';
                        alert("error debes seleccionar un metodo de pago");
                      }
                }
                $scope.cancelarEditPayment=function(){
                    $route.reload();
                }
                $scope.paginateDetPay=function(){
                    $scope.detPayment.fecha=new Date();
                      crudPurchase.byId($scope.payment.id,'detPayments').then(function (data) {
                        $scope.detPayments = data;
                        
                    });
                      $scope.mostrarBtnGEd=false;
                }
                $scope.destroyPay = function(row){
                    //alert(row.detCash_id);
                    if(row.detCash_id!=null){
                    //alert(row.detCash_id);
                      crudPurchase.comprovarCaja(row.detCash_id).then(function(data){
                        //alert(data.estado);
                        if(data.estado==1){
                           if(confirm("Esta segura de querer eliminar este pago!!!") == true){
                           $scope.payment.detpId=row.id;
                           $scope.payment.Saldo_F=row.Saldo_F;
                    //$scope.detPayment.montoPagado=row.montoPagado;
                   // alert(row.montoPagado);
                  // alert(row.id);
                           $scope.payment.detpId=row.id;
                           $scope.payment.cashMonthly_id=row.cashMonthly_id;
                   // $scope.Payment.cash_id=parseInt(row.cashID);
                           $scope.payment.detCash_id=row.detCash_id;
                      crudPurchase.destroy($scope.payment,'payments').then(function(data)
                      {
                        if(data['es     tado'] == true){
                            $scope.success = data['nombre'];
                            
                            alert('Eliminado Correctamente');
                           // alert($scope.totAnterior);
                            $scope.payment.Acuenta=Number($scope.totAnterior)-Number($scope.detPayment.montoPagado);
                            $scope.payment.Saldo=(Number($scope.payment.MontoTotal)-Number($scope.payment.Acuenta)).toFixed(2);
                            $scope.payment.PorPagado=((Number($scope.payment.Acuenta)*100)/(Number($scope.payment.MontoTotal))).toFixed(2);
                            $scope.totAnterior=$scope.payment.Acuenta;
                            $scope.detPayment = {};
                            //$route.reload();
                            //$scope.paginateDetPay();
                            $route.reload();
                        }else{
                            $scope.errors = data;
                        }
                    });
                  }
                        }else{
                            alert("zorry Usted no puede eliminar un pago de una caja cerrada");
                        }
                    });
                }else{
                    if(confirm("Esta segura de querer eliminar este pago!!!") == true){
                         $scope.payment.detpId=row.id;
                         $scope.payment.Saldo_F=row.Saldo_F;
                    //$scope.detPayment.montoPagado=row.montoPagado;
                   // alert(row.montoPagado);
                  // alert(row.id);
                         $scope.payment.detpId=row.id;
                         $scope.payment.cashMonthly_id=row.cashMonthly_id;
                   // $scope.Payment.cash_id=parseInt(row.cashID);
                         $scope.payment.detCash_id=row.detCash_id;
                    crudPurchase.destroy($scope.payment,'payments').then(function(data)
                    {
                        if(data['estado'] == true){
                            $scope.success = data['nombre'];
                            
                            alert('Eliminado Correctamente');
                           // alert($scope.totAnterior);
                            $scope.payment.Acuenta=Number($scope.totAnterior)-Number($scope.detPayment.montoPagado);
                            $scope.payment.Saldo=(Number($scope.payment.MontoTotal)-Number($scope.payment.Acuenta)).toFixed(2);
                            $scope.payment.PorPagado=((Number($scope.payment.Acuenta)*100)/(Number($scope.payment.MontoTotal))).toFixed(2);
                            $scope.totAnterior=$scope.payment.Acuenta;
                            $scope.detPayment = {};
                            //$route.reload();
                            //$scope.paginateDetPay();
                            $route.reload();
                        }else{
                            $scope.errors = data;
                        }
                    });
                  }
              }
                }
                $scope.PagoAnterior;
                $scope.mostrarBtnGEd=false;
           
                $scope.desseleccionarMethodP=function(){
                    $scope.detPayment.montoPagado='';
                       if($scope.detPayment.methodPayment_id==5){
                          $scope.desactivarCuentas=true;
                       }else{
                          $scope.desactivarCuentas=false;
                      }
                  }
                $scope.cashmontly=function(){
                    //alert($scope.payment.cajamensual);
                    if($scope.payment.cajamensual==true){
                          $scope.payment.months_id=$scope.date.getMonth()+1;
                          $scope.payment.año=$scope.date.getFullYear();
                    }else{
                        $scope.detPayment.montoPagado='';
                    }
                     //$scope.payment.months_id=$scope.date.getMonth()+1;
                     //$scope.payment.año=$scope.date.getFullYear();
                     }
                 $scope.check=false;
                $scope.editDetpayment=function(row){
                    //alert(row.detCash_id);
                 $scope.payment.Acuenta=Number((Number($scope.payment.Acuenta)-Number(row.montoPagado)).toFixed(2));
                 $scope.payment.Saldo=Number((Number($scope.payment.Saldo)+Number(row.montoPagado)).toFixed(2));
                 $scope.payments.splice(1,1,$scope.payment);
                   if(row.detCash_id!=null){
                    //alert(row.cashID);
                    crudPurchase.comprovarCaja(row.detCash_id).then(function(data){
                        //alert(data.estado);
                        if(data.estado==1){
                                 $scope.check=true;
                                 if(row.cashMonthly_id>0){
                                     $scope.payment.cajamensual=true;
                                     $scope.payment.cashMonthly_id=row.cashMonthly_id;
                                 }else{
                                     $scope.payment.cajamensual=false;
                                 }
                                 $scope.payment.Saldo_F=row.Saldo_F;
                                 $scope.payment.detpId=row.id;
                                 $scope.detPayment.cashe_id=row.cashID;
                                 $scope.payment.cash_id=$scope.detPayment.cashe_id;
                                 $scope.payment.detCash_id=row.detCash_id;
                                 $scope.detPayment.oldPay=row.montoPagado;
                                 $scope.PagoAnterior=row.montoPagado;
                                 $scope.detPayment.fecha=new Date(row.fecha);
                                 $scope.detPayment.methodPayment_id=row.methodPayment_id;
                                 $scope.detPayment.montoPagado=(Number(row.montoPagado));
                                 $scope.mostrarBtnGEd=true;
                        }else{
                            $scope.orderPurchase.fechafin=null;
                            alert("Error la caja con que se Adelanto ya esta cerrada por ende no se puede registrar los cambios");
                        }
                    });
                   }else{
                   $scope.check=true;
                    if(row.cashMonthly_id>0){
                        $scope.payment.cajamensual=true;
                        $scope.payment.cashMonthly_id=row.cashMonthly_id;
                    }else{
                        $scope.payment.cajamensual=false;
                    }
                    $scope.payment.Saldo_F=row.Saldo_F;
                    $scope.payment.detpId=row.id;
                    $scope.detPayment.cashe_id=row.cashID;
                    $scope.payment.cash_id=$scope.detPayment.cashe_id;
                    $scope.payment.detCash_id=row.detCash_id;
                    $scope.detPayment.oldPay=row.montoPagado;
                    $scope.PagoAnterior=row.montoPagado;
                    $scope.detPayment.fecha=new Date(row.fecha);
                    $scope.detPayment.methodPayment_id=row.methodPayment_id;
                    $scope.detPayment.montoPagado=(Number(row.montoPagado));
                    $scope.mostrarBtnGEd=true;
                }
                }
                $scope.textoBoton="Generar Reporte";
                $scope.generarReporteFiltros=function(){
                  
                  if($scope.query!=''){
                   // alert("no entres");
                            $scope.textoBoton="Generando..";
                            crudPurchase.reporteEstado('reporteOrdenCompreLike',$scope.query).then(function (data) {
                            if (data!= undefined) {
                                  $scope.pdforden=data;
                                  $scope.textoBoton="Generado..";
                                  alert("Reporte Generado");
                               } else {
                                $scope.errors = data;
                             }
                        });
                  }else{
                    //alert($scope.checkFechaPr);
                      if($scope.checkFechaPr==true){
                            if($scope.check==true){
                               if($scope.estado!=''){
                                 $scope.textoBoton="Generando..";
                                     crudPurchase.reporteEstado('orderPurchases',$scope.estado).then(function (data) {
                                     if (data!= undefined) {
                                       $scope.pdforden=data;
                                       $scope.textoBoton="Generado";
                                       alert("Reporte Generado");
                                     } else {
                                $scope.errors = data;
                                   }
                               });
                            }else{
                                   if($scope.orderPurchase.fechaini!=null && $scope.orderPurchase.fechafin!=null && $scope.orderPurchase.fechaini<=$scope.orderPurchase.fechafin)
                                   {
                                    $scope.textoBoton="Generando..";
                                     crudPurchase.reporteRangoFechas('reporteRangoFechaPrevista',$scope.temporalfec,$scope.temporalfech2).then(function (data) {
                             if (data!= undefined) {
                                       $scope.pdforden=data;
                                       $scope.textoBoton="Generado";
                                       alert("Reporte Generado");
                               } else {
                                       $scope.errors = data;
       
                                   }
                               });  

                                   }else{alert("error fechas incorrectas");}
                               }
                            }else{
                              //alert("hola00");
                               if($scope.estado!='' && $scope.orderPurchase.fechaini!=null && $scope.orderPurchase.fechafin!=null && $scope.orderPurchase.fechaini<=$scope.orderPurchase.fechafin)
                              {
                                    $scope.textoBoton="Generando..";
                                    crudPurchase.reporteRangoFechasEstado('reporteRangoFechaPrevistaEstado',$scope.temporalfec,$scope.temporalfech2,$scope.estado).then(function (data) {
                                       if (data!= undefined) {
                                          $scope.pdforden=data;
                                          $scope.textoBoton="Generado";
                                          alert("Reporte Generado");
                                         } else {
                                          $scope.errors = data;

                                      }
                                  });
                           }else{
                              alert("error selecciones un estado y un rago de fechas valido");
                           }
                     }
                     }else{
                            if($scope.check==true){
                               if($scope.estado!=''){
                                $scope.textoBoton="Generando..";
                                     crudPurchase.reporteEstado('orderPurchases',$scope.estado).then(function (data) {
                                     if (data!= undefined) {
                                      $scope.textoBoton="Generado";
                                       $scope.pdforden=data;
                                       alert("Reporte Generado");
                                     } else {
                                $scope.errors = data;
                                   }
                               });
                            }else{
                                   if($scope.orderPurchase.fechaini!=null && $scope.orderPurchase.fechafin!=null && $scope.orderPurchase.fechaini<=$scope.orderPurchase.fechafin)
                                   {
                                    $scope.textoBoton="Generando..";
                                     crudPurchase.reporteRangoFechas('orderPurchases',$scope.temporalfec,$scope.temporalfech2).then(function (data) {
                                      if (data!= undefined) {
                                        $scope.textoBoton="Generado";
                                           $scope.pdforden=data;
                                           alert("Reporte Generado");
                                        } else {
                                       $scope.errors = data;
       
                                   }
                               });  

                                   }else{alert("error fechas incorrectas");}
                               }
                            }else{
                               if($scope.estado!='' && $scope.orderPurchase.fechaini!=null && $scope.orderPurchase.fechafin!=null && $scope.orderPurchase.fechaini<=$scope.orderPurchase.fechafin)
                              {
                                //alert("aQUIESTOY");
                                $scope.textoBoton="Generando..";
                                    crudPurchase.reporteRangoFechasEstado('orderPurchases',$scope.temporalfec,$scope.temporalfech2,$scope.estado).then(function (data) {
                                       if (data!= undefined) {
                                        $scope.textoBoton="Generado";
                                          $scope.pdforden=data;
                                          alert("Reporte Generado");
                                         } else {
                                          $scope.errors = data;

                                      }
                                  });
                           }else{
                              alert("error selecciones un estado y un rago de fechas valido");
                           }
                     }
                }}}
                $scope.paginarfechaTipo=function(){
                   // alert($scope.estado);
                      if($scope.estado!='' && $scope.orderPurchase.fechaini!=null && $scope.orderPurchase.fechafin!=null && $scope.orderPurchase.fechaini<=$scope.orderPurchase.fechafin){
                    // alert($scope.estado);
                   if($scope.orderPurchase.fechaini.getDate()<10){
                         $scope.temporalfec="0"+$scope.orderPurchase.fechaini.getDate();
                         if($scope.orderPurchase.fechaini.getMonth()+1<10){
                            $scope.temporalfec=$scope.orderPurchase.fechaini.getFullYear()+"-0"+
                            ($scope.orderPurchase.fechaini.getMonth()+1)+"-"+$scope.temporalfec;
                            
                         }else{
                            $scope.temporalfec=$scope.orderPurchase.fechaini.getFullYear()+"-"+
                            ($scope.orderPurchase.fechaini.getMonth()+1)+"-"+$scope.temporalfec;
                         }
                   }else{
                        $scope.temporalfec=$scope.orderPurchase.fechaini.getDate();
                         if($scope.orderPurchase.fechaini.getMonth()+1<10){
                            $scope.temporalfec=$scope.orderPurchase.fechaini.getFullYear()+"-0"+
                            ($scope.orderPurchase.fechaini.getMonth()+1)+"-"+$scope.temporalfec;
                         }else{
                            $scope.temporalfec=$scope.orderPurchase.fechaini.getFullYear()+"-"+
                            ($scope.orderPurchase.fechaini.getMonth()+1)+"-"+$scope.temporalfec;
                         }
                   }
                   if($scope.orderPurchase.fechafin.getDate()<10){
                         $scope.temporalfech2="0"+$scope.orderPurchase.fechafin.getDate();
                         if($scope.orderPurchase.fechafin.getMonth()+1<10){
                            $scope.temporalfech2=$scope.orderPurchase.fechafin.getFullYear()+"-0"+
                            ($scope.orderPurchase.fechafin.getMonth()+1)+"-"+$scope.temporalfech2;
                            
                         }else{
                            $scope.temporalfech2=$scope.orderPurchase.fechafin.getFullYear()+"-"+
                            ($scope.orderPurchase.fechafin.getMonth()+1)+"-"+$scope.temporalfech2;
                         }
                   }else{
                        $scope.temporalfech2=$scope.orderPurchase.fechafin.getDate();
                         if($scope.orderPurchase.fechafin.getMonth()+1<10){
                            $scope.temporalfech2=$scope.orderPurchase.fechafin.getFullYear()+"-0"+
                            ($scope.orderPurchase.fechafin.getMonth()+1)+"-"+$scope.temporalfech2;
                         }else{
                            $scope.temporalfech2=$scope.orderPurchase.fechafin.getFullYear()+"-"+
                            ($scope.orderPurchase.fechafin.getMonth()+1)+"-"+$scope.temporalfech2;
                         }
                   }
                   if($scope.checkFechaPr==true){
                    crudPurchase.paginarfechaTipo('searchFechasLlegadaEstado',$scope.temporalfec,$scope.temporalfech2,$scope.estado).then(function (data) {
                               $scope.orderPurchases = data.data;
                               $scope.maxSize = 5;
                               $scope.totalItems = data.total;
                               $scope.currentPage = data.current_page;
                               $scope.itemsperPage = 15;
                         });
                          //$scope.estado='';
                          $scope.query='';
                          $scope.textoBoton="Generar Reporte";
                   }else{
                    //alert("Yes");
                      crudPurchase.paginarfechaTipo('orderPurchases',$scope.temporalfec,$scope.temporalfech2,$scope.estado).then(function (data) {
                               $scope.orderPurchases = data.data;
                               $scope.maxSize = 5;
                               $scope.totalItems = data.total;
                               $scope.currentPage = data.current_page;
                               $scope.itemsperPage = 15;
                         });
                          //$scope.estado='';
                          $scope.query='';
                          $scope.textoBoton="Generar Reporte";
                   }
                    
                  }else{
                    $scope.orderPurchase.fechafin=null;
                    alert("error debe seleccionar fecha inicial fecha final y estado");
                  }
                }
                 $scope.limpiarFiltros=function(){
                  crudPurchase.paginate('orderPurchases',1).then(function (data) {
                        $scope.orderPurchases = data.data;
                        $scope.maxSize = 5;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                        $scope.itemsperPage = 15;

                    });
                    $scope.query='';
                    $scope.orderPurchase.fechafin=null;
                    $scope.orderPurchase.fechaini=null;
                    $scope.estado='';
                    $scope.textoBoton="Generar Reporte";
                }
                $scope.filtroFechas=function(){
                   //alert("oye"+$scope.orderPurchase.fechaini);
                      $scope.temporalfec='';
                    $scope.temporalfech2='';
            //if($scope.orderPurchase.fechaini<$scope.orderPurchase.fechafin){
             if($scope.orderPurchase.fechaini!=null && $scope.orderPurchase.fechafin!=null && $scope.orderPurchase.fechaini<=$scope.orderPurchase.fechafin){
                     
                   if($scope.orderPurchase.fechaini.getDate()<10){
                         $scope.temporalfec="0"+$scope.orderPurchase.fechaini.getDate();
                         if($scope.orderPurchase.fechaini.getMonth()+1<10){
                            $scope.temporalfec=$scope.orderPurchase.fechaini.getFullYear()+"-0"+
                            ($scope.orderPurchase.fechaini.getMonth()+1)+"-"+$scope.temporalfec;
                            
                         }else{
                            $scope.temporalfec=$scope.orderPurchase.fechaini.getFullYear()+"-"+
                            ($scope.orderPurchase.fechaini.getMonth()+1)+"-"+$scope.temporalfec;
                         }
                   }else{
                        $scope.temporalfec=$scope.orderPurchase.fechaini.getDate();
                         if($scope.orderPurchase.fechaini.getMonth()+1<10){
                            $scope.temporalfec=$scope.orderPurchase.fechaini.getFullYear()+"-0"+
                            ($scope.orderPurchase.fechaini.getMonth()+1)+"-"+$scope.temporalfec;
                         }else{
                            $scope.temporalfec=$scope.orderPurchase.fechaini.getFullYear()+"-"+
                            ($scope.orderPurchase.fechaini.getMonth()+1)+"-"+$scope.temporalfec;
                         }
                   }
                   if($scope.orderPurchase.fechafin.getDate()<10){
                         $scope.temporalfech2="0"+$scope.orderPurchase.fechafin.getDate();
                         if($scope.orderPurchase.fechafin.getMonth()+1<10){
                            $scope.temporalfech2=$scope.orderPurchase.fechafin.getFullYear()+"-0"+
                            ($scope.orderPurchase.fechafin.getMonth()+1)+"-"+$scope.temporalfech2;
                            
                         }else{
                            $scope.temporalfech2=$scope.orderPurchase.fechafin.getFullYear()+"-"+
                            ($scope.orderPurchase.fechafin.getMonth()+1)+"-"+$scope.temporalfech2;
                         }
                   }else{
                        $scope.temporalfech2=$scope.orderPurchase.fechafin.getDate();
                         if($scope.orderPurchase.fechafin.getMonth()+1<10){
                            $scope.temporalfech2=$scope.orderPurchase.fechafin.getFullYear()+"-0"+
                            ($scope.orderPurchase.fechafin.getMonth()+1)+"-"+$scope.temporalfech2;
                         }else{
                            $scope.temporalfech2=$scope.orderPurchase.fechafin.getFullYear()+"-"+
                            ($scope.orderPurchase.fechafin.getMonth()+1)+"-"+$scope.temporalfech2;
                         }
                   }
                   if($scope.checkFechaPr==true){
                    //alert($scope.check);
                        if($scope.check==false){
                          
                        }else{
                         // alert("oye este");
                          crudPurchase.reporteRangoFechas('searchFechasLlegada',$scope.temporalfec,$scope.temporalfech2).then(function (data) {
                               $scope.orderPurchases = data.data;
                               $scope.maxSize = 5;
                               $scope.totalItems = data.total;
                               $scope.currentPage = data.current_page;
                               $scope.itemsperPage = 15;
                         })
                          $scope.estado='';
                          $scope.query='';
                          $scope.textoBoton="Generar Reporte";
                        }
                   }else{
                    crudPurchase.paginarporfechas('orderPurchases',$scope.temporalfec,$scope.temporalfech2).then(function (data) {
                               $scope.orderPurchases = data.data;
                               $scope.maxSize = 5;
                               $scope.totalItems = data.total;
                               $scope.currentPage = data.current_page;
                               $scope.itemsperPage = 15;
                         });
                    $scope.estado='';
                    $scope.query='';
                    $scope.textoBoton="Generar Reporte";
                  }
                    }else{
                        //alert("Error selecciones fecha correcta");
                    }
                }
                $scope.editPayment = function(){
                    $scope.payment.detPayments=$scope.detPayment;
                    
                    crudPurchase.update($scope.payment,'payments').then(function(data)
                    {
                        if(data['estado'] == true){
                            $scope.success = data['nombre'];
                            $scope.payment.detpId=0;
                            $scope.detPayment = {};
                            alert('Editado Correctamente');
                            //$route.reload();
                            $scope.paginateDetPay();

                        }else{
                            $scope.errors = data;
                        }
                    });
                }
            $scope.random = function() {
                var type;

                if ($scope.payment.PorPagado < 25) {
                  type = 'info';
                } else if ($scope.payment.PorPagado < 50) {
                  type = 'success';
                } else if ($scope.payment.PorPagado < 75) {
                  type = 'warning';
                } else {
                  type = 'danger';
                }

                $scope.type = type;
              };
 
            }]);
})();

(function(){
    angular.module('consultas.controllers',[])
        .controller('ConsultaController',['$scope', '$routeParams','$http','uiGridConstants','$location','crudService','socketService' ,'$filter','$route','$log',
            function($scope, $routeParams,$http,uiGridConstants,$location,crudService,socket,$filter,$route,$log){
      $scope.date=new Date();
      $scope.brands = [];
      $scope.types = [];
      $scope.warehouses = [];
      $scope.idwarehouse ='1';
      crudService.all('listaAlmacenesTienda').then(function (data) {
                            $scope.warehouses = data;
                        });
     $scope.fechaConsulta = ''+$scope.date.getFullYear()+'-'+($scope.date.getMonth()+1)+'-'+$scope.date.getDate();
                    
      crudService.buquedarapida('buquedarapida',1,$scope.idwarehouse,$scope.fechaConsulta,0,0,0).then(function (data) {                        
                        $scope.gridOptions.data = data;
                  });
      crudService.all('paraFiltro').then(function (data) {
                        $scope.brands = data;
                  });
      crudService.all('paraFiltroType').then(function (data) {
                        $scope.types = data;
                  });
    
   $scope.changeStock=function(){
   	   crudService.buquedarapida('buquedarapida',1,$scope.idwarehouse,$scope.fechaConsulta,0,0,0).then(function (data) {                        
                        $scope.gridOptions.data = data;
                  });
   }

  $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
    if( col.filters[0].term ){
      return 'header-filtered';
    } else {
      return '';
    }
  };

  $scope.gridOptions = {
    enableFiltering: false,
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    },
    columnDefs: [
      // default
      { field: 'Producto', headerCellClass: $scope.highlightFilteredHeader },
      // pre-populated search field
      
        
        { field: 'Sabor', headerCellClass: $scope.highlightFilteredHeader },
        { field: 'Cantidad', headerCellClass: $scope.highlightFilteredHeader },
        { field: 'Services', headerCellClass: $scope.highlightFilteredHeader },
      // no filter input
      { field: 'Marca', filter: {
          term: '',
          type: uiGridConstants.filter.SELECT,
          selectOptions: $scope.brands
        },field: 'Marca', headerCellClass: $scope.highlightFilteredHeader },
      { field: 'Categoria', filter: {
          term: '',
          type: uiGridConstants.filter.SELECT,
          selectOptions: $scope.types
        },field: 'Categoria', headerCellClass: $scope.highlightFilteredHeader },
       { field: 'stock',enableFiltering: false},
       { field: 'Tot_Stock',enableFiltering: false},
       { field: 'Desct_Fecha',enableFiltering: false},
       { field: 'PVP',enableFiltering: false},
       { field: 'Descuento',enableFiltering: false},       
       { field: 'PrecioVenta',enableFiltering: false},
      
    ]
  };

  /*$http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
    .success(function(data) {
      $scope.gridOptions.data = data;
      $scope.gridOptions.data[0].age = -5;

      data.forEach( function addDates( row, index ){
        row.mixedDate = new Date();
        row.mixedDate.setDate(today.getDate() + ( index % 14 ) );
        row.gender = row.gender==='male' ? '1' : '2';
      });
    });*/

  $scope.toggleFiltering = function(){
  	  
                  
    $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
    $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
    $scope.gridOptions = {
    enableFiltering: false,
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    },
    columnDefs: [
      // default
      { field: 'Producto', headerCellClass: $scope.highlightFilteredHeader },
      // pre-populated search field
      
        
        { field: 'Sabor', headerCellClass: $scope.highlightFilteredHeader },
        { field: 'Cantidad', headerCellClass: $scope.highlightFilteredHeader },
        { field: 'Services', headerCellClass: $scope.highlightFilteredHeader },
      // no filter input
      { field: 'Marca', filter: {
          term: '',
          type: uiGridConstants.filter.SELECT,
          selectOptions: $scope.brands
        },field: 'Marca', headerCellClass: $scope.highlightFilteredHeader },
      { field: 'Categoria', filter: {
          term: '',
          type: uiGridConstants.filter.SELECT,
          selectOptions: $scope.types
        },field: 'Categoria', headerCellClass: $scope.highlightFilteredHeader },
       { field: 'stock',enableFiltering: false},
       { field: 'Tot_Stock',enableFiltering: false},
       { field: 'Desct_Fecha', filter: {
          term: '',
          type: uiGridConstants.filter.SELECT,
          selectOptions: [{ value: 'NO', label: 'NO'},{value: 'SI' , label:'SI'}]
        },field: 'Desct_Fecha', headerCellClass: $scope.highlightFilteredHeader },
       { field: 'PVP',enableFiltering: false},
       { field: 'Descuento',enableFiltering: false},       
       { field: 'PrecioVenta',enableFiltering: false},

    ]
  }
     
  };
                
        }]);
})();

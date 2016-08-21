<!-- Content Header (Page header) -->
<section class="content-header">
    <h1>
        Productos
        <small>Panel de Control</small>
    </h1>
    <ol class="breadcrumb">
        <li><a href="/"><i class="fa fa-dashboard"></i> Home</a></li>
        <li class="/products">Productos</li>
                    <li class="active">Ver</li>
    </ol>


</section>

<!-- Main content -->
<section class="content">

    <div class="row">
        <div class="col-md-12">
        <div class="box">
          <div class="box-header with-border">
            <h3 class="box-title">@{{product.nombre}}</h3>
            <div class="box-tools pull-right">
              <!-- Buttons, labels, and many other things can be placed here! -->
              <!-- Here is a label for example -->
              <button class=" label-default" ng-if="product.hasVariants == '1'" ng-click="addVariant(product.id)">Añadir Variante</button>

              <button class=" label-default">Imprimir Código de Barras</button>
              <button class=" label-default" ng-click="editProductShow(product)">Editar Producto</button>
              <button class=" label-danger" ng-if="product.quantVar == '0'">Eliminar</button>
            </div><!-- /.box-tools -->
          </div><!-- /.box-header -->
          <div class="box-body">
              <div class="row">
                  <div class="col-md-8">
                      <b>Descripción:</b> @{{ product.descripcion }} <br/> <br/>
            ------------------------------------------------------------------------------------------------------------------------------------<br/>
                      <b>SKU</b>: @{{variant.sku}}<br/>
            <b>Marca:</b> @{{ product.brand.nombre }} <br/> <br/>
            <b>Línea:</b> @{{ product.type.nombre }} <br/> <br/>
            <b>Código Único de Producto:</b> @{{ product.codigo }}<br/> <br/>
                      <b>Código de Proveedor:</b> @{{ product.suppCode }} <br/><br/>

                  </div>
                  <div class="col-md-4">

                      <img class="pull-right img-thumbnail" ng-src="@{{product.image}}" alt=""/>
                  </div>
              </div>

              <span ng-if="product.hasVariants == '1'">
            <div class="box">
                            <div class="box-header">
                              <h3 class="box-title">Stock de Variantes  </h3>

                                <div class="box-tools">
                                    <div class="input-group" style="width: 150px;">
                                        <input type="text" ng-model="searchText" name="table_search" class="form-control input-sm pull-right" placeholder="Buscar">
                                        <div class="input-group-btn">
                                            <button class="btn btn-sm btn-default"><i class="fa fa-search"></i></button>
                                        </div>
                                    </div>
                                </div>
                                 </div><!-- /.box-header -->
                <div class="callout callout-info"  ng-show="variant.id > 0">
                    <h4>¿ Estás seguro que deseas eliminar a "@{{variant.codigo}}" ?</h4>
                    <p>
                        <button type="button" class="btn btn-danger" ng-click="destroyVariant()">Si</button>
                        <button type="button" class="btn btn-default" ng-click="cancelVariant()">No</button>
                    </p>
                </div>
                            <div class="box-body no-padding">
                              <table class="table table-striped">
                                <tbody><tr>
                                  <th style="width: 10px">#</th>
                                    <th>Código</th>
                                  <th>SKU</th>
                                  <th>Variante</th>
                                    <th>Creado por</th>
                                  <th style="">Precio</th>
                                  <th style="">En stock</th>
                                    <th>Editar</th>
                                    <th >Opción</th>
                                    <th >Eliminar</th>
                                </tr>
                                <tr ng-repeat="row in variants | filter:searchText">

                                    <td><img src="@{{row.image}}" style="width:45px;"></td>
                                    <td>@{{ row.codigo }}</td>
                                    <td>@{{ row.sku }}</td>
                                    <td><a ng-href="/variants/edit/@{{row.id}}">@{{row.product.nombre}}
                                            <span ng-repeat="row2 in row.det_atr ">
                                        / @{{row2.descripcion}}
                                    </span>

                                        </a></td>
                                    <td>@{{ row.user.name }}</td>
                                    <td>@{{row.det_pre[0].price}}</td>
                                    <td>@{{row.stock[0].stockActual}}</td>
                                    <td><a ng-click="editVariant(row)" class="btn btn-warning btn-xs">Editar</a></td>
                                    <td>
                                        <span ng-if="row.estado == 1">
                            <a ng-click="disableVariant(row)" class="btn bg-purple-active color-palette btn-xs">Desactivar</a>
                        </span>
                            <span ng-if="row.estado == 0">
                            <a ng-click="disableVariant(row)" class="btn bg-purple-active color-palette btn-xs">Activar</a>
                        </span>

                                    </td>
                                    <td><a ng-click="deleteVariant(row)" class="btn btn-danger btn-xs">Eliminar</a></td>
                                </tr>



                              </tbody></table>
                            </div><!-- /.box-body -->
                          </div>

                  </span>
              <span ng-if="product.hasVariants == '0'">
                <br>
                  <div class="box">
                      <div class="box-header">
                          <h3 class="box-title">Presentaciones</h3>

                      </div><!-- /.box-header -->
                      <div class="box-body table-responsive no-padding">
                          <table class="table table-hover">
                      <tbody><tr>
                          <th>#</th>
                          <th>Presentación</th>
                          <th>Precio de Proveedor</th>
                          <th>% de Utilidad</th>
                          <th>Precio de Venta</th>

                      </tr>
                      <tr ng-repeat="row in variant.det_pre">
                          <td>@{{$index + 1}}</td>
                          <td>@{{row.nombre}}</td>
                          <td>@{{row.suppPri}}</td>
                          <td>@{{row.markup}}</td>

                          <td>@{{row.price}}</td>

                      </tr>



                      </tbody></table>
                      </div><!-- /.box-body -->
                  </div>


                  <div class="box">
                      <div class="box-header">
                          <h3 class="box-title">Stock</h3>

                      </div><!-- /.box-header -->
                      <div class="box-body table-responsive no-padding">
                          <table class="table table-hover">
                              <tbody><tr>
                                  <th>#</th>
                                  <th>Almacén</th>
                                  <th>Ćodigo</th>
                                  <th>SKU</th>
                                  <th>Stock Actual</th>
                                  <th>Stock por llegar</th>
                              </tr>
                              <tr ng-repeat="row in variant.stock">
                                  <td>@{{$index + 1}}</td>
                                  <td>@{{row.nombre}}</td>
                                  <td>@{{product.codigo}}</td>
                                  <td>@{{variant.sku}}</td>
                                  <td>@{{row.stockActual}}</td>
                                  <td>@{{row.stockPorLlegar}}</td>
                              </tr>



                              </tbody></table>
                      </div><!-- /.box-body -->
                  </div>

                  </span>

          </div><!-- /.box-body -->
          <div class="box-footer">
            Creado: @{{ product.created_at }}
            <div class="box-tools pull-right">

                          <a href="/products" class="btn btn-default btn-xs">Regresar</a>
            </div>
          </div><!-- box-footer -->
        </div><!-- /.box -->
        </div>
    </div>
</section>

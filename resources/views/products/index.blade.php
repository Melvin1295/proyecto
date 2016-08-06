@extends('layout')
@section('module')
Productos
@stop
@section('base_url')
<base href="{{URL::to('/')}}/products"/>
@stop
@section('css-customize')
@stop
@section('content')
<!--<section class="content-header">
    <h1>
        Productos
        <small>Panel de Control</small>
    </h1>
</section>-->

<!-- Main content -->
<section ng-app="products">
    <div ng-view>

    </div>
</section>

@section('js-customize')

    <script src="/js/app/products/app.js"></script>
    <script src="/js/app/products/controllers.js"></script>
    
@stop

@stop
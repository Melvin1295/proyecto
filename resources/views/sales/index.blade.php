@extends('layout')
@section('module')
Ventas
@stop
@section('base_url')
<base href="{{URL::to('/')}}/sales"/>
@stop
@section('css-customize')
<link rel="stylesheet" type="text/css" href="/css/print.css" media="print">
<link rel="stylesheet" type="text/css" href="/vendor/bootstrap-toggle/css/bootstrap-toggle.min.css" media="print">
<link href="https://gitcdn.github.io/bootstrap-toggle/2.2.0/css/bootstrap-toggle.min.css" rel="stylesheet">
@stop
@section('content')
<!--<section class="content-header">
    <h1>
        CLIENTES
        <small>Panel de Control</small>
    </h1>
</section>-->


<!-- Main content -->
<section ng-app="sales">
    <div ng-view>

    </div>
</section>

@section('js-customize')
<script src="/js/app/sales/app.js"></script>
    <script src="/js/app/sales/controllers.js"></script>
    <script src="/js/app/sales/servicesglobalOrders.js"></script>
    <script src="/vendor/bootstrap-toggle/js/bootstrap-toggle.min.js"></script>
    



@stop

@stop
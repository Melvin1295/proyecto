<?php
namespace Salesfly\Salesfly\Managers;
class OrderPurchaseManager extends BaseManager {

    public function getRules()
    {
        $rules = [              
            'fechaPedido'=>'',
            'fechaPrevista'=>'',
             'descuento'=>'between:0,9999999999.00',
             'montoBruto'=>'between:0,9999999999.00',
             'montoTotal'=>'between:0,9999999999.00',
             'Estado'=>'',
             'warehouses_id'=>'required',
             'supplier_id'=>'required',
             'tCambio'=>'',
             'tasaDolar'=>'between:0,9999999999.00',
             'montoBrutoDolar'=>'between:0,9999999999.00',
             'montoTotalDolar'=>'between:0,9999999999.00',
             'montoBase'=>'between:0,9999999999.00',
             'montoBaseDolar'=>'between:0,9999999999.00',
             'igv'=>'between:0,9999999999.00',
             'igvDolar'=>'between:0,9999999999.00'];
        return $rules;
    }}
<?php
namespace Salesfly\Salesfly\Managers;
class SaleManager extends BaseManager {

    public function getRules()
    {
        $rules = [              
            'fechaPedido'=> 'required',
            'fechaEntrega'=>'',
            'montoTotal'=> '',
            'montoBruto'=> '',
            'descuento'=> '',
            'fechaAnulado'=> '',
            'estado'=>'',
            'employee_id'=> '',
            'customer_id'=> '',
            'igv'=> '',
            'notas'=> '',
            'detCash_id'=>'required',
            'orderSale_id'=> '',
            'separateSale_id'=> '',
            'puntos'=>''
                  ];
        return $rules;
    }} 
 
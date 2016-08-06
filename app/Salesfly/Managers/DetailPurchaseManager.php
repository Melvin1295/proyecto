<?php
namespace Salesfly\Salesfly\Managers;
class DetailPurchaseManager extends BaseManager {

    public function getRules()
    {
        $rules = ['producto'=>'',
                   'descuento'=> 'between:0,9999999999.00',
        			'montoBruto'=>'between:0,9999999999.00',
        			'montoTotal'=>'between:0,9999999999.00',
        			'detPres_id'=>'required',
        			'purchases_id'=>'required',
                    'preProducto'=>'',
                    'preCompra'=>'',
                    'cantidad'=>'required',
                    'preProductoDolar'=>'between:0,9999999999.00',
                    'preCompraDolar'=>'between:0,9999999999.00',
                    'montoBrutoDolar'=>'between:0,9999999999.00',
                    'montoTotalDolar'=>'between:0,9999999999.00'
       				 ];
        return $rules;
    }
}
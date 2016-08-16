<?php
namespace Salesfly\Salesfly\Managers;
class OtherPheadManager extends BaseManager {
    public function getRules()
    {
        $rules = [         'fecha'=>'required',
                           'proveedor'=>'required',
                           'ruc'=>'required',
                           'direccion'=>'',
                           'numeroDocumento'=>'required',
                           'serie'=>'',
                           'MontoSubTotal'=>'',
                           'igv'=>'',
                           'BaseImponible'=>'',
                           'MontoTotal'=>'',
                           'tipoDoc'=>'',
                           'checkIgv'=>'',
                           'montoPagado'=>'',
                           'Saldo'=>'',
                           'acount_id'=>''];
        return $rules;
    }}
<?php
namespace Salesfly\Salesfly\Managers;
class SunatAcountManager extends BaseManager {
    public function getRules()
    {
        $rules = [  
                    'codigo'=>'required',
                    'nombre'=>'required' ];
        return $rules;
    }
} 
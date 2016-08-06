<?php

namespace Salesfly\Salesfly\Managers;

class CountManager extends BaseManager{

    public function getRules(){
        $rules = [
            'banco' => '',
            'NumCuenta' => '',
            'supplier_id' => ''
        ];
        return $rules;
    }
}
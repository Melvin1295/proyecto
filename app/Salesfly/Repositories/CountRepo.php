<?php
namespace Salesfly\Salesfly\Repositories;
use Salesfly\Salesfly\Entities\Count;

class CountRepo extends BaseRepo{
    public function getModel()
    {
        return new Count;
    }

    public function getCuentas($id){
        $count=Count::select("id","banco","NumCuenta")
                      ->where("counts.supplier_id","=",$id)->get();
       return $count;
    }
}
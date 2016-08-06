<?php
namespace Salesfly\Salesfly\Repositories;
use Salesfly\Salesfly\Entities\SeparateSale;

class SeparateSaleRepo extends BaseRepo{
    
    public function getModel()
    {
        
        return new SeparateSale;
    }
    public function search($q)
    {
        $separate =SeparateSale::where('nombre','like', $q.'%')
                    //with(['customer','employee'])
                    ->paginate(15);
        return $separate;
    }
    public function paginate($count){
        $separate = SeparateSale::leftjoin('salePayments','salePayments.separateSale_id','=','separateSales.id')
                        ->select('separateSales.*','salePayments.estado as estadoPago')
                        ->with('customer','employee');
        return $separate->paginate($count);
    }
    public function find($id)
    {
        $separate = SeparateSale::with('customer','employee');
        return $separate->find($id);
    }
    
} 
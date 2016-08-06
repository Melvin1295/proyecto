<?php
namespace Salesfly\Salesfly\Repositories;
use Salesfly\Salesfly\Entities\Sale;

class SaleRepo extends BaseRepo{
    
    public function getModel()
    {
        
        return new Sale;
    }

    public function search($q)
    {
        $sale =Sale::where('nombre','like', $q.'%')
                    //with(['customer','employee'])
                    ->paginate(15);
        return $sale;
    }
    public function paginate($count){
        $sale = Sale::leftjoin('salePayments','salePayments.sale_id','=','sales.id')
                        ->select('sales.*','salePayments.estado as estadoPago')
                        ->with('customer','employee');
        return $sale->paginate($count);
    }
    public function find($id)
    {
        $sale = Sale::with('customer','employee');
        return $sale->find($id);
    }
    
} 
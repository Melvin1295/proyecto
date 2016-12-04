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
                        ->select(\DB::raw("sales.* ,CONCAT((SUBSTRING(sales.created_at,9,2)),'-',
                                (SUBSTRING(sales.created_at,6,2)),'-',
                                (SUBSTRING(sales.created_at,1,4)),' ',
                                (SUBSTRING(sales.created_at,11)))as fechaCREDO,
                               CONCAT((SUBSTRING(sales.fechaAnulado,9,2)),'-',
                                (SUBSTRING(sales.fechaAnulado,6,2)),'-',
                                (SUBSTRING(sales.fechaAnulado,1,4)),' ',
                                (SUBSTRING(sales.fechaAnulado,11)))as fechaANULADO2,salePayments.estado as estadoPago")
                                 )

                        ->with('customer','employee')->orderBY('sales.id','desc');

        return $sale->paginate($count);
    }
    public function find($id)
    {
        $sale = Sale::with('customer','employee');
        return $sale->find($id);
    }
    
} 
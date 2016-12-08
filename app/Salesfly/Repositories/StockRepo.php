<?php
namespace Salesfly\Salesfly\Repositories;
use Salesfly\Salesfly\Entities\Stock;

class StockRepo extends BaseRepo{
    
    public function getModel()
    {
        return new Stock;
    }


    public function search($q)
    {
        $stock =Stock::where('direccion','like', $q.'%')
                    //with(['customer','employee'])
                    ->paginate(15);
        return $stock;
    }
   /*public function traerStock($id,$id2){
    $stock=Stock::where('warehouse_id','=',$id)->where('variant_id','=',$id2)->first();
    return $stock;
   }*/
   public function encontrar($vari,$almacen){
        $stocks=Stock::where("variant_id","=",$vari)->where("warehouse_id","=",$almacen)->first();
        return $stocks;
    }

    public function traerPorAlmacen($idAlmacen,$producID){
        $stock=Stock::join('variants','variants.id','=','stock.variant_id')
                    ->join('detPres','detPres.variant_id','=','variants.id')
                    ->join('products','products.id','=','variants.product_id')
                    ->select(\DB::raw("variants.id as varCodigo,
                        (select SUM(stockActual)  from stock where stock.variant_id=varCodigo) as totStock,
                        stock.stockActual,detPres.price,detPres.dscto,detPres.pvp,CONCAT(products.nombre,'/',
                        (SELECT GROUP_CONCAT(detAtr.descripcion SEPARATOR '/') 
                            FROM variants
                                INNER JOIN detAtr ON detAtr.variant_id = variants.id
                                INNER JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=varCodigo
                                GROUP BY variants.id)) as NombreAtributos"))
                    ->where('stock.warehouse_id','=',$idAlmacen)
                    ->where('variants.product_id','=',$producID)
                    ->groupBy('variants.id')
                    ->get();
       return $stock;
    }
} 
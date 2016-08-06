<?php
namespace Salesfly\Salesfly\Repositories;
use Salesfly\Salesfly\Entities\DetSale;

class DetSaleRepo extends BaseRepo{
    
    public function getModel()
    {
        
        return new DetSale;
    }

    public function search($q)
    {
        $detSales =DetSale::where('nombre','like', $q.'%')
                    //with(['customer','employee'])
                    ->paginate(15);
        return $detSales;
    }
    public function searchDetalle($id)
    {
        //$detOrders = \DB::table('detOrders')->leftjoin('detPres','detOrders.detPre_id','=','detPres.id')
        $detSales =\DB::table('detSales')->leftjoin("detPres","detPres.id","=","detSales.detPre_id")
                    ->leftjoin("variants","variants.id","=","detPres.variant_id")
                    ->leftjoin("products","products.id","=","variants.product_id")
                    ->leftjoin("presentation","presentation.id","=","detPres.presentation_id")
                    ->leftjoin("equiv","equiv.preFin_id","=","presentation.id")
                    ->leftjoin("stock","variants.id","=","stock.variant_id")
                    ->leftjoin("warehouses","warehouses.id","=","stock.warehouse_id")
                    
                    ->select(\DB::raw('detSales.*, products.nombre as nameProducto,variants.codigo,variants.sku,detSales.puntos, presentation.nombre as presentacion ,variants.id as vari , warehouses.id as idAlmacen,
                        stock.id as idStock,
                        (SELECT GROUP_CONCAT(CONCAT(atributes.shortname,":",detAtr.descripcion) SEPARATOR " /") FROM variants
                                INNER JOIN detAtr ON detAtr.variant_id = variants.id
                                INNER JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=vari
                                GROUP BY variants.id) as NombreAtributos,equiv.cant'))

                    ->where('sale_id','=', $id.'%')
                    ->groupBy('detSales.id')    
                    //with(['customer','employee'])
                    ->paginate(15);
        return $detSales;
    }
} 
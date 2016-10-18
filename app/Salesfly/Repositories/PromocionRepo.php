<?php
namespace Salesfly\Salesfly\Repositories;
use Salesfly\Salesfly\Entities\Promocion;

class PromocionRepo extends BaseRepo{
    
    public function getModel()
    {
        
        return new Promocion;
    }

    public function search($q)
    {
        $promotion =Promocion::where('nombre','like', $q.'%')
                    //with(['customer','employee'])
                    ->paginate(15);
        return $promotion;
    }
    public function listarPromociones(){
        $promocion=Promocion::join("variants","variants.id","=","promocion.productBase_id")
                              ->join("products","products.id","=","variants.product_id")
                              ->select(\DB::raw("promocion.numero,SUBSTRING(promocion.fecha_fin,1,10) as fechaOri,promocion.id,
                                promocion.product_id,promocion.productBase_id,promocion.fecha_inicio,promocion.fecha_fin,
                                promocion.cantidad,promocion.descripcion,promocion.estado,CONCAT((SUBSTRING(promocion.fecha_inicio,9,2)),'-',(SUBSTRING(promocion.fecha_inicio,6,2)),'-',(SUBSTRING(promocion.fecha_inicio,1,4)))as fecha_inicio,CONCAT((SUBSTRING(promocion.fecha_fin,9,2)),'-',(SUBSTRING(promocion.fecha_fin,6,2)),'-',(SUBSTRING(promocion.fecha_fin,1,4)))as fecha_fin,promocion.descuento,products.nombre,variants.sku,variants.id as vari,promocion.product_id as vari2,
                    (select T20.descripcion FROM detAtr T20 where T20.variant_id=vari and T20.atribute_id=1) as cant,
                    (select T20.descripcion FROM detAtr T20 where T20.variant_id=vari and T20.atribute_id=2) as sabor,

                    (select CONCAT(pro.nombre,'/',vr.sku,'/',(select T20.descripcion FROM detAtr T20 where T20.variant_id=vari2 and T20.atribute_id=1),'/',(select T20.descripcion FROM detAtr T20 where T20.variant_id=vari2 and T20.atribute_id=2)) as descri FROM promocion pr inner join variants vr on pr.product_id=vr.id 
                        inner join products pro on pro.id=vr.product_id where vr.id=vari2 group by pro.id)as product2"))
                              ->groupBy("promocion.numero")
                              ->paginate(15);
         
            return $promocion;
    }
    public function confirmarVariante($id,$fecha){
       $promocion=Promocion::join('variants','variants.id','=','promocion.product_id')
                           ->select('promocion.cantidad','promocion.product_id','variants.sku','promocion.descuento')
                           ->where('promocion.product_id','=',$id)
                           ->where('promocion.fecha_fin','>=',$fecha)
                           ->where('promocion.estado','=',1)
                           ->groupBy('promocion.id')
                           ->first();
        return $promocion;
    }
    public function find10($numero){
       $promocion=Promocion::join('variants','variants.id','=','promocion.productBase_id')
                           ->select('promocion.id','variants.id as vari')
                           ->where('promocion.numero','=',$numero)
                           ->groupBy('promocion.id')
                           ->get();
        return $promocion;
    }
    public function find100($numero){
       $promocion=Promocion::join('variants','variants.id','=','promocion.productBase_id')
                           ->select('promocion.id','variants.id as vari')
                           ->where('promocion.numero','=',$numero)
                           ->groupBy('promocion.productBase_id')
                           ->get();
        return $promocion;
    }
} 
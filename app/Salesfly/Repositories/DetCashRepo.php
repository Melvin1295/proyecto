<?php
namespace Salesfly\Salesfly\Repositories;
use Salesfly\Salesfly\Entities\DetCash;

class DetCashRepo extends BaseRepo{
    
    public function getModel()
    {
        
        return new DetCash;
    }

    public function search($q)
    {
        $detCashs =DetCash::join('cashMotives','cashMotives.id','=','detCash.cashMotive_id')
                           ->join('cashes','cashes.id','=','detCash.cash_id')
                           ->join('users','users.id','=','cashes.user_id')
                           ->leftjoin('sales','sales.detCash_id','=','detCash.id')
                           ->join('cashHeaders','cashHeaders.id','=','cashes.cashHeader_id')
                           ->leftjoin('headInvoices as hi','hi.venta_id','=','sales.id')
                           ->select(\DB::raw("IF(sales.puntos>0,sales.puntos,'0')as puntos,detCash.observacion,detCash.id as idCajaDiaria,sales.id,cashHeaders.nombre,users.name,
                            (SELECT detCash.montoMovimientoEfectivo from detCash where detCash.id=idCajaDiaria)as efectivo2,
                            hi.tipoDoc,hi.id as idDocu,cashMotives.nombre as Motivo,detCash.montoMovimientoTarjeta as tarjeta,
                            detCash.montoMovimientoEfectivo as efectivo,cashMotives.id as cashMotive_id,CONCAT((SUBSTRING(detCash.fecha,9,2)),'-',
                                (SUBSTRING(detCash.fecha,6,2)),'-',
                                (SUBSTRING(detCash.fecha,1,4)))as fecha,detCash.hora,
                            IF(hi.numero<10,CONCAT('000000',hi.numero),
                             IF(hi.numero<100,CONCAT('00000',hi.numero),
                             IF(hi.numero<1000,CONCAT('0000',hi.numero),
                             IF(hi.numero<10000,CONCAT('000',hi.numero),
                             IF(hi.numero<100000,CONCAT('00',hi.numero),
                             IF(hi.numero<100000,CONCAT('0',hi.numero),hi.numero
                             ))))))as NumDocument"))
                    ->where('detCash.cash_id','=', $q)
                    ->groupBy('detCash.id')
                    ->paginate(15);
        return $detCashs;
    }
   /* public function ver_ventas($user){
        $detCashs =DetCash::join('cashMotives','cashMotives.id','=','detCash.cashMotive_id')
                           ->join('cashes','cashes.id','=','detCash.cash_id')
                           ->join('users','users.id','=','cashes.user_id')
                           ->join('sales','sales.detCash_id','=','detCash.id')
                           ->join('cashHeaders','cashHeaders.id','=','cashes.cashHeader_id')
                           ->leftjoin('headInvoices as hi','hi.venta_id','=','sales.id')
                           ->select(\DB::raw("sales.id,cashHeaders.nombre,users.name,
                            hi.tipoDoc,hi.id as idDocu,cashMotives.nombre as Motivo,detCash.montoMovimientoTarjeta as tarjeta,
                            detCash.montoMovimientoEfectivo as efectivo,cashMotives.id as cashMotive_id,CONCAT((SUBSTRING(sales.fechaPedido,9,2)),'-',
                                (SUBSTRING(sales.fechaPedido,6,2)),'-',
                                (SUBSTRING(sales.fechaPedido,1,4)))as fecha,SUBSTRING(sales.fechaPedido,12) as hora,
                            IF(hi.numero<10,CONCAT('000000',hi.numero),
                             IF(hi.numero<100,CONCAT('00000',hi.numero),
                             IF(hi.numero<1000,CONCAT('0000',hi.numero),
                             IF(hi.numero<10000,CONCAT('000',hi.numero),
                             IF(hi.numero<100000,CONCAT('00',hi.numero),
                             IF(hi.numero<100000,CONCAT('0',hi.numero),hi.numero
                             ))))))as NumDocument"))
                          // ->where('detCash.cash_id','=', $q)
                           ->where('detCash.cashMotive_id','=','1')
                           ->where('users.id','=',$user)
                           ->where('cashes.estado','=',1)
                           //->orWhere('detCash.cash_id','=', $q)
                           ->orWhere('detCash.cashMotive_id','=','14')
                           ->where('users.id','=',$user)
                           ->where('cashes.estado','=',1)
                           ->groupBy('sales.id')
                           ->paginate(15);
        return $detCashs; 
    }*/
     public function ver_ventas($user){
        $detCashs =DetCash::join('cashMotives','cashMotives.id','=','detCash.cashMotive_id')
                           ->join('cashes','cashes.id','=','detCash.cash_id')
                           ->join('users','users.id','=','cashes.user_id')
                           ->join('sales','sales.detCash_id','=','detCash.id')
                           ->join('cashHeaders','cashHeaders.id','=','cashes.cashHeader_id')
                           ->leftjoin('headInvoices as hi','hi.venta_id','=','sales.id')
                           ->select(\DB::raw("sales.puntos,sales.id,cashHeaders.nombre,users.name,sales.estado,sales.notas,
                            hi.tipoDoc,hi.id as idDocu,cashMotives.nombre as Motivo,detCash.montoMovimientoTarjeta as tarjeta,
                            detCash.montoMovimientoEfectivo as efectivo,cashMotives.id as cashMotive_id,CONCAT((SUBSTRING(sales.fechaPedido,9,2)),'-',
                                (SUBSTRING(sales.fechaPedido,6,2)),'-',
                                (SUBSTRING(sales.fechaPedido,1,4)))as fecha,SUBSTRING(sales.fechaPedido,12) as hora,
                            IF(hi.numero<10,CONCAT('000000',hi.numero),
                             IF(hi.numero<100,CONCAT('00000',hi.numero),
                             IF(hi.numero<1000,CONCAT('0000',hi.numero),
                             IF(hi.numero<10000,CONCAT('000',hi.numero),
                             IF(hi.numero<100000,CONCAT('00',hi.numero),
                             IF(hi.numero<100000,CONCAT('0',hi.numero),hi.numero
                             ))))))as NumDocument"))
                          // ->where('detCash.cash_id','=', $q)
                           ->where('detCash.cashMotive_id','=','1')
                           ->where('users.id','=',$user)
                           ->where('cashes.estado','=',1)
                           //->orWhere('detCash.cash_id','=', $q)
                           ->orWhere('detCash.cashMotive_id','=','14')
                           ->where('users.id','=',$user)
                           ->where('cashes.estado','=',1)
                           ->groupBy('sales.id')
                            ->orderBy('sales.id','DESC')
                           ->paginate(15);
        return $detCashs; 
    }
    public function searchSale($q)
    {
        $detCashs =DetCash::join('cashMotives','cashMotives.id','=','detCash.cashMotive_id')
                    ->join('cashes','cashes.id','=','detCash.cash_id')
                    ->join('users','users.id','=','cashes.user_id')
                    ->join('sales','sales.detCash_id','=','detCash.id')
                    ->join('cashHeaders','cashHeaders.id','=','cashes.cashHeader_id')
                    ->leftjoin('headInvoices as hi','hi.venta_id','=','sales.id')
                           ->select(\DB::raw("detCash.*,cashMotives.nombre as nommovimiento, users.name,
                            cashHeaders.nombre,hi.tipoDoc,hi.id as idDocu,
                            IF(hi.numero<10,CONCAT('000000',hi.numero),
                             IF(hi.numero<100,CONCAT('00000',hi.numero),
                             IF(hi.numero<1000,CONCAT('0000',hi.numero),
                             IF(hi.numero<10000,CONCAT('000',hi.numero),
                             IF(hi.numero<100000,CONCAT('00',hi.numero),
                             IF(hi.numero<100000,CONCAT('0',hi.numero),hi.numero
                             ))))))as NumDocument"))
                        ->where('detCash.cash_id','=', $q)
                        ->where('detCash.cashMotive_id','=','1')
                        ->orWhere('detCash.cash_id','=', $q)
                        ->where('detCash.cashMotive_id','=','14')
                        ->groupBy('sales.id')
                        //->orWhere('cashMotive_id','=','14')
                    ->paginate(15);
        return $detCashs; 
    } 
    public function searchOrderSale($q)
    {
        $detCashs =DetCash::with('cashMotive')
                        ->where('cash_id','=', $q)
                        ->where('cashMotive_id','=','15')
                        ->orWhere('cash_id','=', $q)
                        ->where('cashMotive_id','=','16')
                        //->orWhere('cashMotive_id','=','14')
                    ->paginate(15);
        return $detCashs;
    }
    public function searchSeparateSale($q)
    {
        $detCashs =DetCash::with('cashMotive')
                        ->where('cash_id','=', $q)
                        ->where('cashMotive_id','=','19')
                        ->orWhere('cash_id','=', $q)
                        ->where('cashMotive_id','=','20')
                        //->orWhere('cashMotive_id','=','14')
                    ->paginate(15);
        return $detCashs;
    }
    public function pagosCompras($id){
        $detCashs = DetCash::join('cashes','cashes.id','=','detCash.cash_id')
                          ->join('OtherPheads','OtherPheads.id','=','detCash.otherPhead_id')                          
                          ->where('detCash.otherPhead_id','=',$id)
                          ->select(\DB::raw('detCash.id ,CONCAT(detCash.fecha," ",detCash.hora)as fecha,detCash.montoMovimientoEfectivo as monto,"Caja" as tipo'))
        ->paginate(15);
        return $detCashs;
    }
     
    public function paginate($count){
        $detCashs = DetCash::with('cashMotive');
        return $detCashs->paginate($count);
    } 
   public function compCajaActiva($id){
        $detCashs = DetCash::join('cashes','cashes.id','=','detCash.cash_id')
                          ->where('detCash.id','=',$id)
                          ->select('cashes.estado')
        ->first();
        return $detCashs;
    }


}
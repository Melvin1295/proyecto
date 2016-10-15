<?php
namespace Salesfly\Salesfly\Repositories;
use Salesfly\Salesfly\Entities\Cash;

class CashRepo extends BaseRepo{
    
    public function getModel()
    {
        
        return new Cash;
    }

    public function search($q)
    {
        if($q==0){
            $q='%%';
        }
        $cashes =Cash::join("users","cashes.user_id","=","users.id")
                    ->select("cashes.*","users.name")
                    ->where('cashes.cashHeader_id','like', $q)
                    ->orWhere('users.name','like', $q)
                    ->orWhere('cashes.fechaInicio','like','%'.$q.'%')
                    
                    //with(['customer','employee'])
                    ->paginate(15);
        return $cashes;
    }
    public function searchuserincaja($id){
        $cashes =Cash::select("id")
                     ->where('user_id','=', $id)
                     ->where('estado','=',1)
                    //with(['customer','employee'])
                    ->first();
        return $cashes;
    }
    public function Datos_Por_Caja($id){
        $cashes =Cash::select("cashes.*","users.name","users.email","users.store_id","users.role_id")
                    ->join("users","cashes.user_id","=","users.id")
                     ->where('cashes.user_id','=', $id)
                     ->where('cashes.estado','=',1)
                     ->limit(1)
                    //with(['customer','employee'])
                    ->first();
        return $cashes;
    }
    public function searchuserincaja1($idCaja,$id){
        $cashes =Cash::select("id","montoBruto")
                     ->where('id','=', $idCaja)
                     ->where('user_id','=',$id)
                    //with(['customer','employee'])
                    ->first();
        return $cashes;
    }
    public function paginarCashes($q){
           $cashes =Cash::join("users","cashes.user_id","=","users.id")
                    ->join("cashHeaders","cashes.cashHeader_id","=","cashHeaders.id")
                    ->join("stores","cashHeaders.store_id","=","stores.id")
                    ->select(\DB::raw("stores.nombreTienda,cashHeaders.nombre,cashes.*,users.name,CONCAT((SUBSTRING(cashes.fechaInicio,9,2)),'-',
                                (SUBSTRING(cashes.fechaInicio,6,2)),'-',
                                (SUBSTRING(cashes.fechaInicio,1,4)),' ',
                                (SUBSTRING(cashes.fechaInicio,11)))as fechaCREADO,CONCAT((SUBSTRING(cashes.fechaFin,9,2)),'-',
                                (SUBSTRING(cashes.fechaFin,6,2)),'-',
                                (SUBSTRING(cashes.fechaFin,1,4)),' ',
                                (SUBSTRING(cashes.fechaFin,11)))as fechaCREADOFIN"))
                    ->paginate($q);
        return $cashes;
    }
} 
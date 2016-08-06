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
    public function searchuserincaja1($idCaja,$id){
        $cashes =Cash::select("id")
                     ->where('id','=', $idCaja)
                     ->where('user_id','=',$id)
                    //with(['customer','employee'])
                    ->first();
        return $cashes;
    }
    public function paginarCashes($q){
           $cashes =Cash::join("users","cashes.user_id","=","users.id")
                    ->select("cashes.*","users.name")
                    ->paginate($q);
        return $cashes;
    }
} 
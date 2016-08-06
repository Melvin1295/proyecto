<?php

namespace Salesfly\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

use Salesfly\Salesfly\Repositories\SupplierRepo;
use Salesfly\Salesfly\Managers\SupplierManager;
use Salesfly\Salesfly\Repositories\CountRepo;
use Salesfly\Salesfly\Managers\CountManager;

class SuppliersController extends Controller {

    protected $supplierRepo;

    public function __construct(SupplierRepo $supplierRepo, CountRepo $countRepo)
    {
        $this->supplierRepo = $supplierRepo;
        $this->countRepo=$countRepo;
    }

    public function index()
    {
        return View('suppliers.index');
    }
    public function getCuentas($id){
        $counts=$this->countRepo->getCuentas($id);
        return response()->json($counts);
    }
    public function all()
    {
        $suppliers = $this->supplierRepo->paginate(15);
        return response()->json($suppliers);
    }
    public function deudas(){
       
        $suppliers = $this->supplierRepo->deudas();
        return response()->json($suppliers);
    }
    public function paginatep(){
        $suppliers = $this->supplierRepo->paginate(15);
        return response()->json($suppliers);
    }


    public function form_create()
    {
        return View('suppliers.form_create');
    }

    public function form_edit()
    {
        return View('suppliers.form_edit');
    }

    public function create(Request $request)
    {
        $var=$request->counts;
        $supplier = $this->supplierRepo->getModel();
        //$count = $this->countRepo->getModel();
        //===================autogenerado========================//

        if($request->input('autogenerado') === true) {
            $codigo = \DB::table('suppliers')->max('codigo');
            if (!empty($codigo)) {
                $codigo = $codigo + 1;
            } else {
                $codigo = 1; //inicializar el sku;
            }
            $request->merge(array('codigo' => $codigo));
        }else{

        }
       
        $manager = new SupplierManager($supplier,$request->except('fechanac'));
        
        $manager->save();
        if($this->supplierRepo->validateDate(substr($request->input('fechanac'),0,10))){
            $supplier->fechanac = substr($request->input('fechanac'),0,10);
        }else{
            $supplier->fechanac = null;
        }

        $supplier->save();
        $idProveedor= $supplier->id;
        foreach ($var as $object) {
            $count = new CountRepo;
             $object["supplier_id"]=$idProveedor;
             $manager1 = new CountManager($count->getModel(),$object);
             $manager1->save();
        }

        return response()->json(['estado'=>true, 'nombres'=>$supplier->nombres]);
    }

    public function find($id)
    {
        $supplier = $this->supplierRepo->find($id);
        return response()->json($supplier);
    }

    public function edit(Request $request)
    {
        $var=$request->counts;
        $supplier = $this->supplierRepo->find($request->id);
        //===================autogenerado========================//

        if($request->input('autogenerado') === true) {
            $codigo = \DB::table('suppliers')->max('codigo');
            if (!empty($codigo)) {
                $codigo = $codigo + 1;
            } else {
                $codigo = 1; //inicializar el sku;
            }
            $request->merge(array('codigo' => $codigo));
        }else{

        }
        $manager = new SupplierManager($supplier,$request->except('fechanac'));
        $manager->save();
        if($this->supplierRepo->validateDate(substr($request->input('fechanac'),0,10))){
            $supplier->fechanac = substr($request->input('fechanac'),0,10);
            $supplier->save();
        }
        $idProveedor= $request->id;
        $cuentas=$this->countRepo->getCuentas($request->input("id"));
        if(!isset($cuentas->id)){
        foreach ($cuentas as $object) {
             $count1=$this->countRepo->find($object["id"]);
             $count1->delete();
        }
       }
        foreach ($var as $object) {
             $count = new CountRepo;
             $object["supplier_id"]=$idProveedor;
             $manager1 = new CountManager($count->getModel(),$object);
             $manager1->save();
        }
        return response()->json(['estado'=>true, 'nombre'=>$supplier->nombre]);
    }

    public function destroy(Request $request)
    {
        $supplier= $this->supplierRepo->find($request->id);
        $cuentas=$this->countRepo->getCuentas($request->id);
        if(!isset($cuentas->id)){
        foreach ($cuentas as $object) {
             $count1=$this->countRepo->find($object["id"]);
             $count1->delete();
        }
       }
        $supplier->delete();
        return response()->json(['estado'=>true, 'nombre'=>$supplier->nombres]);
    }

    public function search($q)
    {
        $suppliers = $this->supplierRepo->search($q);

        return response()->json($suppliers);
    }
     public function selectSupliers(){
        $suppliers = $this->supplierRepo->all();
        return response()->json($suppliers);
    }

}
<?php

namespace Salesfly\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

use Salesfly\Salesfly\Repositories\CashRepo;
use Salesfly\Salesfly\Managers\CashManager;

class CashesController extends Controller
{
    protected $cashRepo;

    public function __construct(CashRepo $cashRepo)
    {
        $this->cashRepo = $cashRepo;
    }

    public function all()
    {
        $cashes = $this->cashRepo->paginate(15);
        return response()->json($cashes);
        //var_dump($materials);
    }

    public function paginatep(){
        $cashes = $this->cashRepo->paginarCashes(15);
        return response()->json($cashes);
    }

    public function find($id)
    {
        $cash = $this->cashRepo->find($id);
        return response()->json($cash);
    }

    public function search($q)
    {
        $cashes = $this->cashRepo->search($q);

        return response()->json($cashes);
    }

    public function index()
    {
        return View('cashes.index');
    }

    public function form_create()
    {
        return View('cashes.form_create');
    }
    public function form_edit()
    {
        return View('cashes.form_edit');
    }
    public function cajas_for_user(){
        $cash=$this->cashRepo->searchuserincaja(auth()->user()->id);
        return response()->json($cash);
    }
    public function cajas_for_user1($id){
        $cash=$this->cashRepo->searchuserincaja1($id,auth()->user()->id);
        return response()->json($cash);
    }


    public function create(Request $request)
    {
        
        $cash = $this->cashRepo->getModel();
        $request->merge(['user_id'=>auth()->user()->id]);
        $manager = new CashManager($cash,$request->all());
        $manager->save();

        return response()->json(['estado'=>true, 'nombre'=>$cash->fechaInicio]);
    }
    public function edit(Request $request)
    {
        $cash = $this->cashRepo->find($request->id);
        
        $manager = new CashManager($cash,$request->all());
        $manager->save();

        return response()->json(['estado'=>true, 'nombre'=>$cash->nombre]);
    }

    public function store(Request $request)
    {
        //
    }

    public function show($id)
    {
        //
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }
}

<?php

namespace Salesfly\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

use Salesfly\Salesfly\Repositories\CashHeaderRepo;
use Salesfly\Salesfly\Managers\CashHeaderManager;
use Salesfly\Salesfly\Repositories\FBnumberRepo;
use Salesfly\Salesfly\Managers\FBnumberManager;

class CashHeadersController extends Controller
{
    protected $cashHeaderRepo;

    public function __construct(CashHeaderRepo $cashHeaderRepo,FBnumberRepo $fbnumberRepo)
    {
        $this->cashHeaderRepo = $cashHeaderRepo;
        $this->fbnumberRepo=$fbnumberRepo;
    }
    public function cajasActivas($alm){
        $cashHeaders = $this->cashHeaderRepo->cajasActivas($alm);
        return response()->json($cashHeaders);
    }
  public function caja(){
    $cashHeaders = $this->cashHeaderRepo->cajas();
        return response()->json($cashHeaders);
  }
    public function all()
    {
        $cashHeaders = $this->cashHeaderRepo->paginate(15);
        return response()->json($cashHeaders);
        //var_dump($materials);
    }

    public function paginatep(){
        $cashHeaders = $this->cashHeaderRepo->paginate(15);
        return response()->json($cashHeaders);
    }

    public function find($id)
    {
        $cashHeader = $this->cashHeaderRepo->find($id);
        return response()->json($cashHeader);
    } 

    public function search($q)
    {
        $cashHeaders = $this->cashHeaderRepo->search($q);

        return response()->json($cashHeaders);
    }
    public function searchHeader($q)
    {
        $cashHeaders = $this->cashHeaderRepo->searchHeader($q);

        return response()->json($cashHeaders);
    }

    public function index()
    {
        return View('cashHeaders.index');
    }

    public function form_create()
    {
        return View('cashHeaders.form_create');
    }
    public function form_edit()
    {
        return View('cashHeaders.form_edit');
    }
    
    public function create(Request $request)
    {
        \DB::beginTransaction();
        $cashHeader = $this->cashHeaderRepo->getModel();
        $fbnumber = $this->fbnumberRepo->getModel();

        $manager = new CashHeaderManager($cashHeader,$request->all());
        $manager->save();
        $request->merge(["numFactura"=>0]);
        $request->merge(["numBoleta"=>0]);
        $request->merge(["caja_id"=>$cashHeader->id]);
        $manager1 = new FBnumberManager($fbnumber,$request->only("numFactura","numBoleta","caja_id"));
        $manager1->save();
        \DB::commit();

        return response()->json(['estado'=>true, 'nombre'=>$cashHeader->nombre]);
    }

    public function edit(Request $request)
    {
        $cashHeader = $this->cashHeaderRepo->find($request->id);

        $manager = new CashHeaderManager($cashHeader,$request->all());
        $manager->save();

        return response()->json(['estado'=>true, 'nombre'=>$cashHeader->nombre]);
    }

    public function destroy(Request $request)
    {
        $cashHeader= $this->cashHeaderRepo->find($request->id);
        $cashHeader->fbnumber()->detach();
        $cashHeader->delete();
        return response()->json(['estado'=>true, 'nombre'=>$cashHeader->nombre]);
    }

    public function store(Request $request)
    {
        //
    }

    public function select(){
        $cashHeader = $this->cashHeaderRepo->all();
        return response()->json($cashHeader);
    }
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        //
    }

}

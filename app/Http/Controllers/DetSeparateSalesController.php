<?php

namespace Salesfly\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

use Salesfly\Salesfly\Repositories\DetSeparateSaleRepo;
use Salesfly\Salesfly\Managers\DetSeparateSaleManager;

use Salesfly\Salesfly\Repositories\StockRepo;
use Salesfly\Salesfly\Managers\StockManager;

class DetSeparateSalesController extends Controller {

    protected $detSeparateSaleRepo;

    public function __construct(DetSeparateSaleRepo $detSeparateSaleRepo)
    {
        $this->detSeparateSaleRepo = $detSeparateSaleRepo;
    }

     

    public function searchDetalle($id) 
    {
        //$q = Input::get('q');
        $detorderSale = $this->detSeparateSaleRepo->searchDetalle($id);

        return response()->json($detorderSale);
    }

    public function edit(Request $request)
    {
        $detorderSale = $this->detSeparateSaleRepo->find($request->id);
        $manager = new DetSeparateSaleManager($detorderSale,$request->all());
        $manager->save();

        $stokRepo;
        $stokRepo = new StockRepo;
        $cajaSave=$stokRepo->getModel();
        $stockOri = $stokRepo->find($request->id);

        $stock = $stokRepo->find($request->idStock);
        if ($request->estad==true) {
            $stock->stockSeparados= $stock->stockSeparados-$request->canPendiente;
        }else{
            $stock->stockSeparados= $stock->stockSeparados+$request->canPendiente;
        }
        

        $stock->save();

        //var_dump($stock);die();

        //$manager1 = new StockManager($stockOri,$stock);
        //$manager1->save();

        return response()->json(['estado'=>true, 'nombre'=>$detorderSale->nombre]);

    }  
}
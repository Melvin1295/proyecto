<?php

namespace Salesfly\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

use Salesfly\Salesfly\Repositories\SeparateSaleRepo;
use Salesfly\Salesfly\Managers\SeparateSaleManager;

use Salesfly\Salesfly\Repositories\DetSeparateSaleRepo;
use Salesfly\Salesfly\Managers\DetSeparateSaleManager;

use Salesfly\Salesfly\Repositories\CashRepo;
use Salesfly\Salesfly\Managers\CashManager;

use Salesfly\Salesfly\Managers\SalePaymentManager;
use Salesfly\Salesfly\Repositories\SalePaymentRepo;

use Salesfly\Salesfly\Managers\DetCashManager;
use Salesfly\Salesfly\Repositories\DetCashRepo;

use Salesfly\Salesfly\Managers\SaleDetPaymentManager;
use Salesfly\Salesfly\Repositories\SaleDetPaymentRepo;
use Salesfly\Salesfly\Managers\StockManager;
use Salesfly\Salesfly\Repositories\StockRepo;

class SeparateSaleController extends Controller {

    protected $separateSaleRepo;

    public function __construct(SeparateSaleRepo $separateSaleRepo)
    {
        $this->separateSaleRepo = $separateSaleRepo;
    }

    public function index() 
    {
        return View('separateSales.index');
    }

    public function all()
    {
        $separateSales = $this->separateSaleRepo->paginate(15);
        return response()->json($separateSales);
        //var_dump($separateSales);
    }

    public function paginatep(){
        $separateSales = $this->separateSaleRepo->paginate(15);
        return response()->json($separateSales);
    }


    public function form_create()
    {
        return View('separateSales.form_create');
    }

    public function form_edit()
    {
        return View('separateSales.form_edit');
    }
public function create(Request $request) {
        $orderSale = $this->separateSaleRepo->getModel();
        $var = $request->detOrders;
        $payment = $request->salePayment;
        $saledetPayments = $request->saledetPayments;
        
        $manager = new SeparateSaleManager($orderSale,$request->all());
        $manager->save();
        /*
       if($this->purchaseRepo->validateDate(substr($request->input('fechaEntrega'),0,10))){
            $order->fechaEntrega = substr($request->input('fechaEntrega'),0,10);
        }else{
           
            $order->fechaEntrega = null;
        }*/ 
        $orderSale->save();

        $temporal=$orderSale->id; 

        //---create movimiento---
            $movimiento = $request->movimiento;
            $detCashrepo;
            $movimiento['observacion']=$temporal;
            $detCashrepo = new DetCashRepo;
            $movimientoSave=$detCashrepo->getModel();
        
            $insertarMovimiento=new DetCashManager($movimientoSave,$movimiento);
            $insertarMovimiento->save();
            $detCash_id=$movimientoSave->id;
    //---Autualizar Caja---
            
            $cajaAct = $request->caja;
            $cashrepo;
            $cashrepo = new CashRepo;
            $cajaSave=$cashrepo->getModel();
            $cash1 = $cashrepo->find($cajaAct["id"]);

            $manager1 = new CashManager($cash1,$cajaAct);
            $manager1->save();
            

        //----------------
        $salePaymentrepo;
        $payment['separateSale_id']=$temporal;
        $salePaymentrepo = new SalePaymentRepo;
        $paymentSave=$salePaymentrepo->getModel();
        
        $insertarpayment=new SalePaymentManager($paymentSave,$payment);
        $insertarpayment->save();          
        $paymentSave->save();

        $temporal1=$paymentSave->id;
            //--------------------------
                $saledetPaymentrepo;
                foreach($saledetPayments as $object1){
                    $object1['salePayment_id'] = $temporal1;
                    $object1['detCash_id']=$detCash_id;
                    $saledetPaymentrepo = new SaleDetPaymentRepo;

                    $insertar=new SaleDetPaymentManager($saledetPaymentrepo->getModel(),$object1);
                    $insertar->save();
          
                    $saledetPaymentrepo = null;
                }

        $detOrderrepox;
         
       foreach($var as $object){
           $object['separateSale_id'] = $temporal;

           $detOrderrepox = new DetSeparateSaleRepo;

           $insertar=new DetSeparateSaleManager($detOrderrepox->getModel(),$object);
           $insertar->save();
          
           $detOrderrepox = null; 

           //-------------------------------------
           
           $stockmodel = new StockRepo;
                  $object['warehouse_id']=$object['idAlmacen'];
                  $object["variant_id"]=$object['vari'];
                  $stockac=$stockmodel->encontrar($object["variant_id"],$object['warehouse_id']);
            if(!empty($stockac)){
             
                if($object["equivalencia"]==null){
                  $object["stockSeparados"]=$stockac->stockSeparados+($object["cantidad"]);//
                  
                }else{
                  $object["stockSeparados"]=$stockac->stockSeparados+($object["cantidad"]*$object["equivalencia"]);
                }
                  $manager = new StockManager($stockac,$object);
                  $manager->save();
            }else{
                
            }
            $stockac=null;
            //-----------------------------------------------------
       }
     return response()->json(['estado'=>true, 'nombres'=>$orderSale->nombres]);
    }

    public function find($id)
    {
        $material = $this->separateSaleRepo->find($id);
        return response()->json($material);
    }

    public function search($q)
    {
        //$q = Input::get('q');
        $separateSales = $this->separateSaleRepo->search($q);

        return response()->json($separateSales);
    } 
    public function edit(Request $request)
    {
        $varDetOrders = $request->detOrder;
        
        $detOrderSaleRepo;
        foreach($varDetOrders as $object){
            $detOrderSaleRepo = new DetSeparateSaleRepo;

            $detorderSale = $detOrderSaleRepo->find($object['id']);
            $manager = new DetSeparateSaleManager($detorderSale,$object);
            $manager->save();

            $stokRepo;
            $stokRepo = new StockRepo;
            $cajaSave=$stokRepo->getModel();
            $stockOri = $stokRepo->find($object['id']);

            $stock = $stokRepo->find($object['idStock']);
            if ($object['estad']==true) {
                $stock->stockSeparados= $stock->stockSeparados-$object['canPendiente'];
            }else{
                $stock->stockSeparados= $stock->stockSeparados+$object['canPendiente'];
            }

            $stock->save();
        }

        $orderSale = $this->separateSaleRepo->find($request->id);
        $manager = new SeparateSaleManager($orderSale,$request->all());
        $manager->save();

        



        return response()->json(['estado'=>true, 'nombre'=>$orderSale->nombre]);
    }
}
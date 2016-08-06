<?php

namespace Salesfly\Http\Controllers;

use Illuminate\Support\Facades\View;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

use Salesfly\Salesfly\Repositories\CustomerRepo;
use Salesfly\Salesfly\Managers\CustomerManager;

use Intervention\Image\Facades\Image;

class CustomersController extends Controller {

    protected $customerRepo;

    public function __construct(CustomerRepo $customerRepo)
    {
        $this->customerRepo = $customerRepo;
        $this->middleware('auth');
        //$this->middleware('role:admin');
    }

    public function index()
    {

        return View('customers.index');
    }

    public function all()
    {
        $customers = $this->customerRepo->paginate(15);
        return response()->json($customers);
        //var_dump($customers);
    }

    public function paginatep(){
        $customers = $this->customerRepo->paginate(15);
        return response()->json($customers);
    }


    public function form_create()
    {
        return View('customers.form_create');
    }

    public function form_edit()
    {
        return View('customers.form_edit');
    }

    public function create(Request $request)
    {
        \DB::beginTransaction();
        $customer = $this->customerRepo->getModel();

        //===================autogenerado========================//

        if($request->input('autogenerado') === true) {
            $codigo = \DB::table('customers')->max('codigo');
            if (!empty($codigo)) {
                $codigo = $codigo + 1;
            } else {
                $codigo = 1; //inicializar el sku;
            }
            $request->merge(array('codigo' => $codigo));
        }else{

        }

        //================fin auto==============================//
        //var_dump($request->all());
        //die();
        //print($customer); die();
        $manager = new CustomerManager($customer,$request->except('fechaNac','imagen'));
        //print_r($manager->entity->apellidos); die();
        //print_r($customer->nombres); die();
        $manager->save();
        if($request->has('imagen') and substr($request->input('imagen'),5,5) === 'image'){
            $imagen = $request->input('imagen');
            $mime = $this->get_string_between($imagen,'/',';');
            $imagen = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imagen));
            Image::make($imagen)->resize(200,200)->save('images/customers/'.$customer->id.'.'.$mime);
            $customer->imagen='/images/customers/'.$customer->id.'.'.$mime;
            $customer->save();
        }else{
            $customer->imagen='/images/customers/default.jpg';
            $customer->save();
        }

        
        //if (!empty($request->input('fechaNac'))) {
        //    $customer->fechaNac = date("Y-m-d", strtotime($request->input('fechaNac')));
        //}
        //print_r(substr($request->input('fechaNac'),0,10)); die();
        if($this->customerRepo->validateDate(substr($request->input('fechaNac'),0,10))){
            //$customer->fechaNac = date("Y-m-d", strtotime($request->input('fechaNac')));
            $customer->fechaNac = substr($request->input('fechaNac'),0,10);
        }else{
            $customer->fechaNac = null;
        }

        $customer->save();
        //print_r($request->all()); die();
        //print_r($customer->nombres); die();
        //Event::fire('update.customer',$customer->all());
      \DB::commit();
        return response()->json(['estado'=>true, 'nombres'=>$customer->nombres]);
    }

    public function find($id)
    {
        $customer = $this->customerRepo->find($id);
        return response()->json($customer);
    }

    public function edit(Request $request)
    {
        \DB::beginTransaction();
        $customer = $this->customerRepo->find($request->id);
        //===================autogenerado========================//

        if($request->input('autogenerado') === true) {
            $codigo = \DB::table('customers')->max('codigo');
            if (!empty($codigo)) {
                $codigo = $codigo + 1;
            } else {
                $codigo = 1; //inicializar el sku;
            }
            $request->merge(array('codigo' => $codigo));
        }else{

        }

        //================fin auto==============================//
        //var_dump($request->except('fechaNac'));
        //die();
        $manager = new CustomerManager($customer,$request->except('fechaNac','imagen'));
        $manager->save();
        if($request->has('imagen') and substr($request->input('imagen'),5,5) === 'image'){
            $imagen = $request->input('imagen');
            $mime = $this->get_string_between($imagen,'/',';');
            $imagen = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imagen));
            Image::make($imagen)->resize(200,200)->save('images/customers/'.$customer->id.'.'.$mime);
            $customer->imagen='/images/customers/'.$customer->id.'.'.$mime;
            $customer->save();
        }else{
            $customer->imagen='/images/customers/default.jpg';
            $customer->save();
        }
        if($this->customerRepo->validateDate(substr($request->input('fechaNac'),0,10))){
            //$customer->fechaNac = date("Y-m-d", strtotime($request->input('fechaNac')));
            $customer->fechaNac = substr($request->input('fechaNac'),0,10);
            $customer->save();
        }
      \DB::commit();
        //Event::fire('update.customer',$customer->all());
        return response()->json(['estado'=>true, 'nombre'=>$customer->nombre]);
    }

    public function destroy(Request $request)
    {
        $customer= $this->customerRepo->find($request->id);
        $customer->delete();
        //Event::fire('update.customer',$customer->all());
        return response()->json(['estado'=>true, 'nombre'=>$customer->nombre]);
    }

    public function search($q)
    {
        //$q = Input::get('q');
        $customers = $this->customerRepo->search($q);

        return response()->json($customers);
    }

    public function searchVenta($q)
    {
        //$q = Input::get('q');
        $customers = $this->customerRepo->searchVenta($q);

        return response()->json($customers);
    }
     public function get_string_between($string, $start, $end){
        $string = " ".$string;
        $ini = strpos($string,$start);
        if ($ini == 0) return "";
        $ini += strlen($start);
        $len = strpos($string,$end,$ini) - $ini;
        return substr($string,$ini,$len);
    }
}
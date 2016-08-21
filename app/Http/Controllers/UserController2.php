<?php
namespace Salesfly\Http\Controllers;
use Illuminate\Http\Request;
use Salesfly\Http\Requests;
use Salesfly\Http\Controllers\Controller;
use Salesfly\User;
use Validator;
use Salesfly\Salesfly\Repositories\UserRepo;
use Salesfly\Salesfly\Managers\UserManager;
use Intervention\Image\Facades\Image;
class UserController2 extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    protected $userRepo;
    public function __construct(UserRepo $userRepo)
    {
        $this->userRepo = $userRepo;
    }
    public function index()
    {
        //
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
     protected function create1(array $data)
    {
        //var_dump("expression");die();
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'store_id' => $data['store_id'],
            'role_id' => $data['role_id'],
            'estado' => $data['estado']
            //'image' => $data['image']
        ]);
    }
     protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|confirmed|min:6',
            'store_id' => 'required|integer',
            'role_id' => 'required|integer',
            'estado' => 'required|integer',
            'image' => ''
        ]);
    }
    public function create(Request $request)
    {
         //var_dump($request->all());die();
       
        //Auth::login($this->create($request->all()));
         $validator = $this->validator($request->all());
        if ($validator->fails()) {
            $this->throwValidationException(
                $request, $validator
            );
        }
        $user = $this->create1($request->except('image'));
        if($request->has('image') and substr($request->input('image'),5,5) === 'image'){
            $image = $request->input('image');
            $mime = $this->get_string_between($image,'/',';');
            $image = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));
            Image::make($image)->resize(200,200)->save('images/users/'.$user->id.'.'.$mime);
            $user->image='/images/users/'.$user->id.'.'.$mime;
            $user->save();
        }else{
            $user->image='/images/users/default.jpg';
            $user->save();
        }
        //return redirect($this->redirectPath());
        return response()->json(['estado'=>true]);
    }
     public function get_string_between($string, $start, $end){
        $string = " ".$string;
        $ini = strpos($string,$start);
        if ($ini == 0) return "";
        $ini += strlen($start);
        $len = strpos($string,$end,$ini) - $ini;
        return substr($string,$ini,$len);
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        //
    }
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
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
    protected function validatorEdit(array $data)
    {
        $user = User::find($data['id']);
        return Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.$user->id,
            'store_id' => 'required|integer',
            'role_id' => 'required|integer',
            'estado' => 'required|integer',
            'image' => ''
        ]);
    }
     protected function validatorChangePasword(array $data)
    {
        $user = User::find($data['id']);
        return Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.$user->id,
            'password' => 'required|confirmed|min:6',
            'store_id' => 'required|integer',
            'role_id' => 'required|integer',
            'estado' => 'required|integer',
            'image' => ''
        ]);
    }
    public function edit(Request $request)
    {//var_dump($request->all());die();
        $validator = $this->validatorEdit($request->all());
        if ($validator->fails()) {
            $this->throwValidationException(
                $request, $validator
            );
        }
        $user1 = User::find($request->input('id'));
        //var_dump($Ttype);
        //die(); 
        //$user = new UserManager($user1,$request->except('image','password'));
        //$user->save();
        if($request->has('image') and substr($request->input('image'),5,5) === 'image'){
            $image = $request->input('image');
            $mime = $this->get_string_between($image,'/',';');
            $image = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));
            Image::make($image)->resize(200,200)->save('images/users/'.$user1->id.'.'.$mime);
            $request->merge(["image"=>'/images/users/'.$user1->id.'.'.$mime]);
            $user = new UserManager($user1,$request->all());
            $user->save();
        }else{
            //$user->image='/images/users/default.jpg';
            //$request->merge(["image"=>'/images/users/default.jpg']);
            $user = new UserManager($user1,$request->all());
            $user->save();
        }
        //return redirect($this->redirectPath());
        return response()->json(['estado'=>true]);
    }
    public function editpassword(Request $request)
    {//var_dump($request->all());die();
        $validator = $this->validatorChangePasword($request->all());
        if ($validator->fails()) {
            $this->throwValidationException(
                $request, $validator
            );
        }
        $user1 = User::find($request->input('id'));
        //var_dump($Ttype);
        //die(); 
        //$user = new UserManager($user1,$request->except('image','password'));
        //$user->save();
        if($request->has('image') and substr($request->input('image'),5,5) === 'image'){
            $image = $request->input('image');
            $mime = $this->get_string_between($image,'/',';');
            $image = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));
            Image::make($image)->resize(200,200)->save('images/users/'.$user1->id.'.'.$mime);
            $request->merge(["image"=>'/images/users/'.$user1->id.'.'.$mime]);
            $user = new UserManager($user1,$request->all());
            $user->save();
        }else{
            //$user->image='/images/users/default.jpg';
            $request->merge(["image"=>'/images/users/default.jpg']);
            $user = new UserManager($user1,$request->all());
            $user->save();
        }
        //return redirect($this->redirectPath());
        return response()->json(['estado'=>true]);
        
    }
    public function destroy(Request $request)
    {
         $user1 = User::find($request->input('id'));
        $user1->delete();
        //Event::fire('update.Ttype',$Ttype->all());
        return response()->json(['estado'=>true]);
    }
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
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    
}
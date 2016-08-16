<?php
namespace Salesfly\Salesfly\Managers;
class UserManager extends BaseManager {

    public function getRules()
    {
        $rules = [              
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|confirmed|min:6',
            'password_confirmation'=>'min:6|same:pass',
            'store_id' => 'required|integer',
            'role_id' => 'required|integer',
            'estado' => 'required|integer',
            'image' => ''
                  ];
        return $rules;
    }}
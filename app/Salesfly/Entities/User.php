<?php
namespace Salesfly\Salesfly\Entities;

class User extends \Eloquent {

	protected $table = 'Users';
    
    protected $fillable = ['name', 'email', 'password','image','store_id','role_id','estado','password_confirmation'];

}
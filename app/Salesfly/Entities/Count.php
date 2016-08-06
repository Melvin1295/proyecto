<?php
namespace Salesfly\Salesfly\Entities;

class Count extends \Eloquent {

	protected $table = 'counts';
    
    protected $fillable = ['banco',
    						'NumCuenta',
    						'supplier_id'];
}
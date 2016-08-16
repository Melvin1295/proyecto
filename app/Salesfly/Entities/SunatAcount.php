<?php
namespace Salesfly\Salesfly\Entities;
use Illuminate\Database\Eloquent\Model;
class SunatAcount extends \Eloquent {
    protected $table = 'SunatAcounts';
    
    protected $fillable = [ 
                    'codigo',
                    'nombre'];
    
}
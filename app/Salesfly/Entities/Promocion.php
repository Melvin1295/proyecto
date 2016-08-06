<?php
namespace Salesfly\Salesfly\Entities;

class Promocion extends \Eloquent {

	protected $table = 'promocion';
    
    protected $fillable = ['descripcion',
                            'cantidad',
    						'productBase_id',
    						'product_id',
    						'fecha_inicio',
    						'fecha_fin',
    						'descuento',
    						'estado'
    						];
}
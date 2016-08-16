<?php
namespace Salesfly\Salesfly\Repositories;
use Salesfly\Salesfly\Entities\SunatAcount;
class SunatAcountRepo extends BaseRepo{
    
    public function getModel()
    {
        return new SunatAcount;
    }
    
    
} 
<?php

namespace Salesfly\Salesfly\Repositories;

use Salesfly\Salesfly\Entities\Product;
use Salesfly\Salesfly\Entities\Variant;

class ProductRepo extends BaseRepo{

    public function getModel(){
        return new Product;
    }
    public function encontrarUltimo(){
         $products = Product::select("id")
         ->orderBy("id",'desc')
         ->first();
         return $products;
    }
     public function cantidadProductos(){
        $products = Product::leftjoin('variants','products.id','=','variants.product_id')
                             ->select(\DB::raw('(select COUNT(*) as cantProductos from variants) as cantidad,(select SUM(stock.stockActual)  from stock ) as stockA'))
                             ->groupBy('variants.id')
                             ->first();
        return $products;
   }
    public function search($q)
    {
        //$promotion =Product::select('id','nombre','codigo','estado')->where('nombre','like', $q.'%')
        //            //with(['customer','employee'])
        //            ->paginate(15);
        //return $promotion;
        $products = Product::leftjoin('brands','products.brand_id','=','brands.id')
            ->join('types','products.type_id','=','types.id')
            ->leftjoin('variants','products.id','=','variants.product_id')
            ->leftjoin('detPres','variants.id','=','detPres.variant_id')
            ->leftjoin('presentation','detPres.presentation_id','=','presentation.id')
            ->leftjoin('stock','stock.variant_id','=','variants.id')
            ->leftjoin('users','users.id','=','products.user_id')
            ->select(\DB::raw('DISTINCT(products.id) as proId'),'products.image','products.codigo as proCodigo','products.nombre as proNombre',
                'variants.suppPri as varPrice','variants.price as precioProducto','users.name as userNombre','products.estado as proEstado',
                'brands.nombre as braNombre','products.hasVariants as TieneVariante','products.hasVariants as proHasVar','types.nombre as typNombre','products.created_at as proCreado',
                \DB::raw('(select count(variants.id) from products inner join variants on products.id = variants.product_id
where products.hasVariants = true
and products.id = proId) as proQuantvar'),
                \DB::raw('(SELECT sum(stock.stockActual)
FROM products
INNER JOIN variants ON products.id = variants.product_id
INNER JOIN stock ON variants.id = stock.variant_id
WHERE products.id = proId) as stoStockActual'),
                \DB::raw('( SELECT detPres.price
FROM products
INNER JOIN variants ON products.id = variants.product_id
INNER JOIN detPres ON variants.id = detPres.variant_id
INNER JOIN presentation ON detPres.presentation_id = presentation.id
WHERE products.presentation_base = presentation.id and products.id = proId and products.hasVariants = false ) as detPresPri'))
            //->having()
            ->groupBy('products.id')            
            ->where('products.nombre','like',$q.'%')
            ->orWhere('products.codigo','like',$q.'%')
            ->orWhere('types.nombre','like',$q.'%')
            ->orWhere('brands.nombre','like',$q.'%')
            ->orderBy('types.id','asc')
            ->paginate(15);
        return $products;
    }
    public function searchProducts($q)
    {
        $products =Product::select('id','nombre')
                    //with(['customer','employee'])
                    ->get();
        return $products;
    }
    public function searchProductAddVariant($q)
    {
        $products =Product::select('id','nombre','codigo','estado','hasVariants')
                    //with(['customer','employee'])
                    ->where('nombre','like', $q.'%')
                    ->where('estado','=','1')
                    ->orWhere('codigo','like',$q.'%')
                    ->paginate(20);
        return $products;
    }

    public function paginate($qantity){
        //$products = $this->getModel()->with('brand','type')->_variant->paginate($qantity);
        //$products = Product::find(1)->variant; trae 1
        //$products = Product::find(1)->variants; trae todos
        //$products = $this->getModel()->with('brand','type','variant')->paginate($qantity);
        //$productsNovariants = Product::join('brands','products.brand_id','=','brands.id')
       //                    ->join('types','products.type_id','=','types.id')
         //                   ->join('variants','products.id','=','variants.product_id')
        //                    ->where('products.hasVariants',false)
         //                   ->select('products.id as proId','products.codigo as proCodigo','products.nombre as proNombre','variants.price as varPrice',
         //                       'brands.nombre as braNombre','types.nombre as typNombre','products.created_at as proCreado',
         //                       \DB::raw('"0" as variantes'),\DB::raw('"0" as stoStockActual') )
         //                   ->paginate($qantity);
                            //->get();

        //$productsSivariants =  Product::join('brands','products.brand_id','=','brands.id')
          //                  ->join('types','products.type_id','=','types.id')
          //                  ->join('variants','products.id','=','variants.product_id')
          //                  ->where('products.hasVariants',true)
          //                  ->select(\DB::raw('DISTINCT(products.id) as proId'),'products.codigo as proCodigo','products.nombre as proNombre','variants.price as varPrice',
          //                      'brands.nombre as braNombre','types.nombre as typNombre','products.created_at as proCreado',
          //                  \DB::raw('COUNT(variants.id) as variantes'),\DB::raw('"0" as stoStockActual') )
          //                  ->groupBy('products.id')
          //                  ->paginate($qantity);
                            //->get();

        //$products = array_merge($productsNovariants->toArray(),$productsSivariants->toArray());

        //$pp = $productsNovariants->toArray();
        //$pp2 = $productsSivariants->toArray();
        //$products = array_merge($pp['data'],$pp2['data']);
        //print_r($products);
        //die();

        //return $products;

        $products = Product::leftjoin('brands','products.brand_id','=','brands.id')
                            ->leftjoin('types','products.type_id','=','types.id')
                            ->leftjoin('variants','products.id','=','variants.product_id')
                            ->leftjoin('detPres','variants.id','=','detPres.variant_id')
                            ->leftjoin('presentation','detPres.presentation_id','=','presentation.id')
                            ->leftjoin('stock','stock.variant_id','=','variants.id')
                            ->leftjoin('users','users.id','=','products.user_id')
                            ->select(\DB::raw('DISTINCT(products.id) as proId'),'products.image','products.codigo as proCodigo','products.nombre as proNombre',
                              'variants.suppPri as varPrice','variants.price as precioProducto','users.name as userNombre','products.estado as proEstado',
                               'brands.nombre as braNombre','products.hasVariants as TieneVariante','products.hasVariants as proHasVar','types.nombre as typNombre','products.created_at as proCreado',
                              \DB::raw('(select count(variants.id) from products inner join variants on products.id = variants.product_id
where products.hasVariants = true
and products.id = proId) as proQuantvar'),
                                    \DB::raw('(SELECT sum(stock.stockActual)
FROM products
INNER JOIN variants ON products.id = variants.product_id
INNER JOIN stock ON variants.id = stock.variant_id
WHERE products.id = proId) as stoStockActual'),
                                \DB::raw('( SELECT detPres.price
FROM products
INNER JOIN variants ON products.id = variants.product_id
INNER JOIN detPres ON variants.id = detPres.variant_id
INNER JOIN presentation ON detPres.presentation_id = presentation.id
WHERE products.presentation_base = presentation.id and products.id = proId and products.hasVariants = false ) as detPresPri'))
                            //->having()
                            ->groupBy('products.id')
                            ->orderBy('types.id','asc')
                            ->paginate($qantity);
        return $products;
    }
    public function Autocomplit(){
            $products = Product::leftjoin('variants','products.id','=','variants.product_id')
                            ->leftjoin("detAtr","variants.id","=","detAtr.variant_id")
                            ->leftjoin('brands','products.brand_id','=','brands.id')
                            ->leftjoin('types','products.type_id','=','types.id')
                            ->leftjoin('materials','materials.id','=','products.material_id')
                            //->leftjoin('variants','products.id','=','variants.product_id')
                            //->leftjoin("atributes","atributes.id","=","detAtr.atribute_id")
                            ->select(\DB::raw('products.id as proId,brands.nombre as BraName,types.nombre as TName,products.codigo as proCodigo,products.nombre as proNombre,
                              variants.id as varid,variants.sku as varcode,variants.suppPri as varPrice,variants.price as precioProducto,
                               products.hasVariants as TieneVariante,products.created_at as proCreado,brands.id as BraID,materials.id as MId
                              ,(SELECT (detAtr.descripcion ) FROM variants
                                INNER JOIN detAtr ON detAtr.variant_id = variants.id
                                INNER JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=varid and atributes.id=4
                                GROUP BY variants.id)as Mnombre,
                              variants.codigo as varCodigo,detAtr.descripcion as descripcion,products.quantVar as proQuantvar,(SELECT GROUP_CONCAT(CONCAT(detAtr.descripcion) SEPARATOR "/") FROM variants
                                INNER JOIN detAtr ON detAtr.variant_id = variants.id
                                INNER JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=varid
                                GROUP BY variants.id) as NombreAtributos'))->groupBy('variants.codigo')
                            ->paginate();

                              /*,(SELECT GROUP_CONCAT(detAtr.descripcion SEPARATOR "-") FROM variants
                                INNER JOIN detAtr ON detAtr.variant_id = variants.id
                                INNER JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=varid
                                GROUP BY variants.id) as NombreAtributos'))->groupBy('variants.id')
                            ->paginate(15);*/

        return $products;
    }
     public function Autocomplit2(){
            $products = Product::leftjoin('variants','products.id','=','variants.product_id')
                            ->leftjoin("detAtr","variants.id","=","detAtr.variant_id")
                            ->leftjoin('brands','products.brand_id','=','brands.id')
                            ->leftjoin('types','products.type_id','=','types.id')
                            ->leftjoin('materials','materials.id','=','products.material_id')
                            //->leftjoin('variants','products.id','=','variants.product_id')
                            //->leftjoin("atributes","atributes.id","=","detAtr.atribute_id")
                            ->select(\DB::raw('products.id as proId,brands.nombre as BraName,types.nombre as TName,products.codigo as proCodigo,products.nombre as proNombre,
                              variants.id as varid,variants.sku as varcode,variants.suppPri as varPrice,variants.price as precioProducto,
                               products.hasVariants as TieneVariante,products.created_at as proCreado,brands.id as BraID,materials.id as MId
                              ,materials.nombre as Mnombre,variants.codigo as varCodigo,detAtr.descripcion as descripcion,products.quantVar as proQuantvar,(SELECT GROUP_CONCAT(CONCAT(detAtr.descripcion) SEPARATOR "/") FROM variants
                                INNER JOIN detAtr ON detAtr.variant_id = variants.id
                                INNER JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=varid
                                GROUP BY variants.id) as NombreAtributos'))->groupBy('variants.id')
                            ->paginate();


        return $products;
    }
    public function find10($id){
         $products = Product::leftjoin('variants','products.id','=','variants.product_id')
                          ->select(\DB::raw('COUNT(variants.id) as cantidad'))
                          ->where('variants.product_id',"=",$id)
                          ->first();
        return $products;
    }
    public function find($id){
        $oProduct = Product::find($id);

        $product = $oProduct->load(['station','type','brand','material']);

        return $product;
    }

    public function pag()
    {

        /*$products = Product::with(['variants' => function ($query) {
            $query->join('detPres', 'variants.id', '=', 'detPres.variant_id')
                ->join('presentation','presentation.id','=','detPres.presentation_id')
                //->join('productss','products.presentation_base','=','presentation.id')
                //->select('detPres.price')
                //->first();
                ->where('presentation.id', 'products.presentation_base');
        }])->get();
        */



        //$products = Product::with(['brand'])->get();

        //return $products;
        /*$variants = $product->variants->load(['detAtr' => function ($query) {
            $query->orderBy('atribute_id', 'asc');
        },'product','detPre' => function($query) use ($product){
            $query->join('presentation','presentation.id','=','detPres.presentation_id')
                ->where('presentation.id',$product->presentation_base);
        },'stock' => function($query){
            $query->where('warehouse_id',1);
        }]);
        */


    }

    public function misDatos($store,$were,$q){
      $datos = \DB::table('products')->leftjoin('materials','products.material_id','=','materials.id')
                           ->leftjoin('variants','products.id','=','variants.product_id')
                            ->leftjoin('stock','variants.id','=','stock.variant_id')
                            ->leftjoin('warehouses','warehouses.id','=','stock.warehouse_id')
                            ->leftjoin('stores','stores.id','=','warehouses.store_id')
                            ->leftjoin('presentation as T1','T1.id','=','products.presentation_base')
                            ->leftjoin('equiv','equiv.preFin_id','=','T1.id')
                            ->join('detPres','detPres.variant_id','=','variants.id')
                            ->join('presentation as T2','T2.id','=','detPres.presentation_id')
                            ->select(\DB::raw('variants.puntos,variants.sku as SKU ,detPres.id as detPre_id,variants.id as vari ,
                                (SELECT stockActual FROM stock where warehouse_id<>'.$were.' and variant_id=vari)
                                    as stock2,stock.stockActual+(SELECT stockActual FROM stock where warehouse_id<>'.$were.' and variant_id=vari) as totStock,

                                IF(products.hasVariants=1 , CONCAT(products.nombre,"(",products.nombre,"/ ",(SELECT GROUP_CONCAT(CONCAT(atributes.shortname,":",detAtr.descripcion) SEPARATOR " /")
                                 FROM variants
                                LEFT JOIN detAtr ON detAtr.variant_id = variants.id
                                LEFT JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=vari
                                GROUP BY variants.id),")"),  products.nombre ) as NombreProducto,
                                materials.nombre as Material,
                              warehouses.nombre as Almacen,stock.stockActual as Stock,detPres.price as precioProducto,

                                detPres.fecIniDscto as FechaInicioDescuento,detPres.fecFinDscto as FechaFinDescuento,
                                detPres.dsctoRange as DescuentoConFecha,detPres.dscto as DescuentoSinFecha,

                              stock.stockPedidos as stockPedidos,stock.stockSeparados as stockSeparados,
                               IF(products.hasVariants=1 , CONCAT(products.nombre,"/ ",(SELECT GROUP_CONCAT(CONCAT(detAtr.descripcion) SEPARATOR " /") FROM variants
                                LEFT JOIN detAtr ON detAtr.variant_id = variants.id
                                LEFT JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=vari
                                GROUP BY variants.id)),  CONCAT(products.nombre) ) as NombreAtributos , T1.nombre as Base, T2.nombre as Presentacion, products.presentation_base, warehouses.id as idAlmacen,
                            equiv.cant as equivalencia, variants.favorite as favorite, variants.codigo as NombreAtributo'))
                             
                              //'T1.nombre as Base')
                            ->where('stores.id','=',$store)
                            ->where('warehouses.id','=',$were)
                            ->where('variants.codigo','like', $q.'%')
                            ->where('T2.base','=','1')
                            /////--------------------
                            ->where('products.estado','=','1')
                            ->where('variants.estado','=','1')
                            /////--------------------
                            //->where('variants.estado','=','1')
                            //->where('products.estado','=','1')
                            ->orWhere('stores.id','=',$store)
                            ->where('warehouses.id','=',$were)
                            ->where('products.nombre','like','%'.$q.'%')
                            ->where('T2.base','=','1')
                            /////--------------------
                            ->where('products.estado','=','1')
                            ->where('variants.estado','=','1')

                            
                            /////--------------------
                            //->where('variants.estado','=','1')
                            //->where('products.estado','=','1')
                            /////--------------------
                            ->groupBy('variants.id')
                            ->get();
            return $datos;
    }

    public function searchsku($store,$were,$q){
      $datos = \DB::table('products')->leftjoin('materials','products.material_id','=','materials.id')
                           ->leftjoin('variants','products.id','=','variants.product_id')
                            ->leftjoin('stock','variants.id','=','stock.variant_id')
                            ->leftjoin('warehouses','warehouses.id','=','stock.warehouse_id')
                            ->leftjoin('stores','stores.id','=','warehouses.store_id')
                            ->leftjoin('presentation as T1','T1.id','=','products.presentation_base')
                            ->leftjoin('equiv','equiv.preFin_id','=','T1.id')
                            ->join('detPres','detPres.variant_id','=','variants.id')             
                            ->join('presentation as T2','T2.id','=','detPres.presentation_id')
                            ->select(\DB::raw('variants.puntos,variants.sku as SKU ,detPres.id as detPre_id,variants.id as vari ,(SELECT stockActual FROM stock where warehouse_id<>'.$were.' and variant_id=vari)
                                    as stock2,stock.stockActual+(SELECT stockActual FROM stock where warehouse_id<>'.$were.' and variant_id=vari) as totStock,

                                IF(products.hasVariants=1 , CONCAT(products.nombre,"(",products.nombre,"/ ",(SELECT GROUP_CONCAT(CONCAT(atributes.shortname,":",detAtr.descripcion) SEPARATOR " /")
                                 FROM variants
                                LEFT JOIN detAtr ON detAtr.variant_id = variants.id
                                LEFT JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=vari
                                GROUP BY variants.id),")"),  products.nombre ) as NombreProducto,

                                materials.nombre as Material,
                                stock.stockPedidos as stockPedidos,stock.stockSeparados as stockSeparados,
                              warehouses.nombre as Almacen,stock.stockActual as Stock,detPres.price as precioProducto,
                        
                                detPres.fecIniDscto as FechaInicioDescuento,detPres.fecFinDscto as FechaFinDescuento,
                                IF(detPres.activateDsctoRange >= 1, detPres.dsctoRange ,0) as DescuentoConFecha,detPres.dscto as DescuentoSinFecha,
                                detPres.activateDsctoRange,
                              IF(products.hasVariants=1 , CONCAT(products.nombre,"/ ",(SELECT GROUP_CONCAT(CONCAT(detAtr.descripcion) SEPARATOR " /") FROM variants
                                LEFT JOIN detAtr ON detAtr.variant_id = variants.id
                                LEFT JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=vari
                                GROUP BY variants.id)),  CONCAT(products.nombre) ) as NombreAtributos , T1.nombre as Base, T2.nombre as Presentacion, products.presentation_base, warehouses.id as idAlmacen,
                            equiv.cant as equivalencia, variants.favorite as favorite, variants.codigo as NombreAtributo'))
                             
                              //'T1.nombre as Base')
                            ->where('stores.id','=',$store)
                            ->where('warehouses.id','=',$were)
                            ->where('variants.sku','=', $q)
                            ->orWhere('variants.sku2','=',$q)
                            /////--------------------
                            ->where('products.estado','=','1')
                            //->where('variants.estado','=','1')
                            /////--------------------
                            //->where('variants.codigo','like', $q.'%')
                            ->where('T2.base','=','1')
                            ->groupBy('variants.id')
                            ->get();
            return $datos;
    }
    public function searchsku2($store,$were,$q){
      $datos = \DB::table('products')->leftjoin('materials','products.material_id','=','materials.id')
                           ->leftjoin('variants','products.id','=','variants.product_id')
                            ->leftjoin('stock','variants.id','=','stock.variant_id')
                            ->leftjoin('warehouses','warehouses.id','=','stock.warehouse_id')
                            ->leftjoin('stores','stores.id','=','warehouses.store_id')
                            ->join('detPres','detPres.variant_id','=','variants.id')
                            ->leftjoin('presentation as T1','T1.id','=','detPres.presentation_id')
                            ->leftjoin('equiv','equiv.preFin_id','=','T1.id')
                                         
                            ->join('presentation as T2','T2.id','=','detPres.presentation_id')
                            ->select(\DB::raw('variants.puntos,variants.sku as SKU ,detPres.id as detPre_id,variants.id as vari ,

                                IF(products.hasVariants=1 , CONCAT(products.nombre,"(",products.nombre,"/ ",(SELECT GROUP_CONCAT(CONCAT(atributes.shortname,":",detAtr.descripcion) SEPARATOR " /")
                                 FROM variants
                                LEFT JOIN detAtr ON detAtr.variant_id = variants.id
                                LEFT JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=vari
                                GROUP BY variants.id),")"),  products.nombre ) as NombreProducto,

                                materials.nombre as Material,
                                stock.stockPedidos as stockPedidos,stock.stockSeparados as stockSeparados,
                              warehouses.nombre as Almacen,stock.stockActual as Stock,detPres.price as precioProducto,

                                detPres.fecIniDscto as FechaInicioDescuento,detPres.fecFinDscto as FechaFinDescuento,
                                detPres.dsctoRange as DescuentoConFecha,detPres.dscto as DescuentoSinFecha,

                              IF(products.hasVariants=1 , CONCAT(products.nombre,"/ ",(SELECT GROUP_CONCAT(CONCAT(detAtr.descripcion) SEPARATOR " /") FROM variants
                                LEFT JOIN detAtr ON detAtr.variant_id = variants.id
                                LEFT JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=vari
                                GROUP BY variants.id)),  CONCAT(products.nombre) ) as NombreAtributos , T1.nombre as Base, T2.nombre as Presentacion, products.presentation_base, warehouses.id as idAlmacen,
                            equiv.cant as equivalencia, variants.favorite as favorite, variants.codigo as NombreAtributo '))
                             
                              //'T1.nombre as Base')
                            ->where('stores.id','=',$store)
                            ->where('warehouses.id','=',$were)
                            ->where('variants.sku','=', $q)
                            ->orWhere('variants.sku2','=',$q)
                            /////--------------------
                            ->where('products.estado','=','1')
                            //->where('variants.estado','=','1')
                            /////--------------------
                            //->where('variants.codigo','like', $q.'%')
                            ->where('T2.base','=','0')
                            ->groupBy('variants.id')
                            ->get();
            return $datos;
    }
    public function DatosVarinatAgrupado($q){
      $datos = \DB::table('products')->join('variants','products.id','=','variants.product_id')
                           ->join('detAtr','detAtr.variant_id','=','variants.id')
                           ->select(\DB::raw('products.id,variants.puntos,variants.sku as SKU ,variants.id as vari ,

                                IF(products.hasVariants=1 , products.nombre,  products.nombre ) as NombreProducto
                              '))
                              //'T1.nombre as Base')
                            ->where('detAtr.atribute_id','=',1)
                            ->where('products.nombre','like',$q.'%')  
                            ->groupBy('products.id')
                            ->get();
            return $datos;
    }

    public function misDatosVariantes($store,$were,$q){
      $datos = \DB::table('products')->leftjoin('materials','products.material_id','=','materials.id')
                           ->leftjoin('variants','products.id','=','variants.product_id')
                            ->leftjoin('stock','variants.id','=','stock.variant_id')
                            ->leftjoin('warehouses','warehouses.id','=','stock.warehouse_id')
                            ->leftjoin('stores','stores.id','=','warehouses.store_id')
                            ->leftjoin('presentation as T1','T1.id','=','products.presentation_base')
                            
                            ->join('detPres','detPres.variant_id','=','variants.id')

                            ->join('presentation as T2','T2.id','=','detPres.presentation_id')
                            ->leftjoin('equiv','equiv.preFin_id','=','T2.id')
                             ->select(\DB::raw('variants.puntos,variants.sku as SKU ,detPres.id as detPre_id,variants.id as vari ,(SELECT stockActual FROM stock where warehouse_id<>'.$were.' and variant_id=vari)
                                    as stock2,stock.stockActual+(SELECT stockActual FROM stock where warehouse_id<>'.$were.' and variant_id=vari) as totStock,

                                IF(products.hasVariants=1 , CONCAT(products.nombre,"(",products.nombre,"/ ",(SELECT GROUP_CONCAT(CONCAT(atributes.shortname,":",detAtr.descripcion) SEPARATOR " /")
                                 FROM variants
                                LEFT JOIN detAtr ON detAtr.variant_id = variants.id
                                LEFT JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=vari
                                GROUP BY variants.id),")"),  products.nombre ) as NombreProducto,

                                materials.nombre as Material,
                                stock.stockPedidos as stockPedidos,stock.stockSeparados as stockSeparados,
                              warehouses.nombre as Almacen,stock.stockActual as Stock,detPres.price as precioProducto,

                                detPres.fecIniDscto as FechaInicioDescuento,detPres.fecFinDscto as FechaFinDescuento,
                                detPres.dsctoRange as DescuentoConFecha,detPres.dscto as DescuentoSinFecha,
                                detPres.activateDsctoRange,

                              IF(products.hasVariants=1 , CONCAT(products.nombre,"/ ",(SELECT GROUP_CONCAT(CONCAT(detAtr.descripcion) SEPARATOR " /") FROM variants
                                LEFT JOIN detAtr ON detAtr.variant_id = variants.id
                                LEFT JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=vari
                                GROUP BY variants.id)),  CONCAT(products.nombre) ) as NombreAtributos , T1.nombre as Base, T2.nombre as Presentacion, products.presentation_base, warehouses.id as idAlmacen,
                            equiv.cant as equivalencia, variants.favorite as favorite, variants.codigo as NombreAtributo'))
                              //'T1.nombre as Base')
                            ->where('stores.id','=',$store)
                            ->where('warehouses.id','=',$were)
                            //->where('products.nombre','like', $q.'%')
                            //->where('T2.base','like','%%')
                            //->groupBy('variants.id')
                            ->where('variants.id','=',$q)
                            ->get();
            return $datos;
    }
    public function consultaProductos($codigo,$marca,$linea,$busColor,$busTaco,$busTalla,$busMate){
      if($codigo=='undefined' || empty($codigo)){$codigo="%%";}else{}
      if($marca==0 || empty($marca) ){$marca="%%";}else{}
      if($linea==0 || empty($linea) ){$linea="%%";}else{}
      if($busColor=='undefined'|| empty($busColor) ){$busColor="%%";}else{}
      if($busTaco=='undefined' || empty($busTaco) ){$busTaco="%%";}else{}
      if($busTalla=='undefined' || empty($busTalla) ){$busTalla="%%";}else{}
      if($busMate=='undefined' || empty($busMate) ){$busMate="%%";}else{}
       $products = Product::leftjoin('brands','products.brand_id','=','brands.id')
                            ->leftjoin('types','products.type_id','=','types.id')
                            ->leftjoin('variants','products.id','=','variants.product_id')
                            ->leftjoin('detPres','variants.id','=','detPres.variant_id')
                            ->leftjoin('presentation','detPres.presentation_id','=','presentation.id')
                            ->leftjoin('stock','stock.variant_id','=','variants.id')
                            ->select('variants.codigo','variants.sku','variants.id as varid','products.estado as proEstado',
                               'brands.nombre as braNombre','products.hasVariants as TieneVariante','types.nombre as typNombre',
                              \DB::raw('(select dt.descripcion from detAtr dt inner join variants v on v.id=dt.variant_id inner join atributes atr on atr.id=dt.atribute_id where v.id=varid and atr.nombre="Color" and dt.descripcion like "'.$busColor.'%") as color'),
                              \DB::raw('(SELECT sum(stock.stockActual)
      
FROM products
INNER JOIN variants ON products.id = variants.product_id
INNER JOIN stock ON variants.id = stock.variant_id
WHERE variants.id = varid) as stoStockActual'),
                              \DB::raw('(select dt.descripcion from detAtr dt inner join variants v on v.id=dt.variant_id inner join atributes atr on atr.id=dt.atribute_id where v.id=varid and atr.nombre="Talla" and dt.descripcion like "'.$busTalla.'%") as Talla'),
                              \DB::raw('(select dt.descripcion from detAtr dt inner join variants v on v.id=dt.variant_id inner join atributes atr on atr.id=dt.atribute_id where v.id=varid and atr.nombre="Taco" and dt.descripcion like "'.$busTaco.'%") as Taco'),
                              \DB::raw('(select dt.descripcion from detAtr dt inner join variants v on v.id=dt.variant_id inner join atributes atr on atr.id=dt.atribute_id where v.id=varid and atr.nombre="Material" and dt.descripcion like "'.$busMate.'%") as Material'),
                              'detPres.suppPri','detPres.price'
                              )
                            //->having()
                            ->where('variants.codigo','like',$codigo.'%')
                            ->where('brands.id','like',$marca.'%')
                            ->where('types.id','like',$linea.'%')                            
                            ->groupBy('variants.id')
                            ->paginate(15);
        return $products;
    }
     public function FavoritosCabecera(){
      $datos = \DB::table('products')->join('variants','products.id','=','variants.product_id')
                           ->join('detAtr','detAtr.variant_id','=','variants.id')
                           ->join("promocion","promocion.productBase_id","=","variants.id")
                           ->select(\DB::raw('promocion.numero as numPromo,products.id,variants.puntos,variants.sku as SKU ,variants.id as vari ,

                                IF(products.hasVariants=1 , products.nombre,  products.nombre ) as NombreProducto,detAtr.descripcion
                              '))
                              //'T1.nombre as Base')
                            ->where('detAtr.atribute_id','=',1)
                            ->where('variants.favorite','=',0)
                            ->groupBy('promocion.numero')
                            ->paginate(1000);
            return $datos;
    }
    public function favoritos($store,$were,$q){
      $datos = \DB::table('products')->leftjoin('materials','products.material_id','=','materials.id')
                           ->leftjoin('variants','products.id','=','variants.product_id')
                            ->leftjoin('stock','variants.id','=','stock.variant_id')
                            ->leftjoin('warehouses','warehouses.id','=','stock.warehouse_id')
                            ->leftjoin('stores','stores.id','=','warehouses.store_id')
                            ->leftjoin('presentation as T1','T1.id','=','products.presentation_base')
                            ->join("promocion","promocion.productBase_id","=","variants.id")
                            ->leftjoin('detPres','detPres.variant_id','=','variants.id')

                            ->join('presentation as T2','T2.id','=','detPres.presentation_id')
                            ->leftjoin('equiv','equiv.preFin_id','=','T2.id')
                            ->select(\DB::raw('promocion.numero ,promocion.product_id as promo,promocion.cantidad as cantPromo,promocion.descuento as decuentoPromo,products.id as productID,variants.sku as SKU ,detPres.id as detPre_id,variants.id as vari ,

                                IF(products.hasVariants=1 , CONCAT(products.nombre,"(",(SELECT GROUP_CONCAT(CONCAT(detAtr.descripcion) SEPARATOR " /")
                                 FROM variants
                                LEFT JOIN detAtr ON detAtr.variant_id = variants.id
                                LEFT JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=vari
                                GROUP BY variants.id),")"),  products.nombre ) as NombreProducto,

                                materials.nombre as Material,
                              warehouses.nombre as Almacen,stock.stockActual as Stock,detPres.price as precioProducto,

                                detPres.fecIniDscto as FechaInicioDescuento,detPres.fecFinDscto as FechaFinDescuento,
                                detPres.dsctoRange as DescuentoConFecha,detPres.dscto as DescuentoSinFecha,

                              stock.stockPedidos as stockPedidos,stock.stockSeparados as stockSeparados,
                               IF(products.hasVariants=1 , CONCAT((SELECT GROUP_CONCAT(CONCAT(detAtr.descripcion) SEPARATOR " /") FROM variants
                                LEFT JOIN detAtr ON detAtr.variant_id = variants.id
                                LEFT JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=vari and detAtr.atribute_id <> 1
                                GROUP BY variants.id)),  CONCAT(products.nombre) ) as NombreAtributos ,(SELECT products.nombre FROM variants
                                INNER JOIN products on products.id=variants.product_id
                                where variants.id=promo 
                                GROUP BY products.id) as nomProduct2,
                                IF(products.hasVariants=1 ,CONCAT((SELECT GROUP_CONCAT(CONCAT(detAtr.descripcion) SEPARATOR " /") FROM variants
                                LEFT JOIN detAtr ON detAtr.variant_id = variants.id
                                INNER JOIN products on products.id=variants.product_id
                                LEFT JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=promo 
                                GROUP BY variants.id)),  CONCAT(products.nombre) ) as NombreAtributos2, T1.nombre as Base, T2.nombre as Presentacion, products.presentation_base, warehouses.id as idAlmacen
                              ,T2.base as base, equiv.cant as equivalencia, variants.favorite as favorite,variants.codigo as NombreAtributo '))
                             
                              //'T1.nombre as Base')
                            ->where('stores.id','=',$store)
                            ->where('warehouses.id','=',$were)
                            //->where('products.nombre','like', $q.'%')
                            ->where('products.estado','=','1')
                            ->where('variants.estado','=','1')
                            
                            ->where('T2.base','like','1')
                            ->groupBy('promocion.id')
                            ->where('variants.favorite','=','0')
                            ->get();
            return $datos;
    }

    public function variantsAllInventary($store,$were,$q,$type,$brand,$product){
        
      if ($store==0) {$store='%%';$simbolo3='like';}else{$simbolo3='=';}
      if ($were==0) {$were='%%';$simbolo2='like';}else{$simbolo2='=';}
      if ($type==0) {$type='%%';$simbolo1='like';}else{$simbolo1='=';}
      if ($brand==0) {$brand='%%';$simbolo='like';}else{$simbolo='=';}
      if ($product=='0') {$product='%';}
      //var_dump($product);die();
      $datos = \DB::table('products')->leftjoin('materials','products.material_id','=','materials.id')
                           ->join('variants as T6','products.id','=','T6.product_id')
                            ->join('stock as T7','T6.id','=','T7.variant_id')
                            ->join ('types as T10','T10.id','=', 'products.type_id')
                            ->join ('brands as T12','T12.id','=', 'products.brand_id')

                            ->join ('detPres as T13','T6.id','=', 'T13.variant_id')

                            ->join ('warehouses as T8','T8.id','=', 'T7.warehouse_id')
                            ->join ('stores as T9', 'T9.id', '=', 'T8.store_id')  

                            ->select(\DB::raw('T6.puntos,products.nombre as Producto,T6.sku as codigo,T6.id as vari ,ROUND(T7.stockActual) as stock,T10.nombre as Categoria,T12.nombre as Marca,
                                                T13.price as PVP,T13.dsctoRange,T13.suppPri,
                                                (select SUM(stockActual) from stock where variant_id=T6.id) as Tot_Stock,

                                                IF( T13.fecIniDscto<="'.$q.'" and T13.fecFinDscto>="'.$q.'",T13.dsctoRange,T13.dscto) as Descuento ,
                                                IF( T13.fecIniDscto<="'.$q.'" and T13.fecFinDscto>="'.$q.'",T13.pvpRange,T13.pvp) as PrecioVenta ,
                                                IF( T13.fecIniDscto<="'.$q.'" and T13.fecFinDscto>="'.$q.'","SI","NO") as Desct_Fecha , (T13.pvp-T13.suppPri) as ganancia,(T13.pvpRange-T13.suppPri) as ganancia2,

                                              (select T20.descripcion FROM detAtr T20 where T20.variant_id=vari and T20.atribute_id=4) as Material,
                                              (select T20.descripcion FROM detAtr T20 where T20.variant_id=vari and T20.atribute_id=1) as Cantidad,
                                              (select T20.descripcion FROM detAtr T20 where T20.variant_id=vari and T20.atribute_id=3) as Sabor,
                                              (select T20.descripcion FROM detAtr T20 where T20.variant_id=vari and T20.atribute_id=2) as Services'))
                             
                            ->where('products.nombre','like',$product.'%')
                            ->where('T9.id',$simbolo3,$store)
                            ->where('T8.id',$simbolo2,$were)
                            ->where('T10.id',$simbolo1,$type)
                            ->where('T12.id',$simbolo,$brand)
                            ->groupBy('T6.id')
                            ->get();
            return $datos;
    }
     public function validarNoRepitname($text){
        $products =product::where('nombre','=', $text)
                    //->with(['customer','employee'])
                    ->first();
        return $products;
    }
     public function ProductosSugeridos(){
      $datos = \DB::table('products')->leftjoin('materials','products.material_id','=','materials.id')
                           ->leftjoin('variants','products.id','=','variants.product_id')
                            ->leftjoin('stock','variants.id','=','stock.variant_id')
                            ->leftjoin('warehouses','warehouses.id','=','stock.warehouse_id')
                            ->leftjoin('stores','stores.id','=','warehouses.store_id')
                            ->leftjoin('presentation as T1','T1.id','=','products.presentation_base')
                            ->leftjoin('equiv','equiv.preFin_id','=','T1.id')
                            ->join('detPres','detPres.variant_id','=','variants.id')             
                            ->join('presentation as T2','T2.id','=','detPres.presentation_id')
                            ->select(\DB::raw('variants.puntos,variants.sku as SKU ,detPres.id as detPre_id,variants.id as vari ,

                                IF(products.hasVariants=1 , CONCAT(products.nombre,"(",products.nombre,"/ ",(SELECT GROUP_CONCAT(CONCAT(atributes.shortname,":",detAtr.descripcion) SEPARATOR " /")
                                 FROM variants
                                LEFT JOIN detAtr ON detAtr.variant_id = variants.id
                                LEFT JOIN atributes ON atributes.id = detAtr.atribute_id
                                where variants.id=vari
                                GROUP BY variants.id),")"),  products.nombre ) as NombreProducto,

                                stock.stockActual '))
                             
                              //'T1.nombre as Base')
                            ->where('stores.id','=','1')
                            /////--------------------
                            ->where('products.estado','=','1')
                            //->where('variants.estado','=','1')
                            /////--------------------
                            //->where('variants.codigo','like', $q.'%')
                            ->where('T2.base','=','1')
                            ->groupBy('variants.id')
                            ->orderBy('stock.stockActual','desc')
                            ->limit('5')
                            ->get();
            return $datos;
    }
}

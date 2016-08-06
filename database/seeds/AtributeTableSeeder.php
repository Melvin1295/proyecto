<?php

use Illuminate\Database\Seeder;

class AtributeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('atributes')->insert([
            'nombre' => 'Sabor',
            'shortname' => 'SB',
            'descripcion' => '',
            'created_at' => date("Y-m-d H:i:s"),
            'updated_at' => date("Y-m-d H:i:s")
        ]);
        DB::table('atributes')->insert([
            'nombre' => 'Cantidad',
            'shortname' => 'CT',
            'descripcion' => '',
            'created_at' => date("Y-m-d H:i:s"),
            'updated_at' => date("Y-m-d H:i:s")
        ]);
        
    }
}

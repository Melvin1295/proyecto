<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePromotionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('promocion', function (Blueprint $table) {
            $table->increments('id');
            $table->string('descripcion');
            $table->integer('cantidad');
            $table->integer('productBase_id')->unsigned();
            $table->foreign('productBase_id')->references('id')->on('variants');
            $table->integer('product_id')->unsigned();
            $table->foreign('product_id')->references('id')->on('variants');
            $table->timestamp('fecha_inicio');
            $table->timestamp('fecha_fin');
            $table->integer('descuento');
            $table->tinyInteger('estado');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('promotion');
    }
}

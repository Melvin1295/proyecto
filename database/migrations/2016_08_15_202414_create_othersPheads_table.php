<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOthersPheadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('OtherPheads', function (Blueprint $table) {
            $table->increments('id');
            $table->dateTime('fecha');
            $table->string('proveedor');
            $table->string('ruc');
            $table->string('direccion');
            $table->string('numeroDocumento');
            $table->string('serie');
            $table->decimal('descuento',10,2)->default(0);
            $table->decimal('MontoSubTotal',10,2)->default(0);
            $table->decimal('igv',10,2)->default(0);
            $table->decimal('BaseImponible',10,2)->default(0);
            $table->decimal('MontoTotal',10,2)->default(0);
            $table->string('tipoDoc',1);
            $table->tinyInteger('checkIgv');
            $table->decimal('montoPagado',10,2)->default(0);
            $table->decimal('Saldo',10,2)->default(0);
            $table->integer('acount_id')->unsigned()->nullable();
            $table->foreign('acount_id')->references('id')->on('SunatAcounts');
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
        Schema::drop('OtherPheads');
    }
}

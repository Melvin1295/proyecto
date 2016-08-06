<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCamposCabOrdenComprasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orderPurchases', function (Blueprint $table) {
            $table->string('tCambio');
            $table->decimal('tasaDolar',10,2);
            $table->decimal('montoBrutoDolar',10,2);
            $table->decimal('montoTotalDolar',10,2);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orderPurchases', function (Blueprint $table) {
            //
        });
    }
}

<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAddCamposOrdenCompraTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('detailPurchases', function (Blueprint $table) {
            $table->decimal('preProductoDolar',10,2)->nullable();
            $table->decimal('preCompraDolar',10,2)->nullable();
            $table->decimal('montoBrutoDolar',10,2)->nullable();
            $table->decimal('montoTotalDolar',10,2)->nullable();
       
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('detailPurchases', function (Blueprint $table) {
            //
        });
    }
}

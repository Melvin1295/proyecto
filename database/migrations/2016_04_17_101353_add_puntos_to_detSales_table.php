<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPuntosToDetSalesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('detSales', function (Blueprint $table) {
            $table->tinyInteger('puntos2')->default(0);
            $table->decimal('puntos',10,2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('detSales', function (Blueprint $table) {
            //
        });
    }
}

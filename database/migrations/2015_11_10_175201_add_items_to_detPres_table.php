<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddItemsToDetPresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('detPres', function (Blueprint $table) {
            //
            $table->decimal('cambioDolar', 10, 2);
            $table->decimal('suppPriDol', 10, 2);
            $table->decimal('markupCant', 10, 2);
            $table->decimal('dscto', 10, 2);
            $table->decimal('dsctoCant', 10, 2);
            $table->decimal('pvp', 10, 2);
            $table->date('fecIniDscto')->nullable();
            $table->date('fecFinDscto')->nullable();
            $table->decimal('dsctoRange', 10, 2)->nullable();
            $table->decimal('dsctoCantRange', 10, 2)->nullable();
            $table->decimal('pvpRange', 10, 2)->nullable();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('detPres', function (Blueprint $table) {
            //
        });
    }
}

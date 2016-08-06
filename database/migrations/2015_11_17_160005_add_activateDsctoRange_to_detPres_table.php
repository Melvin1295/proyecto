<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddActivateDsctoRangeToDetPresTable extends Migration
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
            $table->boolean('activateDsctoRange');
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

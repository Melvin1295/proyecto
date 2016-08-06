<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('headInvoices', function (Blueprint $table) {
            $table->string('dni',8)->nullable()->after('cliente');
            $table->string('direccion_cliente')->nullable()->after('dni');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('headInvoices', function (Blueprint $table) {
            //
        });
    }
}

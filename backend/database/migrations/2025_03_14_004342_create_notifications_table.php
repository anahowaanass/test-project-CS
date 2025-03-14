<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // User who the notification is for
            $table->string('message'); // The message or content of the notification
            $table->string('link'); // A link related to the notification (event, profile, etc.)
            $table->boolean('is_read')->default(false); // Status of whether the notification has been read
            $table->timestamps(); // Created and updated timestamps
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}

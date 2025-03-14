<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\DatabaseNotification;

class Event extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'date', 'location', 'max_participants', 'owner_id', 'image'];

    // Relationship to the owner (user)

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // Relationship to participants (users)

    public function participants()
    {
        return $this->belongsToMany(User::class, 'event_participants');
    }



    protected static function booted()
{
    static::deleted(function ($event) {
        // Delete all notifications related to this event
        DatabaseNotification::where('link', url('events/' . $event->id))->delete();
    });
}


}

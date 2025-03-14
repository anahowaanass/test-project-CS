<?php

namespace App\Http\Controllers;

use App\Events\NotificationCreated;
use App\Mail\EventJoined;
use App\Models\Event;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use UserJoinedNotification;

class EventParticipantController extends Controller
{
    public function joinEvent($id)
    {
         $event = Event::findOrFail($id);
         $user = Auth::user();

         // Check if the user is already a participant
          if ($event->participants()->where('user_id', $user->id)->exists()) {
          return response()->json(['message' => 'You are already a participant'], 409); // Use 409 Conflict
    }

          // Join the event
          $event->participants()->attach($user->id);

            // Notify the event owner
        $notification = Notification::create([
            'user_id' => $event->owner_id, // The event owner
            'message' => 'User ' . $user->name . ' has joined your event: ' . $event->name,
            'link' => url('events/' . $event->id),
            'is_read' => false,
        ]);

        // Broadcast the notification
        broadcast(new NotificationCreated($notification));

           // Send email to the event owner notifying them of the new participant
          Mail::to($event->owner->email)->send(new EventJoined($event, $user));

          return response()->json(['message' => 'Successfully joined the event'], 201);
    }


    public function getParticipants($id)
    {
        $event = Event::findOrFail($id);
        return response()->json($event->participants);
    }
}

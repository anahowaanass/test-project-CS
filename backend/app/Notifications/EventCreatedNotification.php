<?php

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class EventCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private $event;

    public function __construct($event)
    {
        $this->event = $event;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast']; // Store in DB & send via WebSockets
    }

    public function toArray($notifiable)
    {
        return [
            'message' => "A new event '{$this->event->title}' has been created.",
            'event_id' => $this->event->id,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => "A new event '{$this->event->title}' has been created.",
            'event_id' => $this->event->id,
        ]);
    }
}

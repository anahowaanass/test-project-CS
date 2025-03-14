<?php

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class UserJoinedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private $event;
    private $user;

    public function __construct($event, $user)
    {
        $this->event = $event;
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        return [
            'message' => "{$this->user->email} joined your event '{$this->event->title}'.",
            'event_id' => $this->event->id,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => "{$this->user->email} joined your event '{$this->event->title}'.",
            'event_id' => $this->event->id,
        ]);
    }
}

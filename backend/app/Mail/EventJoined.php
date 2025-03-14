<?php

// app/Mail/EventJoined.php

namespace App\Mail;

use App\Models\Event;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EventJoined extends Mailable
{
    use Queueable, SerializesModels;

    public $event; // Store event data
    public $user; // Store the participant's data

    /**
     * Create a new message instance.
     */
    public function __construct(Event $event, User $user)
    {
        $this->event = $event;
        $this->user = $user;
    }

    /**
     * Get the message envelope.
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'A new participant has joined your event: ' . $this->event->name,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content()
    {
        return new Content(
            view: 'vendor.mail.html.event_joined',
            with: [
                'event' => $this->event,
                'user' => $this->user,
            ]
        );
    }
}

<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Screening;

class ScreeningChangedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $screening;
    public $action;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, Screening $screening, string $action)
    {
        $this->user = $user;
        $this->screening = $screening;
        $this->action = $action; // 'updated' or 'deleted'
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Important Update Regarding Your Movie Booking',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.screening_changed',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

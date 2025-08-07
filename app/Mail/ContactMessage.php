<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessage extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $contactName,
        public string $contactEmail,
        public string $messageSubject,
        public string $messageContent
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Devfolio Contact: ' . $this->messageSubject,
            replyTo: $this->contactEmail,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact-message',
            with: [
                'contactName' => $this->contactName,
                'contactEmail' => $this->contactEmail,
                'subject' => $this->messageSubject,
                'messageContent' => $this->messageContent,
            ]
        );
    }
}

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Portfolio Contact Message</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1db954;">New Contact Message from Portfolio</h2>
        
        <p><strong>From:</strong> {{ $contactName }}</p>
        <p><strong>Email:</strong> {{ $contactEmail }}</p>
        <p><strong>Subject:</strong> {{ $subject }}</p>
        
        <h3>Message:</h3>
        <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
            {!! nl2br(e($messageContent)) !!}
        </div>
        
        <hr style="margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">
            This message was sent from your portfolio contact form.
        </p>
    </div>
</body>
</html>
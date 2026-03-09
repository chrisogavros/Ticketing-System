<!DOCTYPE html>
<html>
<head>
    <title>Booking Update</title>
    <style>
        body { font-family: Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-top: 5px solid {{ $action === 'deleted' ? '#ef4444' : '#f59e0b' }}; }
        .header { background-color: {{ $action === 'deleted' ? '#fef2f2' : '#fffbeb' }}; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; color: {{ $action === 'deleted' ? '#991b1b' : '#92400e' }}; }
        .content { padding: 30px; color: #374151; line-height: 1.6; }
        .details-box { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 20px 0; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Schedule {{ ucfirst($action) }}</h1>
        </div>
        
        <div class="content">
            <p>Dear {{ $user->name }},</p>
            
            <p>
                We are writing to inform you about an important change regarding your booking for the movie 
                <strong>{{ $screening->movie->title }}</strong>.
            </p>

            @if($action === 'deleted')
                <p style="color: #dc2626; font-weight: bold;">
                    Unfortunately, this screening has been cancelled due to scheduling changes. 
                    If you have already paid, a full refund will be processed shortly.
                </p>
            @else
                <p style="color: #d97706; font-weight: bold;">
                    The scheduling details or hall assignment for this screening have been updated.
                </p>
            @endif

            <div class="details-box">
                <p style="margin-top: 0;"><strong>Original/Updated Details:</strong></p>
                <ul style="margin-bottom: 0; padding-left: 20px;">
                    <li><strong>Movie:</strong> {{ $screening->movie->title }}</li>
                    <li><strong>Date & Time:</strong> {{ \Carbon\Carbon::parse($screening->start_time)->format('l, F j, Y \a\t g:i A') }}</li>
                    <li><strong>Hall:</strong> {{ $screening->hall->name }}</li>
                </ul>
            </div>

            <p>We apologize for any inconvenience this may cause. If you have any questions, please contact our support team.</p>
            
            <p>Sincerely,<br>Ticket System Administration</p>
        </div>

        <div class="footer">
            <p>This is an automated administrative notification. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <title>Booking Confirmation</title>
    <style>
        body { font-family: Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background-color: #4f46e5; color: #ffffff; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .booking-ref { font-size: 20px; font-weight: bold; padding: 10px; background-color: #f3f4f6; text-align: center; border-radius: 6px; letter-spacing: 2px; margin-bottom: 20px; color: #1f2937; }
        .movie-info { border-left: 4px solid #4f46e5; padding-left: 15px; margin-bottom: 20px; }
        .movie-title { font-size: 22px; font-weight: bold; margin: 0 0 5px 0; color: #111827; }
        .movie-desc { color: #4b5563; line-height: 1.5; margin: 0; font-size: 14px; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .detail-item { background: #f9fafb; padding: 12px; border-radius: 6px; }
        .detail-label { font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; margin-bottom: 4px; }
        .detail-value { font-size: 16px; color: #111827; font-weight: bold; }
        .hall-photo { width: 100%; border-radius: 8px; margin-top: 20px; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Movie Ticket Details</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Sent by {{ $booking->user->name }}</p>
        </div>
        
        <div class="content">
            <p>You have been invited to a movie screening! Here are your booking details:</p>
            
            <div class="booking-ref">
                REF: {{ $booking->booking_reference }}
            </div>

            <div class="movie-info">
                <h2 class="movie-title">{{ $booking->screening->movie->title }}</h2>
                <p class="movie-desc">{{ $booking->screening->movie->description }}</p>
            </div>

            <div style="margin-bottom: 20px;">
                <div class="detail-item" style="margin-bottom: 10px;">
                    <div class="detail-label">Date & Time</div>
                    <div class="detail-value">
                        {{ \Carbon\Carbon::parse($booking->screening->start_time)->format('l, F j, Y \a\t g:i A') }}
                    </div>
                </div>

                <div class="detail-item" style="margin-bottom: 10px;">
                    <div class="detail-label">Hall</div>
                    <div class="detail-value">{{ $booking->screening->hall->name }}</div>
                </div>

                <div class="detail-item">
                    <div class="detail-label">Seat Assignment</div>
                    <div class="detail-value">
                        @foreach($booking->tickets as $ticket)
                            Row {{ $ticket->row_number }}, Seat {{ $ticket->seat_number }}@if(!$loop->last), @endif
                        @endforeach
                    </div>
                </div>
            </div>

            <div>
                <div class="detail-label" style="margin-bottom: 8px;">Hall Photo</div>
                <!-- Placeholder photo since we don't have real hall photos in the DB yet -->
                <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Cinema Hall" class="hall-photo">
            </div>
            
            <p style="text-align: center; margin-top: 30px; font-weight: bold; color: #4f46e5;">Enjoy the movie!</p>
        </div>

        <div class="footer">
            <p>This is an automated message. Please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>

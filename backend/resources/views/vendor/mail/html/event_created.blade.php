<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Created</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #4CAF50;
            font-size: 24px;
            margin-bottom: 20px;
        }

        p {
            font-size: 16px;
            line-height: 1.6;
            margin: 10px 0;
        }

        .event-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .event-details p {
            margin: 8px 0;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }

        .button {
            display: inline-block;
            padding: 12px 20px;
            background-color: #4CAF50;
            color: white;
            font-size: 16px;
            border-radius: 5px;
            text-decoration: none;
            text-align: center;
            margin-top: 20px;
        }

        .button:hover {
            background-color: #45a049;
        }

        /* Responsive Design */
        @media (max-width: 600px) {
            .container {
                width: 90%;
            }

            h1 {
                font-size: 20px;
            }

            .button {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>New Event Created: {{ $event->name }}</h1>

        <div class="event-details">
            <p><strong>Event Name:</strong> {{ $event->name }}</p>
            <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($event->date)->toFormattedDateString() }}</p>
            <p><strong>Location:</strong> {{ $event->location }}</p>
        </div>

        <p>We are excited to inform you that your event has been successfully created. Click the button below to view or manage your event:</p>

        <a href="{{ env('APP_URL') }}/events/{{ $event->id }}" class="button">View Event</a>

        <div class="footer">
            <p>&copy; {{ date('Y') }} Your Event Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

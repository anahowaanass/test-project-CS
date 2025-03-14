<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Participant Joined</title>
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

        h2 {
            color: #4CAF50;
            font-size: 22px;
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

        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }

        /* Responsive Design */
        @media (max-width: 600px) {
            .container {
                width: 90%;
            }

            h2 {
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
        <h2>New Participant for Event: {{ $event->name }}</h2>

        <p>Hello {{ $event->owner->name }},</p>

        <p>We wanted to inform you that a new participant, <strong>{{ $user->email }}</strong>, has joined your event:</p>

        <div class="event-details">
            <p><strong>Event Name:</strong> {{ $event->name }}</p>
            <p><strong>Event Date:</strong> {{ \Carbon\Carbon::parse($event->date)->toFormattedDateString() }}</p>
            <p><strong>Location:</strong> {{ $event->location }}</p>
        </div>

        <p>Best regards,</p>
        <p>Your Event Platform</p>

        <div class="footer">
            <p>&copy; {{ date('Y') }} Your Event Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

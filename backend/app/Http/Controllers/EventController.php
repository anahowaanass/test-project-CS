<?php

namespace App\Http\Controllers;

use App\Events\NotificationCreated;
use App\Mail\EventCreated;
use App\Models\Event;
use App\Models\Notification;
use App\Models\User;
use EventCreatedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    // Show a list of events
    public function index()
    {
        $events = Event::all()->map(function ($event) {
            return [
                'id' => $event->id,
                'name' => $event->name,
                'date' => $event->date,
                'location' => $event->location,
                'max_participants' => $event->max_participants,
                'image' => $event->image ? asset('storage/' . $event->image) : null, // Return full image URL
            ];
        });

        return response()->json($events);
    }

    // Show details of a single event
    public function show($id)
    {
        $event = Event::findOrFail($id);

        return response()->json([
            'id' => $event->id,
            'name' => $event->name,
            'date' => $event->date,
            'location' => $event->location,
            'max_participants' => $event->max_participants,
            'image' => $event->image ? asset('storage/' . $event->image) : null, // Return full image URL
        ]);
    }

    // Create a new event
    public function store(Request $request)
    {
       \Log::info('Authenticated User:', ['user' => Auth::user()]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'location' => 'required|string|max:255',
            'max_participants' => 'required|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate image
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('events', 'public'); // Store in storage/app/public/events
        }

        // Create event
        $event = Event::create([
            'name' => $validated['name'],
            'date' => $validated['date'],
            'location' => $validated['location'],
            'max_participants' => $validated['max_participants'],
            'owner_id' => Auth::user()->id, // Store the authenticated user's ID as owner_id
            'image' => $imagePath,
        ]);





          // Notify all users except the event owner
        $users = User::where('id', '!=', Auth::id())->get();

        foreach ($users as $user) {
            $notification = Notification::create([
                'user_id' => $user->id,
                'message' => 'A new event has been created: ' . $event->name,
                'link' => url('events/' . $event->id),
                'is_read' => false,
            ]);

            // Broadcast the notification
            broadcast(new NotificationCreated($notification));
        }


        // Send email notification
        Mail::to('recipient@example.com')->send(new EventCreated($event));

        return response()->json([
            'id' => $event->id,
            'name' => $event->name,
            'date' => $event->date,
            'location' => $event->location,
            'max_participants' => $event->max_participants,
            'image' => $imagePath ? asset('storage/' . $imagePath) : null, // Return full image URL
        ], 201);
    }

    // Update an existing event
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'date' => 'sometimes|required|date',
            'location' => 'sometimes|required|string|max:255',
            'max_participants' => 'sometimes|required|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate image update
        ]);

        // Handle image update
        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($event->image) {
                Storage::disk('public')->delete($event->image);
            }

            // Store new image
            $imagePath = $request->file('image')->store('events', 'public');
            $validated['image'] = $imagePath;
        }

        $event->update($validated);

        return response()->json([
            'id' => $event->id,
            'name' => $event->name,
            'date' => $event->date,
            'location' => $event->location,
            'max_participants' => $event->max_participants,
            'image' => $event->image ? asset('storage/' . $event->image) : null, // Return full image URL
        ]);
    }

    // Delete an event
    public function destroy($id)
    {
        $event = Event::findOrFail($id);

        // Delete image from storage
        if ($event->image) {
            Storage::disk('public')->delete($event->image);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }

    // Get events created by the authenticated user
    public function myEvents()
    {
        // Ensure user is authenticated
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'User is not authenticated'], 401);
        }

        // Fetch events created by the authenticated user
        $events = Event::where('owner_id', $user->id)->get();

        // Return events with necessary data
        return response()->json($events->map(function ($event) {
            return [
                'id' => $event->id,
                'name' => $event->name,
                'date' => $event->date,
                'location' => $event->location,
                'max_participants' => $event->max_participants,
                'image' => $event->image ? asset('storage/' . $event->image) : null, // Full image URL
            ];
        }));
    }



    // Get events the authenticated user has joined
    public function getJoinedEvents()
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $events = \DB::table('event_participants')
        ->join('events', 'event_participants.event_id', '=', 'events.id')
        ->where('event_participants.user_id', $user->id)
        ->select('events.id', 'events.name', 'events.date', 'events.location', 'events.max_participants', 'events.image')
        ->get()
        ->map(function ($event) {
            return [
                'id' => $event->id,
                'name' => $event->name,
                'date' => $event->date,
                'location' => $event->location,
                'max_participants' => $event->max_participants,
                'image' => $event->image ? asset('storage/' . $event->image) : null, // Return full image URL
            ];
        });

    return response()->json($events);
}







}

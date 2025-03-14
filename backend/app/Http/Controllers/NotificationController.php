<?php


namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    // Fetch notifications for the authenticated user
    public function index()
    {
        return response()->json(Auth::user()->notifications);
    }

    // Mark notification as read
    public function markAsRead($id)
    {
        $notification = Notification::find($id);

        if ($notification && $notification->user_id === Auth::user()->id()) {
            $notification->update(['is_read' => true]);
            return response()->json(['message' => 'Notification marked as read.']);
        }

        return response()->json(['message' => 'Notification not found or not yours.'], 404);
    }

    // Delete a notification
    public function delete($id)
    {
        $notification = Notification::find($id);

        if ($notification && $notification->user_id === Auth::user()->id()) {
            $notification->delete();
            return response()->json(['message' => 'Notification deleted.']);
        }

        return response()->json(['message' => 'Notification not found or not yours.'], 404);
    }
}

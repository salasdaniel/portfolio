<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
            'username' => 'required|string|exists:users,username'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $validated = $validator->validated();
            
            // Get the user by username to get their email
            $user = User::where('username', $validated['username'])->first();
            
            if (!$user || !$user->email) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found or user email not configured.'
                ], 404);
            }

            // Send the email to the user's email
            Mail::to($user->email)->send(new ContactMessage(
                contactName: $validated['name'],
                contactEmail: $validated['email'],
                messageSubject: $validated['subject'],
                messageContent: $validated['message']
            ));

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully! Thank you for reaching out.'
            ]);

        } catch (\Exception $e) {
            Log::error('Contact form error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message. Please try again or contact me directly.'
            ], 500);
        }
    }
}

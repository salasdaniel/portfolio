<?php

namespace App\Http\Controllers;

use App\Models\UserCertification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CertificationController extends Controller
{
    public function store(Request $request)
    {
        // Log the incoming data for debugging
        Log::info('Certification data received:', $request->all());
        
        $validator = Validator::make($request->all(), [
            'institution' => 'required|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'nullable|in:true,false,1,0',
            'description' => 'nullable|string',
            'certification_url' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer',
            'pin_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            Log::error('Certification validation failed:', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $data['user_id'] = Auth::id();
        
        // Convert string boolean to actual boolean
        if (isset($data['is_current'])) {
            $data['is_current'] = in_array($data['is_current'], ['true', '1', 1, true], true);
        }
        
        // If is_current is true, remove end_date
        if ($data['is_current'] ?? false) {
            $data['end_date'] = null;
        }

        // Handle update vs create
        if ($request->has('id') && $request->id) {
            $certification = UserCertification::where('user_id', Auth::id())
                ->where('id', $request->id)
                ->firstOrFail();
            
            // Handle pin_order update
            if (isset($data['pin_order']) && $data['pin_order'] !== $certification->pin_order) {
                UserCertification::updatePinOrder(Auth::id(), $certification->id, $data['pin_order']);
                unset($data['pin_order']); // Remove from data since it's handled separately
            }
            
            $certification->update($data);
        } else {
            // For new certifications, auto-assign pin_order if not provided
            if (!isset($data['pin_order'])) {
                $data['pin_order'] = UserCertification::getNextPinOrder(Auth::id());
            }
            $certification = UserCertification::create($data);
        }

        return response()->json([
            'success' => true,
            'certification' => $certification,
            'message' => 'Certification saved successfully'
        ]);
    }

    public function destroy($id)
    {
        $certification = UserCertification::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        $certification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Certification deleted successfully'
        ]);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserCertification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'institution',
        'field_of_study',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'certification_url',
        'sort_order',
        'pin_order',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
        'sort_order' => 'integer',
        'pin_order' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the next available pin_order for a user
     */
    public static function getNextPinOrder($userId): int
    {
        $maxOrder = self::where('user_id', $userId)->max('pin_order');
        return $maxOrder ? $maxOrder + 1 : 1;
    }

    /**
     * Update pin orders when one is changed to prevent duplicates
     */
    public static function updatePinOrder($userId, $certificationId, $newOrder): void
    {
        // Get current certification
        $certification = self::find($certificationId);
        $oldOrder = $certification->pin_order;

        if ($oldOrder === $newOrder) {
            return;
        }

        // If moving up (to lower number)
        if ($newOrder < $oldOrder) {
            self::where('user_id', $userId)
                ->where('pin_order', '>=', $newOrder)
                ->where('pin_order', '<', $oldOrder)
                ->increment('pin_order');
        }
        // If moving down (to higher number)
        else {
            self::where('user_id', $userId)
                ->where('pin_order', '>', $oldOrder)
                ->where('pin_order', '<=', $newOrder)
                ->decrement('pin_order');
        }

        // Update the certification's order
        $certification->update(['pin_order' => $newOrder]);
    }
}

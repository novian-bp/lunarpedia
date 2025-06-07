<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'docker_image',
        'description',
        'credits_per_month',
        'status',
        'default_environment',
        'default_ports',
    ];

    protected $casts = [
        'default_environment' => 'array',
        'default_ports' => 'array',
        'credits_per_month' => 'integer',
    ];

    /**
     * Scope for published service types
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Get services using this type
     */
    public function services()
    {
        return $this->hasMany(Service::class, 'type', 'type');
    }
}
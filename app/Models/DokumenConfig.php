<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DokumenConfig extends Model
{
    protected $table = 't_dokumen_configs';
    
    protected $fillable = [
        'key',
        'value',
        'description'
    ];

    /**
     * Helper method untuk get config value by key
     */
    public static function getValue(string $key, $default = null)
    {
        $config = self::where('key', $key)->first();
        return $config ? $config->value : $default;
    }

    /**
     * Helper method untuk set config value
     */
    public static function setValue(string $key, string $value, ?string $description = null)
    {
        return self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'description' => $description
            ]
        );
    }
}
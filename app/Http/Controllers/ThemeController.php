<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ThemeController extends Controller
{
    /**
     * Switch user theme preference
     */
    public function switch(Request $request)
    {
        $request->validate([
            'theme' => 'required|in:system,light,dark'
        ]);

        $theme = $request->input('theme');
        
        // Store theme preference in cookie for 1 year
        $cookie = cookie('theme', $theme, 60 * 24 * 365);
        
        return response()->json([
            'success' => true,
            'theme' => $theme,
            'message' => 'Theme berhasil diubah ke ' . $theme
        ])->withCookie($cookie);
    }

    /**
     * Get current theme
     */
    public function current(Request $request)
    {
        $theme = $request->cookie('theme', 'system');
        
        return response()->json([
            'theme' => $theme
        ]);
    }
}
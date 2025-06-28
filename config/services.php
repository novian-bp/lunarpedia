<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'stripe' => [
        'model' => App\Models\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook' => [
            'secret' => env('STRIPE_WEBHOOK_SECRET'),
            'tolerance' => env('STRIPE_WEBHOOK_TOLERANCE', 300),
        ],
    ],

    'docker' => [
        'registry_url' => env('DOCKER_REGISTRY_URL'),
        'registry_username' => env('DOCKER_REGISTRY_USERNAME'),
        'registry_password' => env('DOCKER_REGISTRY_PASSWORD'),
    ],

    'lunarpedia' => [
        'domain' => env('LUNARPEDIA_DOMAIN', 'lunarpedia.app'),
        'subdomain_suffix' => env('LUNARPEDIA_SUBDOMAIN_SUFFIX', 'user.lunarpedia.app'),
        'admin_email' => env('ADMIN_EMAIL', 'admin@lunarpedia.com'),
        'admin_name' => env('ADMIN_NAME', 'Admin'),
        'default_credits' => env('DEFAULT_USER_CREDITS', 250),
        'custom_domain_price' => env('CUSTOM_DOMAIN_PRICE', 25),
    ],

];
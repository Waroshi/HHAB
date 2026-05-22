{{-- resources/views/app.blade.php --}}
{{-- Provides the root Blade shell for Inertia React pages. --}}
{{-- Exists so Laravel can mount Vite-built React pages into the browser. --}}
{{-- RELATED FILES: resources/js/app.js, routes/web.php, resources/js/Pages/Dashboard.jsx --}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        @inertiaHead
    </head>
    <body>
        @inertia
    </body>
</html>

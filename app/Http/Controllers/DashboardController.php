<?php

use Inertia\Inertia;


return Inertia::render('Dashboard', [
    'summary' => [
        'monthExpenses' => 'This is the summary data',
        'expectedIncome' => 'This is the summary data',

    ],
]);
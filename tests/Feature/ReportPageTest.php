<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ReportPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_report_page(): void
    {
        $response = $this->get('/reports');

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_report_page(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('reports.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Report'));
    }
}

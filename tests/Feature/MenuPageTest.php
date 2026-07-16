<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MenuPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_menu_page(): void
    {
        $response = $this->get('/menu');

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_menu_page(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('menu.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Menu'));
    }
}

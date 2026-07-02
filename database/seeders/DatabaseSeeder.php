<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Expense;
use App\Models\Income;
use carbon\carbon;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = User::create([
            'name' => 'test',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);

        $categoriesData = [
            ['name' => '商品', 'color_code' => '#FF0000'],
            ['name' => '交通費', 'color_code' => '#00FF00'],
            ['name' => '娯楽', 'color_code' => '#0000FF'],
        ];

        $categories = [];
        foreach ($categoriesData as $data) {
            $categories[] = Category::create([
                'user_id' => null,
                'name' => $data['name'],
                'color_code' => $data['color_code'],
            ]);
        }

        Income::create([
            'user_id' => $user->id,
            'income_date' => Carbon::now()->startOfMonth()->addDays(24),
            'memo' => '給料',
            'expected_income' => 50000,
            'amount' => null,
        ]);

        $storeNames = ['スーパー', 'コンビニ', 'レストラン'];

        for ($i = 0; $i < 30; $i++) {
            Expense::create([
                'user_id' => $user->id,
                'category_id' => $categories[array_rand($categories)]->id,
                'receipt_id' => null,
                'spent_at' => Carbon::now()->startOfMonth()->subDays(rand(0, 29)),
                'store_name' => $storeNames[array_rand($storeNames)],
                'memo' => 'ダミーデータ',
                'amount' => rand(100, 5000),
            ]);
        }
    }
}

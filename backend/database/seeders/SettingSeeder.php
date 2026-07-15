<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'site_name', 'value' => 'DONAYEM TECH', 'group' => 'general'],
            ['key' => 'site_tagline', 'value' => 'Donnez vie à vos idées digitales', 'group' => 'general'],
            ['key' => 'phone_1', 'value' => '681181456', 'group' => 'contact'],
            ['key' => 'phone_2', 'value' => '696580487', 'group' => 'contact'],
            ['key' => 'email', 'value' => 'contact@donayemtech.com', 'group' => 'contact'],
            ['key' => 'address', 'value' => 'Ange Raphaël – Hôtel Sélect, Douala, Cameroun', 'group' => 'contact'],
            ['key' => 'facebook_url', 'value' => '', 'group' => 'social'],
            ['key' => 'instagram_url', 'value' => '', 'group' => 'social'],
            ['key' => 'whatsapp_number', 'value' => '237681181456', 'group' => 'social'],
            ['key' => 'cinetpay_site_id', 'value' => '', 'group' => 'payment'],
            ['key' => 'smtp_host', 'value' => '', 'group' => 'mail'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}

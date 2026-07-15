<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $testimonials = [
            [
                'client_name' => 'Aïcha Ngo Bell',
                'client_company' => 'Boutique Aïcha Mode, Douala',
                'content' => 'DONAYEM TECH a transformé notre présence en ligne. Nos ventes ont augmenté de 40% en trois mois grâce à leur stratégie marketing.',
                'rating' => 5,
                'service_category' => 'marketing',
                'is_active' => true,
            ],
            [
                'client_name' => 'Serge Fotso',
                'client_company' => 'Fotso Immobilier',
                'content' => 'Un accompagnement professionnel du début à la fin. Notre site vitrine est exactement ce que nous voulions.',
                'rating' => 5,
                'service_category' => 'webdesign',
                'is_active' => true,
            ],
            [
                'client_name' => 'Marie-Claire Eyenga',
                'client_company' => 'Institut de Beauté Eyenga',
                'content' => 'Grâce à la formation bureautique, toute mon équipe maîtrise désormais Excel et Word. Un vrai gain de temps au quotidien.',
                'rating' => 5,
                'service_category' => 'formation',
                'is_active' => true,
            ],
            [
                'client_name' => 'Junior Mbarga',
                'client_company' => 'Mbarga Électronique',
                'content' => 'Notre boutique Shopify a été lancée en deux semaines. Le rendu est superbe et les paiements fonctionnent parfaitement.',
                'rating' => 4,
                'service_category' => 'shopify',
                'is_active' => true,
            ],
            [
                'client_name' => 'Larissa Tchoua',
                'client_company' => 'Traiteur Larissa Events',
                'content' => 'Des visuels magnifiques pour nos réseaux sociaux. Nos clients nous félicitent régulièrement sur notre nouvelle image.',
                'rating' => 5,
                'service_category' => 'webdesign',
                'is_active' => true,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::updateOrCreate(
                ['client_name' => $testimonial['client_name'], 'client_company' => $testimonial['client_company']],
                $testimonial
            );
        }
    }
}

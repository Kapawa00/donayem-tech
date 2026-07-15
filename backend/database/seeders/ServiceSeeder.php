<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'title' => 'Webdesign & Infographie',
                'slug' => 'webdesign-infographie',
                'category' => 'webdesign',
                'short_description' => 'Sites web, identité visuelle, flyers et supports de communication.',
                'long_description' => 'Conception de sites vitrines et e-commerce, création de logos, flyers, cartes de visite et supports de communication visuelle pour donner à votre marque une image professionnelle.',
                'features' => [
                    'Création de site web',
                    'Identité visuelle & logo',
                    'Flyers & supports imprimés',
                    'Retouche photo & infographie',
                ],
                'starting_price' => 50000,
                'is_active' => true,
                'order' => 1,
            ],
            [
                'title' => 'Marketing Digital',
                'slug' => 'marketing-digital',
                'category' => 'marketing',
                'short_description' => 'Gestion des réseaux sociaux, publicité en ligne, stratégie de contenu.',
                'long_description' => 'Gestion de communauté, création de contenu, campagnes publicitaires Facebook/Instagram et stratégie digitale pour développer votre visibilité en ligne.',
                'features' => [
                    'Gestion des réseaux sociaux',
                    'Publicité en ligne (Facebook/Instagram Ads)',
                    'Stratégie de contenu',
                    'Rapports de performance',
                ],
                'starting_price' => 40000,
                'is_active' => true,
                'order' => 2,
            ],
            [
                'title' => 'Formation Bureautique',
                'slug' => 'formation-bureautique',
                'category' => 'formation',
                'short_description' => 'Word, Excel, PowerPoint, Internet et rédaction de documents académiques.',
                'long_description' => 'Formations pratiques en initiation informatique, Word, Excel, PowerPoint et Internet, ainsi qu\'un accompagnement pour la rédaction de CV, lettres de motivation et mémoires.',
                'features' => [
                    'Initiation informatique',
                    'Word, Excel, PowerPoint',
                    'Internet & outils numériques',
                    'Rédaction CV, lettres, mémoires',
                ],
                'starting_price' => 15000,
                'is_active' => true,
                'order' => 3,
            ],
            [
                'title' => 'Boutique Shopify',
                'slug' => 'boutique-shopify',
                'category' => 'shopify',
                'short_description' => 'Création et configuration de boutiques e-commerce clés en main.',
                'long_description' => 'Mise en place complète de votre boutique Shopify : thème, catalogue produits, moyens de paiement et configuration prête à vendre.',
                'features' => [
                    'Configuration boutique Shopify',
                    'Intégration catalogue produits',
                    'Configuration paiement & livraison',
                    'Accompagnement au lancement',
                ],
                'starting_price' => 100000,
                'is_active' => true,
                'order' => 4,
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(['slug' => $service['slug']], $service);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\PortfolioItem;
use Illuminate\Database\Seeder;

class PortfolioItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'title' => 'Flyer promotionnel — Restaurant Le Wouri',
                'category' => 'Flyers',
                'description' => 'Flyer promotionnel pour le lancement de la carte du Restaurant Le Wouri à Douala.',
                'media_type' => 'image',
                'media_url' => 'https://picsum.photos/seed/donayem-portfolio-1/600/800',
                'thumbnail_url' => 'https://picsum.photos/seed/donayem-portfolio-1/300/400',
                'client_name' => 'Restaurant Le Wouri',
                'completion_date' => '2026-02-10',
                'is_featured' => true,
                'tags' => ['flyer', 'restauration'],
            ],
            [
                'title' => 'Affiche événementielle — Salon Beauté Douala',
                'category' => 'Flyers',
                'description' => 'Affiche pour la promotion du Salon Beauté Douala.',
                'media_type' => 'image',
                'media_url' => 'https://picsum.photos/seed/donayem-portfolio-2/600/750',
                'thumbnail_url' => 'https://picsum.photos/seed/donayem-portfolio-2/300/375',
                'client_name' => 'Salon Beauté Douala',
                'completion_date' => '2026-02-18',
                'is_featured' => false,
                'tags' => ['affiche', 'événementiel'],
            ],
            [
                'title' => 'Campagne Instagram — Boutique Aïcha Mode',
                'category' => 'Réseaux sociaux',
                'description' => 'Série de visuels Instagram pour la nouvelle collection de la Boutique Aïcha Mode.',
                'media_type' => 'image',
                'media_url' => 'https://picsum.photos/seed/donayem-portfolio-3/600/600',
                'thumbnail_url' => 'https://picsum.photos/seed/donayem-portfolio-3/300/300',
                'client_name' => 'Boutique Aïcha Mode',
                'completion_date' => '2026-03-02',
                'is_featured' => true,
                'tags' => ['instagram', 'mode'],
            ],
            [
                'title' => 'Contenu Facebook — Fotso Immobilier',
                'category' => 'Réseaux sociaux',
                'description' => 'Contenus Facebook réguliers pour la mise en avant des biens de Fotso Immobilier.',
                'media_type' => 'image',
                'media_url' => 'https://picsum.photos/seed/donayem-portfolio-4/600/600',
                'thumbnail_url' => 'https://picsum.photos/seed/donayem-portfolio-4/300/300',
                'client_name' => 'Fotso Immobilier',
                'completion_date' => '2026-03-08',
                'is_featured' => false,
                'tags' => ['facebook', 'immobilier'],
            ],
            [
                'title' => 'Vidéo promotionnelle — Traiteur Larissa Events',
                'category' => 'Vidéo',
                'description' => 'Vidéo promotionnelle pour le service traiteur événementiel Larissa Events.',
                'media_type' => 'video',
                'media_url' => 'https://picsum.photos/seed/donayem-portfolio-5/800/450',
                'thumbnail_url' => 'https://picsum.photos/seed/donayem-portfolio-5/400/225',
                'client_name' => 'Traiteur Larissa Events',
                'completion_date' => '2026-01-20',
                'is_featured' => true,
                'tags' => ['vidéo', 'traiteur'],
            ],
            [
                'title' => 'Vidéo corporate — Institut de Beauté Eyenga',
                'category' => 'Vidéo',
                'description' => 'Vidéo de présentation corporate pour l\'Institut de Beauté Eyenga.',
                'media_type' => 'video',
                'media_url' => 'https://picsum.photos/seed/donayem-portfolio-6/800/500',
                'thumbnail_url' => 'https://picsum.photos/seed/donayem-portfolio-6/400/250',
                'client_name' => 'Institut de Beauté Eyenga',
                'completion_date' => '2026-01-28',
                'is_featured' => false,
                'tags' => ['vidéo', 'beauté'],
            ],
            [
                'title' => 'Site vitrine — Cabinet Juridique Ekwalla',
                'category' => 'Sites web',
                'description' => 'Site vitrine professionnel pour le Cabinet Juridique Ekwalla.',
                'media_type' => 'image',
                'media_url' => 'https://picsum.photos/seed/donayem-portfolio-7/600/800',
                'thumbnail_url' => 'https://picsum.photos/seed/donayem-portfolio-7/300/400',
                'client_name' => 'Cabinet Juridique Ekwalla',
                'completion_date' => '2025-12-05',
                'is_featured' => true,
                'tags' => ['site web', 'juridique'],
            ],
            [
                'title' => 'Site vitrine — École de Formation Douala',
                'category' => 'Sites web',
                'description' => 'Site vitrine pour la présentation des programmes de l\'École de Formation Douala.',
                'media_type' => 'image',
                'media_url' => 'https://picsum.photos/seed/donayem-portfolio-8/600/700',
                'thumbnail_url' => 'https://picsum.photos/seed/donayem-portfolio-8/300/350',
                'client_name' => 'École de Formation Douala',
                'completion_date' => '2025-12-15',
                'is_featured' => false,
                'tags' => ['site web', 'formation'],
            ],
            [
                'title' => 'Identité visuelle — Café Douala',
                'category' => 'Identité visuelle',
                'description' => 'Création de l\'identité visuelle complète du Café Douala : logo, palette, supports.',
                'media_type' => 'image',
                'media_url' => 'https://picsum.photos/seed/donayem-portfolio-9/600/600',
                'thumbnail_url' => 'https://picsum.photos/seed/donayem-portfolio-9/300/300',
                'client_name' => 'Café Douala',
                'completion_date' => '2026-01-05',
                'is_featured' => true,
                'tags' => ['identité visuelle', 'logo'],
            ],
            [
                'title' => 'Charte graphique — Mbarga Électronique',
                'category' => 'Identité visuelle',
                'description' => 'Charte graphique complète pour l\'enseigne Mbarga Électronique.',
                'media_type' => 'image',
                'media_url' => 'https://picsum.photos/seed/donayem-portfolio-10/600/750',
                'thumbnail_url' => 'https://picsum.photos/seed/donayem-portfolio-10/300/375',
                'client_name' => 'Mbarga Électronique',
                'completion_date' => '2026-01-12',
                'is_featured' => false,
                'tags' => ['identité visuelle', 'électronique'],
            ],
            [
                'title' => 'Boutique Shopify — Mode Urbaine',
                'category' => 'Boutique Shopify',
                'description' => 'Lancement de la boutique en ligne Shopify pour la marque Mode Urbaine.',
                'media_type' => 'image',
                'media_url' => 'https://picsum.photos/seed/donayem-portfolio-11/600/800',
                'thumbnail_url' => 'https://picsum.photos/seed/donayem-portfolio-11/300/400',
                'client_name' => 'Mode Urbaine',
                'completion_date' => '2026-02-25',
                'is_featured' => true,
                'tags' => ['shopify', 'mode'],
            ],
            [
                'title' => 'Boutique Shopify — Cosmétiques Bio',
                'category' => 'Boutique Shopify',
                'description' => 'Configuration complète de la boutique Shopify Cosmétiques Bio, du thème au paiement.',
                'media_type' => 'image',
                'media_url' => 'https://picsum.photos/seed/donayem-portfolio-12/600/600',
                'thumbnail_url' => 'https://picsum.photos/seed/donayem-portfolio-12/300/300',
                'client_name' => 'Cosmétiques Bio',
                'completion_date' => '2026-03-15',
                'is_featured' => false,
                'tags' => ['shopify', 'cosmétiques'],
            ],
        ];

        foreach ($items as $item) {
            PortfolioItem::updateOrCreate(
                ['title' => $item['title'], 'client_name' => $item['client_name']],
                $item
            );
        }
    }
}

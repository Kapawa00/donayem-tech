<?php

namespace Database\Seeders;

use App\Models\Formation;
use Illuminate\Database\Seeder;

class FormationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modules = [
            [
                'icon' => 'MonitorSmartphone',
                'title' => 'Initiation à l’informatique',
                'description' => 'Les bases pour utiliser un ordinateur en toute confiance : environnement, fichiers, navigation.',
                'duration' => '2 semaines',
                'level' => 'Débutant',
            ],
            [
                'icon' => 'LayoutGrid',
                'title' => 'Microsoft Word',
                'description' => 'Mise en forme de documents, styles, tableaux et modèles professionnels.',
                'duration' => '2 semaines',
                'level' => 'Débutant',
            ],
            [
                'icon' => 'Table2',
                'title' => 'Microsoft Excel',
                'description' => 'Tableaux, formules, mise en forme conditionnelle et graphiques pour votre activité.',
                'duration' => '3 semaines',
                'level' => 'Intermédiaire',
            ],
            [
                'icon' => 'Presentation',
                'title' => 'Microsoft PowerPoint',
                'description' => 'Créez des présentations claires et percutantes pour vos projets et soutenances.',
                'duration' => '2 semaines',
                'level' => 'Débutant',
            ],
            [
                'icon' => 'Globe',
                'title' => 'Internet & outils numériques',
                'description' => 'Recherche efficace, messagerie, cloud et outils numériques du quotidien.',
                'duration' => '1 semaine',
                'level' => 'Débutant',
            ],
        ];

        $academicServices = [
            [
                'title' => 'CV professionnels',
                'description' => 'Un CV clair et percutant, adapté à votre profil et au poste visé.',
            ],
            [
                'title' => 'Lettres de motivation',
                'description' => 'Une lettre personnalisée qui met en avant votre parcours et votre motivation.',
            ],
            [
                'title' => 'Mise en page de mémoires',
                'description' => 'Structuration, sommaire automatique, normes académiques respectées.',
            ],
            [
                'title' => 'Accompagnement fin de cycle',
                'description' => 'Un suivi personnalisé jusqu’au dépôt de votre travail de fin de cycle.',
            ],
            [
                'title' => 'Assistance thèse et soutenance',
                'description' => 'Mise en forme, supports de présentation et préparation à la soutenance.',
            ],
        ];

        foreach ($modules as $order => $module) {
            Formation::updateOrCreate(
                ['type' => 'module', 'title' => $module['title']],
                [...$module, 'order' => $order, 'is_active' => true]
            );
        }

        foreach ($academicServices as $order => $service) {
            Formation::updateOrCreate(
                ['type' => 'academic_service', 'title' => $service['title']],
                [...$service, 'order' => $order, 'is_active' => true]
            );
        }
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Colonnes VARCHAR(255) qui doivent être élargies avant d'y stocker un objet
     * JSON multi-locale ({"fr": "...", "en": "...", "de": "..."}).
     */
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->text('title')->change();
        });

        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->text('title')->change();
        });

        Schema::table('blog_posts', function (Blueprint $table) {
            $table->text('title')->change();
            $table->text('meta_title')->nullable()->change();
            $table->text('meta_description')->nullable()->change();
        });

        $this->wrapColumn('services', 'title');
        $this->wrapColumn('services', 'short_description');
        $this->wrapColumn('services', 'long_description');
        $this->wrapJsonColumn('services', 'features');

        $this->wrapColumn('portfolio_items', 'title');
        $this->wrapColumn('portfolio_items', 'description');

        $this->wrapColumn('blog_posts', 'title');
        $this->wrapColumn('blog_posts', 'excerpt');
        $this->wrapColumn('blog_posts', 'content');
        $this->wrapColumn('blog_posts', 'meta_title');
        $this->wrapColumn('blog_posts', 'meta_description');

        $this->wrapColumn('testimonials', 'content');
    }

    public function down(): void
    {
        $this->unwrapColumn('services', 'title');
        $this->unwrapColumn('services', 'short_description');
        $this->unwrapColumn('services', 'long_description');
        $this->unwrapJsonColumn('services', 'features');

        $this->unwrapColumn('portfolio_items', 'title');
        $this->unwrapColumn('portfolio_items', 'description');

        $this->unwrapColumn('blog_posts', 'title');
        $this->unwrapColumn('blog_posts', 'excerpt');
        $this->unwrapColumn('blog_posts', 'content');
        $this->unwrapColumn('blog_posts', 'meta_title');
        $this->unwrapColumn('blog_posts', 'meta_description');

        $this->unwrapColumn('testimonials', 'content');

        Schema::table('services', function (Blueprint $table) {
            $table->string('title')->change();
        });

        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->string('title')->change();
        });

        Schema::table('blog_posts', function (Blueprint $table) {
            $table->string('title')->change();
            $table->string('meta_title')->nullable()->change();
            $table->string('meta_description')->nullable()->change();
        });
    }

    /**
     * Enveloppe une valeur de colonne texte existante dans {"fr": "<valeur>"}.
     */
    private function wrapColumn(string $table, string $column): void
    {
        DB::table($table)->orderBy('id')->get(['id', $column])->each(function ($row) use ($table, $column) {
            if ($row->{$column} === null) {
                return;
            }

            DB::table($table)->where('id', $row->id)->update([
                $column => json_encode(['fr' => $row->{$column}], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ]);
        });
    }

    /**
     * Enveloppe une colonne déjà castée en JSON (ex. features: string[]) dans {"fr": [...]}.
     */
    private function wrapJsonColumn(string $table, string $column): void
    {
        DB::table($table)->orderBy('id')->get(['id', $column])->each(function ($row) use ($table, $column) {
            $decoded = $row->{$column} === null ? null : json_decode((string) $row->{$column}, true);

            DB::table($table)->where('id', $row->id)->update([
                $column => json_encode(['fr' => $decoded], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ]);
        });
    }

    private function unwrapColumn(string $table, string $column): void
    {
        DB::table($table)->orderBy('id')->get(['id', $column])->each(function ($row) use ($table, $column) {
            $decoded = $row->{$column} === null ? null : json_decode((string) $row->{$column}, true);

            DB::table($table)->where('id', $row->id)->update([
                $column => $decoded['fr'] ?? null,
            ]);
        });
    }

    private function unwrapJsonColumn(string $table, string $column): void
    {
        DB::table($table)->orderBy('id')->get(['id', $column])->each(function ($row) use ($table, $column) {
            $decoded = $row->{$column} === null ? null : json_decode((string) $row->{$column}, true);
            $fr = $decoded['fr'] ?? null;

            DB::table($table)->where('id', $row->id)->update([
                $column => $fr === null ? null : json_encode($fr),
            ]);
        });
    }
};

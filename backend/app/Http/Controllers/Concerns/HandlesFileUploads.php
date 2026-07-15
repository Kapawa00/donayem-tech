<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;

trait HandlesFileUploads
{
    /**
     * Redimensionne et stocke une image, avec renommage aléatoire.
     */
    protected function storeUploadedImage(UploadedFile $file, string $directory, int $maxWidth = 1600): string
    {
        $filename = Str::random(40).'.'.($file->extension() ?: 'jpg');
        $path = $directory.'/'.$filename;

        $image = ImageManager::gd()->read($file)->scaleDown(width: $maxWidth);
        Storage::disk('public')->put($path, (string) $image->encode());

        return Storage::disk('public')->url($path);
    }

    /**
     * Stocke un fichier tel quel (vidéos, etc.), avec renommage aléatoire.
     */
    protected function storeUploadedFile(UploadedFile $file, string $directory): string
    {
        $path = $file->store($directory, 'public');

        return Storage::disk('public')->url($path);
    }

    /**
     * Génère une miniature à partir d'une image. Retourne null pour les fichiers non-images
     * (ex. vidéos), qui nécessiteraient un traitement FFMpeg non disponible ici.
     */
    protected function generateThumbnail(UploadedFile $file, string $directory, int $width = 400): ?string
    {
        if (! str_starts_with((string) $file->getMimeType(), 'image/')) {
            return null;
        }

        return $this->storeUploadedImage($file, $directory, $width);
    }

    protected function deleteStoredFile(?string $url): void
    {
        if (! $url) {
            return;
        }

        $path = ltrim(str_replace(Storage::disk('public')->url(''), '', $url), '/');

        if ($path !== '') {
            Storage::disk('public')->delete($path);
        }
    }
}

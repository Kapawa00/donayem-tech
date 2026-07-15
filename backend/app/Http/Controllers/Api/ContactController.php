<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Mail\ContactMessageNotification;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request): JsonResponse
    {
        $contactMessage = ContactMessage::create($request->validated());

        try {
            Mail::to('contact@donayemtech.com')->send(new ContactMessageNotification($contactMessage));
        } catch (TransportExceptionInterface $e) {
            Log::error('Failed to send contact notification email', [
                'contact_message_id' => $contactMessage->id,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'message' => 'Votre message a été envoyé avec succès. Nous vous répondons rapidement.',
        ], 201);
    }
}

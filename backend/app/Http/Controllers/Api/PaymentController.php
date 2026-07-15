<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\PaymentConfirmation;
use App\Models\Order;
use App\Models\Payment;
use App\Services\CinetPayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use RuntimeException;

class PaymentController extends Controller
{
    public function __construct(private readonly CinetPayService $cinetPay)
    {
    }

    public function initiate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => ['required', 'integer', 'exists:orders,id'],
            'payment_method' => ['required', 'string', 'in:orange_money,mtn_momo,visa,mastercard,iban'],
        ]);

        $order = Order::findOrFail($validated['order_id']);

        if ($order->status !== 'pending') {
            return response()->json([
                'message' => 'Cette commande a déjà été traitée.',
            ], 422);
        }

        $transactionId = 'TXN-'.uniqid();

        $payment = Payment::create([
            'order_id' => $order->id,
            'transaction_id' => $transactionId,
            'payment_method' => $validated['payment_method'],
            'amount' => $order->amount,
            'currency' => $order->currency,
            'status' => 'pending',
        ]);

        try {
            $result = $this->cinetPay->initiatePayment($order, $transactionId);
        } catch (RuntimeException $e) {
            $payment->update(['status' => 'failed']);

            Log::error('PaymentController::initiate a échoué.', [
                'order_id' => $order->id,
                'transaction_id' => $transactionId,
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => "Impossible d'initier le paiement pour le moment. Veuillez réessayer.",
            ], 502);
        }

        $payment->update(['cinetpay_data' => ['payment_token' => $result['payment_token'] ?? null]]);

        return response()->json(['payment_url' => $result['payment_url']]);
    }

    public function webhook(Request $request): JsonResponse
    {
        Log::info('CinetPay webhook reçu.', ['payload' => $request->all()]);

        $transactionId = $request->input('cpm_trans_id') ?? $request->input('transaction_id');

        if (! $transactionId) {
            Log::warning('CinetPay webhook sans transaction_id.', ['payload' => $request->all()]);

            return response()->json(['message' => 'OK'], 200);
        }

        $payment = Payment::where('transaction_id', $transactionId)->first();

        if (! $payment) {
            Log::warning('CinetPay webhook : paiement introuvable.', ['transaction_id' => $transactionId]);

            return response()->json(['message' => 'OK'], 200);
        }

        // Ne jamais faire confiance au webhook seul : on revérifie toujours auprès de l'API CinetPay.
        try {
            $status = $this->cinetPay->checkPaymentStatus($transactionId);
        } catch (RuntimeException $e) {
            Log::error('CinetPay webhook : vérification du statut a échoué.', [
                'transaction_id' => $transactionId,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'OK'], 200);
        }

        $isSuccess = $status['status'] === 'ACCEPTED';

        DB::transaction(function () use ($payment, $status, $isSuccess) {
            $payment->update([
                'status' => $isSuccess ? 'success' : 'failed',
                'cinetpay_data' => $status['raw'] ?? null,
                'paid_at' => $isSuccess ? now() : null,
            ]);

            $payment->order->update([
                'status' => $isSuccess ? 'paid' : 'failed',
            ]);
        });

        if ($isSuccess) {
            Mail::to($payment->order->client_email)->send(new PaymentConfirmation($payment));
        }

        Log::info('CinetPay webhook traité.', [
            'transaction_id' => $transactionId,
            'status' => $status['status'],
            'order_id' => $payment->order_id,
        ]);

        return response()->json(['message' => 'OK'], 200);
    }

    public function getStatus(Request $request, string $orderId): JsonResponse
    {
        $order = Order::with(['payments' => fn ($query) => $query->latest()])->findOrFail($orderId);
        $payment = $order->payments->first();

        return response()->json([
            'order_status' => $order->status,
            'payment_status' => $payment?->status,
            'transaction_id' => $payment?->transaction_id,
            'amount' => $order->amount,
            'paid_at' => $payment?->paid_at,
        ]);
    }
}

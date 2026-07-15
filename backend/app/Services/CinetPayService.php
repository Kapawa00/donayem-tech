<?php

namespace App\Services;

use App\Models\Order;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class CinetPayService
{
    private Client $client;
    private string $baseUrl;
    private string $siteId;
    private string $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('services.cinetpay.base_url');
        $this->siteId = (string) config('services.cinetpay.site_id');
        $this->apiKey = (string) config('services.cinetpay.api_key');

        $this->client = new Client([
            'base_uri' => rtrim($this->baseUrl, '/').'/',
            'timeout' => 15,
        ]);
    }

    /**
     * Initie un paiement CinetPay pour une commande.
     *
     * @return array{payment_url: ?string, payment_token: ?string}
     */
    public function initiatePayment(Order $order, string $transactionId): array
    {
        $payload = [
            'apikey' => $this->apiKey,
            'site_id' => $this->siteId,
            'transaction_id' => $transactionId,
            'amount' => $this->formatAmount((float) $order->amount),
            'currency' => config('services.cinetpay.currency', 'XAF'),
            'description' => $order->service_description ?: ('Commande '.$order->reference),
            'customer_name' => $order->client_name,
            'customer_email' => $order->client_email,
            'customer_phone_number' => $order->client_phone,
            'notify_url' => config('services.cinetpay.notify_url'),
            'return_url' => config('services.cinetpay.return_url')
                .'?order_id='.$order->id.'&transaction_id='.$transactionId,
            'channels' => 'ALL',
            'metadata' => (string) $order->id,
        ];

        try {
            $response = $this->client->post('payment', ['json' => $payload]);
            $body = json_decode((string) $response->getBody(), true);

            if (($body['code'] ?? null) !== '201') {
                Log::error('CinetPay initiatePayment : réponse inattendue.', [
                    'order_id' => $order->id,
                    'transaction_id' => $transactionId,
                    'response' => $body,
                ]);

                throw new RuntimeException($body['message'] ?? "Échec de l'initialisation du paiement CinetPay.");
            }

            return [
                'payment_url' => $body['data']['payment_url'] ?? null,
                'payment_token' => $body['data']['payment_token'] ?? null,
            ];
        } catch (GuzzleException $e) {
            Log::error('CinetPay initiatePayment : erreur HTTP.', [
                'order_id' => $order->id,
                'transaction_id' => $transactionId,
                'message' => $e->getMessage(),
            ]);

            throw new RuntimeException("Impossible de contacter CinetPay pour initier le paiement.", previous: $e);
        }
    }

    /**
     * Vérifie le statut d'une transaction directement auprès de CinetPay.
     * Ne jamais faire confiance au webhook seul : cet appel fait foi.
     *
     * @return array{status: ?string, amount: ?float, currency: ?string, payment_method: ?string, operator_id: ?string, raw: array}
     */
    public function checkPaymentStatus(string $transactionId): array
    {
        $payload = [
            'apikey' => $this->apiKey,
            'site_id' => $this->siteId,
            'transaction_id' => $transactionId,
        ];

        try {
            $response = $this->client->post('payment/check', ['json' => $payload]);
            $body = json_decode((string) $response->getBody(), true);

            if (($body['code'] ?? null) !== '00') {
                Log::warning('CinetPay checkPaymentStatus : statut non confirmé.', [
                    'transaction_id' => $transactionId,
                    'response' => $body,
                ]);
            }

            return [
                'status' => $body['data']['status'] ?? null,
                'amount' => isset($body['data']['amount']) ? (float) $body['data']['amount'] : null,
                'currency' => $body['data']['currency'] ?? null,
                'payment_method' => $body['data']['payment_method'] ?? null,
                'operator_id' => $body['data']['operator_id'] ?? null,
                'raw' => $body,
            ];
        } catch (GuzzleException $e) {
            Log::error('CinetPay checkPaymentStatus : erreur HTTP.', [
                'transaction_id' => $transactionId,
                'message' => $e->getMessage(),
            ]);

            throw new RuntimeException("Impossible de vérifier le statut du paiement auprès de CinetPay.", previous: $e);
        }
    }

    /**
     * CinetPay exige un montant entier, multiple de 5.
     */
    private function formatAmount(float $amount): int
    {
        return (int) (ceil($amount / 5) * 5);
    }
}

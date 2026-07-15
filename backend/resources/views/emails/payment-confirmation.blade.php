<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Paiement confirmé</title>
</head>
<body style="margin:0;padding:0;background-color:#F9FAFB;font-family:Arial, Helvetica, sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9FAFB;padding:32px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;">
                    <tr>
                        <td style="background-color:#050A22;padding:24px 32px;">
                            <span style="font-size:18px;font-weight:700;color:#ffffff;">DONAYEM<span style="color:#D4A336;"> TECH</span></span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <h1 style="font-size:20px;color:#050A22;margin:0 0 16px;">Paiement reçu, {{ $payment->order->client_name }} !</h1>
                            <p style="font-size:14px;line-height:1.6;margin:0 0 16px;">
                                Merci, votre paiement a bien été confirmé. Voici le récapitulatif de votre transaction.
                            </p>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9FAFB;border-radius:8px;padding:16px;margin-bottom:16px;">
                                <tr>
                                    <td style="font-size:13px;color:#9CA3AF;padding-bottom:4px;">Référence de transaction</td>
                                </tr>
                                <tr>
                                    <td style="font-size:16px;font-weight:700;color:#050A22;padding-bottom:12px;">{{ $payment->transaction_id }}</td>
                                </tr>
                                <tr>
                                    <td style="font-size:13px;color:#9CA3AF;padding-bottom:4px;">Montant payé</td>
                                </tr>
                                <tr>
                                    <td style="font-size:16px;font-weight:700;color:#050A22;">{{ number_format((float) $payment->amount, 0, ',', ' ') }} {{ $payment->currency }}</td>
                                </tr>
                            </table>
                            <p style="font-size:14px;line-height:1.6;margin:0 0 4px;"><strong>Service commandé :</strong></p>
                            <p style="font-size:14px;line-height:1.6;margin:4px 0 24px;">{{ $payment->order->service_description }}</p>
                            <p style="font-size:14px;line-height:1.6;margin:0 0 16px;">
                                Notre équipe démarre le traitement de votre commande et vous contactera sous 24h pour la suite des étapes.
                            </p>
                            <p style="font-size:13px;color:#9CA3AF;margin:0;">
                                DONAYEM TECH — Douala, Ange Raphaël (Hôtel Sélect) · 681 181 456 / 696 580 487
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

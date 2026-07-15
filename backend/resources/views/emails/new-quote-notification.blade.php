<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Nouvelle demande de devis</title>
</head>
<body style="margin:0;padding:0;background-color:#F9FAFB;font-family:Arial, Helvetica, sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9FAFB;padding:32px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;">
                    <tr>
                        <td style="background-color:#050A22;padding:24px 32px;">
                            <span style="font-size:18px;font-weight:700;color:#ffffff;">Nouvelle demande de devis</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <p style="font-size:14px;line-height:1.6;margin:0 0 4px;"><strong>Référence :</strong> {{ $quote->reference }}</p>
                            <p style="font-size:14px;line-height:1.6;margin:0 0 4px;"><strong>Client :</strong> {{ $quote->client_name }}</p>
                            <p style="font-size:14px;line-height:1.6;margin:0 0 4px;"><strong>Email :</strong> {{ $quote->client_email }}</p>
                            <p style="font-size:14px;line-height:1.6;margin:0 0 4px;"><strong>Téléphone :</strong> {{ $quote->client_phone }}</p>
                            @if($quote->client_company)
                                <p style="font-size:14px;line-height:1.6;margin:0 0 4px;"><strong>Entreprise :</strong> {{ $quote->client_company }}</p>
                            @endif
                            <p style="font-size:14px;line-height:1.6;margin:0 0 4px;"><strong>Service(s) :</strong> {{ implode(', ', (array) $quote->services_requested) }}</p>
                            <p style="font-size:14px;line-height:1.6;margin:0 0 4px;"><strong>Budget :</strong> {{ $quote->budget_range ?? 'À discuter' }}</p>
                            @if($quote->deadline)
                                <p style="font-size:14px;line-height:1.6;margin:0 0 4px;"><strong>Délai souhaité :</strong> {{ $quote->deadline->format('d/m/Y') }}</p>
                            @endif
                            <p style="font-size:14px;line-height:1.6;margin:16px 0 0;"><strong>Description du projet :</strong></p>
                            <p style="font-size:14px;line-height:1.6;margin:4px 0 0;background-color:#F9FAFB;border-radius:8px;padding:16px;">{{ $quote->project_description }}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

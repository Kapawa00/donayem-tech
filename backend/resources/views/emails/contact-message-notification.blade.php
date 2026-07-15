<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Nouveau message de contact</title>
</head>
<body style="margin:0;padding:0;background-color:#F9FAFB;font-family:Arial, Helvetica, sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9FAFB;padding:32px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;">
                    <tr>
                        <td style="background-color:#050A22;padding:24px 32px;">
                            <span style="font-size:18px;font-weight:700;color:#ffffff;">Nouveau message de contact</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <p style="font-size:14px;line-height:1.6;margin:0 0 4px;"><strong>Nom :</strong> {{ $contactMessage->name }}</p>
                            <p style="font-size:14px;line-height:1.6;margin:0 0 4px;"><strong>Email :</strong> {{ $contactMessage->email }}</p>
                            @if($contactMessage->phone)
                                <p style="font-size:14px;line-height:1.6;margin:0 0 4px;"><strong>Téléphone :</strong> {{ $contactMessage->phone }}</p>
                            @endif
                            @if($contactMessage->subject)
                                <p style="font-size:14px;line-height:1.6;margin:0 0 4px;"><strong>Sujet :</strong> {{ $contactMessage->subject }}</p>
                            @endif
                            <p style="font-size:14px;line-height:1.6;margin:16px 0 0;"><strong>Message :</strong></p>
                            <p style="font-size:14px;line-height:1.6;margin:4px 0 0;background-color:#F9FAFB;border-radius:8px;padding:16px;">{{ $contactMessage->message }}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

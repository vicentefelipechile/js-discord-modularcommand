/**
 * @license     MIT
 * @file        src/locales.ts
 * @author      vicentefelipechile
 * @description Localization phrases for various command responses in a Discord bot using Discord.js.
 */

// =================================================================================================
// Imports
// =================================================================================================

import { Locale } from "discord.js";
import LOCALE_DELAY from "./modularlocale";

// =================================================================================================
// Localization Phrases
// =================================================================================================

/**
 * @description Localization phrases for various commands, specifically for permission errors.
 */
const LOCALE_FORBIDDEN: Record<Locale, string> = {
    [Locale.SpanishLATAM]: 'No tienes permiso para usar este comando.',
    [Locale.EnglishUS]: 'You do not have permission to use this command.',
    [Locale.EnglishGB]: 'I say, it appears you lack the proper authorisation to utilise this command, old bean.',
    [Locale.SpanishES]: 'Ostias chaval, tio parece que no vais a poder usar este comando madre mia willy, que barbaridad.',
    [Locale.PortugueseBR]: 'Você não tem permissão para usar este comando.',
    [Locale.French]: 'Vous n\'avez pas la permission d\'utiliser cette commande.',
    [Locale.German]: 'Du hast keine Berechtigung, diesen Befehl zu verwenden.',
    [Locale.Italian]: 'Non hai il permesso di usare questo comando.',
    [Locale.Russian]: 'У вас нет разрешения на использование этой команды.',
    [Locale.ChineseCN]: '您没有权限使用此命令。',
    [Locale.ChineseTW]: '您沒有權限使用此命令。',
    [Locale.Japanese]: 'このコマンドを使用する権限がありません。',
    [Locale.Korean]: '이 명령을 사용할 권한이 없습니다.',
    [Locale.Bulgarian]: 'Нямате разрешение да използвате тази команда.',
    [Locale.Czech]: 'Nemáte oprávnění k použití tohoto příkazu.',
    [Locale.Danish]: 'Du har ikke tilladelse til at bruge denne kommando.',
    [Locale.Dutch]: 'Je hebt geen toestemming om deze opdracht te gebruiken.',
    [Locale.Finnish]: 'Sinulla ei ole lupaa käyttää tätä komentoa.',
    [Locale.Hungarian]: 'Nincs jogosultságod ehhez a parancshoz.',
    [Locale.Norwegian]: 'Du har ikke behörighet til å bruke denne kommandoen.',
    [Locale.Polish]: 'Nie masz uprawnień do używania tej komendy.',
    [Locale.Romanian]: 'Nu ai permisiunea de a folosi acest comandă.',
    [Locale.Swedish]: 'Du har inte behörighet att använda det här kommandot.',
    [Locale.Turkish]: 'Bu komutu kullanma izniniz yok.',
    [Locale.Ukrainian]: 'У вас немає дозволу на використання цієї команди.',
    [Locale.Hindi]: 'आपको इस कमांड का उपयोग करने की अनुमति नहीं है।',
    [Locale.Indonesian]: 'Anda tidak memiliki izin untuk menggunakan perintah ini.',
    [Locale.Greek]: 'Δεν έχετε άδεια να χρησιμοποιήσετε αυτήν την εντολή.',
    [Locale.Croatian]: 'Nemate dopuštenje za korištenje ove naredbe.',
    [Locale.Lithuanian]: 'Jūs neturite teisės naudoti šio komandos.',
    [Locale.Thai]: 'คุณไม่มีสิทธิ์ใช้คำสั่งนี้.',
    [Locale.Vietnamese]: 'Bạn không có quyền sử dụng lệnh này.'
} as const;

/**
 * @description Localization phrases for NSFW command usage errors.
 */
const LOCALE_NSFW: Record<Locale, string> = {
    [Locale.SpanishLATAM]: 'Este comando solo puede ser usado en canales NSFW.',
    [Locale.EnglishUS]: 'This command can only be used in NSFW channels.',
    [Locale.EnglishGB]: 'I do declare, this command is exclusively for channels of a... risqué nature. little bit of cheeky fun, eh?',
    [Locale.SpanishES]: '¡Ostias, chaval! Que este comando es solo para los canales más guarros, ¿vale? No me seas meapilas.',
    [Locale.PortugueseBR]: 'Este comando só pode ser usado em canais NSFW.',
    [Locale.French]: 'Cette commande ne peut être utilisée que dans les salons NSFW.',
    [Locale.German]: 'Dieser Befehl kann nur in NSFW-Kanälen verwendet werden.',
    [Locale.Italian]: 'Questo comando può essere utilizzato solo nei canali NSFW.',
    [Locale.Russian]: 'Эту команду можно использовать только в каналах NSFW.',
    [Locale.ChineseCN]: '此命令只能在NSFW频道中使用。',
    [Locale.ChineseTW]: '此命令只能在 NSFW 頻道中使用。',
    [Locale.Japanese]: 'このコマンドはNSFWチャンネルでのみ使用できます。',
    [Locale.Korean]: '이 명령어는 NSFW 채널에서만 사용할 수 있습니다.',
    [Locale.Bulgarian]: 'Тази команда може да се използва само в NSFW канали.',
    [Locale.Czech]: 'Tento příkaz lze použít pouze v kanálech NSFW.',
    [Locale.Danish]: 'Denne kommando kan kun bruges i NSFW-kanaler.',
    [Locale.Dutch]: 'Deze opdracht kan alleen worden gebruikt in NSFW-kanalen.',
    [Locale.Finnish]: 'Tätä komentoa voi käyttää vain NSFW-kanavilla.',
    [Locale.Hungarian]: 'Ez a parancs csak NSFW csatornákon használható.',
    [Locale.Norwegian]: 'Denne kommandoen kan bare brukes i NSFW-kanaler.',
    [Locale.Polish]: 'Ta komenda może być używana tylko na kanałach NSFW.',
    [Locale.Romanian]: 'Această comandă poate fi utilizată numai în canalele NSFW.',
    [Locale.Swedish]: 'Det här kommandot kan endast användas i NSFW-kanaler.',
    [Locale.Turkish]: 'Bu komut yalnızca NSFW kanallarında kullanılabilir.',
    [Locale.Ukrainian]: 'Цю команду можна використовувати лише в каналах NSFW.',
    [Locale.Hindi]: 'यह कमांड केवल NSFW चैनलों में ही उपयोग की जा सकती है।',
    [Locale.Indonesian]: 'Perintah ini hanya dapat digunakan di saluran NSFW.',
    [Locale.Greek]: 'Αυτή η εντολή μπορεί να χρησιμοποιηθεί μόνο σε κανάλια NSFW.',
    [Locale.Croatian]: 'Ova se naredba može koristiti samo u NSFW kanalima.',
    [Locale.Lithuanian]: 'Ši komanda gali būti naudojama tik NSFW kanaluose.',
    [Locale.Thai]: 'คำสั่งนี้สามารถใช้ได้เฉพาะในช่องทาง NSFW เท่านั้น.',
    [Locale.Vietnamese]: 'Lệnh này chỉ có thể được sử dụng trong các kênh NSFW.'
} as const;

/**
 * @description Localization phrases for general application errors.
 */
const LOCALE_ERROR: Record<Locale, string> = {
    [Locale.SpanishLATAM]: 'Ocurrió un error al procesar tu solicitud.',
    [Locale.EnglishUS]: 'An error occurred while processing your request.',
    [Locale.EnglishGB]: 'I do declare, an error occurred while processing your request.',
    [Locale.SpanishES]: 'Pero que me estás contando, willy, ocurrió un error al procesar tu solicitud.',
    [Locale.PortugueseBR]: 'Ocorreu um erro ao processar sua solicitação.',
    [Locale.French]: 'Une erreur est survenue lors du traitement de votre demande.',
    [Locale.German]: 'Bei der Verarbeitung Ihrer Anfrage ist ein Fehler aufgetreten.',
    [Locale.Italian]: 'Si è verificato un errore durante l\'elaborazione della tua richiesta.',
    [Locale.Russian]: 'Произошла ошибка при обработке вашего запроса.',
    [Locale.ChineseCN]: '处理您的请求时发生错误。',
    [Locale.ChineseTW]: '處理您的請求時發生錯誤。',
    [Locale.Japanese]: 'リクエストの処理中にエラーが発生しました。',
    [Locale.Korean]: '요청을 처리하는 동안 오류가 발생했습니다.',
    [Locale.Bulgarian]: 'При обработката на заявката ви възникна грешка.',
    [Locale.Czech]: 'Při zpracování vaší žádosti došlo k chybě.',
    [Locale.Danish]: 'Der opstod en fejl under behandlingen af din anmodning.',
    [Locale.Dutch]: 'Er is een fout opgetreden bij het verwerken van uw verzoek.',
    [Locale.Finnish]: 'Pyyntösi käsittelyssä tapahtui virhe.',
    [Locale.Hungarian]: 'A kérésed feldolgozása során hiba lépett fel.',
    [Locale.Norwegian]: 'Det oppstod en feil under behandling av forespørselen din.',
    [Locale.Polish]: 'Wystąpił błąd podczas przetwarzania twojej prośby.',
    [Locale.Romanian]: 'A apărut o eroare în timpul procesării cererii tale.',
    [Locale.Swedish]: 'Ett fel inträffade vid behandling av din begäran.',
    [Locale.Turkish]: 'Talebiniz işlenirken bir hata oluştu.',
    [Locale.Ukrainian]: 'Під час обробки вашого запиту сталася помилка.',
    [Locale.Hindi]: 'आपके अनुरोध को संसाधित करते समय एक त्रुटि हुई।',
    [Locale.Indonesian]: 'Terjadi kesalahan saat memproses permintaan Anda.',
    [Locale.Greek]: 'Συνέβη σφάλμα κατά την επεξεργασία του αιτήματός σας.',
    [Locale.Croatian]: 'Došlo je do pogreške prilikom obrade vašeg zahtjeva.',
    [Locale.Lithuanian]: 'Apdorojant jūsų užklausą įvyko klaida.',
    [Locale.Thai]: 'เกิดข้อผิดพลาดระหว่างการประมวลผลคำขอของคุณ',
    [Locale.Vietnamese]: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu của bạn.'
} as const;

// =================================================================================================
// Exports
// =================================================================================================

export {
    LOCALE_DELAY,
    LOCALE_ERROR,
    LOCALE_FORBIDDEN,
    LOCALE_NSFW,
};
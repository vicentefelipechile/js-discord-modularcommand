/**
 * @module ModularCommand Locales
 * @description Generic localization phrases used throughout the application.
 * @license MIT
 */

import { Locale } from "discord.js";

/**
 * Regular expressions for time formatting
 * Used to match and replace time-related placeholders in localization strings.
 */

/**
 * @name SECONDS
 * @description Matches the `{seconds}` placeholder in localization strings to replace it with the amount of seconds of delay.
 */
const SECONDS = new RegExp('\\{seconds(?:\\|([^}]+))?\\}', 'g');

/**
 * @name SECONDS_PLURAL
 * @description Matches the `{seconds|plural|...}` placeholder in localization strings, unlike SECONDS RegEx, this one handles pluralization.
 */
const SECONDS_PLURAL = new RegExp('\\{seconds\\|plural\\|([^}]+)\\}', 'g');

/**
 * @name MINUTES
 * @description The same as `SECONDS`, but for minutes.
 */
const MINUTES = new RegExp('\\{minutes(?:\\|([^}]+))?\\}', 'g');

/**
 * @name MINUTES_PLURAL
 * @description Do we really need an explanation for this RegEx?
 */
const MINUTES_PLURAL = new RegExp('\\{minutes\\|plural\\|([^}]+)\\}', 'g');

/**
 * @description Function to handle seconds format
 * @param phrase The phrase to format
 * @param time The time in seconds
 * @returns The formatted string
 * @example ```javascript
 * const phraseLocale = LOCALE_DELAY[Locale.EnglishUS];
 * const phrasePlural = FormatSecondsLocale(phraseLocale, 90);
 * console.log(phrasePlural); // 'You must wait 1 minute 30 seconds before using this command again.'
 *
 * const phraseSingular = FormatSecondsLocale(phraseLocale, 60);
 * console.log(phraseSingular); // 'You must wait 1 minute before using this command again.'
 * ```
 */

function FormatSecondsLocale(phrase: string, time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  let formattedPhrase = phrase;

  if (minutes > 0) {
    // Replace plural forms for minutes first
    formattedPhrase = formattedPhrase.replace(MINUTES_PLURAL, (match, p1) => {
      return minutes === 1 ? '' : p1;
    });
    // Replace minute values
    formattedPhrase = formattedPhrase.replace(MINUTES, (match, p1) => {
      if (p1) {
        // Handles patterns like {minutes|y $ minuto}
        return p1.replace('$', minutes.toString());
      }
      return minutes.toString();
    });
  } else {
    // If no minutes, remove all minute-related placeholders
    formattedPhrase = formattedPhrase.replace(MINUTES, '').replace(MINUTES_PLURAL, '');
  }

  if (seconds > 0 || minutes === 0) {
    // Replace plural forms for seconds
    formattedPhrase = formattedPhrase.replace(SECONDS_PLURAL, (match, p1) => {
      return seconds === 1 ? '' : p1;
    });
    // Replace second values
    formattedPhrase = formattedPhrase.replace(SECONDS, seconds.toString());
  } else {
    // If there are minutes but no seconds, remove second-related placeholders
    formattedPhrase = formattedPhrase.replace(SECONDS, '').replace(SECONDS_PLURAL, '');
  }

  // Clean up any remaining empty placeholders and extra spaces
  return formattedPhrase.replace(/\{[^}]+\}/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * @description Localization phrases for delay commands.
 * @example
 * const example = LOCALE_DELAY[Locale.EnglishUS];
 *
 * console.log(FormatTimeLocale(example, 5)); // 'You must wait 5 seconds before using this command again.'
 * console.log(FormatTimeLocale(example, 63)); // 'You must wait 3 seconds and 1 minute before using this command again.'
 */

const LOCALE_DELAY: Record<Locale, string> = {
  [Locale.SpanishLATAM]: 'Debes esperar {seconds} segundo{seconds|plural|s} {minutes|y $ minuto}{minutes|plural|s} antes de utilizar este comando denuevo.',
  [Locale.EnglishUS]: 'You must wait {seconds} second{seconds|plural|s} {minutes|and $ minute}{minutes|plural|s} before using this command again.',
  [Locale.EnglishGB]: 'Good heavens! One must exhibit a spot of patience, you see. A brief pause of {seconds} second{seconds|plural|s} {minutes|and $ minute}{minutes|plural|s} is required before another attempt, what?',
  [Locale.SpanishES]: '¡Joder, tío! ¡Que te esperes {seconds} segundo{seconds|plural|s} {minutes|y $ minuto}{minutes|plural|s}, coño! ¡No flipes y dale un respiro al bot, hostia ya!',
  [Locale.PortugueseBR]: 'Você deve esperar {seconds} segundo{seconds|plural|s} {minutes|e $ minuto}{minutes|plural|s} antes de usar este comando novamente.',
  [Locale.French]: 'Vous devez attendre {seconds} seconde{seconds|plural|s} {minutes|et $ minute}{minutes|plural|s} avant d\'utiliser cette commande à nouveau.',
  [Locale.German]: 'Sie müssen {seconds} Sekunde{seconds|plural|n} {minutes|und $ Minute}{minutes|plural|n} warten, bevor Sie diesen Befehl erneut verwenden können.',
  [Locale.Italian]: 'Devi aspettare {seconds} secondo{seconds|plural|i} {minutes|e $ minuto}{minutes|plural|i} prima di utilizzare di nuovo questo comando.',
  [Locale.Russian]: 'Вы должны подождать {seconds} секунд{seconds|plural|у} {minutes|и $ минут}{minutes|plural|ы} перед повторным использованием этой команды.',
  [Locale.ChineseCN]: '您必须等待 {seconds} 秒 {minutes|和 $ 分钟} 才能再次使用此命令。',
  [Locale.ChineseTW]: '您必須等待 {seconds} 秒 {minutes|和 $ 分鐘} 才能再次使用此命令。',
  [Locale.Japanese]: 'このコマンドを再度使用するには、{seconds} 秒 {minutes|と $ 分} 待つ必要があります。',
  [Locale.Korean]: '이 명령어를 다시 사용하려면 {seconds} 초 {minutes|하고 $ 분} 기다려야 합니다.',
  [Locale.Bulgarian]: 'Трябва да изчакате {seconds} секунд{seconds|plural|и} {minutes|и $ минут}{minutes|plural|и}, преди да използвате тази команда отново.',
  [Locale.Czech]: 'Musíte počkat {seconds} sekund{seconds|plural|u} {minutes|a $ minut}{minutes|plural|y}, než znovu použijete tento příkaz.',
  [Locale.Danish]: 'Du skal vente {seconds} sekund{seconds|plural|er} {minutes|og $ minut}{minutes|plural|ter} før du kan bruge denne kommando igen.',
  [Locale.Dutch]: 'Je moet {seconds} seconde{seconds|plural|n} {minutes|en $ minuut}{minutes|plural|en} wachten voordat je dit commando opnieuw kunt gebruiken.',
  [Locale.Finnish]: 'Sinun on odotettava {seconds} sekunti{seconds|plural|a} {minutes|ja $ minuutti}{minutes|plural|a} ennen kuin voit käyttää tätä komentoa uudelleen.',
  [Locale.Hungarian]: 'Várnod kell {seconds} másodperc{seconds|plural|et} {minutes|és $ perc}{minutes|plural|et}, mielőtt újra használhatod ezt a parancsot.',
  [Locale.Norwegian]: 'Du må vente {seconds} sekund{seconds|plural|er} {minutes|og $ minutt}{minutes|plural|er} før du kan bruke denne kommandoen igjen.',
  [Locale.Polish]: 'Musisz poczekać {seconds} sekund{seconds|plural|y} {minutes|i $ minut}{minutes|plural|y}, zanim ponownie użyjesz tego polecenia.',
  [Locale.Romanian]: 'Trebuie să aștepți {seconds} secund{seconds|plural|ă} {minutes|și $ minut}{minutes|plural|e} înainte de a folosi din nou acest comandă.',
  [Locale.Swedish]: 'Du måste vänta {seconds} sekund{seconds|plural|er} {minutes|och $ minut}{minutes|plural|er} innan du kan använda det här kommandot igen.',
  [Locale.Turkish]: 'Bu komutu tekrar kullanmadan önce {seconds} saniye {minutes|ve $ dakika} beklemelisiniz.',
  [Locale.Ukrainian]: 'Вам потрібно почекати {seconds} секунд{seconds|plural|и} {minutes|і $ хвилин}{minutes|plural|и}, перш ніж знову використовувати цю команду.',
  [Locale.Hindi]: 'आपको इस कमांड का उपयोग करने से पहले {seconds} सेकंड {minutes|और $ मिनट} इंतजार करना होगा।',
  [Locale.Indonesian]: 'Anda harus menunggu {seconds} detik {minutes|dan $ menit} sebelum menggunakan perintah ini lagi.',
  [Locale.Greek]: 'Πρέπει να περιμένετε {seconds} δευτερόλεπτ{seconds|plural|ο} {minutes|και $ λεπτό}{minutes|plural|ά} πριν χρησιμοποιήσετε ξανά αυτήν την εντολή.',
  [Locale.Croatian]: 'Morate pričekati {seconds} sekund{seconds|plural|u} {minutes|i $ minut}{minutes|plural|e} prije nego što ponovno upotrijebite ovu naredbu.',
  [Locale.Lithuanian]: 'Prieš vėl naudodamiesi šiuo komandu, turite palaukti {seconds} sekund{seconds|plural|ę} {minutes|ir $ minut}{minutes|plural|es}.',
  [Locale.Thai]: 'คุณต้องรอ {seconds} วินาที {minutes|และ $ นาที} ก่อนที่จะใช้คำสั่งนี้อีกครั้ง',
  [Locale.Vietnamese]: 'Bạn phải đợi {seconds} giây {minutes|và $ phút} trước khi sử dụng lại lệnh này.'
} as const;

/**
 * @description Localization phrases for various commands.
 * @example ```js
 * const example = LOCALE_FORBIDDEN[Locale.EnglishUS];
 * console.log(example); // 'You do not have permission to use this command.'
 * ```
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
  [Locale.Norwegian]: 'Du har ikke tillatelse til å bruke denne kommandoen.',
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
 * @description Localization phrases for NSFW commands.
 * @example ```js
 * const example = LOCALE_NSFW[Locale.EnglishUS];
 * console.log(example); // 'This command can only be used in NSFW channels.'
 * ```
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
 * Error messages for different locales.
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

export {
  FormatSecondsLocale,
  LOCALE_DELAY,
  LOCALE_ERROR,
  LOCALE_FORBIDDEN,
  LOCALE_NSFW
};
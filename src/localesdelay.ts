/**
 * @license     MIT
 * @file        src/localesdelay.ts
 * @author      vicentefelipechile
 * @description Generic localization phrases used throughout the application.
 */

// =================================================================================================
// Imports
// =================================================================================================

import { Locale } from "discord.js";

// =================================================================================================
// Helper Functions
// =================================================================================================

/**
 * Format a time unit (seconds or minutes) for localization.
 * @param unit The time unit ('s' for seconds, 'm' for minutes).
 * @param unitCount The count of the time unit.
 * @param unitData The localization data for the time unit.
 * @returns The formatted string for the time unit.
 */
function formatUnit(unit: 's' | 'm', unitCount: number, unitData: Record<string, string>) {
    if (unitCount === 1) {
        return unitData.singular.replace(`{${unit}}`, unitCount.toString());
    } else {
        return unitData.plural.replace(`{${unit}}`, unitCount.toString());
    }
};

// =================================================================================================
// ModularLocale Class
// =================================================================================================

/**
 * @description Class to handle localization in a modular way.
 */
class ModularLocale {
    public locale: Locale;
    public phrases: Record<string, string>;
    public seconds: Record<string, string>;
    public minutes: Record<string, string>;

    constructor(locale: Locale) {
        this.locale = locale;
        this.phrases = {};
        this.seconds = {};
        this.minutes = {};
    }

    /**
     * Set the singular and plural forms for seconds.
     * @param {string} singular The singular form (e.g., '{s} segundo').
     * @param {string} plural The plural form (e.g., '{s} segundos').
     * @returns {ModularLocale}
     */
    setSeconds(singular: string, plural: string): this {
        this.seconds = { singular, plural };
        return this;
    }

    /**
     * Set the singular and plural forms for minutes.
     * @param {string} singular The singular form (e.g., '{m} minuto').
     * @param {string} plural The plural form (e.g., '{m} minutos').
     * @returns {ModularLocale}
     */
    setMinutes(singular: string, plural: string): this {
        this.minutes = { singular, plural };
        return this;
    }

    /**
     * Set the main phrase for the command delay.
     * @param {string} phrase The phrase when only seconds or minutes are present.
     * @returns {ModularLocale}
     */
    setPhrase(phrase: string): this {
        this.phrases.singular = phrase;
        return this;
    }

    /**
     * Set the phrase when both seconds and minutes are present.
     * @param {string} phrase The phrase for combined time.
     * @returns {ModularLocale}
     */
    setPhrasePlural(phrase: string): this {
        this.phrases.plural = phrase;
        return this;
    }

    /**
     * Set the phrase when only minutes are present.
     * @param {string} phrase The phrase for when only minutes are present.
     * @returns {ModularLocale}
     */
    setPhraseOnlyMinutes(phrase: string): this {
        this.phrases.onlyMinutes = phrase;
        return this;
    }

    getPhrase = (): Record<string, string> => this.phrases;
    getSeconds = (): Record<string, string> => this.seconds;
    getMinutes = (): Record<string, string> => this.minutes;

    /**
     * Get the formatted phrase based on the time.
     * @param {number} time The time in seconds.
     * @returns {string} The formatted string.
     */
    formatTime(time: number): string {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        let formattedPhrase = '';

        if (minutes > 0 && seconds > 0) {
            formattedPhrase = this.phrases.plural
                .replace('{seconds}', formatUnit('s', seconds, this.seconds))
                .replace('{minutes}', formatUnit('m', minutes, this.minutes));
        } else if (minutes > 0 && seconds === 0) {
            // Handle case where only minutes are present
            formattedPhrase = this.phrases.onlyMinutes
                .replace('{minutes}', formatUnit('m', minutes, this.minutes));
        } else {
            formattedPhrase = this.phrases.singular
                .replace('{seconds}', formatUnit('s', seconds, this.seconds))
                .replace('{minutes}', '')
                .trim();
        }

        return formattedPhrase.replace(/\s+/g, ' ').trim();
    }
}

// =================================================================================================
// Localization Phrases
// =================================================================================================

/**
 * @description Localization phrases for delay commands in ModularLocale structure.
 * @example ```js
 * const phrase = LOCALE_DELAY[Locale.EnglishUS];
 * console.log( phrase.formatTime(64) );    // 'You must wait 4 seconds and 1 minute.'
 * console.log( phrase.formatTime(390) );   // 'You must wait 30 seconds and 6 minutes.'
 * console.log( phrase.formatTime(1) );     // 'You must wait 1 second.'
 * console.log( phrase.formatTime(120) );   // 'You must wait 2 minutes.'
 * ```
 */
const LOCALE_DELAY = {
    [Locale.SpanishLATAM]: new ModularLocale(Locale.SpanishLATAM)
        .setSeconds('{s} segundo', '{s} segundos')
        .setMinutes('{m} minuto', '{m} minutos')
        .setPhrase('Debes esperar {seconds} antes de utilizar este comando denuevo.')
        .setPhrasePlural('Debes esperar {seconds} y {minutes} antes de utilizar este comando denuevo.')
        .setPhraseOnlyMinutes('Debes esperar {minutes} antes de utilizar este comando denuevo.'),

    [Locale.EnglishUS]: new ModularLocale(Locale.EnglishUS)
        .setSeconds('{s} second', '{s} seconds')
        .setMinutes('{m} minute', '{m} minutes')
        .setPhrase('You must wait {seconds} before using this command again.')
        .setPhrasePlural('You must wait {seconds} and {minutes} before using this command again.')
        .setPhraseOnlyMinutes('You must wait {minutes} before using this command again.'),

    [Locale.EnglishGB]: new ModularLocale(Locale.EnglishGB)
        .setSeconds('{s} second', '{s} seconds')
        .setMinutes('{m} minute', '{m} minutes')
        .setPhrase('One must exhibit a spot of patience, you see. A brief pause of {seconds} is required before another attempt, what?')
        .setPhrasePlural('One must exhibit a spot of patience, you see. A brief pause of {seconds} and {minutes} is required before another attempt, what?')
        .setPhraseOnlyMinutes('One must exhibit a spot of patience, you see. A brief pause of {minutes} is required before another attempt, what?'),

    [Locale.SpanishES]: new ModularLocale(Locale.SpanishES)
        .setSeconds('{s} segundo', '{s} segundos')
        .setMinutes('{m} minuto', '{m} minutos')
        .setPhrase('¡Joder, tío! ¡Que te esperes {seconds} antes de utilizar este comando, coño!')
        .setPhrasePlural('¡Joder, tío! ¡Que te esperes {seconds} y {minutes}, coño!')
        .setPhraseOnlyMinutes('¡Joder, tío! ¡Que te esperes {minutes} antes de utilizar este comando, coño!'),

    [Locale.PortugueseBR]: new ModularLocale(Locale.PortugueseBR)
        .setSeconds('{s} segundo', '{s} segundos')
        .setMinutes('{m} minuto', '{m} minutos')
        .setPhrase('Você deve esperar {seconds} antes de usar este comando novamente.')
        .setPhrasePlural('Você deve esperar {seconds} e {minutes} antes de usar este comando novamente.')
        .setPhraseOnlyMinutes('Você deve esperar {minutes} antes de usar este comando novamente.'),

    [Locale.French]: new ModularLocale(Locale.French)
        .setSeconds('{s} seconde', '{s} secondes')
        .setMinutes('{m} minute', '{m} minutes')
        .setPhrase('Vous devez attendre {seconds} avant d\'utiliser cette commande à nouveau.')
        .setPhrasePlural('Vous devez attendre {seconds} et {minutes} avant d\'utiliser cette commande à nouveau.')
        .setPhraseOnlyMinutes('Vous devez attendre {minutes} avant d\'utiliser cette commande à nouveau.'),

    [Locale.German]: new ModularLocale(Locale.German)
        .setSeconds('{s} Sekunde', '{s} Sekunden')
        .setMinutes('{m} Minute', '{m} Minuten')
        .setPhrase('Sie müssen {seconds} warten, bevor Sie diesen Befehl erneut verwenden können.')
        .setPhrasePlural('Sie müssen {seconds} und {minutes} warten, bevor Sie diesen Befehl erneut verwenden können.')
        .setPhraseOnlyMinutes('Sie müssen {minutes} warten, bevor Sie diesen Befehl erneut verwenden können.'),

    [Locale.Italian]: new ModularLocale(Locale.Italian)
        .setSeconds('{s} secondo', '{s} secondi')
        .setMinutes('{m} minuto', '{m} minuti')
        .setPhrase('Devi aspettare {seconds} prima di utilizzare di nuovo questo comando.')
        .setPhrasePlural('Devi aspettare {seconds} e {minutes} prima di utilizzare di nuovo questo comando.')
        .setPhraseOnlyMinutes('Devi aspettare {minutes} prima di utilizzare di nuovo questo comando.'),

    [Locale.Russian]: new ModularLocale(Locale.Russian)
        .setSeconds('{s} секунду', '{s} секунд')
        .setMinutes('{m} минуту', '{m} минут')
        .setPhrase('Вы должны подождать {seconds} перед повторным использованием этой команды.')
        .setPhrasePlural('Вы должны подождать {seconds} и {minutes} перед повторным использованием этой команды.')
        .setPhraseOnlyMinutes('Вы должны подождать {minutes} перед повторным использованием этой команды.'),

    [Locale.ChineseCN]: new ModularLocale(Locale.ChineseCN)
        .setSeconds('{s} 秒', '{s} 秒')
        .setMinutes('{m} 分钟', '{m} 分钟')
        .setPhrase('您必须等待 {seconds} 才能再次使用此命令.')
        .setPhrasePlural('您必须等待 {seconds} 和 {minutes} 才能再次使用此命令.')
        .setPhraseOnlyMinutes('您必须等待 {minutes} 才能再次使用此命令.'),

    [Locale.ChineseTW]: new ModularLocale(Locale.ChineseTW)
        .setSeconds('{s} 秒', '{s} 秒')
        .setMinutes('{m} 分鐘', '{m} 分鐘')
        .setPhrase('您必須等待 {seconds} 才能再次使用此命令.')
        .setPhrasePlural('您必須等待 {seconds} 和 {minutes} 才能再次使用此命令.')
        .setPhraseOnlyMinutes('您必須等待 {minutes} 才能再次使用此命令.'),

    [Locale.Japanese]: new ModularLocale(Locale.Japanese)
        .setSeconds('{s} 秒', '{s} 秒')
        .setMinutes('{m} 分', '{m} 分')
        .setPhrase('このコマンドを再度使用するには、{seconds} 待つ必要があります.')
        .setPhrasePlural('このコマンドを再度使用するには、{seconds} と {minutes} 待つ必要があります.')
        .setPhraseOnlyMinutes('このコマンドを再度使用するには、{minutes} 待つ必要があります.'),

    [Locale.Korean]: new ModularLocale(Locale.Korean)
        .setSeconds('{s} 초', '{s} 초')
        .setMinutes('{m} 분', '{m} 분')
        .setPhrase('이 명령어를 다시 사용하려면 {seconds} 기다려야 합니다.')
        .setPhrasePlural('이 명령어를 다시 사용하려면 {seconds} 하고 {minutes} 기다려야 합니다.')
        .setPhraseOnlyMinutes('이 명령어를 다시 사용하려면 {minutes} 기다려야 합니다.'),

    [Locale.Bulgarian]: new ModularLocale(Locale.Bulgarian)
        .setSeconds('{s} секунд', '{s} секунди')
        .setMinutes('{m} минут', '{m} минути')
        .setPhrase('Трябва да изчакате {seconds} преди да използвате тази команда отново.')
        .setPhrasePlural('Трябва да изчакате {seconds} и {minutes} преди да използвате тази команда отново.')
        .setPhraseOnlyMinutes('Трябва да изчакате {minutes} преди да използвате тази команда отново.'),

    [Locale.Czech]: new ModularLocale(Locale.Czech)
        .setSeconds('{s} sekundu', '{s} sekund')
        .setMinutes('{m} minutu', '{m} minut')
        .setPhrase('Musíte počkat {seconds} než znovu použijete tento příkaz.')
        .setPhrasePlural('Musíte počkat {seconds} a {minutes} než znovu použijete tento příkaz.')
        .setPhraseOnlyMinutes('Musíte počkat {minutes} než znovu použijete tento příkaz.'),

    [Locale.Danish]: new ModularLocale(Locale.Danish)
        .setSeconds('{s} sekund', '{s} sekunder')
        .setMinutes('{m} minut', '{m} minutter')
        .setPhrase('Du skal vente {seconds} før du kan bruge denne kommando igen.')
        .setPhrasePlural('Du skal vente {seconds} og {minutes} før du kan bruge denne kommando igen.')
        .setPhraseOnlyMinutes('Du skal vente {minutes} før du kan bruge denne kommando igen.'),

    [Locale.Dutch]: new ModularLocale(Locale.Dutch)
        .setSeconds('{s} seconde', '{s} seconden')
        .setMinutes('{m} minuut', '{m} minuten')
        .setPhrase('Je moet {seconds} wachten voordat je dit commando opnieuw kunt gebruiken.')
        .setPhrasePlural('Je moet {seconds} en {minutes} wachten voordat je dit commando opnieuw kunt gebruiken.')
        .setPhraseOnlyMinutes('Je moet {minutes} wachten voordat je dit commando opnieuw kunt gebruiken.'),

    [Locale.Finnish]: new ModularLocale(Locale.Finnish)
        .setSeconds('{s} sekunti', '{s} sekuntia')
        .setMinutes('{m} minuutti', '{m} minuuttia')
        .setPhrase('Sinun on odotettava {seconds} ennen kuin voit käyttää tätä komentoa uudelleen.')
        .setPhrasePlural('Sinun on odotettava {seconds} ja {minutes} ennen kuin voit käyttää tätä komentoa uudelleen.')
        .setPhraseOnlyMinutes('Sinun on odotettava {minutes} ennen kuin voit käyttää tätä komentoa uudelleen.'),

    [Locale.Hungarian]: new ModularLocale(Locale.Hungarian)
        .setSeconds('{s} másodperc', '{s} másodpercet')
        .setMinutes('{m} perc', '{m} percet')
        .setPhrase('Várnod kell {seconds} mielőtt újra használhatod ezt a parancsot.')
        .setPhrasePlural('Várnod kell {seconds} és {minutes} mielőtt újra használhatod ezt a parancsot.')
        .setPhraseOnlyMinutes('Várnod kell {minutes} mielőtt újra használhatod ezt a parancsot.'),

    [Locale.Norwegian]: new ModularLocale(Locale.Norwegian)
        .setSeconds('{s} sekund', '{s} sekunder')
        .setMinutes('{m} minutt', '{m} minutter')
        .setPhrase('Du må vente {seconds} før du kan bruke denne kommandoen igjen.')
        .setPhrasePlural('Du må vente {seconds} og {minutes} før du kan bruke denne kommandoen igjen.')
        .setPhraseOnlyMinutes('Du må vente {minutes} før du kan bruke denne kommandoen igjen.'),

    [Locale.Polish]: new ModularLocale(Locale.Polish)
        .setSeconds('{s} sekundę', '{s} sekundy')
        .setMinutes('{m} minutę', '{m} minuty')
        .setPhrase('Musisz poczekać {seconds} zanim ponownie użyjesz tego polecenia.')
        .setPhrasePlural('Musisz poczekać {seconds} i {minutes} zanim ponownie użyjesz tego polecenia.')
        .setPhraseOnlyMinutes('Musisz poczekać {minutes} zanim ponownie użyjesz tego polecenia.'),

    [Locale.Romanian]: new ModularLocale(Locale.Romanian)
        .setSeconds('{s} secundă', '{s} secunde')
        .setMinutes('{m} minut', '{m} minute')
        .setPhrase('Trebuie să aștepți {seconds} înainte de a folosi din nou acest comandă.')
        .setPhrasePlural('Trebuie să aștepți {seconds} și {minutes} înainte de a folosi din nou acest comandă.')
        .setPhraseOnlyMinutes('Trebuie să aștepți {minutes} înainte de a folosi din nou acest comandă.'),

    [Locale.Swedish]: new ModularLocale(Locale.Swedish)
        .setSeconds('{s} sekund', '{s} sekunder')
        .setMinutes('{m} minut', '{m} minuter')
        .setPhrase('Du måste vänta {seconds} innan du kan använda det här kommandot igen.')
        .setPhrasePlural('Du måste vänta {seconds} och {minutes} innan du kan använda det här kommandot igen.')
        .setPhraseOnlyMinutes('Du måste vänta {minutes} innan du kan använda det här kommandot igen.'),

    [Locale.Turkish]: new ModularLocale(Locale.Turkish)
        .setSeconds('{s} saniye', '{s} saniye')
        .setMinutes('{m} dakika', '{m} dakika')
        .setPhrase('Bu komutu tekrar kullanmadan önce {seconds} beklemeniz gerekir.')
        .setPhrasePlural('Bu komutu tekrar kullanmadan önce {seconds} ve {minutes} beklemeniz gerekir.')
        .setPhraseOnlyMinutes('Bu komutu tekrar kullanmadan önce {minutes} beklemeniz gerekir.'),

    [Locale.Ukrainian]: new ModularLocale(Locale.Ukrainian)
        .setSeconds('{s} секунду', '{s} секунди')
        .setMinutes('{m} хвилину', '{m} хвилини')
        .setPhrase('Вам потрібно почекати {seconds} перш ніж знову використовувати цю команду.')
        .setPhrasePlural('Вам потрібно почекати {seconds} і {minutes} перш ніж знову використовувати цю команду.')
        .setPhraseOnlyMinutes('Вам потрібно почекати {minutes} перш ніж знову використовувати цю команду.'),

    [Locale.Hindi]: new ModularLocale(Locale.Hindi)
        .setSeconds('{s} सेकंड', '{s} सेकंड')
        .setMinutes('{m} मिनट', '{m} मिनट')
        .setPhrase('आपको इस कमांड का उपयोग करने से पहले {seconds} इंतजार करना होगा.')
        .setPhrasePlural('आपको इस कमांड का उपयोग करने से पहले {seconds} और {minutes} इंतजार करना होगा.')
        .setPhraseOnlyMinutes('आपको इस कमांड का उपयोग करने से पहले {minutes} इंतजार करना होगा.'),

    [Locale.Indonesian]: new ModularLocale(Locale.Indonesian)
        .setSeconds('{s} detik', '{s} detik')
        .setMinutes('{m} menit', '{m} menit')
        .setPhrase('Anda harus menunggu {seconds} sebelum menggunakan perintah ini lagi.')
        .setPhrasePlural('Anda harus menunggu {seconds} dan {minutes} sebelum menggunakan perintah ini lagi.')
        .setPhraseOnlyMinutes('Anda harus menunggu {minutes} sebelum menggunakan perintah ini lagi.'),

    [Locale.Greek]: new ModularLocale(Locale.Greek)
        .setSeconds('{s} δευτερόλεπτο', '{s} δευτερόλεπτα')
        .setMinutes('{m} λεπτό', '{m} λεπτά')
        .setPhrase('Πρέπει να περιμένετε {seconds} πριν χρησιμοποιήσετε ξανά αυτήν την εντολή.')
        .setPhrasePlural('Πρέπει να περιμένετε {seconds} και {minutes} πριν χρησιμοποιήσετε ξανά αυτήν την εντολή.')
        .setPhraseOnlyMinutes('Πρέπει να περιμένετε {minutes} πριν χρησιμοποιήσετε ξανά αυτήν την εντολή.'),

    [Locale.Croatian]: new ModularLocale(Locale.Croatian)
        .setSeconds('{s} sekundu', '{s} sekunde')
        .setMinutes('{m} minutu', '{m} minute')
        .setPhrase('Morate pričekati {seconds} prije nego što ponovno upotrijebite ovu naredbu.')
        .setPhrasePlural('Morate pričekati {seconds} i {minutes} prije nego što ponovno upotrijebite ovu naredbu.')
        .setPhraseOnlyMinutes('Morate pričekati {minutes} prije nego što ponovno upotrijebite ovu naredbu.'),

    [Locale.Lithuanian]: new ModularLocale(Locale.Lithuanian)
        .setSeconds('{s} sekundę', '{s} sekundes')
        .setMinutes('{m} minutę', '{m} minutes')
        .setPhrase('Prieš vėl naudodamiesi šiuo komandu, turite palaukti {seconds}.')
        .setPhrasePlural('Prieš vėl naudodamiesi šiuo komandu, turite palaukti {seconds} ir {minutes}.')
        .setPhraseOnlyMinutes('Prieš vėl naudodamiesi šiuo komandu, turite palaukti {minutes}.'),

    [Locale.Thai]: new ModularLocale(Locale.Thai)
        .setSeconds('{s} วินาที', '{s} วินาที')
        .setMinutes('{m} นาที', '{m} นาที')
        .setPhrase('คุณต้องรอ {seconds} ก่อนที่จะใช้คำสั่งนี้อีกครั้ง')
        .setPhrasePlural('คุณต้องรอ {seconds} และ {minutes} ก่อนที่จะใช้คำสั่งนี้อีกครั้ง')
        .setPhraseOnlyMinutes('คุณต้องรอ {minutes} ก่อนที่จะใช้คำสั่งนี้อีกครั้ง'),

    [Locale.Vietnamese]: new ModularLocale(Locale.Vietnamese)
        .setSeconds('{s} giây', '{s} giây')
        .setMinutes('{m} phút', '{m} phút')
        .setPhrase('Bạn phải đợi {seconds} trước khi sử dụng lại lệnh này.')
        .setPhrasePlural('Bạn phải đợi {seconds} và {minutes} trước khi sử dụng lại lệnh này.')
        .setPhraseOnlyMinutes('Bạn phải đợi {minutes} trước khi sử dụng lại lệnh này.')
};

Object.freeze(LOCALE_DELAY);

// =================================================================================================
// Export
// =================================================================================================

export default LOCALE_DELAY;

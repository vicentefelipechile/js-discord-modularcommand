/**
 * @module ModularCommand
 * @description A module for creating and managing modular commands in a easy way for me.
 * @license MIT
 */

/**
 * Imports
 */

import {
    ApplicationCommandOptionType,
    MessageComponentInteraction,
    ChatInputCommandInteraction,
    ModalSubmitInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    ButtonBuilder,
    ModalBuilder,
    Locale,
    MessageFlags,
    Message,
    ButtonStyle,
    Channel,
    User,
    Role,
    GuildMember,
    LocalizationMap,
    APIApplicationCommandOptionChoice,
    TextInputStyle,
} from 'discord.js';


/**
 * Localization Phrases
 */

/**
 * @description Localization phrases for various commands.
 * @example
 * const example = LOCALE_FORBIDDEN[Locale.EnglishUS];
 * console.log(example); // 'You do not have permission to use this command.'
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
};

/**
 * @description Localization phrases for NSFW commands.
 * @example
 * const example = LOCALE_NSFW[Locale.EnglishUS];
 * console.log(example); // 'This command can only be used in NSFW channels.'
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
};

/**
 * @description Localization phrases for delay commands.
 * @example
 * const example = LOCALE_DELAY[Locale.EnglishUS];
 * const secondsPluralRegEx = new RegExp('{plural\\|([^}]+)}', 'g');
 * const seconds = 5;
 * const formattedPhrase = example
 *      .replace('{seconds}', seconds.toString())
 *      .replace(secondsPluralRegEx, seconds === 1 ? '' : '$1');
 *
 * console.log(formattedPhrase); // 'You must wait 5 seconds before using this command again.'
 */
const LOCALE_DELAY: Record<Locale, string> = {
    [Locale.SpanishLATAM]: 'Debes esperar {seconds} segundo{plural|s} antes de utilizar este comando denuevo.',
    [Locale.EnglishUS]: 'You must wait {seconds} second{plural|s} before using this command again.',
    [Locale.EnglishGB]: 'I do declare, you must wait {seconds} second{plural|s} before using this command again.',
    [Locale.SpanishES]: '¡Ostias, chaval! Debes esperar {seconds} segundo{plural|s} antes de utilizar este comando denuevo.',
    [Locale.PortugueseBR]: 'Você deve esperar {seconds} segundo{plural|s} antes de usar este comando novamente.',
    [Locale.French]: 'Vous devez attendre {seconds} seconde{plural|s} avant d\'utiliser cette commande à nouveau.',
    [Locale.German]: 'Sie müssen {seconds} Sekunde{plural|n} warten, bevor Sie diesen Befehl erneut verwenden können.',
    [Locale.Italian]: 'Devi aspettare {seconds} secondo{plural|i} prima di utilizzare di nuovo questo comando.',
    [Locale.Russian]: 'Вы должны подождать {seconds} секунду{plural|ы} перед повторным использованием этой команды.',
    [Locale.ChineseCN]: '您必须等待 {seconds} 秒钟{plural|s}才能再次使用此命令。',
    [Locale.ChineseTW]: '您必須等待 {seconds} 秒鐘{plural|s}才能再次使用此命令。',
    [Locale.Japanese]: 'このコマンドを再度使用するには、{seconds} 秒待つ必要があります。',
    [Locale.Korean]: '이 명령어를 다시 사용하려면 {seconds} 초 기다려야 합니다.',
    [Locale.Bulgarian]: 'Трябва да изчакате {seconds} секунда{plural|и}, преди да използвате тази команда отново.',
    [Locale.Czech]: 'Musíte počkat {seconds} sekundu{plural|y}, než znovu použijete tento příkaz.',
    [Locale.Danish]: 'Du skal vente {seconds} sekund{plural|er} før du kan bruge denne kommando igen.',
    [Locale.Dutch]: 'Je moet {seconds} seconde{plural|n} wachten voordat je dit commando opnieuw kunt gebruiken.',
    [Locale.Finnish]: 'Sinun on odotettava {seconds} sekuntia ennen kuin voit käyttää tätä komentoa uudelleen.',
    [Locale.Hungarian]: 'Várnod kell {seconds} másodpercet, mielőtt újra használhatod ezt a parancsot.',
    [Locale.Norwegian]: 'Du må vente {seconds} sekund{plural|er} før du kan bruke denne kommandoen igjen.',
    [Locale.Polish]: 'Musisz poczekać {seconds} sekund{plural|y}, zanim ponownie użyjesz tego polecenia.',
    [Locale.Romanian]: 'Trebuie să aștepți {seconds} secundă{plural|e} înainte de a folosi din nou acest comandă.',
    [Locale.Swedish]: 'Du måste vänta {seconds} sekund{plural|er} innan du kan använda det här kommandot igen.',
    [Locale.Turkish]: 'Bu komutu tekrar kullanmadan önce {seconds} saniye beklemelisiniz.',
    [Locale.Ukrainian]: 'Вам потрібно почекати {seconds} секунду{plural|и}, перш ніж знову використовувати цю команду.',
    [Locale.Hindi]: 'आपको इस कमांड का उपयोग करने से पहले {seconds} सेकंड{plural|s} इंतजार करना होगा।',
    [Locale.Indonesian]: 'Anda harus menunggu {seconds} detik{plural|s} sebelum menggunakan perintah ini lagi.',
    [Locale.Greek]: 'Πρέπει να περιμένετε {seconds} δευτερόλεπτο{plural|α} πριν χρησιμοποιήσετε ξανά αυτήν την εντολή.',
    [Locale.Croatian]: 'Morate pričekati {seconds} sekundu{plural|e} prije nego što ponovno upotrijebite ovu naredbu.',
    [Locale.Lithuanian]: 'Prieš vėl naudodamiesi šiuo komandu, turite palaukti {seconds} sekundę{plural|es}.',
    [Locale.Thai]: 'คุณต้องรอ {seconds} วินาที{plural|s} ก่อนที่จะใช้คำสั่งนี้อีกครั้ง',
    [Locale.Vietnamese]: 'Bạn phải đợi {seconds} giây{plural|s} trước khi sử dụng lại lệnh này.'
};

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
};

/**
 * Types
 */

type ArgType = string | number | boolean | User | Channel | Role | GuildMember;

type ExecuteFunction<T extends ChatInputCommandInteraction | MessageComponentInteraction> = (params: {
    interaction: T;
    args?: Record<string, ArgType>;
    command: ModularCommand;
    locale: Record<string, any>;
}) => Promise<void>;

type ButtonExecuteFunction = (params: {
    interaction: MessageComponentInteraction;
    command: ModularCommand;
    locale: Record<string, any>;
    message: Message;
}) => Promise<void>;

type ModalExecuteFunction = (params: {
    interaction: ModalSubmitInteraction;
    args: Record<string, string>;
    command: ModularCommand;
    locale: Record<string, any>;
}) => Promise<void>;

type PermissionCheckFunction = (interaction: ChatInputCommandInteraction) => boolean;

/**
 * Interface
 */

interface ModularCommandOptions {
    name: string;
    description?: string;
    execute?: ExecuteFunction<ChatInputCommandInteraction>;
    componentExecute?: ExecuteFunction<MessageComponentInteraction>;
    modalExecute?: ModalExecuteFunction;
}

interface CommandOption {
    name: string;
    type: ApplicationCommandOptionType;
    description: Record<Locale, string> | string;
    required?: boolean;
    choices?: APIApplicationCommandOptionChoice[];
}

interface RegisteredCommand {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    componentExecute?: (interaction: MessageComponentInteraction) => Promise<void>;
    modalExecute?: (interaction: ModalSubmitInteraction) => Promise<void>;
    buttonExecute?: (interaction: MessageComponentInteraction) => Promise<void>;
    cooldown: number;
}

/**
 * Variables
 */

const ALLOWED_OPTION_TYPE = [
    ApplicationCommandOptionType.String,
    ApplicationCommandOptionType.Boolean,
    ApplicationCommandOptionType.Integer,
    ApplicationCommandOptionType.Number,
    ApplicationCommandOptionType.User,
    ApplicationCommandOptionType.Channel,
];


/**
 * @class ModularButton
 * @description Represents a modular button that can be registered with Discord.js.
 * It allows for dynamic button creation and execution.
 */

class ModularButton {
    public buttonObject: ButtonBuilder;
    public customId: string;
    public style: ButtonStyle;
    public execute: ButtonExecuteFunction = async () => { };

    /**
     * Creates a new button for the command.
     * @param {string} customId The custom ID for the button.
     * @param {ButtonStyle} style The style of the button.
     */
    constructor(customId: string, style: ButtonStyle) {
        this.buttonObject = new ButtonBuilder();
        this.buttonObject.setCustomId(customId);
        this.buttonObject.setStyle(style);

        this.customId = customId;
        this.style = style;
    }

    /**
     * Sets the execute function for the button.
     * @param {ButtonExecuteFunction} executeFunction The function to execute.
     * @return {ModularButton} The button instance for chaining.
     */
    setExecute(executeFunction: ButtonExecuteFunction): this {
        this.execute = executeFunction;
        return this;
    }
}


/**
 * @class ModularModal
 * @description Represents a modular modal that can be registered with Discord.js.
 * It allows for dynamic modal creation and execution.
 */
class ModularModal {
    public modalObject: ModalBuilder;
    public modalId: string;
    public modalInputs: Map<string, TextInputBuilder>;
    public command: ModularCommand;
    public execute: ModalExecuteFunction = async () => { };

    /**
     * Creates a new modal for the command.
     * @param {string} modalId The ID for the modal.
     * @param {ModularCommand} command The command that this modal belongs to.
     */
    constructor(modalId: string, command: ModularCommand) {
        this.modalObject = new ModalBuilder();
        this.modalObject.setCustomId(modalId);
        this.modalId = modalId;

        this.modalInputs = new Map();
        this.command = command;
    }

    /**
     * Sets the execute function for the modal.
     * @param {ModalExecuteFunction} executeFunction The function to execute.
     * @returns {ModularModal} The modal instance for chaining.
     */
    setExecute(executeFunction: ModalExecuteFunction): this {
        this.execute = executeFunction;
        return this;
    }

    /**
     * Creates a new text input for the modal.
     * @param {string} id The ID for the text input.
     * @param {TextInputStyle} style The style of the text input.
     * @returns {TextInputBuilder} The created text input instance.
     */
    newTextInput(id: string, style: TextInputStyle): TextInputBuilder {
        const textInput = new TextInputBuilder();
        textInput.setCustomId(id);
        textInput.setStyle(style);
        this.modalInputs.set(id, textInput);

        this.modalObject.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(textInput));
        return textInput;
    }

    /**
     * Builds the modal object.
     * @param {Record<string, any>} locale The localization object for the modal.
     * @return {ModalBuilder} The built modal object.
     */
    build(locale: Record<string, any>): ModalBuilder {
        const selfModal = this.modalObject;
        const commandName = this.command.name;

        selfModal.setTitle(locale[`${commandName}.${this.modalId}.title`]);

        this.modalInputs.forEach((input, id) => {
            input.setLabel(locale[`${commandName}.${id}.label`]);
            input.setPlaceholder(locale[`${commandName}.${id}.placeholder`]);
        });

        return selfModal;
    }
}

/**
 * @class ModularCommand
 * @description Represents a modular command that can be registered with Discord.js.
 * It allows for dynamic command creation and execution.
 */
class ModularCommand {
    public name: string;
    public description: string;
    public execute: ExecuteFunction<ChatInputCommandInteraction>;
    public componentExecute?: ExecuteFunction<MessageComponentInteraction>;
    public modalExecute?: ModalExecuteFunction;
    public options: CommandOption[];
    public optionsLocalizations: Record<string, Record<Locale, string>>;
    public customIdHandlers: Record<string, ExecuteFunction<ChatInputCommandInteraction>>;
    public cooldown: number;
    public modals: Map<string, ModularModal>;
    public buttons: Map<string, ModularButton>;
    public buttonsArray: ModularButton[];
    public isNSFW: boolean;
    public descriptionLocalizations?: LocalizationMap;
    public localizationPhrases?: Record<Locale, any>;
    public permissionCheck?: PermissionCheckFunction;
    public componentId?: string;

    constructor({ name, description, execute, componentExecute, modalExecute }: ModularCommandOptions) {
        this.name = name;
        this.description = description || '';
        this.execute = execute || (async () => { });
        this.componentExecute = componentExecute;
        this.modalExecute = modalExecute;
        this.options = [];
        this.optionsLocalizations = {};
        this.customIdHandlers = {};
        this.cooldown = 3;
        this.modals = new Map();
        this.buttons = new Map();
        this.buttonsArray = [];
        this.isNSFW = false;
    }

    /**
     * Sets the description of the command.
     * @param {string} description The description.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setDescription(description: string): this {
        this.description = description;
        return this;
    }

    /**
     * Sets the description localizations for the command.
     * @param {LocalizationMap} localizations The description localizations.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setLocalizationsDescription(localizations: LocalizationMap): this {
        this.description = localizations[Locale.EnglishUS] || this.description;
        this.descriptionLocalizations = localizations;
        return this;
    }

    setLocalizationOptions(localizations: Record<string, Record<Locale, string>>): this {
        this.optionsLocalizations = localizations;
        return this;
    }

    /**
     * Sets the localization phrases for the command.
     * @param {Record<Locale, any>} localizationPhrases The localization phrases.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setLocalizationPhrases(localizationPhrases: Record<Locale, any>): this {
        this.localizationPhrases = localizationPhrases;
        return this;
    }

    /**
     * Sets the execute function for the command.
     * @param {ExecuteFunction<CommandInteraction>} executeFunction The function to execute.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setExecute(executeFunction: ExecuteFunction<ChatInputCommandInteraction>): this {
        this.execute = executeFunction;
        return this;
    }

    /**
     * Sets the component execute function for the command.
     * @param {string} componentId The base ID for the components.
     * @param {ExecuteFunction<MessageComponentInteraction>} executeFunction The function to execute for component interactions.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setComponentExecute(componentId: string, executeFunction: ExecuteFunction<MessageComponentInteraction>): this {
        this.componentId = componentId;
        this.componentExecute = executeFunction;
        return this;
    }

    /**
     * Creates a new modal for the command.
     * @param {string} modalId The ID for the modal.
     * @returns {ModularModal} The created modal instance.
     */
    newModal(modalId: string): ModularModal {
        const modal = new ModularModal(modalId, this);
        this.modals.set(modalId, modal);
        return modal;
    }

    /**
     * Creates a new button for the command.
     * @param {string} customId The custom ID for the button.
     * @param {ButtonStyle} style The style of the button.
     * @return {ModularButton} The created button instance.
     */
    newButton(customId: string, style: ButtonStyle): ModularButton {
        const button = new ModularButton(customId, style);
        this.buttons.set(customId, button);
        this.buttonsArray.push(button);
        return button;
    }

    /**
     * Set the minimun permissions required to execute the command.
     * @param {PermissionCheckFunction} permissionCheckFunction The function to check permissions.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setPermissionCheck(permissionCheckFunction: PermissionCheckFunction): this {
        this.permissionCheck = permissionCheckFunction;
        return this;
    }

    /**
     * Sets the cooldown for the command.
     * @param {number} cooldown The cooldown in seconds.
     * @returns {ModularCommand} The command instance for chaining.
     */
    setCooldown(cooldown: number): this {
        this.cooldown = cooldown;
        return this;
    }

    /**
     * Gets the component ID for the command.
     * @returns {string | undefined} The component ID.
     */
    getComponentId(): string | undefined {
        return this.componentId;
    }

    /**
     * Adds an option to the command.
     * @param {CommandOption} option The option for the command option.
     * @returns {ModularCommand} The command instance for chaining.
     */
    addOption(option: CommandOption): this {
        if (!ALLOWED_OPTION_TYPE.includes(option.type)) {
            throw new Error(`Invalid option type: ${option.type}. Allowed types are: ${ALLOWED_OPTION_TYPE.join(', ')}`);
        }

        this.options.push(option);

        return this;
    }

    /**
     * Adds a custom ID handler for the command.
     * @param {string} customId The custom ID to match.
     * @param {ExecuteFunction<CommandInteraction<CacheType>>} handlerFunction The function to execute when the custom ID matches.
     * @returns {ModularCommand} The command instance for chaining.
     */
    addCustomIDHandler(customId: string, handlerFunction: ExecuteFunction<ChatInputCommandInteraction>): this {
        this.customIdHandlers[customId] = handlerFunction;
        return this;
    }
}

/**
 * Registers an array of modular commands.
 * @param {ModularCommand[]} commands An array of ModularCommand instances.
 * @returns {RegisteredCommand[]} An array of command data objects ready for Discord.js client.
 */
const RegisterCommand = (commands: ModularCommand[]): RegisteredCommand[] => {
    return commands.map(command => {
        const commandBuilder = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)
            .setDescriptionLocalizations(command.descriptionLocalizations || null);

        const options: Record<string, ApplicationCommandOptionType> = {};

        command.options.forEach(opt => {
            const description =
                typeof opt.description === 'string' ?
                opt.description :
                (opt.description[Locale.EnglishUS] || `The description for ${opt.name} in English.`);
    
            const descriptionsLocalizations = typeof opt.description === 'object' ? opt.description : {};

            if (!description) {
                throw new Error(`Option '${opt.name}' is missing a description.`);
            }

            options[opt.name] = opt.type;

            const optionBuilder = (option: any) => {
                option.setName(opt.name)
                    .setDescription(description)
                    .setRequired(opt.required || false)
                    .setDescriptionLocalizations(descriptionsLocalizations);

                if (opt.choices && opt.choices.length > 0) {
                    option.addChoices(...opt.choices);
                }

                return option;
            };

            switch (opt.type) {
                case ApplicationCommandOptionType.String: commandBuilder.addStringOption(optionBuilder); break;
                case ApplicationCommandOptionType.Boolean: commandBuilder.addBooleanOption(optionBuilder); break;
                case ApplicationCommandOptionType.Integer: commandBuilder.addIntegerOption(optionBuilder); break;
                case ApplicationCommandOptionType.Number: commandBuilder.addNumberOption(optionBuilder); break;
                case ApplicationCommandOptionType.User: commandBuilder.addUserOption(optionBuilder); break;
                case ApplicationCommandOptionType.Channel: commandBuilder.addChannelOption(optionBuilder); break;
                default:
                    throw new Error(`Unsupported option type: ${opt.type}`);
            }
        });

        const executeBuilder = async (interaction: ChatInputCommandInteraction): Promise<void> => {
            if (command.permissionCheck && !command.permissionCheck(interaction)) {
                await interaction.reply({
                    content: LOCALE_FORBIDDEN[interaction.locale] || LOCALE_FORBIDDEN[Locale.EnglishUS],
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }

            if (command.isNSFW && (!interaction.channel || !('nsfw' in interaction.channel) || !interaction.channel.nsfw)) {
                await interaction.reply({
                    content: LOCALE_NSFW[interaction.locale] || LOCALE_NSFW[Locale.EnglishUS],
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }

            const args: Record<string, any> = {};

            for (const option of Object.keys(options)) {
                switch (options[option]) {
                    case ApplicationCommandOptionType.String: args[option] = interaction.options.getString(option, false); break;
                    case ApplicationCommandOptionType.Boolean: args[option] = interaction.options.getBoolean(option, false); break;
                    case ApplicationCommandOptionType.Integer: args[option] = interaction.options.getInteger(option, false); break;
                    case ApplicationCommandOptionType.Number: args[option] = interaction.options.getNumber(option, false); break;
                    case ApplicationCommandOptionType.User: args[option] = interaction.options.getUser(option, false); break;
                    case ApplicationCommandOptionType.Channel: args[option] = interaction.options.getChannel(option, false); break;
                    default:
                        throw new Error(`Unsupported option type: ${options[option]}`);
                }
            }

            const localeTarget = (command.localizationPhrases && command.localizationPhrases[interaction.locale])
                ? interaction.locale
                : Locale.EnglishUS;
            const localeTable = command.localizationPhrases;

            const customId = (interaction as any).customId;
            if (customId && command.customIdHandlers[customId]) {
                await command.customIdHandlers[customId]({
                    interaction,
                    args,
                    command,
                    locale: localeTable ? localeTable[localeTarget] : {},
                });
            } else {
                await command.execute({
                    interaction,
                    args,
                    command,
                    locale: localeTable ? localeTable[localeTarget] : {},
                });
            }
        };

        const componentExecuteBuilder = async (interaction: MessageComponentInteraction): Promise<void> => {
            if (!command.componentExecute) return;
            if (!interaction.customId.startsWith(command.getComponentId()!)) return;

            const localeTarget = (command.localizationPhrases && command.localizationPhrases[interaction.locale])
                ? interaction.locale
                : Locale.EnglishUS;
            const localeTable = command.localizationPhrases;

            await command.componentExecute({
                interaction,
                command,
                locale: localeTable ? localeTable[localeTarget] : {},
            });
        };

        const modalExecuteBuilder = async (interaction: ModalSubmitInteraction): Promise<void> => {
            const modalId = interaction.customId;
            const modalObject = command.modals.get(modalId);
            if (!modalObject) return;

            const args: Record<string, string> = {};
            for (const [id] of modalObject.modalInputs.entries()) {
                args[id] = interaction.fields.getTextInputValue(id);
            }

            const localeTarget = (command.localizationPhrases && command.localizationPhrases[interaction.locale])
                ? interaction.locale
                : Locale.EnglishUS;
            const localeTable = command.localizationPhrases;

            await modalObject.execute({
                interaction,
                args,
                command,
                locale: localeTable ? localeTable[localeTarget] : {},
            });
        };

        const buttonExecuteBuilder = async (interaction: MessageComponentInteraction): Promise<void> => {
            const buttonId = interaction.customId;
            const buttonObject = command.buttons.get(buttonId);
            if (!buttonObject) return;

            const localeTarget = (command.localizationPhrases && command.localizationPhrases[interaction.locale])
                ? interaction.locale
                : Locale.EnglishUS;
            const localeTable = command.localizationPhrases;

            await buttonObject.execute({
                interaction,
                command,
                locale: localeTable ? localeTable[localeTarget] : {},
                message: interaction.message,
            });
        };

        return {
            data: commandBuilder,
            execute: executeBuilder,
            componentExecute: command.componentExecute ? componentExecuteBuilder : undefined,
            modalExecute: command.modals.size > 0 ? modalExecuteBuilder : undefined,
            buttonExecute: command.buttons.size > 0 ? buttonExecuteBuilder : undefined,
            cooldown: command.cooldown,
        };
    });
};

export default ModularCommand;
export {
    RegisterCommand,
    ModularCommand,
    ModularButton,
    ModularModal,
    LOCALE_FORBIDDEN,
    LOCALE_DELAY,
    LOCALE_NSFW,
    LOCALE_ERROR,
};

import { LOCALE_DELAY, LOCALE_ERROR, LOCALE_FORBIDDEN, LOCALE_NSFW } from "./locales";
import { ModularCommand, ModularButton, RegisterCommand, CommandData } from "./modularcommand";
import ModularModal from "./modularmodal";
import LoadCommand from "./loadcommands";
import ModularCommandHandler from "./interaction";

export default ModularCommand;
export {
    ModularCommand,
    ModularButton,
    ModularModal,
    CommandData,
    RegisterCommand,
    LoadCommand,
    ModularCommandHandler,
    LOCALE_DELAY,
    LOCALE_ERROR,
    LOCALE_FORBIDDEN,
    LOCALE_NSFW
};
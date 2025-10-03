import { LOCALE_DELAY, LOCALE_ERROR, LOCALE_FORBIDDEN, LOCALE_NSFW } from "./locales";

import ModularCommandHandler from "./interaction";
import { CommandData, SubCommand } from "./types";

import ModularModal from "./modularmodal";
import ModularCommand from "./modularcommand";
import ModularButton from "./modularbutton";

import RegisterCommand from "./registercommand";
import LoadCommand from "./loadcommands";

export default ModularCommand;
export {
    ModularCommand,
    ModularButton,
    ModularModal,
    CommandData,
    SubCommand,
    RegisterCommand,
    LoadCommand,
    ModularCommandHandler,
    LOCALE_DELAY,
    LOCALE_ERROR,
    LOCALE_FORBIDDEN,
    LOCALE_NSFW
};
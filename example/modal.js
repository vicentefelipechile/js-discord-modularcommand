/**
 * @file        modal.js
 * @author      vicentefelipechile
 * @version     2.4.0
 * @license     MIT
 * @description Example of a modular command that uses modals (pop-up forms).
 * This script demonstrates how to create a command that triggers a modal,
 * define input fields within it, and handle the data upon submission,
 * all with localization support.
 */

// -----------------------------------------------------------------------------
// IMPORTS SECTION
// -----------------------------------------------------------------------------

const { Locale, TextInputStyle } = require("discord.js");
const { ModularCommand, RegisterCommand } = require("js-discord-modularcommand");

// -----------------------------------------------------------------------------
// COMMAND INITIALIZATION
// -----------------------------------------------------------------------------

const modalCommand = new ModularCommand('modalcommand');

// -----------------------------------------------------------------------------
// MAIN COMMAND CONFIGURATION
// -----------------------------------------------------------------------------

modalCommand.setDescription('Sends a modal!');

// -----------------------------------------------------------------------------
// LOCALIZATION CONFIGURATION
// -----------------------------------------------------------------------------

modalCommand.setLocalizationDescription({
    [Locale.EnglishUS]: 'Test modal',
    [Locale.SpanishLATAM]: 'Modal de prueba',
});

// Define a dictionary of phrases for all text.
// For modals, the library requires a specific key structure to automatically
// populate the fields when .build(locale) is called:
// • Title: 'MODAL_NAME.title'
// • Input Label: 'MODAL_NAME.INPUT_NAME.label'
// • Input Placeholder: 'MODAL_NAME.INPUT_NAME.placeholder'
modalCommand.setLocalizationPhrases({
    [Locale.EnglishUS]: {
        'description': 'Sends a modal!',
        'modaltest.title': 'Test Modal',
        'modaltest.input1.label': 'Input 1 (required)',
        'modaltest.input1.placeholder': 'Enter something for input 1',
        'modaltest.input2.label': 'Input 2 (optional)',
        'modaltest.input2.placeholder': 'Enter something for input 2',
        'reply.message': 'You submitted:\nInput1: {input1}\nInput2: {input2}',
    },
    [Locale.SpanishLATAM]: {
        'description': '¡Envía un modal!',
        'modaltest.title': 'Modal de Prueba',
        'modaltest.input1.label': 'Entrada 1 (requerida)',
        'modaltest.input1.placeholder': 'Ingresa algo para la entrada 1',
        'modaltest.input2.label': 'Entrada 2 (opcional)',
        'modaltest.input2.placeholder': 'Ingresa algo para la entrada 2',
        'reply.message': 'Has enviado:\nEntrada1: {input1}\nEntrada2: {input2}',
    }
});

// -----------------------------------------------------------------------------
// MODAL DEFINITION & COMPONENTS
// -----------------------------------------------------------------------------

const modalTest = modalCommand.addModal('modaltest'); // 'modaltest' is the MODAL_NAME

const Input1 = modalTest.newTextInput('input1') // 'input1' is the INPUT_NAME
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .data
    .custom_id;

const Input2 = modalTest.newTextInput('input2') // 'input2' is the INPUT_NAME
    .setStyle(TextInputStyle.Short)
    .setRequired(false)
    .data
    .custom_id;

// -----------------------------------------------------------------------------
// MODAL EXECUTION LOGIC (Handles Submission)
// -----------------------------------------------------------------------------

// setExecute for the modal handler. This function is triggered ONLY when a user
// submits the modal'.
// The 'args' object conveniently contains the submitted values, keyed by their
// respective custom IDs.
modalTest.setExecute(async ({ interaction, args, locale }) => {
    // Retrieve the submitted data from the args object.
    const input1 = args[Input1];
    const input2 = args[Input2] || 'No input2 provided'; // Provide a default for the optional field.

    // Reply to the interaction with a confirmation message, showing the submitted data.
    await interaction.reply({
        content: locale['reply.message'].replace('{input1}', input1).replace('{input2}', input2)
    });
});

// -----------------------------------------------------------------------------
// MAIN COMMAND EXECUTION LOGIC (Shows the Modal)
// -----------------------------------------------------------------------------

// setExecute for the main slash command. This function is triggered when a user
// types and runs the '/modalcommand'. Its primary role is to construct and
// display the modal to the user.
modalCommand.setExecute(async ({ interaction, locale }) => {
    // The .build(locale) method assembles the modal with all its defined components
    // (inputs, title, etc.), automatically using the provided locale phrases.
    const modal = modalTest.build(locale);

    // This method presents the fully constructed modal as a pop-up to the user.
    await interaction.showModal(modal);
});

// -----------------------------------------------------------------------------
// COMMAND EXPORT
// -----------------------------------------------------------------------------

module.exports = RegisterCommand(modalCommand);
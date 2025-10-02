<coding-guidelines>
    <!-- Global Rules Applied to All Files -->
    <global-rules applyTo="All Files">
        <metadata>
            <rule>Each script must begin with JSDoc meta-information using /** */ comments</rule>
            <rule>When working with Discord.js components, always import the necessary builders and types</rule>
            <required-fields>
                <field name="@license">Always use "MIT" to maintain consistency</field>
                <field name="@file">Relative script path from root (e.g., "src/modularcommand.ts", "example/command.js")</field>
                <field name="@author">Author name (use "vicentefelipechile" as default)</field>
                <field name="@description">Brief description of the script's functionality</field>
                <field name="@version">Version number when applicable (especially in examples)</field>
            </required-fields>
        </metadata>
    </global-rules>
    <!-- TypeScript Specific Rules -->
    <typescript-rules applyTo="src/**/*.ts">
        <structure>
            <imports>
                <rule>Group imports in sections with clear comment headers using "=" characters</rule>
                <rule>Import Discord.js types and builders from 'discord.js'</rule>
                <rule>Import internal types from './types.js' (always use .js extension for imports)</rule>
                <rule>Import other modular components with relative paths</rule>
                <rule>Use section comment: "// ================================================================================================="</rule>
                <rule>Use section comment: "// Imports"</rule>
                <rule>Use section comment: "// ================================================================================================="</rule>
            </imports>
            <sections>
                <rule>Use comment separators with "=" characters (65 characters wide) for major sections</rule>
                <rule>Each class or major functionality should have its own section</rule>
                <rule>Example: "// ModularCommand Class", "// Interfaces", "// Function Parameter Types"</rule>
            </sections>
        </structure>
        <naming-conventions>
            <classes>PascalCase (ModularCommand, ModularButton, ModularModal)</classes>
            <functions>camelCase (setDescription, setExecute, getButton)</functions>
            <variables>camelCase (customId, buttonObject, commandData)</variables>
            <constants>SCREAMING_SNAKE_CASE (LOCALE_DELAY, LOCALE_FORBIDDEN, ALLOWED_OPTION_TYPE)</constants>
            <properties>camelCase for class properties</properties>
            <types-interfaces>PascalCase (CommandData, LocaleKey, ButtonExecuteFunction)</types-interfaces>
        </naming-conventions>
        <class-implementation>
            <step number="1">Define public properties with proper TypeScript typing</step>
            <step number="2">Initialize all properties in constructor with sensible defaults</step>
            <step number="3">Implement chainable methods that return 'this' for fluent API</step>
            <step number="4">Use proper TypeScript generics and type constraints where applicable</step>
            <step number="5">Document each public method with JSDoc comments</step>
            <step number="6">Maintain consistent property organization (Core Properties, Execution Handlers, Configuration, Component Collections)</step>
        </class-implementation>
        <type-definitions>
            <interfaces>
                <rule>Use clear, descriptive interface names that explain their purpose</rule>
                <rule>Include JSDoc comments for each property explaining its role</rule>
                <rule>Use optional properties (?) when appropriate</rule>
                <rule>Group related interfaces in logical sections</rule>
            </interfaces>
            <types>
                <rule>Use union types for constrained values (e.g., typeof ALLOWED_OPTION_TYPE[number])</rule>
                <rule>Create specific function signature types for better type safety</rule>
                <rule>Use generic types for reusable patterns</rule>
                <rule>Export types that will be used by library consumers</rule>
            </types>
        </type-definitions>
        <localization-handling>
            <rule>Always support LocalizationMap from discord.js for command descriptions</rule>
            <rule>Use LocaleKey type for internal localization phrases</rule>
            <rule>Default to Locale.EnglishUS when setting primary descriptions</rule>
            <rule>Provide comprehensive localization support for all user-facing text</rule>
            <rule>Use consistent key naming: 'component.element.property' (e.g., 'modaltest.input1.label')</rule>
        </localization-handling>
        <component-management>
            <rule>Maintain both Map and Array collections for components (e.g., buttons, modals, selectMenus)</rule>
            <rule>Use command name prefix for component custom IDs: `${command.name}_${customId}`</rule>
            <rule>Implement fluent API methods for adding components that return the component instance</rule>
            <rule>Store component execute functions in customIdHandlers record</rule>
        </component-management>
    </typescript-rules>
    <!-- JavaScript Example Rules -->
    <javascript-rules applyTo="example/**/*.js">
        <structure>
            <imports>
                <rule>Group imports logically with comment headers</rule>
                <rule>Use destructuring for selective imports from libraries</rule>
                <rule>Import Discord.js enums and builders as needed</rule>
                <rule>Use section comment: "// -----------------------------------------------------------------------------"</rule>
                <rule>Use section comment: "// IMPORTS SECTION"</rule>
                <rule>Use section comment: "// -----------------------------------------------------------------------------"</rule>
            </imports>
            <sections>
                <rule>Use descriptive section headers with consistent formatting</rule>
                <rule>Organize code in logical sections: IMPORTS, INITIALIZATION, CONFIGURATION, LOCALIZATION, HANDLERS, EXPORT</rule>
                <rule>Each section should have a clear, descriptive comment header</rule>
            </sections>
        </structure>
        <example-patterns>
            <command-creation>
                <rule>Always create command instance first: `new ModularCommand('commandname')`</rule>
                <rule>Set basic description before localization</rule>
                <rule>Define localization phrases with comprehensive language support</rule>
                <rule>Set localized descriptions for the command itself</rule>
                <rule>Define execution logic last, before export</rule>
            </command-creation>
            <localization>
                <rule>Use Locale enum from discord.js for consistency</rule>
                <rule>Always include at least EnglishUS and SpanishLATAM localizations</rule>
                <rule>Use descriptive keys that reflect the component hierarchy</rule>
                <rule>Include both setLocalizationPhrases and setLocalizationDescription</rule>
            </localization>
            <component-handling>
                <rule>Register component handlers using addButton, addModal, etc. methods</rule>
                <rule>Use destructuring in handler parameters: { interaction, locale, message }</rule>
                <rule>Always use await for asynchronous operations</rule>
                <rule>Access localized strings through the locale parameter</rule>
            </component-handling>
        </example-patterns>
        <documentation>
            <rule>Include comprehensive JSDoc headers explaining the purpose and functionality</rule>
            <rule>Add inline comments explaining complex logic or Discord.js specific concepts</rule>
            <rule>Document parameter usage and return values</rule>
            <rule>Explain the purpose of each configuration step</rule>
        </documentation>
        <export-patterns>
            <rule>Always wrap commands with RegisterCommand function before export</rule>
            <rule>Use module.exports for CommonJS compatibility</rule>
            <rule>Single command per file for modularity</rule>
        </export-patterns>
    </javascript-rules>
    <!-- Project Structure Rules -->
    <project-structure>
        <src-directory>
            <rule>Core library code only in src/ directory</rule>
            <rule>Each major component gets its own file (modularcommand.ts, modularbutton.ts, etc.)</rule>
            <rule>Types and interfaces in dedicated types.ts file</rule>
            <rule>Centralized localization in locales.ts</rule>
            <rule>Main entry point should export all public APIs</rule>
        </src-directory>
        <example-directory>
            <rule>Complete, working examples showing library usage</rule>
            <rule>Each example demonstrates specific features</rule>
            <rule>Examples should be well-documented and educational</rule>
            <rule>Use realistic command names and functionality</rule>
        </example-directory>
        <configuration-files>
            <rule>Maintain TypeScript strict mode configuration</rule>
            <rule>Use CommonJS module system for compatibility</rule>
            <rule>Include proper ESLint configuration for code quality</rule>
            <rule>Generate type declarations for library consumers</rule>
        </configuration-files>
    </project-structure>
    <!-- API Design Principles -->
    <api-design>
        <fluent-interface>
            <rule>All configuration methods should return 'this' for method chaining</rule>
            <rule>Method names should be descriptive and intuitive</rule>
            <rule>Provide both single-operation and batch-operation methods where applicable</rule>
        </fluent-interface>
        <error-handling>
            <rule>Use async/await pattern consistently</rule>
            <rule>Provide sensible defaults for optional parameters</rule>
            <rule>Validate input parameters and provide clear error messages</rule>
        </error-handling>
        <extensibility>
            <rule>Design components to be easily extendable</rule>
            <rule>Use composition over inheritance where possible</rule>
            <rule>Provide hooks and handlers for custom behavior</rule>
        </extensibility>
    </api-design>
    <!-- Build and Development -->
    <build-system>
        <compilation>
            <rule>Target ES2020 for modern JavaScript features with broad compatibility</rule>
            <rule>Generate both JavaScript and TypeScript declaration files</rule>
            <rule>Exclude example files from compilation</rule>
            <rule>Output to dist/ directory with clean structure</rule>
        </compilation>
        <package-management>
            <rule>Use exact Discord.js version for compatibility</rule>
            <rule>Include development tools for code quality (ESLint, TypeScript)</rule>
            <rule>Provide build and lint scripts</rule>
            <rule>Include only necessary files in published package</rule>
        </package-management>
    </build-system>
</coding-guidelines>

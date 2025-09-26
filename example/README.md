# Command Examples for `js-discord-modularcommand`

This directory contains practical examples demonstrating the features of the `js-discord-modularcommand` library.

---

### 📂 Example Files

* **[`bot.js`](./bot.js)**: Main entry point; loads commands and handles interactions.
* **[`loadcommands.js`](./loadcommands.js)**: Script to register commands with the Discord API.
* **[`command.js`](./command.js)**: A basic "ping-pong" style command.
* **[`kick.js`](./kick.js)**: Demonstrates options, arguments, and permission checks.
* **[`button.js`](./button.js)**: Shows how to send and handle interactive buttons.
* **[`modal.js`](./modal.js)**: Shows how to use pop-up forms (modals) to get user input.
* **[`selectmenu.js`](./selectmenu.js)**: Shows how to use interactive dropdown menus.

---

### 🚀 How to Run

1.  **Install dependencies:**
    ```bash
    npm install discord.js js-discord-modularcommand dotenv
    ```
2.  **Create a `.env` file:**
    ```env
    DISCORD_TOKEN=YOUR_TOKEN
    DISCORD_CLIENT_ID=YOUR_CLIENT_ID
    ```
3.  **Register commands (only once):**
    ```bash
    node loadcommands.js
    ```
4.  **Start the bot:**
    ```bash
    node bot.js
    ```
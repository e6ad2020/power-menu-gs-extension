<p align="center">
  <img src="./assets/icon.svg" width="160" height="160" alt="Power Menu Logo">
</p>

<h1 align="center">Power Menu</h1>

<p align="center">
  A modern, interactive power dialogue for GNOME Shell.
  <br>
  Triggered with <b>Alt + F4</b> on the desktop to manage Shutdown, Restart, Suspend, and Log Out.
</p>

<p align="center">
  Built with ❤️ for the GNOME community.
</p>

---

### Features

- **Custom Keybinding:** Overrides the default Alt+F4 to show the dialogue when no windows are open.
- **Modern UI:** Clean, polished design that blends perfectly with GNOME Shell.
- **Customizable:** Reorder or hide actions through the settings menu.
- **Interactive:** Supports both keyboard navigation (arrows) and mouse interaction (hover & click).
- **Localized:** Full support for Arabic, German, Brazilian Portuguese and English languages — see [Supported Languages](#supported-languages).
- **GNOME Ready:** Compatible with GNOME versions 45 up to 50.

---

### Screenshot

<p align="center">
  <img src="./assets/preview.png" alt="Power Menu Preview" width="500">
</p>

---

### Installation

### Automatic Installation

1. Install the extension from the GNOME Extensions website:
    
    [Power Menu Extension](https://extensions.gnome.org/extension/9710/power-menu/)
    
    [![Install on GNOME Shell](https://pbs.twimg.com/media/D6s8OS2U8AAaLNQ.png)](https://extensions.gnome.org/extension/9710/power-menu/)


#### Manual Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/e6ad2020/power-menu-gs-extension.git
    ```

2. Navigate to the directory:
    ```sh
    cd power-menu-gs-extension
    ```

3. Install the extension:
    ```sh
    ./install.sh
    ```

4. Restart GNOME Shell:
    - **Wayland:** Log out and log back in.
    - **X11:** Press `Alt+F2`, type `r`, and press `Enter`.

5. Enable the extension using the **Extensions** app.

---

### 💡 Pro Tip: Faster Workflow

Since this extension triggers when no windows are focused (on the desktop), you can make it even faster by setting a shortcut to "Show Desktop":

1. Set **Super + D** to hide all windows:
   ```sh
   gsettings set org.gnome.desktop.wm.keybindings show-desktop "['<Super>d']"
   ```
2. Now you can simply press **Super + D** followed by **Alt + F4** to access the power menu from anywhere!

---

### Usage

- Press **Alt+F4** when no windows are active to trigger the dialogue.
- Use **Arrow Keys** or **Mouse** to select an action.
- Press **Enter** or **Click** to confirm.

---

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

### 🌐 Supported Languages

| Flag | Language | Locale Code |
|------|----------|-------------|
| 🇺🇸 | English | `en` |
| 🇸🇦 | Arabic | `ar` |
| 🇩🇪 | German | `de` |
| 🇧🇷 | Brazilian Portuguese | `pt_BR` |

#### ➕ Adding a New Language

Want to see Power Menu in your language? Contributions are welcome!

1. Copy [`translation_template.po`](translation_template.po) and name it after your locale code (e.g. `fr.po` for French, `es.po` for Spanish).
2. Fill in the `msgstr ""` fields with your translations.
3. Update the `Language` and `Language-Team` fields in the file header.
4. Place the file under `power-menu@e6ad2020/po/`.
5. Open a pull request with the title: **`feat: add <Language> translation`** — and you'll be credited in the Contributors list! 🎉

---

### 👥 Contributors

Thanks to everyone who helped make this extension better!

<table>
  <tr>
    <td align="center" width="160">
      <a href="https://github.com/e6ad2020">
        <img src="https://avatars.githubusercontent.com/u/119390190?v=4&s=100" width="80" height="80" alt="Eyad" style="border-radius:50%"><br>
        <b>Eyad</b>
      </a><br>
      <sub>Maintainer</sub><br>
      <sub>UI redesign · localization · prefs · icons · animations</sub>
    </td>
    <td align="center" width="160">
      <a href="https://github.com/PublisherName">
        <img src="https://avatars.githubusercontent.com/u/62213479?v=4&s=100" width="80" height="80" alt="PublisherName" style="border-radius:50%"><br>
        <b>PublisherName</b>
      </a><br>
      <sub>Original Author</sub><br>
      <sub>upstream fork · GNOME 48/49 support · dark mode fixes</sub>
    </td>
    <td align="center" width="160">
      <a href="https://github.com/Stubennerd">
        <img src="https://github.com/Stubennerd.png?size=100" width="80" height="80" alt="Stubennerd" style="border-radius:50%"><br>
        <b>Stubennerd</b>
      </a><br>
      <sub>Translator</sub><br>
      <sub>🇩🇪 German</sub>
    </td>
    <td align="center" width="160">
      <a href="https://github.com/izak-ag">
        <img src="https://avatars.githubusercontent.com/u/91832540?v=4&s=100" width="80" height="80" alt="Izak A." style="border-radius:50%"><br>
        <b>Izak A.</b>
      </a><br>
      <sub>Translator</sub><br>
      <sub>🇧🇷 Brazilian Portuguese</sub>
    </td>
  </tr>
</table>

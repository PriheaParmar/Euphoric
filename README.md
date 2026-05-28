# Euphoric

Euphoric is a calming Chrome new tab extension with beautiful daily scenery, a stylish clock, Bhagavad Gita daily lessons, automatic website shortcuts, Spotify controls, Focus/Pomodoro mode, and optional desktop butterfly reminders.

## Features

- Random daily scenic new tab background, unique per browser
- Large stylish editorial clock and date
- Random daily Bhagavad Gita lesson text, unique per browser
- Automatic shortcuts from most visited/recent websites
- Spotify now-playing panel and playback controls
- Focus mode / Pomodoro study timer
- Task reminders
- Optional Windows desktop companion for butterfly reminder animation

## Install for development

1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the `chrome-extension` folder.

## Optional butterfly desktop companion

The browser extension works without the desktop companion, but full desktop butterfly reminders need the Windows companion.

1. Open `RUN_THIS_FOR_LOGO_BUTTERFLY_COMPANION_windows`.
2. Run `RESET_AND_INSTALL_COMPANION.bat`.
3. Restart Chrome.

## Spotify setup

Spotify support uses Spotify OAuth. You need your own Spotify Developer app Client ID.

1. Open the Euphoric new tab.
2. Click Spotify.
3. Paste your Spotify Client ID.
4. Copy the redirect URL shown in Euphoric.
5. Add that redirect URL in your Spotify Developer Dashboard app settings.
6. Connect again.

Playback controls require an active Spotify playback device, and some controls may require Spotify Premium.

## Permissions

Euphoric uses Chrome permissions for:

- `storage` — save tasks/settings/shortcuts
- `alarms` — scheduled reminders
- `nativeMessaging` — optional desktop butterfly companion
- `identity` — Spotify OAuth login
- `topSites` and `history` — automatic shortcut suggestions from your recent/visited websites

## Project structure

```text
chrome-extension/                         Chrome extension source
RUN_THIS_FOR_LOGO_BUTTERFLY_COMPANION_windows/  Optional Windows reminder companion
```

## Notes

This is an unpacked extension project for development and personal use. Before publishing to the Chrome Web Store, review permissions, privacy text, assets, and packaging requirements.


## v1.1 Random daily content

Scenery and Bhagavad Gita lessons are now selected randomly per browser/user and change daily. The same user sees stable content for that day, but different users can see different daily images and lessons.

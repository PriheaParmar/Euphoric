# Euphoric v4.2 Logo Butterfly Companion

This is the new desktop companion for the Euphoric Chrome extension.

It uses your selected Euphoric logo butterfly only:

- logo butterfly flies in at top-right
- waits as a small clickable butterfly
- click opens compact task note
- no Chrome notification
- no big default popup

## Requirements

Node.js must be installed because this companion uses Electron for the transparent animated overlay.

## Direct test

Run:

`test_companion_direct.bat`

Expected: the Euphoric logo butterfly flies in at the top-right. Click it to open the note.

## Install for Chrome

Run:

`install_companion_windows.bat`

Then close all Chrome windows and reopen Chrome.


Custom landed butterfly size:
Edit alarm.css and change these CSS variables in :root:
--landed-butterfly-width
--landed-butterfly-height
--landed-butterfly-scale
--landed-butterfly-hover-scale


Trail fix: the glitter trail is now a separate stage element, so it follows the butterfly without inheriting the butterfly rotation.


Trail size controls in alarm.css:
--trail-width
--trail-height
--trail-opacity

Reminder music:
A built-in soft chime plays when the note opens.


Current music: option 11 - calm morning chime.


V6.8: stable butterfly size restored; trail uses a soft mask; music starts during flight.


BUTTERFLY SIZE CONTROLS
Open alarm.css and edit these values at the top:
--landed-butterfly-width: 86px;
--landed-butterfly-height: 70px;
--landed-butterfly-scale: .72;
--landed-butterfly-hover-scale: .73;

Example smaller:
--landed-butterfly-width: 72px;
--landed-butterfly-height: 58px;
--landed-butterfly-scale: .62;
--landed-butterfly-hover-scale: .63;

Example bigger:
--landed-butterfly-width: 100px;
--landed-butterfly-height: 82px;
--landed-butterfly-scale: .84;
--landed-butterfly-hover-scale: .85;

CYBERVS DOMINATVS X LISTENING STATION ENTERPRISE v3.4.1

WINDOWS

To build the normal installable Windows application:

1. Extract this ZIP completely into a normal folder.
2. Double-click INSTALL_WINDOWS.bat.
3. The helper installs pinned npm dependencies if needed.
4. It downloads the official Tor Expert Bundle 15.0.19 directly from the Tor Project and verifies its published SHA-256.
5. It validates and builds the application.
6. Explorer opens with the generated Setup.exe selected.
7. Double-click that Setup.exe to install the application.

The finished application contains its own Tor runtime. Users do not need Tor Browser installed to use CONNECT OVER TOR.

To run from source for development, open PowerShell in this folder and run:

npm install
npm run dev

The project root intentionally contains one batch file only: INSTALL_WINDOWS.bat.

The installer is unsigned, so Windows may show an Unknown Publisher / SmartScreen reputation warning.

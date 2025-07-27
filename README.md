# Shards Backend
The electron's main process (backend) for "Shards", an electron render process (frontend).

### Development Setup

1. Download, install and run the corresponding frontend "Shards".
2. Install with `npm install` all necessary packages for this project.
3. Run `npm start` to start the backend.

### Production setup (build .exe)

1. Download and install the corresponding frontend "Shards".
2. Open the `config.build.json` file and check whether the provided paths match the location where you saved the Shards frontend application.
3. Run `npm run electron:prod` to
   - build the Angular frontend application
   - copy the frontend application's dist folder
   - start the Electron building process itself.
4. The application should be successfully build and be available under `dist-electron`

## Q&A

1. What is this?
    - This is a part of an Electron application, mainly the so-called "main process". It functions as a backend for a corresponding Electron render process (frontend).
2. What could go wrong when building this?
    - For prod? A lot of things. Therefore, the build.mjs script is here to guide you. It tries to check every single step and gives you feedback if something is not working as expected. Just run `npm run electron:prod`.
3. Is there a database involved?
    - No. The idea of this project is to load file names and give users the possibility to "mass-rename" them. There is no data to be stored.
4. How about the testing?
    - Due to its size, there is currently no testing.

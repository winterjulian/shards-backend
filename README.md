# Shards Backend
The electron's main process (backend) for "Shards", an electron render process (frontend).

## Development Setup

1. Download, install and run the corresponding frontend "Shards".
2. Install with `npm install` all necessary packages for this backend.
3. Run `npm start` to start the backend.

## Production setup (build .exe)

1. Download and install the corresponding frontend "Shards".
2. Make sure to have the Shards project folder next to this project's folder,
or change the building command (`cd ../shards`) to your liking.
3. Run `npm run electron:build`.
   - This is running 

## Q&A

1. What is this?
    - This is the main process for "shards", an electron render process (frontend).
4. How about the testing?
    - Due to its size, there is currently no testing.

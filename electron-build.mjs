import { exec } from 'child_process';
import { rmSync, cpSync, existsSync, readFileSync } from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Load build config
const configPath = path.resolve('./config.build.json');
let config = {};

try {
    const rawData = readFileSync(configPath, 'utf-8');
    config = JSON.parse(rawData);
    console.log('🛠️Loaded build config.');
} catch (e) {
    console.error(`❌ Failed to read config (${configPath}):`, e.message);
    process.exit(1);
}

// Resolve absolute paths
const paths = {
    frontendProject: path.resolve(config.frontendProject),
    frontendDist: path.resolve(config.frontendProject, config.frontendOutput),
    backendDist: path.resolve(config.backendOutput)
};

async function run() {
    try {
        console.log('🚀 Starting Angular build...');

        await execAsync(config.angularBuildCommand, { cwd: paths.frontendProject });

        console.log('✅  Angular build finished.');

        if (!existsSync(paths.frontendDist)) {
            throw new Error(`❌ Frontend build not found at ${paths.frontendDist}`);
        }

        console.log('🧹 Removing previous frontend build in backend...');
        rmSync(paths.backendDist, { recursive: true, force: true });

        console.log('📦 Copying frontend to backend...');
        cpSync(paths.frontendDist, paths.backendDist, { recursive: true });

        console.log('⚙️ Running Electron build...');
        await execAsync(config.electronBuildCommand);

        console.log('🎉 Build completed successfully!');
    } catch (err) {
        console.error('❌ Build failed:', err.message);
        process.exit(1);
    }
}

run();

import { exec } from 'child_process';
import { rmSync, cpSync, existsSync, readFileSync } from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

// --------------------------------------------------
// Load config
// --------------------------------------------------
const config = JSON.parse(
    readFileSync(path.resolve('./config.build.json'), 'utf-8')
);

// --------------------------------------------------
// Resolve paths
// --------------------------------------------------
const paths = {
    frontendDist: path.resolve(
        config.frontendProject,
        config.frontendOutput
    ),
    backendDist: path.resolve(
        config.backendProject,
        config.backendOutput
    )
};

// --------------------------------------------------
// Electron build
// --------------------------------------------------
async function run() {
    try {
        if (!existsSync(paths.frontendDist)) {
            throw new Error(
                `Frontend build missing: ${paths.frontendDist}`
            );
        }

        if (!existsSync(paths.backendDist)) {
            throw new Error(
                `Backend build missing: ${paths.backendDist}`
            );
        }

        console.log('🧹 Preparing Electron backend...');
        rmSync(paths.backendDist, { recursive: true, force: true });

        console.log('📦 Injecting frontend into backend...');
        cpSync(paths.frontendDist, paths.backendDist, { recursive: true });

        console.log('⚙️ Running Electron build...');
        await execAsync(config.electronBuildCommand);

        console.log('🎉 Electron build completed');
    } catch (err) {
        console.error('❌ Electron build failed:', err.message);
        process.exit(1);
    }
}

run();

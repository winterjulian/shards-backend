import { exec } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

// --------------------------------------------------
// Load build config
// --------------------------------------------------
const configPath = path.resolve('./config.build.json');
let config;

try {
    config = JSON.parse(readFileSync(configPath, 'utf-8'));
    console.log('🛠️  Loaded build config');
} catch (e) {
    console.error(`❌ Failed to read ${configPath}:`, e.message);
    process.exit(1);
}

// --------------------------------------------------
// Resolve paths
// --------------------------------------------------
const paths = {
    frontendRoot: path.resolve(config.frontendProject),
    frontendDist: path.resolve(
        config.frontendProject,
        config.frontendOutput
    ),
    backendRoot: path.resolve(config.backendProject),
    backendDist: path.resolve(
        config.backendProject,
        config.backendOutput
    )
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------
async function runStep(label, command, cwd) {
    console.log(`🚀 ${label}`);
    await execAsync(command, { cwd, stdio: 'inherit' });
    console.log(`✅ ${label} finished`);
}

// --------------------------------------------------
// Build pipeline
// --------------------------------------------------
async function run() {
    const backendOnly = process.argv.includes('--backend-only');

    try {
        if (!backendOnly) {
            await runStep(
                'Building Frontend',
                config.angularBuildCommand,
                paths.frontendRoot
            );

            if (!existsSync(paths.frontendDist)) {
                throw new Error(`Frontend dist not found: ${paths.frontendDist}`);
            }
        } else {
            console.log('ℹ️  --backend-only flag detected → skipping Frontend build');
        }

        if (config.backendBuildCommand) {
            await runStep(
                'Building Backend',
                config.backendBuildCommand,
                paths.backendRoot
            );
        } else {
            console.log('ℹ️  No backend build step configured – skipping');
        }

        if (!existsSync(paths.backendDist)) {
            throw new Error(`Backend dist not found: ${paths.backendDist}`);
        }

        console.log('\n🎉 Build successful');
        console.log('📦 Artifacts:');
        console.log(`   - Frontend → ${paths.frontendDist}`);
        console.log(`   - Backend  → ${paths.backendDist}`);
    } catch (err) {
        console.error('\n❌ Build failed:', err.message);
        process.exit(1);
    }
}

run();

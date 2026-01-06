import { exec } from 'child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, cpSync } from 'fs';
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
    frontendDist: path.resolve(config.frontendProject, config.frontendOutput),
    backendRoot: path.resolve(config.backendProject),
    backendDist: path.resolve(config.backendProject, config.backendOutput)
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------
async function runStep(label, command, cwd) {
    console.log(`🚀 ${label}`);
    await execAsync(command, { cwd, stdio: 'inherit' });
    console.log(`✅ ${label} finished`);
}

function copyBackendPlainJS(srcRoot, destRoot) {
    if (!existsSync(destRoot)) mkdirSync(destRoot, { recursive: true });

    const entries = readdirSync(srcRoot);

    for (const entry of entries) {
        if (entry === 'node_modules' || entry === 'dist') continue;

        const srcPath = path.join(srcRoot, entry);
        const destPath = path.join(destRoot, entry);
        const stat = statSync(srcPath);

        if (stat.isDirectory()) {
            cpSync(srcPath, destPath, { recursive: true });
        } else {
            cpSync(srcPath, destPath);
        }
    }

    console.log(`ℹ️  Backend plain JS copied to ${destRoot}`);
}

// --------------------------------------------------
// Build pipeline
// --------------------------------------------------
async function run() {
    const backendOnly = process.argv.includes('--backend-only');

    try {
        // -----------------------------
        // Build Frontend
        // -----------------------------
        if (!backendOnly) {
            await runStep('Building Frontend', config.angularBuildCommand, paths.frontendRoot);

            if (!existsSync(paths.frontendDist)) {
                throw new Error(`Frontend dist not found: ${paths.frontendDist}`);
            }
        } else {
            console.log('ℹ️  --backend-only flag detected → skipping Frontend build');
        }

        // -----------------------------
        // Build Backend
        // -----------------------------
        if (config.backendBuildCommand) {
            await runStep('Building Backend', config.backendBuildCommand, paths.backendRoot);
        } else {
            console.log('ℹ️  No backend build step configured → assuming plain JS');
            copyBackendPlainJS(paths.backendRoot, paths.backendDist);
        }

        // -----------------------------
        // Final existence checks
        // -----------------------------
        if (!existsSync(paths.backendDist)) {
            throw new Error(`Backend dist not found: ${paths.backendDist}`);
        }

        console.log('\n🎉 Build successful');
        console.log('📦 Artifacts:');
        if (!backendOnly) console.log(`   - Frontend → ${paths.frontendDist}`);
        console.log(`   - Backend  → ${paths.backendDist}`);

    } catch (err) {
        console.error('\n❌ Build failed:', err.message);
        process.exit(1);
    }
}

run();

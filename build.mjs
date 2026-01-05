import { rmSync, cpSync, existsSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// === Define paths ===
const backendDist = path.resolve('./dist');       // Output deines Backend-Builds
const packageDir = path.resolve('./release-backend');  // Zielpaket
const packageZip = path.resolve('./backend.zip');      // optional ZIP

// === Cleanup of older builds ===
rmSync(packageDir, { recursive: true, force: true });
rmSync(packageZip, { force: true });

console.log('🧹 Cleaning previous backend package...');

// === Copy backend ===
if (!existsSync(backendDist)) {
    console.error(`❌ Backend dist folder not found: ${backendDist}`);
    process.exit(1);
}

console.log('📦 Copying backend files...');
cpSync(backendDist, packageDir, { recursive: true });

// === Optionally: Create zip ===
console.log('📦 Creating backend.zip...');
execAsync(`zip -r ${packageZip} ${packageDir}`)
    .then(() => {
        console.log('✅ Backend packaged successfully!');
    })
    .catch(err => {
        console.error('❌ Failed to zip backend:', err.message);
        process.exit(1);
    });
#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('Starting auto-commit watcher...');
console.log('Press Ctrl+C to stop');

// Function to commit changes
function commitChanges() {
    try {
        console.log('Changes detected, committing...');
        execSync('git add -A', { stdio: 'inherit' });
        execSync('git commit -m "changes" --no-verify', { stdio: 'inherit' });
        execSync('git push origin main', { stdio: 'inherit' });
        console.log('Committed and pushed changes');
    } catch (error) {
        console.log('No changes to commit or push failed');
    }
}

// Watch the entire directory recursively
function watchDirectory(dir) {
    fs.watch(dir, { recursive: true }, (eventType, filename) => {
        // Ignore .git directory and node_modules
        if (filename && !filename.includes('.git') && !filename.includes('node_modules')) {
            console.log(`File changed: ${filename}`);
            commitChanges();
        }
    });
}

// Start watching
watchDirectory('.');

console.log('Watching for file changes...'); 

const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, 'main.js');
const outputDir = path.join(__dirname, 'characters', 'data');

const mainJsContent = fs.readFileSync(mainJsPath, 'utf8');

// Extract charactersData object
// Looking for "const charactersData = {" until "};"
const startMarker = "const charactersData = {";
const endMarker = "};";

const startIndex = mainJsContent.indexOf(startMarker);
if (startIndex === -1) {
    console.error("Could not find charactersData start");
    process.exit(1);
}

// Find the matching closing brace is safer than simple string search if there are nested braces,
// but looking at the file, "};" followed by newline seems safe enough for this one-off task.
// Actually, let's just grab the block.
const contentAfterStart = mainJsContent.substring(startIndex + startMarker.length - 1); // include {

// We need to find the matching closing brace.
let braceCount = 0;
let endIndex = -1;
for (let i = 0; i < contentAfterStart.length; i++) {
    if (contentAfterStart[i] === '{') braceCount++;
    if (contentAfterStart[i] === '}') braceCount--;
    
    if (braceCount === 0) {
        endIndex = i;
        break;
    }
}

if (endIndex === -1) {
    console.error("Could not find charactersData end");
    process.exit(1);
}

const charactersDataString = contentAfterStart.substring(0, endIndex + 1);

// Evaluate the string to get the object
// We need to be careful with eval, but this is a local dev task.
let charactersData;
try {
    charactersData = eval('(' + charactersDataString + ')');
} catch (e) {
    console.error("Failed to eval charactersData:", e);
    // It might be because the object keys are not quoted? JS objects don't strictly require quoted keys.
    // eval should handle it if it's valid JS.
    process.exit(1);
}

// Save each character
Object.values(charactersData).forEach(char => {
    // Update avatar path
    // Old: resources/characters/xxx.png
    // New: characters/avatars/xxx.png
    // We also need to move the files.
    
    const oldAvatarPath = char.avatar;
    const avatarFileName = path.basename(oldAvatarPath);
    char.avatar = `characters/avatars/${avatarFileName}`;
    
    const filePath = path.join(outputDir, `${char.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(char, null, 4), 'utf8');
    console.log(`Saved ${char.id} to ${filePath}`);
    
    // Copy avatar file
    const oldAvatarFullPath = path.join(__dirname, oldAvatarPath);
    const newAvatarFullPath = path.join(__dirname, 'characters', 'avatars', avatarFileName);
    
    if (fs.existsSync(oldAvatarFullPath)) {
        fs.copyFileSync(oldAvatarFullPath, newAvatarFullPath);
        console.log(`Copied avatar to ${newAvatarFullPath}`);
    } else {
        console.warn(`Avatar file not found: ${oldAvatarFullPath}`);
    }
});

console.log("Extraction complete.");

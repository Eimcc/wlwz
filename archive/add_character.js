const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const templatePath = path.join(__dirname, 'characters', 'templates', 'character_template.json');
const dataDir = path.join(__dirname, 'characters', 'data');

// Load template
let template = {};
try {
    template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
} catch (err) {
    console.error('Error loading template:', err.message);
    process.exit(1);
}

const questions = [
    { key: 'name', question: 'Character Name: ' },
    { key: 'id', question: 'Character ID (leave empty to generate from name): ' },
    { key: 'occupation', question: 'Occupation: ' },
    { key: 'faction', question: 'Faction: ' },
    { key: 'description', question: 'Description: ' }
];

const answers = {};

function ask(index) {
    if (index >= questions.length) {
        saveCharacter();
        return;
    }

    const q = questions[index];
    rl.question(q.question, (answer) => {
        answers[q.key] = answer.trim();
        ask(index + 1);
    });
}

function saveCharacter() {
    const charData = { ...template };
    
    charData.name = answers.name;
    charData.occupation = answers.occupation;
    charData.faction = answers.faction;
    charData.description = answers.description;
    
    // Generate ID if empty
    if (!answers.id) {
        // pinyin lib would be nice, but for now simple replacement
        // Assuming english or simple hash for chinese
        // Better: just use timestamp or ask user to provide english id if name is chinese
        // Since we don't have pinyin lib, let's use a random string or require ID.
        // But the prompt said "Auto-generate standardized filename".
        // I'll try to use a simple timestamp-based ID if name is not suitable.
        charData.id = 'char-' + Date.now();
    } else {
        charData.id = answers.id;
    }

    // Ensure ID is safe for filename
    charData.id = charData.id.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();

    const filePath = path.join(dataDir, `${charData.id}.json`);
    
    if (fs.existsSync(filePath)) {
        console.error(`Error: Character with ID ${charData.id} already exists.`);
        rl.close();
        return;
    }

    fs.writeFileSync(filePath, JSON.stringify(charData, null, 4), 'utf8');
    console.log(`Character saved to ${filePath}`);
    
    // Trigger update script logic if module was importable, but here just log
    console.log('Run "node update_script.js" to update the frontend data.');
    
    rl.close();
}

console.log('--- Add New Character ---');
ask(0);

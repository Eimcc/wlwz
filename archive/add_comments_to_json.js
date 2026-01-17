const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'characters', 'data');

const fieldComments = {
    "id": "唯一标识符",
    "name": "姓名",
    "aliases": "别名列表",
    "faction": "所属势力",
    "occupation": "职业",
    "martialArts": "武功招式",
    "avatar": "头像路径",
    "description": "人物简介",
    "quote": "经典台词",
    "category": "分类",
    "personality": "性格数据",
    "traits": "性格特征维度",
    "hobbies": "爱好",
    "relationships": "人际关系",
    "target": "关系对象ID",
    "type": "关系类型",
    "strength": "关系强度",
    "timeline": "生平大事记",
    "episode": "集数",
    "event": "事件描述",
    "year": "年份"
};

function processFile(file) {
    const filePath = path.join(dataDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let data;
    try {
        data = JSON.parse(content);
    } catch (e) {
        console.error(`Failed to parse ${file}:`, e);
        return;
    }

    const jsonString = JSON.stringify(data, null, 4);
    const lines = jsonString.split('\n');
    const newLines = lines.map(line => {
        // Simple heuristic: match "key":
        const match = line.match(/^\s*"([^"]+)":/);
        if (match) {
            const key = match[1];
            if (fieldComments[key]) {
                // Check if comment already exists to avoid duplication if run multiple times
                if (!line.includes('//')) {
                    return `${line} // ${fieldComments[key]}`;
                }
            }
        }
        return line;
    });

    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    console.log(`Updated ${file}`);
}

const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
files.forEach(processFile);

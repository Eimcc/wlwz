import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const dataDir = path.join(__dirname, 'src', 'data', 'source', 'data');
const templatePath = path.join(__dirname, 'src', 'data', 'source', 'templates', 'character_template.json');

// 确保目录存在
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const questions = [
    { key: 'name', question: '请输入角色姓名 (例如: 李大嘴): ' },
    { key: 'id', question: '请输入角色ID (英文, 留空将尝试根据姓名拼音生成): ' },
    { key: 'occupation', question: '请输入职业: ' },
    { key: 'faction', question: '请输入所属势力 (例如: 同福客栈): ' },
    { key: 'description', question: '请输入人物简介: ' },
    { key: 'category', question: '请输入分类 (tongfu/guest/other, 默认: other): ' }
];

const answers = {};

function ask(index) {
    if (index === questions.length) {
        createCharacter();
        return;
    }

    const q = questions[index];
    rl.question(q.question, (answer) => {
        answers[q.key] = answer.trim();
        ask(index + 1);
    });
}

function generateId(name) {
    // 简单的拼音映射表（仅作示例，实际应使用 pinyin 库）
    // 这里为了不引入新依赖，如果用户未输入ID，我们生成一个随机ID或要求用户重试
    // 但为了满足"根据姓名生成"的预期，我们可以做一个极简的 fallback，或者直接用时间戳
    // 更好的做法是提示用户必须输入ID如果无法转换
    return 'char-' + Date.now();
}

function createCharacter() {
    rl.close();

    // 处理默认值和ID
    if (!answers.id) {
        // 尝试简单的拼音转换（这里仅处理纯ASCII，否则用随机数）
        if (/^[a-zA-Z0-9\s-]+$/.test(answers.name)) {
            answers.id = answers.name.toLowerCase().replace(/\s+/g, '-');
        } else {
            console.log('\n⚠️  未检测到有效的英文ID，且姓名包含非ASCII字符。');
            console.log('   已自动生成ID，建议稍后手动修改文件名和ID字段。');
            answers.id = generateId(answers.name);
        }
    }

    if (!answers.category) {
        answers.category = 'other';
    }

    // 读取模板
    let template = {};
    if (fs.existsSync(templatePath)) {
        try {
            template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
        } catch (e) {
            console.error('Error reading template:', e);
        }
    }

    // 合并数据
    const characterData = {
        ...template,
        id: answers.id,
        name: answers.name,
        occupation: answers.occupation,
        faction: answers.faction,
        description: answers.description,
        category: answers.category,
        avatar: "characters/avatars/portraits/default.webp", // 默认头像
        // 保留模板中的其他结构
        aliases: template.aliases || [],
        martialArts: template.martialArts || [],
        personality: template.personality || {},
        quotes: template.quotes || []
    };

    const filePath = path.join(dataDir, `${answers.id}.json`);

    if (fs.existsSync(filePath)) {
        console.error(`\n❌ 错误: 文件 ${answers.id}.json 已存在！`);
        return;
    }

    fs.writeFileSync(filePath, JSON.stringify(characterData, null, 4), 'utf8');

    console.log(`\n✅ 成功！角色文件已生成:`);
    console.log(`   ${filePath}`);
    console.log(`\n下一步:`);
    console.log(`1. 将角色头像放入 public/characters/avatars/portraits/`);
    console.log(`2. 修改生成的 JSON 文件中的 avatar 字段指向正确的图片路径`);
    console.log(`3. 运行 'npm run update-data' 更新前端数据`);
}

console.log('--- 武林外传角色创建向导 ---');
ask(0);

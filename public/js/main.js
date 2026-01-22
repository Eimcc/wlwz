
// 武林外传人物图鉴 - 完整版JavaScript逻辑

if (!window.charactersData) {
    console.error('Character data not loaded! Please ensure resources/characters-data.js is included.');
}
const charactersData = window.charactersData || {};
let relationsChart = null;
let relationsChartDom = null;
let relationsLayout = 'force';
let relationsNodes = [];
let relationsLinks = [];
let relationsFilterType = 'all';
let relationsNeighborMap = new Map();
let relationsFocusedNodeId = null;
let relationsLabelRotationUpdating = false;
let characterDetailScrollAnimationId = null;

// --- 核心功能函数 ---

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        initIndexPage();
    } else if (window.location.pathname.endsWith('relations.html')) {
        initRelationsPage();
    } else if (window.location.pathname.endsWith('activities.html')) {
        initActivitiesPage();
    } else if (window.location.pathname.endsWith('character.html')) {
        initCharacterPage();
    }
});

function initIndexPage() {
	const grid = document.getElementById('characters-grid');
	if (!grid) return;

	renderCharacterCards(Object.values(charactersData));

	const featuredList = document.querySelector('#featured-characters .splide__list');
	if (featuredList && typeof Splide !== 'undefined') {
		const featuredCharacters = ['tong-xiangyu', 'bai-zhantang', 'guo-furong', 'l-xiucai', 'mo-xiaobei'];
		featuredCharacters.forEach(id => {
			const character = charactersData[id];
			if (!character) return;
			const li = document.createElement('li');
			li.className = 'splide__slide';
			li.innerHTML = `
				<div class="character-card p-4 rounded-lg text-center cursor-pointer" onclick="window.location.href='character.html?id=${character.id}'">
					<img src="${character.avatar}" alt="${character.name}" class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md">
					<h3 class="text-lg font-bold">${character.name}</h3>
					<p class="text-sm text-gray-600">${character.aliases[0]}</p>
				</div>
			`;
			featuredList.appendChild(li);
		});

		new Splide('#featured-characters', {
			type: 'loop',
			perPage: 4,
			perMove: 1,
			gap: '1rem',
			pagination: false,
			breakpoints: {
				1024: { perPage: 3 },
				768: { perPage: 2 },
				640: { perPage: 1 },
			}
		}).mount();
	}

	if (typeof anime !== 'undefined') {
		anime.timeline({
			easing: 'easeOutExpo',
		})
		.add({
			targets: '#main-title',
			translateY: [-50, 0],
			opacity: [0, 1],
			duration: 1200
		})
		.add({
			targets: '#main-subtitle',
			translateY: [-30, 0],
			opacity: [0, 1],
			duration: 1000
		}, '-=800')
		.add({
			targets: '#hero-buttons button',
			translateY: [30, 0],
			opacity: [0, 1],
			duration: 800,
			delay: anime.stagger(200)
		}, '-=600');
	}
}

// 渲染角色卡片
function renderCharacterCards(characters) {
    const grid = document.getElementById('characters-grid');
    if (!grid) return;
    grid.innerHTML = ''; // 清空现有内容
    characters.forEach(character => {
        const card = document.createElement('div');
        card.className = 'character-card bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2';
        card.innerHTML = `
            <a href="character?id=${character.id}" class="block">
                <img src="${character.avatar}" alt="${character.name}" class="w-full h-48 object-cover rounded-md mb-4">
                <h3 class="text-xl font-bold text-gray-800">${character.name}</h3>
                <p class="text-gray-600">${character.occupation}</p>
            </a>
        `;
        grid.appendChild(card);
    });
}



function smoothScrollToY(targetY, duration) {
    if (characterDetailScrollAnimationId) {
        cancelAnimationFrame(characterDetailScrollAnimationId);
        characterDetailScrollAnimationId = null;
    }
    const startY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
    const maxScroll = Math.max(0, docHeight - viewportHeight);
    const clampedTarget = Math.max(0, Math.min(targetY, maxScroll));
    const distance = clampedTarget - startY;
    if (Math.abs(distance) < 1) {
        window.scrollTo(0, clampedTarget);
        return;
    }
    const startTime = performance.now();
    const d = duration || 400;
    function step(now) {
        const elapsed = now - startTime;
        const t = d === 0 ? 1 : Math.min(elapsed / d, 1);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        window.scrollTo(0, startY + distance * eased);
        if (t < 1) {
            characterDetailScrollAnimationId = requestAnimationFrame(step);
        } else {
            characterDetailScrollAnimationId = null;
        }
    }
    characterDetailScrollAnimationId = requestAnimationFrame(step);
}

function scrollToCharacterDetailSection() {
    const detail = document.getElementById('character-detail-section');
    if (!detail) return;
    const rect = detail.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const nav = document.querySelector('nav.nav-bar');
    const navHeight = nav ? nav.getBoundingClientRect().height : 0;
    const padding = 16;
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
    const absoluteTop = currentScroll + rect.top;
    const detailHeight = rect.height;
    const available = viewportHeight - navHeight - padding * 2;
    let targetY;
    if (detailHeight <= available) {
        targetY = absoluteTop - navHeight - Math.max((available - detailHeight) / 2, padding);
    } else {
        targetY = absoluteTop - navHeight - padding;
    }
    smoothScrollToY(targetY, 400);
}

function initCharacterPage() {
    const selector = document.getElementById('character-selector');
    if (selector) {
        selector.innerHTML = '';
        Object.values(charactersData).forEach(char => {
            const div = document.createElement('div');
            div.className = 'character-option bg-white shadow hover:shadow-md cursor-pointer text-center p-2 rounded transition-all duration-300';
            div.dataset.id = char.id;
            
            div.onclick = (e) => {
                e.preventDefault();
                const newUrl = `character?id=${char.id}`;
                window.history.pushState({ id: char.id }, '', newUrl);
                loadCharacterData(char.id);
                scrollToCharacterDetailSection();
            };
            
            div.innerHTML = `
                <img src="${char.avatar}" class="w-12 h-12 rounded-full mx-auto mb-2 object-cover">
                <div class="text-sm font-bold">${char.name}</div>
            `;
            selector.appendChild(div);
        });
    }
}

// 加载并渲染角色数据
function loadCharacterData(id) {
    console.log('loadCharacterData called with ID:', id);
    const character = charactersData[id];
    if (!character) {
        console.error('Character not found:', id);
        // User Requirement: Friendly error message
        const container = document.getElementById('character-name');
        if (container) container.textContent = '角色未找到';
        return;
    }
    
    // Highlight selected character in switcher
    const options = document.querySelectorAll('.character-option');
    options.forEach(opt => {
        if (opt.dataset.id === id) {
            opt.classList.add('ring-2', 'ring-amber-600', 'bg-amber-50');
            opt.classList.remove('bg-white');
        } else {
            opt.classList.remove('ring-2', 'ring-amber-600', 'bg-amber-50');
            opt.classList.add('bg-white');
        }
    });
    
    // 更新页面标题
    document.title = `${character.name} - 武林外传人物图鉴`;

    // 填充基本信息
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };
    const setSrc = (id, src) => {
        const el = document.getElementById(id);
        if (el) el.src = src;
    };

    setText('character-name', character.name);
    let quoteText = '';
    if (Array.isArray(character.quotes) && character.quotes.length > 0) {
        const idx = Math.floor(Math.random() * character.quotes.length);
        quoteText = character.quotes[idx];
    } else if (typeof character.quote === 'string') {
        quoteText = character.quote;
    }
    setText('character-quote', quoteText);
    setSrc('character-avatar', character.avatar);
    setText('character-description', character.description);
    setText('character-faction', character.faction);
    setText('character-occupation', character.occupation);

    // 填充详细信息表格
    setText('character-fullname', character.name);
    setText('character-nickname', character.aliases.join(', '));
    setText('character-sect', character.faction);
    setText('character-job', character.occupation);
    setText('character-kungfu', character.martialArts.join(', ') || '无');

    // 渲染武功列表
    const martialArtsContainer = document.getElementById('martial-arts-list');
    if (martialArtsContainer) {
        martialArtsContainer.innerHTML = character.martialArts.length ? character.martialArts.map(art => 
            `<span class="martial-arts-badge text-xs px-2 py-1 mr-1 mb-1 inline-block">${art}</span>`
        ).join('') : '<span class="text-xs text-gray-500">无武功记载</span>';
    }

    // 渲染兴趣爱好
    const hobbiesContainer = document.getElementById('hobbies-list');
    if (hobbiesContainer) {
        hobbiesContainer.innerHTML = character.hobbies.map(hobby => `
            <div class="flex items-center space-x-2 bg-amber-50 p-1.5 rounded-md">
                <div class="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center text-white text-[10px]">
                    ${hobby[0]}
                </div>
                <span class="text-sm text-gray-700">${hobby}</span>
            </div>
        `).join('');
    }

    // 渲染性格画像列表
    const traitsContainer = document.getElementById('personality-traits');
    if (traitsContainer && character.personality && character.personality.traits) {
        traitsContainer.innerHTML = Object.entries(character.personality.traits).map(([trait, value]) => `
            <div class="mb-1.5">
                <div class="flex justify-between text-xs mb-0.5">
                    <span>${trait}</span>
                    <span>${value}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-1.5">
                    <div class="bg-amber-600 h-1.5 rounded-full" style="width: ${value}%"></div>
                </div>
            </div>
        `).join('');
    }

    // 渲染性格雷达图
    if (character.personality && character.personality.bigFive) {
        renderPersonalityChart(character.personality.bigFive);
    }

    // 渲染时间线
    const timelineContainer = document.getElementById('character-timeline');
    if (timelineContainer) {
        timelineContainer.innerHTML = character.timeline.map((item, index) => `
            <div class="timeline-item pl-4 pb-4 relative border-l-2 border-amber-600 ml-1">
                <div class="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-amber-600 border-2 border-white"></div>
                <div class="bg-white p-3 rounded-lg shadow-sm border border-amber-100">
                    <div class="flex justify-between items-center mb-1">
                        <h4 class="font-bold text-base text-amber-800">${item.year}</h4>
                        <span class="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">${item.episode}</span>
                    </div>
                    <p class="text-sm text-gray-700 leading-snug">${item.event}</p>
                </div>
            </div>
        `).join('');
    }

    // 渲染关系列表
    const relationshipsContainer = document.getElementById('relationships-list');
    if (relationshipsContainer) {
        relationshipsContainer.innerHTML = character.relationships.map(rel => {
            const targetChar = charactersData[rel.target];
            if (!targetChar) return '';
            
            let badgeClass = 'bg-gray-500';
            if (rel.type === 'love') badgeClass = 'bg-red-500';
            if (rel.type === 'family') badgeClass = 'bg-green-500';
            if (rel.type === 'friendship') badgeClass = 'bg-blue-500';
            if (rel.type === 'enemy') badgeClass = 'bg-purple-500';
            if (rel.type === 'love_rival') badgeClass = 'bg-pink-500';

            return `
                <div class="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" onclick="window.location.href='#/character?id=${targetChar.id}'">
                    <div class="flex items-center space-x-2">
                        <img src="${targetChar.avatar}" class="w-8 h-8 rounded-full object-cover border border-gray-200">
                        <div>
                            <div class="font-bold text-sm text-gray-800">${targetChar.name}</div>
                            <div class="text-[10px] text-gray-500">${rel.description}</div>
                        </div>
                    </div>
                    <span class="${badgeClass} text-white text-[10px] px-1.5 py-0.5 rounded-full">${getRelationshipText(rel.type)}</span>
                </div>
            `;
        }).join('');
    }
}

const BIG_FIVE_DIMENSIONS = [
    { key: '开放性', label: '开放性' },
    { key: '责任心', label: '责任心' },
    { key: '外向性', label: '外向性' },
    { key: '宜人性', label: '宜人性' },
    { key: '情绪稳定性', label: '情绪稳定性' }
];

// 渲染性格雷达图 (使用 ECharts)
function renderPersonalityChart(bigFive) {
    const chartDom = document.getElementById('personality-radar');
    if (!chartDom) return;
    
    // 如果已经有实例，先销毁
    const existingChart = echarts.getInstanceByDom(chartDom);
    if (existingChart) existingChart.dispose();

    const myChart = echarts.init(chartDom);
    const indicators = BIG_FIVE_DIMENSIONS.map(dim => ({
        name: dim.label,
        max: 100
    }));
    const values = BIG_FIVE_DIMENSIONS.map(dim => {
        const value = bigFive && typeof bigFive[dim.key] === 'number' ? bigFive[dim.key] : 0;
        return value;
    });

    const option = {
        radar: {
            indicator: indicators,
            shape: 'circle',
            splitNumber: 4,
            axisName: {
                color: '#8B4513',
                fontSize: 12
            },
            splitLine: {
                lineStyle: {
                    color: [
                        'rgba(139, 69, 19, 0.1)', 'rgba(139, 69, 19, 0.2)',
                        'rgba(139, 69, 19, 0.4)', 'rgba(139, 69, 19, 0.6)'
                    ].reverse()
                }
            },
            splitArea: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(139, 69, 19, 0.3)'
                }
            }
        },
        series: [{
            type: 'radar',
            data: [{
                value: values,
                name: '性格特征',
                areaStyle: {
                    color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                        { color: 'rgba(160, 82, 45, 0.1)', offset: 0 },
                        { color: 'rgba(160, 82, 45, 0.5)', offset: 1 }
                    ])
                },
                lineStyle: {
                    color: '#A0522D',
                    width: 2
                },
                itemStyle: {
                    color: '#A0522D',
                    borderColor: '#fff',
                    borderWidth: 2
                }
            }]
        }]
    };

    myChart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', () => {
        myChart.resize();
    });
}

function formatCharacterNodeLabel(char) {
    if (!char) return '';
    const key = char.occupation || char.faction || '';
    if (!key) return char.name;
    return char.name + '\n' + key;
}

function buildRelationsGraphData() {
    relationsNodes = [];
    relationsLinks = [];
    relationsNeighborMap = new Map();

    const characterEntries = Object.entries(charactersData);

    characterEntries.forEach(([id, char]) => {
        if (!char) return;
        const node = {
            id: char.id,
            name: char.name,
            category: char.category || 'default'
        };
        if (char.avatar) {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = char.avatar;
            
            // Set default styling
            node.symbol = 'circle';
            node.itemStyle = {
                color: '#e5e7eb',
                borderColor: '#ffffff',
                borderWidth: 2,
                shadowBlur: 8,
                shadowColor: 'rgba(0,0,0,0.15)'
            };

            const processAvatar = (imageSource) => {
                try {
                    const canvas = document.createElement('canvas');
                    const size = 140; // Double size for better quality
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext('2d');
                    
                    // Draw circle path
                    ctx.beginPath();
                    ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.save();
                    ctx.clip();
                    
                    // Draw image centered and covering the circle
                    const aspect = imageSource.width / imageSource.height;
                    let drawWidth = size;
                    let drawHeight = size;
                    let offsetX = 0;
                    let offsetY = 0;
                    
                    if (aspect > 1) {
                        drawWidth = size * aspect;
                        offsetX = -(drawWidth - size) / 2;
                    } else {
                        drawHeight = size / aspect;
                        offsetY = -(drawHeight - size) / 2;
                    }
                    
                    ctx.drawImage(imageSource, offsetX, offsetY, drawWidth, drawHeight);
                    ctx.restore();
                    
                    // Draw border inside the canvas image itself to ensure it's visible
                    // This is more robust than relying on ECharts itemStyle border for image symbols
                    ctx.beginPath();
                    ctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI * 2, true);
                    ctx.lineWidth = 4; // Thicker because we scaled up
                    ctx.strokeStyle = '#ffffff';
                    ctx.stroke();

                    return canvas.toDataURL();
                } catch (e) {
                    console.error('Avatar processing error:', e);
                    return null;
                }
            };

            img.onload = () => {
                const dataUrl = processAvatar(img);
                if (dataUrl) {
                    node.symbol = 'image://' + dataUrl;
                    // Reset itemStyle color so it doesn't conflict
                    node.itemStyle.color = undefined; 
                    node.itemStyle.borderColor = undefined; // Border is now part of the image
                    node.itemStyle.borderWidth = 0;
                }
                requestAnimationFrame(refreshRelationsChart);
            };
            
            img.onerror = () => {
                const defaultImg = new Image();
                defaultImg.src = 'characters/avatars/portraits/default.webp';
                defaultImg.onload = () => {
                    const dataUrl = processAvatar(defaultImg);
                    if (dataUrl) {
                        node.symbol = 'image://' + dataUrl;
                        node.itemStyle.color = undefined;
                        node.itemStyle.borderColor = undefined;
                        node.itemStyle.borderWidth = 0;
                    }
                    requestAnimationFrame(refreshRelationsChart);
                };
            };
        }
        relationsNodes.push(node);
    });

    const undirectedSeen = new Set();

    characterEntries.forEach(([id, char]) => {
        if (!char || !Array.isArray(char.relationships)) return;
        char.relationships.forEach(rel => {
            const sourceId = char.id;
            const targetId = rel.target;
            if (!targetId) return;
            const type = rel.type;
            const isDirectional = type === 'pursuer';

            let linkSource = sourceId;
            let linkTarget = targetId;
            let key;

            if (isDirectional) {
                key = type + ':' + linkSource + '->' + linkTarget;
                const existsSameDirection = relationsLinks.some(
                    l => l.source === linkSource && l.target === linkTarget && l.type === type
                );
                const existsOppositeDirection = relationsLinks.some(
                    l => l.source === linkTarget && l.target === linkSource && l.type === type
                );
                if (existsSameDirection || existsOppositeDirection) {
                    return;
                }
            } else {
                // 如果这对角色之间已经存在追求者关系，则不再绘制其他类型的线，避免覆盖箭头
                const hasPursuerBetweenPair = relationsLinks.some(l => {
                    if (l.type !== 'pursuer') return false;
                    return (l.source === sourceId && l.target === targetId) ||
                           (l.source === targetId && l.target === sourceId);
                });
                if (hasPursuerBetweenPair) return;

                const a = sourceId < targetId ? sourceId : targetId;
                const b = sourceId < targetId ? targetId : sourceId;
                linkSource = a;
                linkTarget = b;
                key = type + ':' + a + '-' + b;
                if (undirectedSeen.has(key)) return;
                undirectedSeen.add(key);
            }

            const link = {
                source: linkSource,
                target: linkTarget,
                value: rel.strength,
                type: type,
                lineStyle: {
                    color: getCategoryColor(type),
                    width: rel.strength / 25
                }
            };

            if (isDirectional) {
                link.lineStyle.curveness = 0;
                link.label = {
                    show: true,
                    formatter: '➤ ➤ ➤',
                    fontSize: 10,
                    color: getCategoryColor(type),
                    position: 'middle',
                    distance: 0,
                    align: 'center',
                    verticalAlign: 'middle'
                };
                link.edgeSymbol = ['none', 'none'];
            }

            relationsLinks.push(link);

            if (!relationsNeighborMap.has(sourceId)) relationsNeighborMap.set(sourceId, new Set());
            if (!relationsNeighborMap.has(targetId)) relationsNeighborMap.set(targetId, new Set());
            relationsNeighborMap.get(sourceId).add(targetId);
            relationsNeighborMap.get(targetId).add(sourceId);
        });
    });

    updateRelationsStats();
}

function applyGridLayout(nodes, chartDom) {
    if (!chartDom || !nodes.length) return;
    const width = chartDom.clientWidth || 800;
    const height = chartDom.clientHeight || 600;
    const margin = 80;
    const innerWidth = Math.max(width - margin * 2, 200);
    const innerHeight = Math.max(height - margin * 2, 200);

    const sorted = nodes.slice().sort((a, b) => {
        const aChar = charactersData[a.id];
        const bChar = charactersData[b.id];
        const aCat = aChar && aChar.category ? aChar.category : '';
        const bCat = bChar && bChar.category ? bChar.category : '';
        if (aCat === bCat) return a.name.localeCompare(b.name);
        return aCat.localeCompare(bCat);
    });

    const count = sorted.length;
    const cols = Math.ceil(Math.sqrt(count * 0.8));
    const rows = Math.ceil(count / cols);
    const cellWidth = innerWidth / cols;
    const cellHeight = innerHeight / rows;

    sorted.forEach((node, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        node.x = margin + (col + 0.5) * cellWidth;
        node.y = margin + (row + 0.5) * cellHeight;
    });
}

function updateRelationsStats() {
    const totalRelationsEl = document.getElementById('total-relations');
    const coreCharactersEl = document.getElementById('core-characters');
    const strongestRelationEl = document.getElementById('strongest-relation');
    if (!totalRelationsEl || !coreCharactersEl || !strongestRelationEl) return;

    totalRelationsEl.textContent = String(relationsLinks.length);

    let coreCount = 0;
    relationsNodes.forEach(node => {
        const neighbors = relationsNeighborMap.get(node.id);
        if (neighbors && neighbors.size >= 3) coreCount += 1;
    });
    coreCharactersEl.textContent = String(coreCount);

    let strongest = '';
    let maxStrength = -Infinity;
    relationsLinks.forEach(link => {
        const strength = typeof link.value === 'number' ? link.value : 0;
        const sourceChar = charactersData[link.source];
        const targetChar = charactersData[link.target];
        if (strength > maxStrength && sourceChar && targetChar) {
            maxStrength = strength;
            strongest = sourceChar.name + '-' + targetChar.name;
        }
    });
    if (strongest) strongestRelationEl.textContent = strongest;
}

function refreshRelationsChart() {
    if (!relationsChart || !relationsChartDom) return;

    let displayLinks;
    if (relationsFilterType === 'all') {
        displayLinks = relationsLinks;
    } else if (relationsFilterType === 'sect') {
        displayLinks = relationsLinks.filter(link => link.type === 'mentorship' || link.type === 'same_sect');
    } else {
        displayLinks = relationsLinks.filter(link => link.type === relationsFilterType);
    }

    const layoutType = relationsLayout === 'grid' ? 'none' : 'force';
    if (relationsLayout === 'grid') {
        applyGridLayout(relationsNodes, relationsChartDom);
    }

    const option = {
        tooltip: {
            confine: true,
            position: 'top',
            extraCssText: 'max-width: 250px; white-space: normal;',
            formatter: function (params) {
                if (params.dataType === 'node') {
                    const char = charactersData[params.data.id];
                    if (!char) return params.data.name || '';
                    const lines = [];
                    lines.push('<b>' + char.name + '</b>');
                    if (char.occupation) lines.push('身份：' + char.occupation);
                    if (char.faction) lines.push('阵营：' + char.faction);
                    if (char.quote) lines.push('台词：' + char.quote);
                    return lines.join('<br/>');
                }
                if (params.dataType === 'edge') {
                    const sourceChar = charactersData[params.data.source];
                    const targetChar = charactersData[params.data.target];
                    const typeText = getRelationshipText(params.data.type);
                    const strength = params.data.value;
                    const pair = sourceChar && targetChar ? sourceChar.name + ' - ' + targetChar.name : '';
                    return pair + '<br/>' + typeText + '（强度 ' + strength + '）';
                }
            }
        },
        series: [{
            type: 'graph',
            layout: layoutType,
            data: relationsNodes,
            links: displayLinks,
            roam: true,
            draggable: true,
            edgeSymbol: ['none', 'none'],
            edgeSymbolSize: 8,
            label: {
                show: true,
                position: 'bottom',
                align: 'center',
                color: '#3C2415',
                fontSize: 10,
                formatter: function (params) {
                    const char = charactersData[params.data.id];
                    if (!char) return params.data.name || '';
                    return char.name;
                }
            },
            lineStyle: {
                opacity: 0.8
            },
            emphasis: {
                focus: 'adjacency',
                lineStyle: {
                    width: 3
                }
            },
            symbolSize: 70,
            force: {
                repulsion: 320,
                edgeLength: 120,
                gravity: 0.02,
                layoutAnimation: true
            },
            progressive: 200,
            progressiveThreshold: 600
        }]
    };

    relationsChart.setOption(option, true);
}

function updateDirectionalEdgeLabelRotation() {
    if (!relationsChart) return;
    if (relationsLabelRotationUpdating) return;
    const option = relationsChart.getOption();
    if (!option || !option.series || !option.series.length) return;
    const series = option.series[0];
    const data = series.data || [];
    const links = series.links || [];
    const posMap = {};
    data.forEach(node => {
        if (!node || node.id == null) return;
        const x = node.x;
        const y = node.y;
        if (typeof x !== 'number' || typeof y !== 'number') return;
        posMap[node.id] = [x, y];
    });

    let changed = false;
    links.forEach(link => {
        if (!link || link.type !== 'pursuer') return;
        const p1 = posMap[link.source];
        const p2 = posMap[link.target];
        if (!p1 || !p2) return;
        const dx = p2[0] - p1[0];
        const dy = p2[1] - p1[1];
        if (!dx && !dy) return;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        if (!link.label) link.label = {};
        if (link.label.rotate === angle) return;
        link.label.rotate = angle;
        changed = true;
    });

    if (!changed) return;
    relationsLabelRotationUpdating = true;
    relationsChart.setOption(option, false);
    relationsLabelRotationUpdating = false;
}

function handleRelationsNodeClick(params) {
    if (!relationsChart) return;
    const nodeId = params.data.id;
    if (relationsFocusedNodeId === nodeId) {
        relationsFocusedNodeId = null;
        relationsChart.dispatchAction({
            type: 'unfocusNodeAdjacency',
            seriesIndex: 0
        });
    } else {
        relationsFocusedNodeId = nodeId;
        relationsChart.dispatchAction({
            type: 'focusNodeAdjacency',
            seriesIndex: 0,
            dataIndex: params.dataIndex
        });
    }
}

function showRelationshipDetails(sourceId, targetId) {
    const sourceChar = charactersData[sourceId];
    const targetChar = charactersData[targetId];
    if (!sourceChar || !targetChar) return;

    let relation = null;
    if (Array.isArray(sourceChar.relationships)) {
        relation = sourceChar.relationships.find(rel => rel.target === targetId) || null;
    }
    if (!relation && Array.isArray(targetChar.relationships)) {
        relation = targetChar.relationships.find(rel => rel.target === sourceId) || null;
    }
    if (!relation) return;

    const panel = document.getElementById('relationship-details');
    const titleEl = document.getElementById('relation-title');
    const sourceNameEl = document.getElementById('relation-source-name');
    const targetNameEl = document.getElementById('relation-target-name');
    const sourceAvatarEl = document.getElementById('relation-source-avatar');
    const targetAvatarEl = document.getElementById('relation-target-avatar');
    const typeEl = document.getElementById('relation-type');
    const strengthBarEl = document.getElementById('relation-strength-bar');
    const descriptionEl = document.getElementById('relation-description');

    if (!panel || !titleEl || !sourceNameEl || !targetNameEl || !sourceAvatarEl || !targetAvatarEl || !typeEl || !strengthBarEl || !descriptionEl) {
        return;
    }

    titleEl.textContent = sourceChar.name + ' 与 ' + targetChar.name;
    sourceNameEl.textContent = sourceChar.name;
    targetNameEl.textContent = targetChar.name;
    sourceAvatarEl.src = sourceChar.avatar;
    targetAvatarEl.src = targetChar.avatar;
    typeEl.textContent = getRelationshipText(relation.type);
    strengthBarEl.style.width = Math.max(0, Math.min(100, relation.strength)) + '%';
    descriptionEl.textContent = relation.description || '';

    panel.classList.remove('hidden');
}

function handleRelationsEdgeClick(params) {
    showRelationshipDetails(params.data.source, params.data.target);
}

function handleRelationsResize() {
    if (!relationsChart || !relationsChartDom) return;
    if (relationsLayout === 'grid') {
        applyGridLayout(relationsNodes, relationsChartDom);
        refreshRelationsChart();
    } else {
        relationsChart.resize();
    }
}

function initRelationsPage() {
    if (!charactersData || !Object.keys(charactersData).length) return;
    if (relationsChart) return;

    relationsChartDom = document.getElementById('network-chart');
    if (!relationsChartDom) return;

    buildRelationsGraphData();
    relationsLayout = 'force';
    relationsFilterType = 'all';

    relationsChart = echarts.init(relationsChartDom);
    refreshRelationsChart();

    relationsChart.on('finished', updateDirectionalEdgeLabelRotation);

    relationsChart.on('click', function (params) {
        if (params.dataType === 'node') {
            handleRelationsNodeClick(params);
        }
        if (params.dataType === 'edge') {
            handleRelationsEdgeClick(params);
        }
    });

    window.addEventListener('resize', handleRelationsResize);
}

let activitiesWeatherContext = null;
let activitiesLogMode = '24h';
let activitiesSelectedCharacterId = null;
let isActivitiesPageInitialized = false;

function updateActivitiesToggleButton(toggleBtn) {
    if (!toggleBtn) return;
    const isSevenDays = activitiesLogMode === '7d';
    
    // 更新文本
    toggleBtn.textContent = isSevenDays ? '查看最近十二个时辰' : '查看近七日';
    
    // 更新 ARIA 属性
    toggleBtn.setAttribute('aria-pressed', isSevenDays ? 'true' : 'false');
    
    // 更新 Title
    toggleBtn.title = isSevenDays 
        ? '当前显示：近七日活动日志，点击切换最近十二个时辰' 
        : '当前显示：最近十二个时辰活动，点击查看近七日';

    // 更新样式类
    // 移除所有可能的状态类
    toggleBtn.classList.remove('from-indigo-600', 'to-purple-600', 'hover:from-indigo-700', 'hover:to-purple-700');
    toggleBtn.classList.remove('from-amber-600', 'to-red-600', 'hover:from-amber-700', 'hover:to-red-700');
    
    if (isSevenDays) {
        // 橙红色调
        toggleBtn.classList.add('from-amber-600', 'to-red-600', 'hover:from-amber-700', 'hover:to-red-700');
    } else {
        // 蓝紫色调
        toggleBtn.classList.add('from-indigo-600', 'to-purple-600', 'hover:from-indigo-700', 'hover:to-purple-700');
    }
}

function initActivitiesPage() {
    if (isActivitiesPageInitialized) return;
    isActivitiesPageInitialized = true;

    const selectionContainer = document.getElementById('character-selection');
    const toggleBtn = document.getElementById('log-toggle-btn');
    
    if (selectionContainer && window.charactersData) {
        selectionContainer.innerHTML = '';
        for (const id in charactersData) {
            const char = charactersData[id];
            const div = document.createElement('div');
            div.className = 'character-selector p-3 cursor-pointer flex flex-col items-center';
            div.innerHTML = '<img src="' + char.avatar + '" class="w-16 h-16 rounded-full border-2 border-gray-300 mb-2 object-cover"><span class="font-medium text-sm">' + char.name + '</span>';
            div.addEventListener('click', function () {
                selectCharacterForLogs(id, div);
            });
            selectionContainer.appendChild(div);
        }
    }
    if (toggleBtn) {
        // 初始化按钮状态
        updateActivitiesToggleButton(toggleBtn);
        
        toggleBtn.addEventListener('click', function () {
            activitiesLogMode = activitiesLogMode === '24h' ? '7d' : '24h';
            
            updateActivitiesToggleButton(toggleBtn);
            
            if (activitiesSelectedCharacterId) {
                renderActivityLogForCharacter(activitiesSelectedCharacterId);
            }
        });
    }
}

function loadActivitiesData() {
    updateActivitiesTimeDisplay();
    fetchHuojiaWeather().then(function (ctx) {
        activitiesWeatherContext = ctx;
        if (!activitiesSelectedCharacterId && window.charactersData) {
            const ids = Object.keys(charactersData);
            if (ids.length) {
                const firstId = ids[0];
                const firstCard = document.querySelector('.character-selector');
                if (firstCard) {
                    selectCharacterForLogs(firstId, firstCard);
                }
            }
        } else if (activitiesSelectedCharacterId) {
            renderActivityLogForCharacter(activitiesSelectedCharacterId);
        }
    });
}

function updateActivitiesTimeDisplay() {
    const timeEl = document.getElementById('log-current-time');
    if (timeEl) {
        const now = new Date();
        timeEl.textContent = getMingDateStr(now) + ' ' + getShichenWithKe(now);
    }
}

function getMingDateStr(date) {
    const currentYear = date.getFullYear();
    // Anchor: 2006 (Reality) = 1608 (Wanli 36)
    const offset = currentYear - 2006;
    const mingYear = 1608 + offset;
    
    let yearStr = '';
    if (mingYear <= 1620) {
        yearStr = '万历' + toChineseNum(mingYear - 1572) + '年';
    } else if (mingYear === 1620) {
        // Overlap year, but for simplicity let's stick to Wanli end or Taichang
        yearStr = '泰昌元年'; 
    } else if (mingYear <= 1627) {
        yearStr = '天启' + toChineseNum(mingYear - 1620) + '年';
    } else if (mingYear <= 1644) {
        yearStr = '崇祯' + toChineseNum(mingYear - 1627) + '年';
    } else {
        // After 1644, history diverges or enters Qing. 
        // For the sake of the game/immersion, maybe keep counting or show Qing era?
        // But users usually want the Ming vibe. 
        // Let's use Shunzhi (Qing) or just numeric if it goes too far.
        // 1644 is Shunzhi 1.
        yearStr = '清顺治' + toChineseNum(mingYear - 1643) + '年';
    }
    
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return yearStr + toChineseNum(month) + '月' + toChineseNum(day) + '日';
}

function toChineseNum(num) {
    const chars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    if (num <= 10) return chars[num];
    if (num < 20) return '十' + (num % 10 === 0 ? '' : chars[num % 10]);
    if (num === 20) return '二十';
    // Simple implementation for days/months usually < 32
    if (num < 100) {
        const ten = Math.floor(num / 10);
        const unit = num % 10;
        return chars[ten] + '十' + (unit === 0 ? '' : chars[unit]);
    }
    return num;
}

function selectCharacterForLogs(id, element) {
    activitiesSelectedCharacterId = id;
    document.querySelectorAll('.character-selector').forEach(function (el) {
        el.classList.remove('selected', 'border-yellow-500', 'bg-yellow-50');
    });
    element.classList.add('selected', 'border-yellow-500', 'bg-yellow-50');
    renderActivityLogForCharacter(id);
}

async function fetchHuojiaWeather() {
    const now = new Date();
    const context = {
        time: now,
        location: '河南省新乡市获嘉县',
        weather: { desc: '晴朗', type: 'sunny', temp: 20 }
    };
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=35.258&longitude=113.6433&current_weather=true');
        if (res.ok) {
            const data = await res.json();
            if (data && data.current_weather) {
                const code = data.current_weather.weathercode;
                const temp = data.current_weather.temperature;
                const decoded = decodeWeatherCode(code);
                context.weather = decoded;
                context.weather.temp = temp;
            }
        }
    } catch (e) {
    }
    // No longer displaying reference weather on UI as per user request (Previous comment)
    // Update: User requested simplified weather display without temperature numbers
    const weatherEl = document.getElementById('log-current-weather');
    if (weatherEl) {
        const feeling = getBodyFeeling(context.weather.temp);
        weatherEl.textContent = context.weather.desc + ' ' + feeling;
    }
    return context;
}

function decodeWeatherCode(code) {
    if (code === 0) return { desc: '晴朗', type: 'sunny' };
    if (code <= 3) return { desc: '多云', type: 'cloudy' };
    if (code <= 48) return { desc: '雾', type: 'cloudy' };
    if (code <= 67) return { desc: '细雨', type: 'rainy' };
    if (code <= 77) return { desc: '大雪', type: 'snowy' };
    if (code <= 82) return { desc: '阵雨', type: 'rainy' };
    return { desc: '暴雨', type: 'rainy' };
}

function getShichen(date) {
    const hour = date.getHours();
    const shichenList = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'];
    // 子时 is 23:00 - 01:00. 
    // If hour is 23 or 0, it's index 0.
    // 1-2: 1, 3-4: 2, ...
    // Formula: (hour + 1) / 2
    let index = Math.floor((hour + 1) / 2);
    if (index >= 12) index = 0;
    return shichenList[index];
}

function getShichenWithKe(date) {
    const hour = date.getHours();
    const minute = date.getMinutes();
    const shichenList = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'];
    const shichenStartHours = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
    let index = Math.floor((hour + 1) / 2);
    if (index >= 12) index = 0;
    const shichen = shichenList[index];
    const startHour = shichenStartHours[index];
    let diffMinutes;
    if (startHour <= hour) {
        diffMinutes = (hour - startHour) * 60 + minute;
    } else {
        diffMinutes = (hour + 24 - startHour) * 60 + minute;
    }
    const keIndex = Math.min(8, Math.floor(diffMinutes / 15) + 1);
    const keNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八'];
    const keStr = keNums[keIndex] + '刻钟';
    return shichen + keStr;
}

function getBodyFeeling(temp) {
    if (temp <= 0) return '极寒';
    if (temp <= 10) return '寒冷';
    if (temp <= 18) return '微凉';
    if (temp <= 24) return '舒适';
    if (temp <= 29) return '温暖';
    if (temp <= 35) return '炎热';
    return '酷热';
}

function renderActivityLogForCharacter(id) {
    const logDiv = document.getElementById('activity-log');
    if (!logDiv || !window.charactersData) return;
    const character = charactersData[id];
    if (!character) return;
    const context = activitiesWeatherContext || {
        time: new Date(),
        location: '河南省新乡市获嘉县',
        weather: { desc: '晴朗', type: 'sunny', temp: 20 }
    };
    let logs = [];
    if (activitiesLogMode === '24h') {
        logs = generateCharacterLogs(character, context, '24h');
    } else if (activitiesLogMode === '7d') {
        const recentLogs = generateCharacterLogs(character, context, '24h');
        const olderLogs = generateCharacterLogsRange(character, context, 24 * 7, 24, 12);
        logs = recentLogs.concat(olderLogs);
    } else {
        logs = generateCharacterLogs(character, context, '24h');
    }
    logs.sort(function (a, b) {
        const ta = typeof a.timestamp === 'number' ? a.timestamp : 0;
        const tb = typeof b.timestamp === 'number' ? b.timestamp : 0;
        return tb - ta;
    });
    logs = compressConsecutiveLogs(logs);
    let html = '';
    logs.forEach(function (entry) {
        html += '<div class="timeline-item">' +
            '<div class="activity-card">' +
            '<div class="flex items-center justify-between mb-2">' +
            '<div class="text-sm text-gray-500">' + entry.timeLabel + '</div>' +
            '<span class="mood-indicator ' + entry.moodClass + '">' + entry.moodText + '</span>' +
            '</div>' +
            '<h4 class="font-bold text-lg mb-1">' + entry.title + '</h4>' +
            '<p class="text-sm text-gray-500 mb-2">地点：' + entry.location + '</p>' +
            '<p class="text-gray-800 text-sm leading-relaxed">' + entry.detail + '</p>' +
            '</div>' +
            '</div>';
    });
    if (activitiesLogMode === '7d' && logs.length > 0) {
        if (logs.length < 40) {
            html += '<div class="mt-4 mb-2 text-center text-sm text-gray-500 italic">哎呀时间太早不记得了</div>';
        } else {
            html += '<div class="mt-4 mb-2 text-center text-xs text-gray-400">—— 仅展示近七日记录 ——</div>';
        }
    }
    logDiv.innerHTML = html || '<p class="text-gray-500 text-sm">暂时没有可展示的日志。</p>';
    if (logs.length) {
        anime({
            targets: '#activity-log .timeline-item',
            opacity: [0, 1],
            translateY: [10, 0],
            delay: anime.stagger(80),
            duration: 500,
            easing: 'easeOutQuad'
        });
    }
}

function generateCharacterLogsRange(character, context, startHoursAgo, endHoursAgoExclusive, stepHours) {
    const logs = [];
    const times = [];
    const now = context.time instanceof Date ? context.time : new Date();
    const weather = context.weather;
    const baseLocation = context.location;
    for (let h = endHoursAgoExclusive + stepHours; h <= startHoursAgo + 1e-6; h += stepHours) {
        const time = new Date(now.getTime() - h * 60 * 60 * 1000);
        const entry = getCharacterActionAtTime(character, time, weather, baseLocation);
        logs.push(entry);
        times.push(time);
    }
    for (let i = 0; i < times.length - 1; i++) {
        const t1 = times[i];
        const t2 = times[i + 1];
        const midTime = new Date((t1.getTime() + t2.getTime()) / 2);
        const rng = createDeterministicRandom(
            character,
            midTime,
            weather && weather.type ? weather.type : 'sunny',
            (baseLocation || '') + '|extra'
        );
        if (rng() < 0.2) {
            const extraEntry = getCharacterActionAtTime(character, midTime, weather, baseLocation);
            extraEntry.isExtra = true;
            logs.push(extraEntry);
        }
    }
    return logs;
}

function generateCharacterLogs(character, context, mode) {
    if (mode === '24h') {
        return generateCharacterLogsRange(character, context, 24, 0, 1.5);
    }
    if (mode === '7d') {
        return generateCharacterLogsRange(character, context, 24 * 7, 0, 12);
    }
    return [];
}

function compressConsecutiveLogs(logs) {
    if (!Array.isArray(logs) || logs.length === 0) return [];
    const result = [];
    let last = null;
    for (let i = 0; i < logs.length; i++) {
        const entry = logs[i];
        if (
            last &&
            entry &&
            entry.title === last.title &&
            entry.detail === last.detail &&
            entry.location === last.location &&
            entry.moodClass === last.moodClass &&
            entry.moodText === last.moodText
        ) {
            continue;
        }
        result.push(entry);
        last = entry;
    }
    return result;
}

function getTimeOfDayForCharacter(date) {
    const hour = date.getHours();
    if (hour >= 23 || hour < 5) return 'night';
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
}

function hasThiefIdentity(character) {
    if (!character) return false;
    if (Array.isArray(character.identity)) {
        for (let i = 0; i < character.identity.length; i++) {
            const tag = character.identity[i];
            if (typeof tag === 'string' && (tag.indexOf('盗') !== -1 || tag.indexOf('贼') !== -1)) {
                return true;
            }
        }
    }
    const desc = character.description || '';
    if (desc.indexOf('盗圣') !== -1 || desc.indexOf('盗贼') !== -1) {
        return true;
    }
    return false;
}

function isConstableCharacter(character) {
    if (!character) return false;
    const occupations = character.occupation || '';
    if (occupations === '捕快' || occupations === '捕头') return true;
    if (Array.isArray(character.identity)) {
        for (let i = 0; i < character.identity.length; i++) {
            const tag = character.identity[i];
            if (typeof tag === 'string' && (tag.indexOf('捕头') !== -1 || tag.indexOf('捕快') !== -1)) {
                return true;
            }
        }
    }
    return false;
}

function createDeterministicRandom(character, time, weatherType, baseLocation) {
    const idPart = character && character.id ? character.id : 'unknown';
    let normalizedTime = null;
    if (time && typeof time.getFullYear === 'function') {
        normalizedTime = new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours());
    }
    const timePart = normalizedTime && typeof normalizedTime.toISOString === 'function' ? normalizedTime.toISOString() : '';
    const weatherPart = weatherType || '';
    const locPart = baseLocation || '';
    const seedStr = idPart + '|' + timePart + '|' + weatherPart + '|' + locPart;
    let h = 2166136261;
    for (let i = 0; i < seedStr.length; i++) {
        h ^= seedStr.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return function () {
        h += 0x6D2B79F5;
        let x = h;
        x ^= x >>> 15;
        x = Math.imul(x, 1 | x);
        x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
        x ^= x >>> 14;
        return (x >>> 0) / 4294967296;
    };
}

// --- Event System Helper Functions ---

function checkConditions(cond, character, timeOfDay, weatherType, baseLocation) {
    if (!cond) return true; // 无条件则默认满足
    
    // 1. Time of Day
    if (cond.timeOfDay) {
        const times = Array.isArray(cond.timeOfDay) ? cond.timeOfDay : [cond.timeOfDay];
        if (!times.includes(timeOfDay)) return false;
    }
    
    // 2. Weather
    if (cond.weather) {
        const weathers = Array.isArray(cond.weather) ? cond.weather : [cond.weather];
        if (!weathers.includes(weatherType)) return false;
    }
    
    // 3. Occupation
    if (cond.occupation) {
        const requiredOccs = Array.isArray(cond.occupation) ? cond.occupation : [cond.occupation];
        const charOcc = character.occupation || '';
        if (!requiredOccs.includes(charOcc)) return false;
    }
    
    // 4. Identity (Partial match)
    if (cond.identity) {
        const requiredIds = Array.isArray(cond.identity) ? cond.identity : [cond.identity];
        const charIds = character.identity || [];
        // Ensure charIds is an array
        const safeCharIds = Array.isArray(charIds) ? charIds : [charIds];
        const hasIdentity = requiredIds.some(req => {
             return safeCharIds.some(cid => typeof cid === 'string' && cid.includes(req));
        });
        if (!hasIdentity) return false;
    }

    // 5. Character ID
    if (cond.characterId) {
        const ids = Array.isArray(cond.characterId) ? cond.characterId : [cond.characterId];
        if (!ids.includes(character.id)) return false;
    }

    return true;
}

function evaluateJsonEvents(character, time, weather, baseLocation, actionPool) {
    // Combine global events and character-specific events
    const globalEvents = window.eventsData || [];
    const charEvents = character.events || [];
    const allEvents = globalEvents.concat(charEvents);
    
    if (!allEvents.length) return;

    const timeOfDay = getTimeOfDayForCharacter(time);
    const weatherType = weather && weather.type ? weather.type : 'sunny';
    
    allEvents.forEach(event => {
        if (!checkConditions(event.conditions, character, timeOfDay, weatherType, baseLocation)) {
            return;
        }
        
        // 解析模板变量
        let detail = event.detail || '';
        if (character.name) {
            detail = detail.replace(/{name}/g, character.name);
        }
        
        let title = event.title || '';
        if (character.name) {
            title = title.replace(/{name}/g, character.name);
        }

        actionPool.push({
            title: title,
            detail: detail,
            location: event.location || baseLocation,
            type: event.type || 'personal',
            baseWeight: event.baseWeight || 10,
            mood: event.mood // Optional custom mood object { class: '', text: '' }
        });
    });
}

function getCharacterActionAtTime(character, time, weather, realLocation) {
    const hour = time.getHours();
    const bigFive = character && character.personality && character.personality.bigFive ? character.personality.bigFive : {};
    const openness = typeof bigFive.openness === 'number' ? bigFive.openness : 60;
    const conscientiousness = typeof bigFive.conscientiousness === 'number' ? bigFive.conscientiousness : 60;
    const extraversion = typeof bigFive.extraversion === 'number' ? bigFive.extraversion : 60;
    const agreeableness = typeof bigFive.agreeableness === 'number' ? bigFive.agreeableness : 60;
    const neuroticism = typeof bigFive.neuroticism === 'number' ? bigFive.neuroticism : 60;
    const timeOfDay = getTimeOfDayForCharacter(time);
    const weatherType = weather && weather.type ? weather.type : 'sunny';
    const temp = weather && typeof weather.temp === 'number' ? weather.temp : 20;
    const feeling = getBodyFeeling(temp);
    const occupations = character && character.occupation ? character.occupation : '';
    const baseLocation = realLocation || '同福客栈';
    const actionPool = [];

    // --- NEW: Load events from JSON data ---
    evaluateJsonEvents(character, time, weather, baseLocation, actionPool);
    // ---------------------------------------

    const isConstable = isConstableCharacter(character);
    const rng = createDeterministicRandom(character, time, weatherType, baseLocation);
    const pushAction = function (config) {
        actionPool.push(config);
    };
    if (timeOfDay === 'night') {
        const isHardWorking = conscientiousness >= 70;
        if (isConstable) {
            let patrolLocation = '七侠镇街道';
            const patrolRand = rng();
            if (patrolRand < 0.4) {
                patrolLocation = '七侠镇街道';
            } else if (patrolRand < 0.75) {
                patrolLocation = '七侠镇衙门';
            } else {
                patrolLocation = '七侠镇监牢';
            }
            const patrolBaseWeight = isHardWorking ? 16 : 12;
            pushAction({
                title: '夜间巡逻',
                detail: character.name + ' 在' + patrolLocation + '来回巡查，注意着每一处动静，确认镇上是否平安无事。',
                location: patrolLocation,
                type: 'work',
                baseWeight: patrolBaseWeight
            });
            const sleepLocation = '七侠镇衙门值房';
            pushAction({
                title: '值房小憩',
                detail: character.name + ' 一整晚巡逻下来有些困乏，回到' + sleepLocation + '简单歇息，随时准备再被叫醒办案。',
                location: sleepLocation,
                type: 'rest',
                baseWeight: isHardWorking ? 4 : 8
            });
        } else {
            if (isHardWorking) {
                pushAction({
                    title: '深夜仍在忙碌',
                    detail: character.name + ' 还没睡，安静地整理一天的琐事，生怕落下什么细节。',
                    location: baseLocation + '后堂或房间',
                    type: 'work',
                    baseWeight: 10
                });
            }
            let sleepLocation = '卧房';
            if (character && character.id === 'bai-zhantang') {
                let anchor = new Date(time.getFullYear(), time.getMonth(), time.getDate(), 0);
                if (hour < 5) {
                    const prev = new Date(time.getTime() - 24 * 60 * 60 * 1000);
                    anchor = new Date(prev.getFullYear(), prev.getMonth(), prev.getDate(), 0);
                }
                const dailyRng = createDeterministicRandom(
                    character,
                    anchor,
                    weatherType,
                    (baseLocation || '') + '|sleep'
                );
                const v = dailyRng();
                sleepLocation = v < 0.8 ? '同福客栈大堂' : '佟湘玉的房间';
            }
            pushAction({
                title: '安稳入睡',
                detail: character.name + ' 已经躺下休息，偶尔还会在梦里继续白天未完的故事。',
                location: sleepLocation,
                type: 'rest',
                baseWeight: isHardWorking ? 6 : 12
            });
        }
    } else if (timeOfDay === 'morning') {
        if (occupations === '掌柜') {
            pushAction({
                title: '清晨理账',
                detail: character.name + ' 一大早就翻着账本，盘点昨日收支，谋划今天的生意。',
                location: '柜台',
                type: 'work',
                baseWeight: 12
            });
        } else if (occupations === '跑堂') {
            pushAction({
                title: '早早开门迎客',
                detail: character.name + ' 把门面打扫干净，顺手在门口和邻里打招呼。',
                location: '同福客栈门口',
                type: 'social',
                baseWeight: 12
            });
        } else if (occupations === '厨子') {
            pushAction({
                title: '备菜熬汤',
                detail: character.name + ' 在厨房里忙前忙后，洗菜、切菜、熬头锅汤，准备早餐。',
                location: '厨房',
                type: 'work',
                baseWeight: 12
            });
        } else if (occupations === '捕快') {
            pushAction({
                title: '清晨巡街',
                detail: character.name + ' 顺着街道慢慢走过，留意着夜里是否留下了什么蛛丝马迹。',
                location: '七侠镇街道',
                type: 'work',
                baseWeight: 12
            });
        }
        if (isConstable) {
            pushAction({
                title: '在衙门简单梳洗',
                detail: character.name + ' 在衙门值房简单洗漱收拾，整理好衣冠准备开始一天的公事。',
                location: '七侠镇衙门值房',
                type: 'personal',
                baseWeight: 8
            });
        } else {
            pushAction({
                title: '独自梳洗准备新的一天',
                detail: character.name + ' 慢悠悠地洗漱、更衣，在镜子前打量今天的自己。',
                location: '房间',
                type: 'personal',
                baseWeight: 8
            });
        }
    } else if (timeOfDay === 'afternoon') {
        if (occupations === '掌柜') {
            pushAction({
                title: '招呼客人算账',
                detail: character.name + ' 一边招呼客人，一边心算今日收入，精打细算不放过每一文钱。',
                location: '大堂与柜台之间',
                type: 'work',
                baseWeight: 14
            });
        } else if (occupations === '跑堂') {
            pushAction({
                title: '穿梭大堂端茶送水',
                detail: character.name + ' 脚下生风，忙着给每一桌添茶上菜，嘴上还不忘插科打诨活跃气氛。',
                location: '同福客栈大堂',
                type: 'social',
                baseWeight: 16
            });
        } else if (occupations === '厨子') {
            pushAction({
                title: '琢磨新菜式',
                detail: character.name + ' 对着案板发呆，忽然灵光一闪，开始尝试把平凡的食材做出新花样。',
                location: '厨房',
                type: 'creative',
                baseWeight: 14
            });
        } else if (occupations === '捕快') {
            pushAction({
                title: '街头打探消息',
                detail: character.name + ' 在街上与各路小贩闲聊，从只言片语中捕捉可能的线索。',
                location: '七侠镇街道',
                type: 'social',
                baseWeight: 14
            });
        } else if (character.id === 'l-xiucai') {
            pushAction({
                title: '伏案写稿',
                detail: character.name + ' 手握毛笔，对着纸面挠头，时不时得意地在纸上写下几行“惊世骇俗”的句子。',
                location: '柜台一角',
                type: 'creative',
                baseWeight: 16
            });
        } else if (character.id === 'mo-xiaobei') {
            pushAction({
                title: '满街跑着玩耍',
                detail: character.name + ' 一会儿追着风筝跑，一会儿又蹦回客栈嚷嚷要吃点心。',
                location: '街口与客栈之间',
                type: 'social',
                baseWeight: 16
            });
        }
        if (isConstable) {
            pushAction({
                title: '在衙门翻阅卷宗',
                detail: character.name + ' 在七侠镇衙门里翻看案卷，把最近的小案子梳理了一遍，生怕漏掉什么线索。',
                location: '七侠镇衙门',
                type: 'work',
                baseWeight: 12
            });
        } else {
            pushAction({
                title: '在角落里发呆消磨时光',
                detail: character.name + ' 找了个清静角落，一边听大家说话，一边默默打量来往的江湖客。',
                location: '客栈角落',
                type: 'personal',
                baseWeight: 10
            });
        }
    } else if (timeOfDay === 'evening') {
        if (isConstable) {
            pushAction({
                title: '来同福客栈吃晚饭',
                detail: character.name + ' 下班后来到同福客栈点了几道拿手菜，一边吃一边和大家聊起今天的案子。',
                location: '同福客栈大堂',
                type: 'social',
                baseWeight: 16
            });
        } else {
            pushAction({
                title: '与众人围桌闲聊',
                detail: character.name + ' 和熟悉的几个人围坐一桌，聊着今天发生的趣事，时不时传来一阵笑声。',
                location: '同福客栈大堂',
                type: 'social',
                baseWeight: 14
            });
        }
        if (occupations === '厨子') {
            pushAction({
                title: '收拾厨房顺手留点夜宵',
                detail: character.name + ' 一边刷锅洗碗，一边顺手给自己留了一点夜宵填肚子。',
                location: '厨房',
                type: 'work',
                baseWeight: 10
            });
        }
        if (isConstable) {
            pushAction({
                title: '饭后回衙门值班',
                detail: character.name + ' 在同福客栈吃完饭，又匆匆赶回七侠镇衙门，和值班的同僚交接情况，准备继续守夜。',
                location: '七侠镇衙门',
                type: 'work',
                baseWeight: 12
            });
        } else {
            pushAction({
                title: '独自在房间整理心情',
                detail: character.name + ' 推开窗户看了看夜色，心里把一天的事情过了一遍。',
                location: '房间',
                type: 'personal',
                baseWeight: 10
            });
        }
    }
    if (!actionPool.length) {
        pushAction({
            title: '随意消磨时光',
            detail: character.name + ' 在客栈里走走停停，时而帮忙搭把手，时而靠在柱子边出神。',
            location: baseLocation || '同福客栈',
            type: 'personal',
            baseWeight: 10
        });
    }
    const adjustWeight = function (item) {
        let weight = item.baseWeight;
        if (item.type === 'social') {
            weight *= extraversion >= 70 ? 1.6 : extraversion <= 40 ? 0.6 : 1;
        } else if (item.type === 'creative') {
            weight *= openness >= 75 ? 1.7 : openness <= 45 ? 0.7 : 1;
        } else if (item.type === 'work') {
            weight *= conscientiousness >= 70 ? 1.5 : conscientiousness <= 40 ? 0.7 : 1;
        } else if (item.type === 'rest') {
            weight *= neuroticism >= 70 ? 1.4 : 1;
        }
        if (weatherType === 'rainy' || weatherType === 'snowy') {
            if (item.location.indexOf('街') !== -1 || item.location.indexOf('户外') !== -1) {
                weight *= 0.4;
            }
            if (item.location.indexOf('大堂') !== -1 || item.location.indexOf('房') !== -1 || item.location.indexOf('客栈') !== -1) {
                weight *= 1.3;
            }
        } else if (weatherType === 'sunny') {
            if (item.location.indexOf('街') !== -1 || item.location.indexOf('门口') !== -1) {
                weight *= 1.3;
            }
        }
        return weight;
    };
    let totalWeight = 0;
    const weighted = actionPool.map(function (item) {
        const w = adjustWeight(item);
        totalWeight += w;
        return { item: item, weight: w };
    });
    let r = rng() * totalWeight;
    let selected = weighted[0].item;
    for (let i = 0; i < weighted.length; i++) {
        r -= weighted[i].weight;
        if (r <= 0) {
            selected = weighted[i].item;
            break;
        }
    }
    let moodClass = 'mood-calm';
    let moodText = '平静';
    if (weatherType === 'rainy' || weatherType === 'snowy') {
        if (selected.location.indexOf('街') !== -1) {
            selected.location = '同福客栈大堂';
            selected.title = '躲雨闲聊';
            selected.detail = '外头' + (weather ? weather.desc : '') + '，' + feeling + '，大家只好缩在客栈里喝茶聊天。';
        }
        moodClass = neuroticism >= 70 ? 'mood-sad' : 'mood-calm';
        moodText = neuroticism >= 70 ? '有点闷' : '心情平稳';
    } else if (weatherType === 'sunny') {
        moodClass = extraversion >= 65 ? 'mood-happy' : 'mood-calm';
        moodText = extraversion >= 65 ? '心情很好' : '心情不错';
    } else if (weatherType === 'cloudy') {
        moodClass = 'mood-calm';
        moodText = '波澜不惊';
    }
    if (openness >= 80 && selected.type === 'creative') {
        moodClass = 'mood-happy';
        moodText = '灵感涌现';
    }
    const identityResult = applyIdentityAndSpecialEvents({
        character,
        time,
        timeOfDay,
        baseLocation,
        weather,
        weatherType,
        rng,
        selected,
        moodClass,
        moodText
    });
    const finalSelected = identityResult.selected;
    const finalMoodClass = identityResult.moodClass;
    const finalMoodText = identityResult.moodText;
    const timeLabel = getMingDateStr(time) + ' ' + getShichenWithKe(time);
    return {
        timeLabel: timeLabel,
        timestamp: time.getTime(),
        title: finalSelected.title,
        detail: finalSelected.detail,
        location: finalSelected.location,
        moodClass: finalMoodClass,
        moodText: finalMoodText
    };
}

function applyIdentityAndSpecialEvents(options) {
    const character = options.character;
    const time = options.time;
    const timeOfDay = options.timeOfDay;
    const baseLocation = options.baseLocation;
    const weather = options.weather;
    const weatherType = options.weatherType;
    const rng = options.rng;
    const identity = Array.isArray(character && character.identity) ? character.identity : [];
    let selected = options.selected;
    let moodClass = options.moodClass;
    let moodText = options.moodText;

    if (hasThiefIdentity(character)) {
        const visitHour = time.getHours();
        if (visitHour >= 8 && visitHour <= 22 && rng() < 0.18) {
            const fromLiuShanMen = rng() < 0.5;
            const visitor = fromLiuShanMen ? '六扇门的人' : '县衙差役';
            const eventLocation = selected.location || baseLocation || '同福客栈大堂';
            selected.title = visitor + '来到' + eventLocation + '查问';
            selected.detail = visitor + '出现在' + eventLocation + '，' + character.name + ' 下意识缩了缩脖子，生怕过往旧事被认出来。';
            selected.location = eventLocation;
            moodClass = 'mood-sad';
            moodText = '心惊胆战';
        }
    }
    if (identity.indexOf('女侠') !== -1 || identity.indexOf('关中大侠') !== -1) {
        if (rng() < 0.16) {
            const eventLocation = selected.location || baseLocation || '客栈附近街道';
            selected.title = '路见不平拔刀相助';
            selected.detail = character.name + ' 路过' + eventLocation + '时听到争执声，下意识停下脚步，看清情况后出手相助，把麻烦平和地化解掉。';
            selected.location = eventLocation;
            moodClass = 'mood-happy';
            moodText = '正气上头';
        }
    } else if (identity.indexOf('掌柜') !== -1) {
        if (rng() < 0.14) {
            const eventLocation = selected.location || '柜台';
            selected.title = '发现账目对不上';
            selected.detail = character.name + ' 在' + eventLocation + '翻账本时突然发现几处对不上，只好一边嘀咕一边把全客栈今天的流水又重新过了一遍。';
            selected.location = eventLocation;
            moodClass = 'mood-sad';
            moodText = '略显焦虑';
        }
    } else if (identity.indexOf('厨子') !== -1) {
        if (rng() < 0.16) {
            const eventLocation = '厨房';
            selected.title = '即兴研发新菜';
            selected.detail = character.name + ' 在' + eventLocation + '里看着剩下的食材，忽然心血来潮，决定随手拼一盘“今日限定”，边做边想象客人会不会买账。';
            selected.location = eventLocation;
            moodClass = 'mood-happy';
            moodText = '小小得意';
        }
    } else if (identity.indexOf('衡山掌门') !== -1 || identity.indexOf('五岳盟主') !== -1) {
        if (rng() < 0.18) {
            const eventLocation = selected.location || '客栈二楼走廊';
            selected.title = '被长辈突然点名训话';
            selected.detail = character.name + ' 正在' + eventLocation + '闲逛时，被人叫住，提醒她身为掌门要有掌门的样子，只好一边点头一边偷偷想着下一串糖葫芦。';
            selected.location = eventLocation;
            moodClass = 'mood-calm';
            moodText = '嘴上乖巧';
        }
    } else if (identity.indexOf('捕头') !== -1 || identity.indexOf('女捕快') !== -1) {
        if (rng() < 0.16) {
            const eventLocation = selected.location || '七侠镇街道';
            selected.title = '临时被叫去问话';
            selected.detail = character.name + ' 刚想歇一会儿，就被人喊去' + eventLocation + '，说是有点小案子要打听情况，只好一边犯嘀咕一边跟着去了。';
            selected.location = eventLocation;
            moodClass = 'mood-calm';
            moodText = '公事缠身';
        }
    }
    if (identity.indexOf('夜猫子') !== -1) {
        if (timeOfDay === 'night' && rng() < 0.18) {
            const eventLocation = selected.location || baseLocation || '同福客栈大堂';
            const isRest = selected.type === 'rest' || (selected.title && selected.title.indexOf('睡') !== -1) || (selected.detail && selected.detail.indexOf('睡') !== -1);
            if (isRest) {
                selected.title = '从梦中惊醒';
                selected.detail = character.name + ' 在' + eventLocation + '睡到一半突然从梦中惊醒，心口还在怦怦直跳，好一会儿才缓过神来。';
                selected.location = eventLocation;
                moodClass = 'mood-sad';
                moodText = '被梦惊醒';
            } else {
                selected.title = '又熬夜不肯睡';
                selected.detail = character.name + ' 在' + eventLocation + '明明已经困得眼睛都睁不开了，却还是不肯睡，嘴上还说自己“精神着呢”。';
                selected.location = eventLocation;
                moodClass = 'mood-sad';
                moodText = '有点透支';
            }
        }
    }
    if (identity.indexOf('爱财如命') !== -1) {
        if ((timeOfDay === 'afternoon' || timeOfDay === 'evening') && rng() < 0.17) {
            let eventLocation = selected.location || '柜台';
            if (character && character.id === 'qian-furen') {
                eventLocation = '怡红楼钱庄柜台';
            } else if (character && character.id === 'qian-zhanggui') {
                eventLocation = '怡红楼当铺柜台';
            } else if (character && character.id === 'tong-xiangyu') {
                eventLocation = '同福客栈柜台';
            }
            selected.title = '为几文银子纠结半天';
            selected.detail = character.name + ' 在' + eventLocation + '盯着账本和算盘，一笔一笔算来算去，就为确认多出来的几文到底该不该退给客人。';
            selected.location = eventLocation;
            moodClass = 'mood-calm';
            moodText = '小算盘打得响';
        }
    }
    if (identity.indexOf('情场受挫') !== -1) {
        if ((timeOfDay === 'evening' || timeOfDay === 'night') && rng() < 0.15) {
            const eventLocation = selected.location || baseLocation || '同福客栈角落';
            selected.title = '又想起过往情事';
            selected.detail = character.name + ' 坐在' + eventLocation + '发呆时，被某句无心的话勾起旧事，只好假装若无其事地换了个话题。';
            selected.location = eventLocation;
            moodClass = 'mood-sad';
            moodText = '心里有点酸';
        }
    }
    if (character && character.id === 'guo-furong') {
        if (rng() < 0.12) {
            const eventLocation = selected.location || '同福客栈大堂';
            selected.title = '一时冲动又砸了桌子';
            selected.detail = character.name + ' 在' + eventLocation + '越说越气，没忍住又一拳拍在桌子上，把旁边的人都吓了一跳，只好尴尬地收回手。';
            selected.location = eventLocation;
            moodClass = 'mood-angry';
            moodText = '火气上头';
        }
    } else if (character && character.id === 'l-xiucai') {
        if (rng() < 0.12) {
            const eventLocation = selected.location || '同福客栈大堂';
            selected.title = '关中大侠往事被人翻出来';
            selected.detail = character.name + ' 正在' + eventLocation + '给人讲自己的“关中大侠”经历，结果旁边的人忍不住补充了几个黑历史细节，他的笑容逐渐有些僵硬。';
            selected.location = eventLocation;
            moodClass = 'mood-sad';
            moodText = '有点下不来台';
        }
    } else if (character && character.id === 'l-dazui') {
        if (rng() < 0.13) {
            const eventLocation = '厨房';
            selected.title = '玄铁菜刀差点砍到自己';
            selected.detail = character.name + ' 在' + eventLocation + '里挥舞玄铁菜刀摆造型，不小心脚下一滑，差点把案板砍缺一角，吓得他连忙把菜刀抱在怀里喊“祖宗饶命”。';
            selected.location = eventLocation;
            moodClass = 'mood-sad';
            moodText = '虚惊一场';
        }
    } else if (character && character.id === 'mo-xiaobei') {
        if (rng() < 0.14) {
            const eventLocation = selected.location || '同福客栈门口';
            selected.title = '因为糖葫芦和人讨价还价';
            selected.detail = character.name + ' 在' + eventLocation + '盯着糖葫芦不肯走，和小贩为了多送一串争论半天，最后被长辈拎着衣领拖回客栈。';
            selected.location = eventLocation;
            moodClass = 'mood-happy';
            moodText = '嘴上不服';
        }
    } else if (character && character.id === 'yan-xiaoliu') {
        if (rng() < 0.14) {
            const eventLocation = selected.location || '七侠镇街口';
            selected.title = '练刀时把旗杆砍歪了';
            selected.detail = character.name + ' 在' + eventLocation + '热血上头练刀，一刀下去把旁边的旗杆砍得歪歪斜斜，只好赶紧把刀往后一藏，装作什么都没发生。';
            selected.location = eventLocation;
            moodClass = 'mood-sad';
            moodText = '有点心虚';
        }
    } else if (character && character.id === 'zhu-wushuang') {
        if (rng() < 0.13) {
            const eventLocation = selected.location || '同福客栈二楼走廊';
            selected.title = '又被人提起师兄往事';
            selected.detail = character.name + ' 走在' + eventLocation + '时听到有人随口提到“盗圣”两个字，脚步明显一顿，只好假装若无其事地继续往前走。';
            selected.location = eventLocation;
            moodClass = 'mood-sad';
            moodText = '心里酸酸的';
        }
    } else if (character && character.id === 'qian-furen') {
        if (rng() < 0.14) {
            const eventLocation = '怡红楼钱庄';
            selected.title = '在钱庄盘点银票';
            selected.detail = character.name + ' 在' + eventLocation + '里反复清点银票和账本，生怕漏掉一文钱，还时不时让钱掌柜再核对一遍。';
            selected.location = eventLocation;
            moodClass = 'mood-happy';
            moodText = '数钱很满足';
        }
    } else if (character && character.id === 'qian-zhanggui') {
        if (rng() < 0.13) {
            const eventLocation = '怡红楼当铺柜台';
            selected.title = '在当铺里小心接客';
            selected.detail = character.name + ' 缩在' + eventLocation + '后面接待上门典当的客人，遇上难决断的就赶紧去请示夫人。';
            selected.location = eventLocation;
            moodClass = 'mood-calm';
            moodText = '小心翼翼';
        }
    }

    if (character && (character.id === 'qian-furen' || character.id === 'qian-zhanggui')) {
        const currentLocation = selected.location || '';
        if (currentLocation.indexOf('客栈') !== -1 && currentLocation.indexOf('怡红楼') === -1) {
            const relocateRand = rng();
            if (relocateRand < 0.7) {
                if (character.id === 'qian-furen') {
                    selected.location = '怡红楼钱庄';
                } else {
                    selected.location = '怡红楼当铺';
                }
            }
        }
    }

    return {
        selected,
        moodClass,
        moodText
    };
}


function setActiveRelationshipFilterButton(type) {
    const buttons = document.querySelectorAll('.filter-btn');
    if (!buttons || !buttons.length) return;
    buttons.forEach(btn => {
        btn.classList.remove('active');
        const text = btn.textContent || '';
        if (type === 'all' && text.indexOf('显示全部') !== -1) btn.classList.add('active');
        if (type === 'love' && text.indexOf('爱情关系') !== -1) btn.classList.add('active');
        if (type === 'friendship' && text.indexOf('朋友关系') !== -1) btn.classList.add('active');
        if (type === 'family' && text.indexOf('亲情关系') !== -1) btn.classList.add('active');
        if (type === 'enemy' && text.indexOf('敌对关系') !== -1) btn.classList.add('active');
        if (type === 'sect' && text.indexOf('师门关系') !== -1) btn.classList.add('active');
    });
}

function filterRelationships(type) {
    relationsFilterType = type || 'all';
    setActiveRelationshipFilterButton(relationsFilterType);
    refreshRelationsChart();
}

function resetZoom() {
    if (!relationsChart) return;
    relationsFocusedNodeId = null;
    relationsChart.dispatchAction({
        type: 'restore'
    });
}

function toggleLayout() {
    relationsLayout = relationsLayout === 'force' ? 'grid' : 'force';
    refreshRelationsChart();
}

function loadRelationsData() {
    updateRelationsStats();
}

function getRelationsVisualSnapshot() {
    const degrees = [];
    relationsNodes.forEach(node => {
        const neighbors = relationsNeighborMap.get(node.id);
        degrees.push(neighbors ? neighbors.size : 0);
    });
    const nodeCount = relationsNodes.length;
    const linkCount = relationsLinks.length;
    const maxDegree = degrees.length ? Math.max.apply(null, degrees) : 0;
    const minDegree = degrees.length ? Math.min.apply(null, degrees) : 0;
    const sumDegree = degrees.reduce((sum, d) => sum + d, 0);
    const avgDegree = degrees.length ? sumDegree / degrees.length : 0;
    return {
        layout: relationsLayout,
        filterType: relationsFilterType,
        nodeCount: nodeCount,
        linkCount: linkCount,
        degree: {
            max: maxDegree,
            min: minDegree,
            avg: avgDegree
        }
    };
}

function runRelationsVisualizationTests() {
    const results = [];
    const hasNodes = relationsNodes.length > 0;
    const hasLinks = relationsLinks.length > 0;
    const edgeWidthRule = relationsLinks.every(link => {
        if (!link.lineStyle) return false;
        return link.lineStyle.width === link.value / 25;
    });
    const neighborConsistency = relationsLinks.every(link => {
        const from = relationsNeighborMap.get(link.source);
        const to = relationsNeighborMap.get(link.target);
        return from && to && from.has(link.target) && to.has(link.source);
    });
    results.push({ name: 'nodes-exist', passed: hasNodes });
    results.push({ name: 'links-exist', passed: hasLinks });
    results.push({ name: 'edge-width-strength-rule', passed: edgeWidthRule });
    results.push({ name: 'neighbor-map-consistency', passed: neighborConsistency });
    if (console && console.table) {
        console.table(results);
    } else {
        console.log(results);
    }
    return results;
}

if (typeof window !== 'undefined') {
    window.initIndexPage = initIndexPage;
    window.initCharacterPage = initCharacterPage;
    window.loadCharacterData = loadCharacterData;
    window.initRelationsPage = initRelationsPage;
    window.loadRelationsData = loadRelationsData;
    window.initActivitiesPage = initActivitiesPage;
    window.loadActivitiesData = loadActivitiesData;
    window.filterRelationships = filterRelationships;
    window.resetZoom = resetZoom;
    window.toggleLayout = toggleLayout;
    window.getRelationsVisualSnapshot = getRelationsVisualSnapshot;
    window.runRelationsVisualizationTests = runRelationsVisualizationTests;

}

// Helper: 获取关系类型文本
function getRelationshipText(type) {
    const map = {
        'love': '恋人',
        'family': '亲人',
        'friendship': '朋友',
        'enemy': '死对头',
        'love_rival': '情敌',
        'mentorship': '师徒',
        'pursuer': '追求者',
        'same_sect': '同门'
    };
    return map[type] || type;
}

// Helper: 获取分类颜色
function getCategoryColor(type) {
    const map = {
        'love': '#ef4444',
        'family': '#22c55e',
        'friendship': '#eab308',
        'enemy': '#a855f7',
        'love_rival': '#ec4899',
        'mentorship': '#0ea5e9',
        'pursuer': '#f97316',
        'same_sect': '#14b8a6'
    };
    return map[type] || '#9ca3af';
}

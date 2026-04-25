// 武器数据
const weapons = [
    {
        id: 'm4a1',
        name: 'M4A1',
        category: '突击步枪',
        baseStats: {
            damage: 70,
            fireRate: 85,
            hipFire: 65,
            accuracy: 75,
            control: 70,
            mobility: 60
        },
        slots: ['muzzle', 'barrel', 'optic', 'underbarrel', 'magazine', 'stock'],
        color: '#64c8ff'
    },
    {
        id: 'ak47',
        name: 'AK-47',
        category: '突击步枪',
        baseStats: {
            damage: 85,
            fireRate: 70,
            hipFire: 60,
            accuracy: 65,
            control: 55,
            mobility: 55
        },
        slots: ['muzzle', 'barrel', 'optic', 'underbarrel', 'magazine', 'stock'],
        color: '#ff8c64'
    },
    {
        id: 'mp5',
        name: 'MP5',
        category: '冲锋枪',
        baseStats: {
            damage: 55,
            fireRate: 90,
            hipFire: 80,
            accuracy: 70,
            control: 75,
            mobility: 85
        },
        slots: ['muzzle', 'barrel', 'optic', 'underbarrel', 'magazine', 'stock'],
        color: '#64ff8c'
    },
    {
        id: 'sniper',
        name: 'SP-R 208',
        category: '狙击步枪',
        baseStats: {
            damage: 95,
            fireRate: 40,
            hipFire: 30,
            accuracy: 95,
            control: 50,
            mobility: 40
        },
        slots: ['muzzle', 'barrel', 'optic', 'magazine', 'stock'],
        color: '#ff64c8'
    }
];

// 配件数据
const attachments = {
    muzzle: [
        { id: 'none', name: '无配件', stats: {}, icon: 'none' },
        { id: 'muzzle_silencer', name: '消音器', stats: { accuracy: 5, mobility: -3 }, icon: 'muzzle' },
        { id: 'muzzle_compensator', name: '枪口补偿器', stats: { control: 10, accuracy: -5 }, icon: 'muzzle' },
        { id: 'muzzle_flash', name: '消焰器', stats: { control: 5, hipFire: 5 }, icon: 'muzzle' }
    ],
    barrel: [
        { id: 'none', name: '无配件', stats: {}, icon: 'none' },
        { id: 'barrel_long', name: '长枪管', stats: { damage: 5, accuracy: 10, mobility: -10 }, icon: 'barrel' },
        { id: 'barrel_short', name: '短枪管', stats: { mobility: 10, accuracy: -5, hipFire: 5 }, icon: 'barrel' },
        { id: 'barrel_heavy', name: '重型枪管', stats: { control: 8, accuracy: 5, mobility: -5 }, icon: 'barrel' }
    ],
    optic: [
        { id: 'none', name: '无配件', stats: {}, icon: 'none' },
        { id: 'optic_reddot', name: '红点瞄准镜', stats: { accuracy: 5, hipFire: -3 }, icon: 'optic' },
        { id: 'optic_3x', name: '3倍镜', stats: { accuracy: 10, mobility: -5 }, icon: 'optic' },
        { id: 'optic_holo', name: '全息瞄准镜', stats: { accuracy: 8, hipFire: -2 }, icon: 'optic' }
    ],
    underbarrel: [
        { id: 'none', name: '无配件', stats: {}, icon: 'none' },
        { id: 'grip_vertical', name: '垂直握把', stats: { control: 10, hipFire: 5, mobility: -3 }, icon: 'underbarrel' },
        { id: 'grip_angle', name: '斜角握把', stats: { control: 5, accuracy: 5, hipFire: 5 }, icon: 'underbarrel' },
        { id: 'foregrip', name: '前握把', stats: { control: 8, accuracy: 3 }, icon: 'underbarrel' }
    ],
    magazine: [
        { id: 'none', name: '无配件', stats: {}, icon: 'none' },
        { id: 'mag_extended', name: '扩容弹匣', stats: { mobility: -5 }, icon: 'magazine' },
        { id: 'mag_fast', name: '快速弹匣', stats: { mobility: 5, hipFire: 3 }, icon: 'magazine' },
        { id: 'mag_dual', name: '双弹匣', stats: { mobility: 8, hipFire: 5 }, icon: 'magazine' }
    ],
    stock: [
        { id: 'none', name: '无配件', stats: {}, icon: 'none' },
        { id: 'stock_heavy', name: '重型枪托', stats: { control: 15, mobility: -10 }, icon: 'stock' },
        { id: 'stock_light', name: '轻型枪托', stats: { mobility: 10, control: -5 }, icon: 'stock' },
        { id: 'stock_tactical', name: '战术枪托', stats: { control: 8, mobility: 3 }, icon: 'stock' }
    ]
};

// 槽位名称映射
const slotNames = {
    muzzle: '枪口',
    barrel: '枪管',
    optic: '瞄具',
    underbarrel: '下挂',
    magazine: '弹匣',
    stock: '枪托'
};

// 当前状态
let currentWeapon = null;
let currentAttachments = {};
let originalStats = {};

// 页面元素
const weaponSelectionPage = document.getElementById('weapon-selection');
const gunsmithPage = document.getElementById('gunsmith-page');
const weaponGrid = document.getElementById('weaponGrid');
const gunDisplay = document.getElementById('gunDisplay');
const attachmentSlots = document.getElementById('attachmentSlots');
const modal = document.getElementById('attachmentModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

let currentEditingSlot = null;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderWeaponGrid();
    setupEventListeners();
});

// 渲染武器选择网格
function renderWeaponGrid() {
    weaponGrid.innerHTML = '';
    
    weapons.forEach(weapon => {
        const card = document.createElement('div');
        card.className = 'weapon-card';
        card.innerHTML = `
            <div class="weapon-card-image">
                ${getWeaponSVG(weapon.id)}
            </div>
            <div class="weapon-card-info">
                <h3>${weapon.name}</h3>
                <span>${weapon.category}</span>
            </div>
        `;
        card.addEventListener('click', () => selectWeapon(weapon));
        weaponGrid.appendChild(card);
    });
}

// 获取武器SVG
function getWeaponSVG(weaponId) {
    const svgs = {
        m4a1: `<svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="50" y="40" width="300" height="20" fill="#4a4a6a" rx="2"/>
            <rect x="60" y="35" width="80" height="10" fill="#3a3a5a" rx="1"/>
            <rect x="340" y="30" width="40" height="40" fill="#5a5a7a" rx="3"/>
            <rect x="150" y="60" width="25" height="30" fill="#64c8ff" rx="2"/>
            <rect x="20" y="45" width="40" height="10" fill="#3a3a5a" rx="1"/>
            <rect x="250" y="35" width="40" height="8" fill="#5a5a7a" rx="1"/>
            <rect x="280" y="32" width="20" height="15" fill="#64c8ff" rx="1"/>
        </svg>`,
        ak47: `<svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="60" y="40" width="280" height="25" fill="#5a4a4a" rx="2"/>
            <rect x="70" y="30" width="70" height="15" fill="#4a3a3a" rx="1"/>
            <rect x="330" y="25" width="50" height="50" fill="#6a5a5a" rx="3"/>
            <rect x="140" y="65" width="30" height="25" fill="#ff8c64" rx="2"/>
            <rect x="20" y="48" width="50" height="12" fill="#4a3a3a" rx="1"/>
            <rect x="240" y="38" width="35" height="8" fill="#6a5a5a" rx="1"/>
            <rect x="270" y="30" width="25" height="20" fill="#ff8c64" rx="1"/>
            <path d="M180 65 Q200 85 220 65" stroke="#ff8c64" stroke-width="8" fill="none"/>
        </svg>`,
        mp5: `<svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="80" y="40" width="220" height="20" fill="#4a6a4a" rx="2"/>
            <rect x="90" y="35" width="60" height="10" fill="#3a5a3a" rx="1"/>
            <rect x="290" y="35" width="40" height="30" fill="#5a7a5a" rx="2"/>
            <rect x="150" y="60" width="20" height="25" fill="#64ff8c" rx="2"/>
            <rect x="30" y="45" width="60" height="10" fill="#3a5a3a" rx="1"/>
            <rect x="220" y="38" width="30" height="6" fill="#5a7a5a" rx="1"/>
            <path d="M190 60 L210 80 L250 80 L270 60" stroke="#64ff8c" stroke-width="6" fill="none"/>
        </svg>`,
        sniper: `<svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="60" y="40" width="300" height="18" fill="#6a4a6a" rx="2"/>
            <rect x="180" y="15" width="120" height="25" fill="#5a3a5a" rx="2"/>
            <rect x="190" y="20" width="100" height="8" fill="#ff64c8" rx="1"/>
            <rect x="350" y="20" width="40" height="58" fill="#7a5a7a" rx="3"/>
            <rect x="120" y="58" width="25" height="30" fill="#ff64c8" rx="2"/>
            <rect x="20" y="45" width="50" height="10" fill="#5a3a5a" rx="1"/>
            <rect x="280" y="38" width="40" height="6" fill="#7a5a7a" rx="1"/>
        </svg>`
    };
    return svgs[weaponId] || svgs.m4a1;
}

// 选择武器
function selectWeapon(weapon) {
    currentWeapon = weapon;
    currentAttachments = {};
    originalStats = { ...weapon.baseStats };
    
    weapon.slots.forEach(slot => {
        currentAttachments[slot] = attachments[slot][0];
    });
    
    showPage('gunsmith');
    renderGunsmith();
}

// 显示页面
function showPage(page) {
    weaponSelectionPage.classList.remove('active');
    gunsmithPage.classList.remove('active');
    
    if (page === 'selection') {
        weaponSelectionPage.classList.add('active');
    } else {
        gunsmithPage.classList.add('active');
    }
}

// 渲染枪匠界面
function renderGunsmith() {
    if (!currentWeapon) return;
    
    // 更新武器信息
    document.getElementById('currentWeaponName').textContent = currentWeapon.name;
    document.querySelector('.weapon-category').textContent = currentWeapon.category;
    
    // 渲染枪械显示
    renderGunDisplay();
    
    // 渲染配件槽
    renderAttachmentSlots();
    
    // 更新属性
    updateStats();
}

// 渲染枪械显示
function renderGunDisplay() {
    gunDisplay.innerHTML = getWeaponSVG(currentWeapon.id);
}

// 渲染配件槽
function renderAttachmentSlots() {
    attachmentSlots.innerHTML = '';
    
    const slotPositions = getSlotPositions();
    
    currentWeapon.slots.forEach((slot, index) => {
        const position = slotPositions[slot];
        if (!position) return;
        
        const slotContainer = document.createElement('div');
        slotContainer.className = 'slot-container';
        slotContainer.style.left = position.x + '%';
        slotContainer.style.top = position.y + '%';
        slotContainer.style.transform = 'translate(-50%, -50%)';
        
        const hasAttachment = currentAttachments[slot] && currentAttachments[slot].id !== 'none';
        
        slotContainer.innerHTML = `
            <div class="slot-box ${hasAttachment ? 'has-attachment' : ''}" data-slot="${slot}">
                ${getSlotIcon(slot)}
            </div>
            <span class="slot-label">${slotNames[slot]}</span>
        `;
        
        const slotBox = slotContainer.querySelector('.slot-box');
        slotBox.addEventListener('click', () => openAttachmentModal(slot));
        
        attachmentSlots.appendChild(slotContainer);
    });
}

// 获取槽位位置（百分比）
function getSlotPositions() {
    return {
        muzzle: { x: 8, y: 50 },
        barrel: { x: 25, y: 30 },
        optic: { x: 50, y: 20 },
        underbarrel: { x: 40, y: 75 },
        magazine: { x: 55, y: 80 },
        stock: { x: 92, y: 50 }
    };
}

// 获取槽位图标
function getSlotIcon(slotType) {
    const icons = {
        muzzle: `<svg viewBox="0 0 24 24" fill="none" stroke="#64c8ff" stroke-width="2"><rect x="2" y="8" width="20" height="8" rx="1"/></svg>`,
        barrel: `<svg viewBox="0 0 24 24" fill="none" stroke="#64c8ff" stroke-width="2"><rect x="4" y="10" width="16" height="4" rx="1"/></svg>`,
        optic: `<svg viewBox="0 0 24 24" fill="none" stroke="#64c8ff" stroke-width="2"><circle cx="12" cy="12" r="6"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/></svg>`,
        underbarrel: `<svg viewBox="0 0 24 24" fill="none" stroke="#64c8ff" stroke-width="2"><path d="M6 8v8M18 8v8M6 16h12"/></svg>`,
        magazine: `<svg viewBox="0 0 24 24" fill="none" stroke="#64c8ff" stroke-width="2"><rect x="8" y="6" width="8" height="12" rx="1"/></svg>`,
        stock: `<svg viewBox="0 0 24 24" fill="none" stroke="#64c8ff" stroke-width="2"><rect x="4" y="8" width="16" height="8" rx="2"/></svg>`
    };
    return icons[slotType] || '';
}

// 打开配件选择弹窗
function openAttachmentModal(slot) {
    currentEditingSlot = slot;
    modalTitle.textContent = `选择${slotNames[slot]}`;
    
    modalBody.innerHTML = '';
    
    // 添加"无配件"选项
    const noneOption = createAttachmentOption(attachments[slot][0], true);
    modalBody.appendChild(noneOption);
    
    // 添加其他配件选项
    attachments[slot].slice(1).forEach(attachment => {
        const option = createAttachmentOption(attachment, false);
        modalBody.appendChild(option);
    });
    
    modal.classList.add('active');
}

// 创建配件选项
function createAttachmentOption(attachment, isNone) {
    const option = document.createElement('div');
    option.className = isNone ? 'attachment-none' : 'attachment-option';
    
    if (currentAttachments[currentEditingSlot] && 
        currentAttachments[currentEditingSlot].id === attachment.id) {
        option.classList.add('selected');
    }
    
    let statsHTML = '';
    Object.entries(attachment.stats).forEach(([stat, value]) => {
        const isPositive = value > 0;
        const statName = getStatName(stat);
        statsHTML += `<span class="attachment-stat ${isPositive ? 'positive' : 'negative'}">${statName} ${isPositive ? '+' : ''}${value}</span>`;
    });
    
    option.innerHTML = `
        <div class="attachment-icon">
            ${isNone ? `<svg viewBox="0 0 24 24" fill="none" stroke="#64c8ff" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>` : getSlotIcon(currentEditingSlot)}
        </div>
        <div class="attachment-info">
            <h4>${attachment.name}</h4>
            ${statsHTML ? `<div class="attachment-stats">${statsHTML}</div>` : ''}
        </div>
    `;
    
    option.addEventListener('click', () => selectAttachment(attachment));
    
    return option;
}

// 获取属性名称
function getStatName(statKey) {
    const names = {
        damage: '伤害',
        fireRate: '射速',
        hipFire: '腰射',
        accuracy: '精准',
        control: '控制',
        mobility: '机动'
    };
    return names[statKey] || statKey;
}

// 选择配件
function selectAttachment(attachment) {
    currentAttachments[currentEditingSlot] = attachment;
    
    modal.classList.remove('active');
    renderAttachmentSlots();
    updateStats();
}

// 更新属性显示
function updateStats() {
    // 计算当前属性
    const currentStats = calculateCurrentStats();
    
    // 更新每个属性
    Object.keys(originalStats).forEach(stat => {
        const baseValue = originalStats[stat];
        const currentValue = currentStats[stat];
        const change = currentValue - baseValue;
        
        // 更新基础值条
        const baseBarFill = document.querySelector(`#stat-${stat}-base .stat-bar-fill`);
        if (baseBarFill) {
            baseBarFill.style.width = `${baseValue}%`;
        }
        
        // 更新基础值显示
        const valueElement = document.getElementById(`stat-${stat}-value`);
        if (valueElement) {
            valueElement.textContent = baseValue;
        }
        
        // 更新变化条
        const changeBar = document.getElementById(`stat-${stat}-change`);
        if (changeBar) {
            if (change !== 0) {
                const changePercent = Math.abs(change);
                const basePercent = baseValue;
                
                if (change > 0) {
                    // 增加：在基础值右边延伸
                    changeBar.style.left = `${basePercent}%`;
                    changeBar.style.width = `${changePercent}%`;
                    changeBar.style.right = 'auto';
                    changeBar.className = 'stat-bar-change positive';
                } else {
                    // 减少：从基础值左边延伸（实际是覆盖基础值的一部分）
                    // 为了视觉效果，我们在基础值条上方显示减少的部分
                    changeBar.style.left = `${basePercent - changePercent}%`;
                    changeBar.style.width = `${changePercent}%`;
                    changeBar.style.right = 'auto';
                    changeBar.className = 'stat-bar-change negative';
                }
            } else {
                changeBar.style.width = '0%';
                changeBar.className = 'stat-bar-change';
            }
        }
        
        // 更新变化值显示
        const changeElement = document.getElementById(`stat-${stat}-change-value`);
        if (changeElement) {
            if (change !== 0) {
                const sign = change > 0 ? '+' : '';
                changeElement.textContent = `(${sign}${change})`;
                changeElement.className = `stat-change ${change > 0 ? 'positive' : 'negative'}`;
            } else {
                changeElement.textContent = '';
                changeElement.className = 'stat-change';
            }
        }
    });
}

// 计算当前属性
function calculateCurrentStats() {
    const stats = { ...originalStats };
    
    Object.values(currentAttachments).forEach(attachment => {
        if (attachment && attachment.stats) {
            Object.entries(attachment.stats).forEach(([stat, value]) => {
                if (stats[stat] !== undefined) {
                    stats[stat] = Math.max(0, Math.min(100, stats[stat] + value));
                }
            });
        }
    });
    
    return stats;
}

// 重置配置
function resetConfiguration() {
    if (!currentWeapon) return;
    
    currentWeapon.slots.forEach(slot => {
        currentAttachments[slot] = attachments[slot][0];
    });
    
    renderAttachmentSlots();
    updateStats();
}

// 设置事件监听器
function setupEventListeners() {
    // 武器选择按钮
    document.getElementById('weapon-select-btn').addEventListener('click', () => {
        showPage('selection');
    });
    
    // 返回按钮
    document.getElementById('back-btn').addEventListener('click', () => {
        if (currentWeapon) {
            showPage('gunsmith');
        }
    });
    
    // 重置按钮
    document.getElementById('reset-btn').addEventListener('click', resetConfiguration);
    
    // 保存按钮
    document.getElementById('save-btn').addEventListener('click', () => {
        if (!currentWeapon) return;
        
        const config = {
            weapon: currentWeapon.id,
            attachments: {}
        };
        
        Object.entries(currentAttachments).forEach(([slot, attachment]) => {
            if (attachment && attachment.id !== 'none') {
                config.attachments[slot] = attachment.id;
            }
        });
        
        console.log('保存配置:', config);
        alert(`已保存 ${currentWeapon.name} 的配置！`);
    });
    
    // 关闭模态框
    document.getElementById('closeModal').addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

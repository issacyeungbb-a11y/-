import { Monster, Zone } from '../types';

const forestTemplates = [
  { id: 'slime',    name: '黏黏史萊姆', emoji: '🟢', description: '一隻喺森林裡跳來跳去嘅綠色史萊姆！' },
  { id: 'goblin',   name: '小妖精高布林', emoji: '👺', description: '一隻調皮嘅小妖精，喜歡惡作劇！' },
  { id: 'mushroom', name: '毒蘑菇怪', emoji: '🍄', description: '長喺森林深處嘅毒蘑菇怪物！' },
  { id: 'bat',      name: '夜行蝙蝠', emoji: '🦇', description: '黃昏出沒嘅神秘蝙蝠！' },
  { id: 'wolf',     name: '森林狼王', emoji: '🐺', description: '守護森林嘅強大狼王 — 森林 BOSS！' },
];

const castleTemplates = [
  { id: 'skeleton', name: '骷髏衛兵',   emoji: '💀', description: '城堡入口嘅骷髏守衛！' },
  { id: 'ghost',    name: '幽靈武士',   emoji: '👻', description: '飄浮喺城堡走廊嘅武士幽靈！' },
  { id: 'golem',    name: '石頭傀儡',   emoji: '🗿', description: '由古代魔法召喚嘅巨型石頭怪！' },
  { id: 'witch',    name: '黑魔法師',   emoji: '🧙', description: '住喺城堡頂樓嘅邪惡魔法師！' },
  { id: 'dragon',   name: '城堡龍王',   emoji: '🐉', description: '守護城堡寶藏嘅威猛龍王 — 城堡 BOSS！' },
];

const volcanoTemplates = [
  { id: 'flame',   name: '火焰精靈', emoji: '🔥', description: '從火山噴出嘅憤怒火焰精靈！' },
  { id: 'lava',    name: '熔岩怪獸', emoji: '🌋', description: '由熔岩堆成嘅巨型怪獸！' },
  { id: 'phoenix', name: '不死鳳凰', emoji: '🦅', description: '喺火焰中不斷重生嘅神聖鳳凰！' },
  { id: 'demon',   name: '地獄惡魔', emoji: '😈', description: '從地底深處爬出嘅邪惡惡魔！' },
  { id: 'boss',    name: '火山魔王', emoji: '👑', description: '統治火山嘅終極魔王 — 最終 BOSS！' },
];

function build(templates: typeof forestTemplates, zone: Zone, baseHp: number): Monster[] {
  return templates.map((t, i) => {
    const hp = baseHp + i * 20;
    return { ...t, zone, hp, maxHp: hp };
  });
}

export const ZONE_MONSTERS: Record<Zone, Monster[]> = {
  forest:  build(forestTemplates,  'forest',  60),
  castle:  build(castleTemplates,  'castle',  80),
  volcano: build(volcanoTemplates, 'volcano', 120),
};

export const MONSTERS_PER_ZONE = 5;

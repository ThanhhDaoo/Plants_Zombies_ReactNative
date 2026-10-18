export const PERKS_CONFIG = {
  ricochet: {
    id: 'ricochet',
    name: 'Đậu Nảy Liên Hoàn',
    emoji: '⚡',
    rarity: 'rare',
    color: '#00e5ff',
    desc: 'Đạn bắn trúng kẻ thù sẽ nảy sang 2 zombie gần nhất.',
  },
  cluster: {
    id: 'cluster',
    name: 'Đạn Phân Mảnh',
    emoji: '💥',
    rarity: 'epic',
    color: '#ff9100',
    desc: 'Khi đạn phát nổ hoặc trúng mục tiêu, vỡ ra 4 viên đạn nhỏ tỏa ra xung quanh.',
  },
  frostbite: {
    id: 'frostbite',
    name: 'Sương Giá Cực Hàn',
    emoji: '❄️',
    rarity: 'rare',
    color: '#40c4ff',
    desc: 'Mọi phát bắn có 30% cơ hội đóng băng zombie trong 1.5 giây.',
  },
  vampirism: {
    id: 'vampirism',
    name: 'Đậu Ma Cà Rồng',
    emoji: '🩸',
    rarity: 'epic',
    color: '#f50057',
    desc: 'Hồi 15 Máu (HP) mỗi khi tiêu diệt được 3 Zombie.',
  },
  hyperMagnet: {
    id: 'hyperMagnet',
    name: 'Từ Trường Vô Tận',
    emoji: '🧲',
    rarity: 'common',
    color: '#b388ff',
    desc: 'Tăng x2 tầm hút Xu, Não, Máu và Ngọc Kinh Nghiệm.',
  },
  doubleBarrel: {
    id: 'doubleBarrel',
    name: 'Song Nòng Kép',
    emoji: '🔫',
    rarity: 'rare',
    color: '#ffd600',
    desc: 'Bắn thêm 1 viên đạn phụ mỗi lần nhả cò, tăng gấp đôi hỏa lực.',
  },
  thornArmor: {
    id: 'thornArmor',
    name: 'Giáp Gai Cảm Tử',
    emoji: '🛡️',
    rarity: 'common',
    color: '#69f0ae',
    desc: 'Phản lại 60% sát thương khi bị Zombie áp sát cắn.',
  },
  stormMaster: {
    id: 'stormMaster',
    name: 'Bão Tố Cuồng Nộ',
    emoji: '🌪️',
    rarity: 'rare',
    color: '#76ff03',
    desc: 'Giảm 45% thời gian hồi chiêu của kỹ năng Bão Đậu 360°.',
  },
  acidTrail: {
    id: 'acidTrail',
    name: 'Vệt Axit Độc',
    emoji: '🧪',
    rarity: 'epic',
    color: '#c6ff00',
    desc: 'Khi Lướt (Dash), để lại vệt độc đốt 35 sát thương/giây cho Zombie bám theo.',
  },
  megaBomb: {
    id: 'megaBomb',
    name: 'Siêu Bom Chùm',
    emoji: '🍒',
    rarity: 'epic',
    color: '#ff1744',
    desc: 'Bom Anh Đào nổ xong văng thêm 3 quả mìn con phát nổ liên tiếp.',
  },
  giantSlayer: {
    id: 'giantSlayer',
    name: 'Thợ Săn Khổng Lồ',
    emoji: '🎯',
    rarity: 'rare',
    color: '#ffab00',
    desc: 'Tăng +40% sát thương lên Zombie Xô, Zombie Điền Kinh và Boss.',
  },
  swiftWings: {
    id: 'swiftWings',
    name: 'Đậu Siêu Tốc',
    emoji: '👟',
    rarity: 'common',
    color: '#00e676',
    desc: 'Tăng 25% tốc độ chạy và tăng 35% tốc độ nạp đạn.',
  },
};

export const getRandomPerks = (count = 3, existingPerks = {}) => {
  const keys = Object.keys(PERKS_CONFIG);
  // Shuffle
  const shuffled = keys.sort(() => Math.random() - 0.5);
  const selected = [];

  for (const k of shuffled) {
    if (selected.length >= count) break;
    selected.push(PERKS_CONFIG[k]);
  }
  return selected;
};

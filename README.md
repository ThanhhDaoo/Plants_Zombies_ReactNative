# 🌱 Plants vs Zombies: Battle Royale - React Native Mobile Edition 🧟

<p align="center">
  <b>Tựa game bắn súng sinh tồn Top-Down 2D "Đậu Chiến Binh vs 32 Zombie" được xây dựng hoàn toàn bằng React Native thuần & Expo.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.88-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo_SDK-58-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/JavaScript-100%25-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Shopify_Skia-2D_Engine-E34F26?style=for-the-badge&logo=shopify&logoColor=white" alt="Skia" />
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android-4CAF50?style=for-the-badge&logo=android" alt="Platform" />
</p>

---

## 📖 Giới thiệu

Dự án **Plants vs Zombies: Battle Royale** là game bắn súng sinh tồn góc nhìn từ trên xuống (Top-Down 2D Survival / PUBG Style) được viết lại **100% bằng JavaScript thuần (React Native)**, loại bỏ hoàn toàn web wrapper (Capacitor/Vite).

Người chơi điều khiển chú **Đậu Chiến Binh (Peashooter Hero)** sinh tồn trên bản đồ rộng lớn 2400x2400 px, nhặt trang bị, đập thùng gỗ, tích trữ đạn dược, né tránh vòng bo độc thu hẹp và tiêu diệt 32 Zombie AI để giành lấy danh hiệu **TOP #1 SINH TỒN 🏆**.

**Tác giả:** Thanh Đạo ([@ThanhhDaoo](https://github.com/ThanhhDaoo))  
**Repository:** [Plants_Zombies_ReactNative](https://github.com/ThanhhDaoo/Plants_Zombies_ReactNative)

---

## 🌟 Tính năng nổi bật

### 🎮 Gameplay Sinh Tồn Đỉnh Cao
- **Bản đồ sinh tồn 2400x2400**: Khám phá vùng cỏ rộng lớn với camera mượt mà bám sát chuyển động nhân vật.
- **Vòng Bo Thu Hẹp (Poison Zone)**: Vòng an toàn thu nhỏ qua 4 giai đoạn. Đi ra ngoài vùng bo sẽ bị trúng độc và rút máu liên tục.
- **32 Zombie AI khát máu**: Gồm Zombie Thường, Nón Bảo Hiểm, Xô Sắt, Điền Kinh Siêu Tốc, Zombie Độc Dược và Boss Khổng Lồ ở tâm bản đồ.
- **Thùng Gỗ & Vật Phẩm Rơi**: Phá thùng gỗ để nhặt Túi Máu (Heal), Giáp Phòng Hộ (Armor), Tiền Xu (🪙) và Não (🧠).

### 🕹️ Điều Khiển Công Thái Học Di Động (Mobile-First)
- **Cần gạt ảo 360° (Virtual Joystick)**: Đặt ở góc dưới bên trái, hỗ trợ xoay và di chuyển tự do mọi hướng.
- **Hệ thống Kỹ năng & Tác chiến**:
  - 💥 **Bắn & Tụ Lực Mega Pea**: Nhấn để bắn hạt đậu, giữ nút để tích năng lượng phóng Siêu Đậu Khổng Lồ sát thương x3.5.
  - ⚡ **Lướt Né Đòn (Dash)**: Tăng 320% tốc độ trong tích tắc để thoát khỏi vòng vây của bầy Zombie.
  - 🔄 **Nạp Đạn (Reload)**: Băng đạn riêng cho từng loại súng, tự động nạp khi hết đạn.
  - 🌪️ **Bão Đậu 360° (Pea Storm)**: Xả liên hoàn 20 hạt đậu xuyên phá tỏa đều toàn diện 360 độ.
  - 🍒 **Bom Anh Đào (Cherry Bomb)**: Thả quả bom nổ quét sạch Zombie trong phạm vi lớn.

### 🔫 Kho Vũ Khí & Nâng Cấp (Armory)
1. **Pea Pistol**: Súng đậu tiêu chuẩn, độ chính xác cao.
2. **Threepeater**: Súng 3 nòng bắn chùm 3 viên đạn.
3. **Snow Sniper**: Súng bắn tỉa làm chậm 50% tốc độ Zombie trong 3.5 giây.
4. **Fire Gatling**: Súng máy 6 nòng tốc độ xả đạn cực nhanh kèm hiệu ứng thiêu đốt.
5. **Melon Launcher**: Pháo dưa hấu bắn đạn nổ diện rộng.
6. **Plasma Repeater**: Súng năng lượng plasma bắn xuyên qua nhiều Zombie cùng lúc.

### ⭐ Nâng Cấp Bản Thân & Hệ Thống Cấp Bậc
- Nâng cấp **Máu Tối Đa (HP)** từ 100 lên 200 HP.
- Nâng cấp **Giáp Phòng Vệ (Armor)** từ 25 lên 105 Giáp.
- Nâng cấp **Tốc Độ Di Chuyển (Speed)** từ 4.6 lên 5.8.
- Danh hiệu cấp bậc theo thành tích: *Tân Binh Đậu 🌱* ➔ *Chiến Binh Đậu 🛡️* ➔ *Đậu Biệt Kích 🌲* ➔ *Đậu Tinh Anh ⚡* ➔ *Đậu Đại Tướng 🌟*.

---

## 🏗️ Cấu trúc thư mục dự án

```text
Plants_Zombies_ReactNative/
├── assets/
│   ├── game/                         # Sprite textures (zombie_normal.png, cone, bucket, lawn_bg.jpg,...)
│   └── (icon.png, favicon.png,...)   # App icons
│
├── src/
│   ├── components/
│   │   ├── controls/
│   │   │   ├── VirtualJoystick.jsx   # Cần gạt joystick ảo 360 độ (PanResponder)
│   │   │   └── CombatControls.jsx    # Cụm nút Bắn, Tụ lực, Lướt, Nạp đạn, Bão đậu, Bom
│   │   ├── hud/
│   │   │   └── BattleRoyaleHUD.jsx   # Thanh trạng thái (Sống sót, Kills, Vòng bo, HP, Giáp, Đạn)
│   │   └── modals/
│   │       ├── PauseModal.jsx        # Tạm dừng trận đấu
│   │       └── SurvivalResultModal.jsx# Kết quả trận đấu (TOP #1 Chiến Thắng / Bị Hạ Gục)
│   │
│   ├── game/
│   │   ├── config/
│   │   │   ├── pubgWeapons.js        # Chỉ số 6 loại súng đậu
│   │   │   └── pubgZombies.js        # Cấu hình 7 loại Zombie AI
│   │   ├── core/
│   │   │   └── BattleRoyaleEngine.js # Logic mô phỏng vật lý, di chuyển, đạn, vòng bo, AI quái
│   │   └── render/
│   │       └── BattleRoyaleCanvas.jsx# Render đồ họa Canvas 2D qua @shopify/react-native-skia
│   │
│   ├── screens/
│   │   ├── HomeScreen.jsx            # Sảnh chờ Lobby & Kho vũ khí / Nâng cấp chỉ số
│   │   └── BattleRoyaleScreen.jsx    # Màn hình chiến trường sinh tồn chính
│   │
│   ├── store/
│   │   └── usePlayerStore.js         # Zustand lưu trữ Xu, Não, Vũ khí, Cấp độ, Điểm kỷ lục
│   └── services/
│       └── audio/SoundService.js     # Quản lý âm thanh bằng expo-av
│
├── App.jsx                           # Khởi tạo khóa Landscape & Điều hướng màn hình
├── app.json                          # Expo configuration
├── package.json                      # Quản lý dependencies (100% pure JavaScript)
└── README.md                         # Tài liệu hướng dẫn dự án
```

---

## 🚀 Hướng dẫn cài đặt & Chạy ứng dụng

### 1. Yêu cầu hệ thống
- **Node.js**: >= 18.x
- **Expo CLI** (SDK 58)
- Thiết bị di động (Android / iOS) đã cài app **Expo Go** hoặc Simulator/Emulator.

### 2. Cài đặt Dependencies
```bash
# Clone repository
git clone https://github.com/ThanhhDaoo/Plants_Zombies_ReactNative.git
cd Plants_Zombies_ReactNative

# Cài đặt các gói thư viện
npm install
```

### 3. Khởi chạy trên Local

```bash
# Khởi động Metro Bundler
npx expo start

# Hoặc chạy trực tiếp trên iOS Simulator (macOS)
npx expo run:ios # hoặc phím 'i' trong terminal

# Hoặc chạy trên Android Emulator
npx expo run:android # hoặc phím 'a' trong terminal
```

---

## 📜 Giấy phép & Đóng góp

Dự án được xây dựng phục vụ mục đích học tập và giải trí phi thương mại.
Mọi đóng góp, báo lỗi (Issues) hoặc Pull Request đều được hoan nghênh tại [GitHub Repository](https://github.com/ThanhhDaoo/Plants_Zombies_ReactNative).

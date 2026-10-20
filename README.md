# Plants vs Zombies: Battle Royale (Mobile Edition)

<p align="center">
  <b>Tựa game bắn súng sinh tồn Top-Down 2D "Chiến Binh Đậu vs 32 Zombie" tối ưu hóa cho nền tảng di động với React Native & Expo.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.88-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo_SDK-58-000020?style=flat-square&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/State-Zustand-orange?style=flat-square" alt="Zustand" />
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS-4CAF50?style=flat-square&logo=android" alt="Platform" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
</p>

---

## Mục lục

- [Tổng quan dự án](#tổng-quan-dự-án)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Tính năng cốt lõi](#tính-năng-cốt-lõi)
- [Hệ thống vũ khí & Kẻ địch](#hệ-thống-vũ-khí--kẻ-địch)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Hướng dẫn cài đặt & Khởi chạy](#hướng-dẫn-cài-đặt--khởi-chạy)
- [Quy trình đóng gói APK (Android)](#quy-trình-đóng-gói-apk-android)
- [Tối ưu hóa hiệu năng](#tối-ưu-hóa-hiệu-năng)
- [Đóng góp & Giấy phép](#đóng-góp--giấy-phép)

---

## Tổng quan dự án

**Plants vs Zombies: Battle Royale** là dự án game bắn súng sinh tồn góc nhìn từ trên xuống (Top-Down 2D Survival) lấy cảm hứng từ vũ trụ PvZ kết hợp cơ chế thu hẹp vòng bo của dòng game Battle Royale.

Người chơi điều khiển chú **Đậu Chiến Binh (Peashooter Hero)** sinh tồn trên chiến trường rộng lớn 2400x2400 px, thu thập trang bị từ hòm gỗ, nâng cấp hỏa lực, né tránh vòng bo độc và hạ gục 32 Zombie AI để giành lấy vị trí **TOP #1 Sinh Tồn**.

### Thông số kỹ thuật
- **Nền tảng mục tiêu**: Android (API 24+) & iOS (14.0+)
- **Định dạng màn hình**: Khóa hướng ngang cố định (Landscape Mode), hỗ trợ toàn màn hình tràn viền (Edge-to-Edge).
- **Ngôn ngữ**: 100% JavaScript thuần (ES6+ / JSX), không phụ thuộc TypeScript runtime.

---

## Kiến trúc hệ thống

Dự án áp dụng mô hình kiến trúc phân lớp nhằm tối ưu hóa độ phản hồi của thao tác cảm ứng và tốc độ dựng hình trên thiết bị di động:

```text
┌────────────────────────────────────────────────────────┐
│                   App Shell (React Native)             │
│  - Landscape ScreenOrientation Lock                    │
│  - Immersive NavigationBar (Edge-to-Edge Fullscreen)   │
│  - AppState Lifecycle Management                       │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                 Engine & State Management              │
│  - BattleRoyaleEngine: Physics loop, collision, poison │
│  - Zustand Store: Player stats, coins, brains, arsenal │
│  - SoundService: Low-latency audio trigger             │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                  Renderer & Control Surface            │
│  - 2D Canvas Viewport (Fit cover, zero letterbox)      │
│  - PanResponder Virtual Joystick (360° input)          │
│  - Combat Action System: Tap, Hold-to-Charge, Dash     │
└────────────────────────────────────────────────────────┘
```

---

## Tính năng cốt lõi

### 1. Cơ chế sinh tồn Battle Royale
- **Đấu trường 2400x2400 px**: Không gian bản đồ lớn với cơ chế camera mượt mà bám sát tọa độ nhân vật theo thời gian thực.
- **Vòng bo độc hại (Poison Ring)**: Vòng an toàn thu hẹp dần qua 4 giai đoạn. Nhân vật đứng ngoài vòng sẽ chịu sát thương liên tục theo % máu tối đa.
- **Hệ thống hòm tiếp tế**: Phá các thùng gỗ rải rác trên bản đồ để nhận Túi Máu (Heal), Giáp Bảo Vệ (Armor), Tiền Xu và Não (nguyên liệu mở khóa vũ khí cao cấp).

### 2. Hệ thống điều khiển công thái học (Mobile-First)
- **Virtual Joystick 360°**: Hỗ trợ di chuyển mượt mà ở mọi góc độ, tự động căn chỉnh tâm theo hướng chạm ngón tay.
- **Hệ thống kỹ năng tác chiến**:
  - **Bắn thường & Tụ lực (Mega Pea)**: Chạm nhẹ để bắn đạn đơn; giữ nút để tích năng lượng phóng Siêu Đậu với sát thương x3.5.
  - **Lướt né đòn (Dash)**: Tăng tốc tức thì trong 0.25 giây để thoát khỏi vòng vây của bầy Zombie.
  - **Nạp đạn thông minh (Auto Reload)**: Tự động nạp khi hết băng đạn hoặc nạp thủ công bất kỳ lúc nào.
  - **Bão đậu (Pea Storm)**: Kỹ năng đặc biệt xả 20 hạt đậu tỏa đều 360 độ quanh bản đồ.
  - **Bom Anh Đào (Cherry Bomb)**: Vũ khí hủy diệt diện rộng, tiêu diệt toàn bộ kẻ địch trong tầm nổ.

### 3. Nâng cấp chỉ số & Hệ thống cấp bậc
- **Chỉ số nâng cấp vĩnh viễn**: Máu tối đa (HP: 100 ➔ 200), Giáp hộ thân (Armor: 25 ➔ 105), Tốc độ di chuyển (Speed: 4.6 ➔ 5.8).
- **Hệ thống cấp bậc danh dự**: Tân Binh Đậu ➔ Chiến Binh Đậu ➔ Đậu Biệt Kích ➔ Đậu Tinh Anh ➔ Đậu Đại Tướng.

---

## Hệ thống vũ khí & Kẻ địch

### Danh mục vũ khí (Arsenal)

| Tên vũ khí | Sát thương | Tốc độ bắn | Băng đạn | Thời gian nạp | Đặc tính tác chiến |
|:---|:---:|:---:|:---:|:---:|:---|
| **Pea Pistol** | 28 | 260 ms | 24 viên | 1.2 s | Súng lục tiêu chuẩn, độ ổn định và chính xác cao |
| **Threepeater Shotgun** | 24 x 4 | 480 ms | 10 viên | 1.5 s | Bắn chùm 4 đạn xòe, sát thương cận chiến cực lớn |
| **Snow Pea Sniper** | 85 | 700 ms | 7 viên | 1.8 s | Bắn tỉa tầm xa, làm chậm đối phương 50% trong 3 giây |
| **Fire Gatling** | 34 | 110 ms | 48 viên | 2.1 s | Tốc độ xả đạn cực cao, thiêu đốt mục tiêu theo thời gian |
| **Melon Launcher** | 140 | 1200 ms | 5 quả | 2.4 s | Pháo cẩu dưa hấu, gây sát thương diện rộng (AoE) |
| **Plasma Repeater** | 65 | 320 ms | 18 viên | 1.6 s | Đạn năng lượng plasma xuyên qua nhiều mục tiêu thẳng hàng |

### Phân loại Zombie AI

| Loại Zombie | Bậc | Máu | Tốc độ | Đặc tính AI |
|:---|:---:|:---:|:---:|:---|
| **Walker Zombie** | Tier 1 | 90 | Chậm (1.9) | Kẻ địch cơ bản, di chuyển áp sát theo số đông |
| **Conehead Zombie** | Tier 2 | 190 | Trung bình (1.8) | Trang bị nón bảo hộ, tăng gấp đôi khả năng chống chịu |
| **Buckethead Zombie** | Tier 3 | 320 | Chậm (1.7) | Giảm 25% toàn bộ sát thương đạn tác động |
| **Football Zombie** | Tier 3 | 150 | Rất nhanh (3.5) | Khả năng chạy nước rút tiếp cận mục tiêu trong tích tắc |
| **Toxic Zombie** | Tier 3 | 240 | Trung bình (2.0) | Phát tán vòng độc xung quanh, gây suy giảm máu theo thời gian |
| **Gargantuar Boss** | Boss | 1800 | Chậm (1.4) | Xuất hiện ở trung tâm đấu trường, đòn đánh gây sát thương cực lớn |

---

## Cấu trúc thư mục

```text
Plants_Zombies_ReactNative/
├── android/                          # Native Android Project (Gradle build configuration)
├── assets/                           # Tài nguyên hình ảnh, âm thanh, icon ứng dụng
├── src/
│   ├── components/
│   │   ├── controls/
│   │   │   ├── VirtualJoystick.jsx   # Cần gạt joystick ảo đa hướng (PanResponder)
│   │   │   └── CombatControls.jsx    # Cụm phím tác chiến (Bắn, Tụ lực, Lướt, Nạp đạn)
│   │   ├── hud/
│   │   │   └── BattleRoyaleHUD.jsx   # HUD trạng thái (HP, Giáp, Vòng bo, Đạn dược, Kills)
│   │   └── modals/
│   │       ├── PauseModal.jsx        # Menu tạm dừng trận đấu
│   │       └── SurvivalResultModal.jsx # Bảng tổng kết kết quả trận đấu
│   ├── game/
│   │   ├── config/
│   │   │   ├── pubgWeapons.js        # Bảng thông số kỹ thuật 6 loại vũ khí
│   │   │   └── pubgZombies.js        # Cấu hình chỉ số và bảng rơi đồ của Zombie AI
│   │   ├── core/
│   │   │   └── BattleRoyaleEngine.js # Vòng lặp vật lý, va chạm, logic vòng bo và đường đạn
│   │   └── render/
│   │       └── BattleRoyaleCanvas.jsx# Khung render đồ họa 2D Canvas tối ưu hóa
│   ├── screens/
│   │   ├── HomeScreen.jsx            # Sảnh chính (Lobby), kho vũ khí và bảng nâng cấp
│   │   └── BattleRoyaleScreen.jsx    # Màn hình chiến trường sinh tồn chính
│   ├── store/
│   │   └── usePlayerStore.js         # Quản trị trạng thái người chơi với Zustand
│   └── services/
│       └── audio/SoundService.js     # Trình quản lý hiệu ứng âm thanh
├── App.jsx                           # Điểm nhập ứng dụng, xử lý xoay màn hình & tràn viền
├── app.json                          # Cấu hình siêu dữ liệu Expo
├── package.json                      # Danh sách dependencies và npm scripts
└── README.md                         # Tài liệu kỹ thuật dự án
```

---

## Hướng dẫn cài đặt & Khởi chạy

### 1. Yêu cầu môi trường
- **Node.js**: Phiên bản 18.x trở lên
- **NPM** hoặc **Yarn**
- **Expo CLI** (SDK 58)
- Thiết bị di động đã cài đặt ứng dụng **Expo Go** (Android / iOS) hoặc máy ảo Android Emulator / iOS Simulator.

### 2. Cài đặt mã nguồn

```bash
# Sao chép repository về máy
git clone https://github.com/ThanhhDaoo/Plants_Zombies_ReactNative.git
cd Plants_Zombies_ReactNative

# Cài đặt toàn bộ thư viện phụ thuộc
npm install
```

### 3. Khởi chạy môi trường phát triển

```bash
# Khởi động Metro Bundler
npm start

# Chạy trực tiếp trên thiết bị Android qua kết nối USB / Emulator
npm run android

# Chạy trực tiếp trên iOS Simulator (yêu cầu macOS & Xcode)
npm run ios
```

---

## Quy trình đóng gói APK (Android)

Dự án hỗ trợ đóng gói ứng dụng Android dạng tệp tin APK độc lập bằng hai phương thức:

### Cách 1: Đóng gói Local với Gradle (Khuyên dùng)
Yêu cầu đã cài đặt Android Studio và Android SDK:

```bash
# Di chuyển vào thư mục android và build bản phát hành
cd android
./gradlew assembleRelease

# Tệp APK xuất ra tại đường dẫn:
# android/app/build/outputs/apk/release/app-release.apk
```

### Cách 2: Đóng gói Cloud với EAS Build

```bash
# Cài đặt công cụ EAS CLI
npm install -g eas-cli

# Đăng nhập tài khoản Expo và khởi chạy build APK
eas login
eas build -p android --profile preview
```

---

## Tối ưu hóa hiệu năng

- **Khóa xoay Landscape**: Sử dụng `expo-screen-orientation` khóa cứng chiều ngang màn hình, ngăn chặn hiện tượng layout reflow ngoài ý muốn.
- **Tràn viền Immersive Mode**: Cấu hình `expo-navigation-bar` tự động ẩn thanh điều hướng mềm và hiển thị thanh trạng thái dạng trong suốt trên Android, mang lại trải nghiệm hiển thị không viền cạnh.
- **Cơ chế Garbage Collection & Memory Management**: Vòng lặp đạn và Zombie AI được dọn dẹp tọa độ ngay khi ra khỏi bán kính kiểm soát, hạn chế tối đa nguy cơ rò rỉ bộ nhớ (memory leak) trên thiết bị di động cấu hình trung bình.

---

## Đóng góp & Giấy phép

- **Tác giả**: Trần Thanh Đạo ([@ThanhhDaoo](https://github.com/ThanhhDaoo))
- **Mục đích**: Dự án được xây dựng phục vụ nghiên cứu kỹ thuật, học tập và giải trí phi thương mại.
- **Báo cáo lỗi & Đóng góp**: Mọi vấn đề kỹ thuật hoặc đề xuất tính năng vui lòng mở issue tại [GitHub Issues](https://github.com/ThanhhDaoo/Plants_Zombies_ReactNative/issues).
- **Giấy phép**: Phân phối dưới giấy phép [MIT License](LICENSE).

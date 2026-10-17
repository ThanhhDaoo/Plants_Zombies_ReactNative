# 🌱 Plants vs Zombies: React Native Mobile Edition 🧟

<p align="center">
  <b>Tựa game chiến thuật phòng thủ sân cỏ kinh điển được tái hiện hoàn toàn trên nền tảng di động với React Native & Expo.</b>
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

Dự án **Plants vs Zombies: React Native** được xây dựng lại từ đầu bằng **React Native thuần (JavaScript)**, loại bỏ hoàn toàn web wrapper (Capacitor/Vite). Game tối ưu trải nghiệm công thái học trên thiết bị di động với chế độ màn hình ngang (Landscape), đồ họa Canvas 2D tốc độ cao qua thư viện **@shopify/react-native-skia** và hệ thống quản lý trạng thái mượt mà bằng **Zustand**.

**Tác giả:** Thanh Đạo ([@ThanhhDaoo](https://github.com/ThanhhDaoo))

---

## 🌟 Tính năng nổi bật

- 🎮 **Đồ họa Canvas 2D 60-120 FPS**: Render bằng C++ Engine của `@shopify/react-native-skia`, đảm bảo khung hình luôn mượt mà ngay cả khi có hàng chục Zombie và đạn bay trên sân cỏ.
- 📱 **Tự động khóa màn hình ngang**: Sử dụng `expo-screen-orientation` khóa chế độ Landscape chuẩn như phiên bản PvZ gốc.
- 🌻 **Hệ thống Cây trồng phong phú**:
  - **Hoa Hướng Dương (Sunflower)**: Sản xuất mặt trời định kỳ.
  - **Đậu Bắn Tỉa (Peashooter)**: Bắn hạt đậu cơ bản.
  - **Hạt Óc Chó (Wall-nut)**: Tường thành vững chắc với lượng máu cực lớn cản bước quái.
  - **Đậu Băng (Snow Pea)**: Bắn hạt đậu băng làm chậm 50% tốc độ di chuyển của Zombie.
  - **Đậu Nòng Đôi (Repeater)**: Xả liên tiếp 2 viên đạn mỗi lượt bắn.
  - **Cây Ăn Thịt (Chomper)**: Ngoạm nuốt chửng Zombie tiếp cận.
  - **Bom Anh Đào (Cherry Bomb)**: Phát nổ hủy diệt dọn sạch Zombie trong bán kính 3x3 ô.
- 🧟 **Hệ thống Zombie đa dạng**:
  - **Zombie Thường (Normal Zombie)**: Cơ bản nhưng đông đảo.
  - **Zombie Nón (Conehead Zombie)**: Giáp nón bảo vệ, chịu đòn tốt gấp đôi.
  - **Zombie Xô (Buckethead Zombie)**: Đội xô sắt dày, cực kỳ trâu bò.
  - **Zombie Điền Kinh (Fast Zombie)**: Bứt tốc lao thẳng vào vườn.
  - **Zombie Khổng Lồ (Strong Zombie)**: Máu trâu, sát thương đập cắn cực mạnh.
- 🚜 **Máy Cắt Cỏ Cứu Cánh (Lawn Mowers)**: Hàng phòng thủ cuối cùng ở mỗi hàng cỏ, tự động kích hoạt nghiền nát toàn bộ Zombie trên hàng khi có quái đột nhập.
- ☀️ **Cơ chế nhặt Mặt Trời trực quan**: Nhặt mặt trời rơi từ bầu trời hoặc từ Hoa hướng dương chỉ bằng một cú chạm.
- 🎴 **Cụm HUD tiện lợi**:
  - Khay thẻ bài hiển thị thời gian hồi chiêu (Cooldown Overlay) trực quan.
  - Xẻng nhổ cây (Shovel) hỗ trợ đào cây tái cơ cấu đội hình.
  - Bộ đếm mặt trời và thanh tiến trình đợt Wave quái.
- 📳 **Phản hồi xúc giác (Haptic Feedback)**: Rung nhẹ khi nhặt sun, trồng cây, đạn nổ qua `expo-haptics`.

---

## 🏗️ Cấu trúc thư mục chuẩn (Enterprise Architecture)

```text
Plants_Zombies_ReactNative/
├── assets/
│   ├── game/                         # Tài nguyên đồ họa (lawn_bg.jpg, zombie_normal.png,...)
│   └── (icon.png, favicon.png,...)   # App icon & Splash screen
│
├── src/
│   ├── game/                         # [LÕI GAME ENGINE & SKIA 2D CANVAS]
│   │   ├── config/
│   │   │   ├── grid.js               # Kích thước lưới cỏ 5x9, pixel & cell coordinate
│   │   │   ├── plants.config.js      # Chỉ số máu, giá Sun, cooldown của cây
│   │   │   ├── zombies.config.js     # Chỉ số máu, tốc độ di chuyển của Zombie
│   │   │   └── game.config.js        # Cấu hình đợt wave quái, nhịp rơi mặt trời
│   │   ├── core/
│   │   │   └── GameWorld.js          # Game Loop, va chạm đạn, zombie cắn cây, máy cắt cỏ
│   │   └── render/
│   │       └── GameCanvas.jsx        # Component Canvas 2D Skia render 60 FPS
│   │
│   ├── components/                   # Giao diện HUD & Modals bằng React Native
│   │   ├── hud/
│   │   │   ├── TopBar.jsx            # Thanh đợt quái, vàng, nút Pause, âm thanh
│   │   │   ├── SeedBank.jsx          # Khay thẻ bài cây trồng
│   │   │   ├── SeedPacket.jsx        # Thẻ bài cây (cooldown mask & giá sun)
│   │   │   ├── SunCounter.jsx        # Bộ đếm mặt trời
│   │   │   └── ShovelButton.jsx      # Xẻng nhổ cây
│   │   └── modals/
│   │       ├── GameOverModal.jsx     # Bảng thông báo Zombie ăn não & chơi lại
│   │       ├── VictoryModal.jsx      # Bảng chiến thắng các đợt wave
│   │       └── PauseModal.jsx        # Bảng tạm dừng trận đấu
│   │
│   ├── screens/                      # Các màn hình ứng dụng
│   │   ├── HomeScreen.jsx            # Sảnh chính (Menu, nhân vật, nút bắt đầu)
│   │   └── GameScreen.jsx            # Màn chơi chính (Canvas + HUD)
│   │
│   ├── store/                        # Quản lý State bằng Zustand
│   │   ├── useGameStore.js           # Trạng thái ván đấu hiện tại (Sun, Seed, GameStatus)
│   │   └── usePlayerStore.js         # Lưu tiến trình người chơi (Vàng, não, điểm cao)
│   │
│   └── services/audio/
│       └── SoundService.js           # Âm thanh & phản hồi rung Haptic
│
├── App.jsx                           # Root component, khóa xoay ngang & điều hướng
├── index.js                          # Entry point của ứng dụng Expo
├── app.json                          # Cấu hình Expo Landscape & App metadata
└── package.json                      # Danh sách dependencies chuẩn
```

---

## 🚀 Hướng dẫn cài đặt và Chạy ứng dụng

### 1. Yêu cầu môi trường
- **Node.js**: Phiên bản 18 trở lên (Khuyến nghị Node LTS hoặc v22).
- **npm** hoặc **yarn** / **bun**.
- Điện thoại di động đã cài ứng dụng **Expo Go** (có sẵn trên Google Play Store & Apple App Store).

### 2. Cài đặt các gói thư viện
```bash
npm install
```

### 3. Khởi chạy máy chủ phát triển
```bash
npx expo start
```

### 4. Trải nghiệm trên thiết bị
- **Trên điện thoại thật (Khuyến nghị)**: Mở ứng dụng **Expo Go** và quét mã QR xuất hiện trên terminal.
- **Trên Android Emulator**: Bấm phím **`a`** trên terminal.
- **Trên iOS Simulator (macOS)**: Bấm phím **`i`** trên terminal.

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Vai trò |
| :--- | :--- |
| **React Native (0.88)** | Nền tảng xây dựng ứng dụng di động đa nền tảng |
| **Expo SDK (v58)** | Bộ công cụ phát triển ứng dụng di động hiện đại |
| **@shopify/react-native-skia** | Engine đồ họa 2D Canvas hiệu năng cao 60 FPS |
| **Zustand** | Quản lý trạng thái nhẹ, không re-render canvas không cần thiết |
| **React Native Reanimated & Worklets** | Hỗ trợ chuyển động đồ họa luồng Native |
| **Expo Haptics** | Phản hồi rung xúc giác cho trải nghiệm chạm chân thực |
| **Expo Screen Orientation** | Khóa hướng màn hình ngang (Landscape mode) |

---

## 📦 Đóng gói ứng dụng di động (EAS Build)

Để xuất file cài đặt APK cho Android hoặc IPA cho iOS bằng EAS (Expo Application Services):

1. Cài đặt EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Đăng nhập tài khoản Expo:
   ```bash
   eas login
   ```
3. Cấu hình và đóng gói file APK trực tiếp trên cloud:
   ```bash
   eas build --platform android --profile preview
   ```

---

## 📄 Bản quyền & Giấy phép

Dự án được xây dựng cho mục đích học tập và giải trí cá nhân. Bản quyền hình ảnh, âm thanh và ý tưởng gốc thuộc về **PopCap Games & Electronic Arts (EA)**.
Mã nguồn phát triển bởi **Thanh Đạo (@ThanhhDaoo)**.

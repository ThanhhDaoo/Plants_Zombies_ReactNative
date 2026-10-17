import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Canvas,
  Rect,
  Circle,
  Group,
  useImage,
  Image as SkiaImage,
} from '@shopify/react-native-skia';
import { battleRoyaleEngine, MAP_CONFIG } from '../core/BattleRoyaleEngine';

export const BattleRoyaleCanvas = ({ width, height }) => {
  const [, setFrameTick] = useState(0);
  const lastTimeRef = useRef(Date.now());
  const animFrameRef = useRef(null);

  // Load zombie and map textures
  const imgZombieNormal = useImage(require('../../../assets/game/zombie_normal.png'));
  const imgZombieCone = useImage(require('../../../assets/game/zombie_cone.png'));
  const imgZombieBucket = useImage(require('../../../assets/game/zombie_bucket.png'));
  const imgZombieFast = useImage(require('../../../assets/game/zombie_fast.png'));
  const imgZombieStrong = useImage(require('../../../assets/game/zombie_strong.png'));

  const zombieTextures = {
    normal: imgZombieNormal,
    conehead: imgZombieCone,
    buckethead: imgZombieBucket,
    runner: imgZombieFast,
    boss: imgZombieStrong,
  };

  useEffect(() => {
    const loop = () => {
      const now = Date.now();
      const dtMs = now - lastTimeRef.current;
      lastTimeRef.current = now;

      battleRoyaleEngine.update(dtMs);
      setFrameTick((t) => (t + 1) % 1000);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const player = battleRoyaleEngine.player;
  const camera = battleRoyaleEngine.camera;
  const zone = battleRoyaleEngine.zone;

  const camOffsetX = -camera.x + width / 2;
  const camOffsetY = -camera.y + height / 2;

  return (
    <View style={styles.container}>
      <Canvas style={{ width, height }}>
        {/* Camera World Transform */}
        <Group transform={[{ translateX: camOffsetX }, { translateY: camOffsetY }]}>
          {/* Map Ground Backdrop */}
          <Rect
            x={0}
            y={0}
            width={MAP_CONFIG.WIDTH}
            height={MAP_CONFIG.HEIGHT}
            color="#1b4d1b"
          />

          {/* Grass Grid Checkers (every 200px) */}
          {Array.from({ length: 12 }).map((_, r) =>
            Array.from({ length: 12 }).map((__, c) => {
              if ((r + c) % 2 === 0) return null;
              return (
                <Rect
                  key={`tile-${r}-${c}`}
                  x={c * 200}
                  y={r * 200}
                  width={200}
                  height={200}
                  color="rgba(46, 125, 50, 0.25)"
                />
              );
            })
          )}

          {/* Map Boundaries */}
          <Rect
            x={0}
            y={0}
            width={MAP_CONFIG.WIDTH}
            height={MAP_CONFIG.HEIGHT}
            color="#2e7d32"
            style="stroke"
            strokeWidth={14}
          />

          {/* Safe Zone / Vòng Bo */}
          <Circle
            cx={zone.centerX}
            cy={zone.centerY}
            r={zone.radius}
            color="#42a5f5"
            style="stroke"
            strokeWidth={6}
          />
          {/* Zone Danger Outline */}
          <Circle
            cx={zone.centerX}
            cy={zone.centerY}
            r={zone.radius}
            color="rgba(244, 67, 54, 0.08)"
          />

          {/* Crates */}
          {battleRoyaleEngine.crates.map((crate) => (
            <Group key={crate.id}>
              <Rect
                x={crate.x - 20}
                y={crate.y - 20}
                width={40}
                height={40}
                color="#8d6e63"
              />
              <Rect
                x={crate.x - 17}
                y={crate.y - 17}
                width={34}
                height={34}
                color="#6d4c41"
              />
              <Rect
                x={crate.x - 3}
                y={crate.y - 18}
                width={6}
                height={36}
                color="#ffd54f"
              />
            </Group>
          ))}

          {/* Ground Items (Loot) */}
          {battleRoyaleEngine.groundItems.map((item) => (
            <Group key={item.id}>
              {item.type === 'coin' && (
                <Circle cx={item.x} cy={item.y} r={10} color="#ffd54f" />
              )}
              {item.type === 'brain' && (
                <Circle cx={item.x} cy={item.y} r={12} color="#f48fb1" />
              )}
              {item.type === 'heal' && (
                <Circle cx={item.x} cy={item.y} r={11} color="#4caf50" />
              )}
              {item.type === 'armor' && (
                <Circle cx={item.x} cy={item.y} r={11} color="#00bcd4" />
              )}
            </Group>
          ))}

          {/* Bombs */}
          {battleRoyaleEngine.bombs.map((bomb) => (
            <Group key={bomb.id}>
              <Circle cx={bomb.x - 6} cy={bomb.y} r={14} color="#d32f2f" />
              <Circle cx={bomb.x + 6} cy={bomb.y} r={14} color="#c2185b" />
            </Group>
          ))}

          {/* Bullets */}
          {battleRoyaleEngine.bullets.map((b) => (
            <Group key={b.id}>
              <Circle cx={b.x} cy={b.y} r={b.radius} color={b.color || '#76c828'} />
              <Circle cx={b.x} cy={b.y} r={b.radius * 0.4} color="#ffffff" />
            </Group>
          ))}

          {/* Zombies */}
          {battleRoyaleEngine.zombies.map((z) => {
            const tex = zombieTextures[z.type] || imgZombieNormal;
            const hpRatio = Math.max(0, z.health / z.maxHealth);

            return (
              <Group key={z.id}>
                {tex ? (
                  <SkiaImage
                    image={tex}
                    x={z.x - z.radius * 1.5}
                    y={z.y - z.radius * 2}
                    width={z.radius * 3}
                    height={z.radius * 3.5}
                    fit="contain"
                  />
                ) : (
                  <Circle cx={z.x} cy={z.y} r={z.radius} color={z.color} />
                )}

                {/* Zombie Health Bar */}
                {hpRatio < 1 && (
                  <Group>
                    <Rect
                      x={z.x - 22}
                      y={z.y - z.radius * 2 - 8}
                      width={44}
                      height={5}
                      color="rgba(0,0,0,0.6)"
                    />
                    <Rect
                      x={z.x - 22}
                      y={z.y - z.radius * 2 - 8}
                      width={44 * hpRatio}
                      height={5}
                      color="#e53935"
                    />
                  </Group>
                )}
              </Group>
            );
          })}

          {/* Player: Pea Hero (Đậu Chiến Binh) */}
          <Group>
            {/* Shadow */}
            <Circle
              cx={player.x}
              cy={player.y + 12}
              r={player.radius}
              color="rgba(0,0,0,0.3)"
            />

            {/* Dash Speed Ghost */}
            {player.isDashing && (
              <Circle
                cx={player.x - Math.cos(player.angle) * 30}
                cy={player.y - Math.sin(player.angle) * 30}
                r={player.radius * 0.9}
                color="rgba(102, 187, 106, 0.4)"
              />
            )}

            {/* Charging Aura */}
            {player.isCharging && (
              <Circle
                cx={player.x}
                cy={player.y}
                r={player.radius * 1.6}
                color="rgba(0, 229, 255, 0.35)"
              />
            )}

            {/* Main Body */}
            <Circle cx={player.x} cy={player.y} r={player.radius} color="#66bb6a" />

            {/* Snout pointing at player.angle */}
            <Circle
              cx={player.x + Math.cos(player.angle) * 22}
              cy={player.y + Math.sin(player.angle) * 22}
              r={9}
              color="#388e3c"
            />

            {/* Eyes */}
            <Circle
              cx={player.x + Math.cos(player.angle - 0.5) * 12}
              cy={player.y + Math.sin(player.angle - 0.5) * 12}
              r={5}
              color="#ffffff"
            />
            <Circle
              cx={player.x + Math.cos(player.angle - 0.5) * 14}
              cy={player.y + Math.sin(player.angle - 0.5) * 14}
              r={2.5}
              color="#111111"
            />
          </Group>
        </Group>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  Canvas,
  Rect,
  Circle,
  Group,
  useImage,
  Image as SkiaImage,
} from '@shopify/react-native-skia';
import { GRID_CONFIG, getGridFromPixel } from '../config/grid';
import { gameWorld } from '../core/GameWorld';
import { useGameStore } from '../../store/useGameStore';
import { PLANTS_CONFIG } from '../config/plants.config';

export const GameCanvas = ({ width, height }) => {
  const [, setFrameTick] = useState(0);
  const selectedSeed = useGameStore((s) => s.selectedSeed);
  const isShovelActive = useGameStore((s) => s.isShovelActive);
  const toggleShovel = useGameStore((s) => s.toggleShovel);

  // Load zombie and background textures
  const imgZombieNormal = useImage(require('../../../assets/game/zombie_normal.png'));
  const imgZombieCone = useImage(require('../../../assets/game/zombie_cone.png'));
  const imgZombieBucket = useImage(require('../../../assets/game/zombie_bucket.png'));
  const imgZombieFast = useImage(require('../../../assets/game/zombie_fast.png'));
  const imgZombieStrong = useImage(require('../../../assets/game/zombie_strong.png'));
  const imgLawnBg = useImage(require('../../../assets/game/lawn_bg.jpg'));

  const zombieImages = {
    normal: imgZombieNormal,
    cone: imgZombieCone,
    bucket: imgZombieBucket,
    fast: imgZombieFast,
    strong: imgZombieStrong,
  };

  const lastTimeRef = useRef(Date.now());
  const animFrameRef = useRef(null);

  useEffect(() => {
    gameWorld.init();

    const loop = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      gameWorld.update(dt, now);
      setFrameTick((t) => (t + 1) % 1000);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const scaleX = width / GRID_CONFIG.BOARD_WIDTH;
  const scaleY = height / GRID_CONFIG.BOARD_HEIGHT;

  const handleTouch = (e) => {
    const { locationX, locationY } = e.nativeEvent;
    const virtualX = locationX / scaleX;
    const virtualY = locationY / scaleY;

    // 1. Check if tapped any Sun item
    for (const sun of gameWorld.suns) {
      const dist = Math.hypot(sun.x - virtualX, sun.y - virtualY);
      if (dist < 35) {
        gameWorld.collectSun(sun.id);
        return;
      }
    }

    // 2. Check grid touch
    const grid = getGridFromPixel(virtualX, virtualY);
    if (!grid) return;

    if (isShovelActive) {
      gameWorld.removePlantAt(grid.row, grid.col);
      toggleShovel();
      return;
    }

    if (selectedSeed) {
      gameWorld.plantAt(grid.row, grid.col, selectedSeed);
    }
  };

  return (
    <Pressable style={styles.container} onPress={handleTouch}>
      <Canvas style={{ width, height }}>
        {/* Background */}
        {imgLawnBg ? (
          <SkiaImage
            image={imgLawnBg}
            x={0}
            y={0}
            width={width}
            height={height}
            fit="cover"
          />
        ) : (
          <Rect x={0} y={0} width={width} height={height} color="#1b4d1b" />
        )}

        {/* Scaled Game Content */}
        <Group transform={[{ scaleX }, { scaleY }]}>
          {/* Lawn Grid */}
          {Array.from({ length: GRID_CONFIG.ROWS }).map((_, r) =>
            Array.from({ length: GRID_CONFIG.COLS }).map((__, c) => {
              const isEven = (r + c) % 2 === 0;
              return (
                <Rect
                  key={`cell-${r}-${c}`}
                  x={GRID_CONFIG.LAWN_START_X + c * GRID_CONFIG.CELL_WIDTH}
                  y={GRID_CONFIG.LAWN_START_Y + r * GRID_CONFIG.CELL_HEIGHT}
                  width={GRID_CONFIG.CELL_WIDTH}
                  height={GRID_CONFIG.CELL_HEIGHT}
                  color={isEven ? 'rgba(76, 175, 80, 0.15)' : 'rgba(56, 142, 60, 0.15)'}
                />
              );
            })
          )}

          {/* LawnMowers */}
          {gameWorld.lawnMowers.map((mower) => {
            if (mower.used) return null;
            return (
              <Group key={mower.id}>
                <Rect
                  x={mower.x}
                  y={mower.y}
                  width={35}
                  height={30}
                  color="#d32f2f"
                />
                <Circle cx={mower.x + 8} cy={mower.y + 28} r={5} color="#212121" />
                <Circle cx={mower.x + 28} cy={mower.y + 28} r={5} color="#212121" />
              </Group>
            );
          })}

          {/* Plants */}
          {gameWorld.plants.map((plant) => {
            const hpRatio = Math.max(0, plant.health / plant.maxHealth);

            return (
              <Group key={plant.id}>
                {/* Shadow */}
                <Circle
                  cx={plant.x}
                  cy={plant.y + 35}
                  r={22}
                  color="rgba(0,0,0,0.25)"
                />

                {/* Plant Shapes */}
                {plant.type === 'sunflower' && (
                  <Group>
                    <Circle cx={plant.x} cy={plant.y} r={24} color="#fbc02d" />
                    <Circle cx={plant.x} cy={plant.y} r={14} color="#795548" />
                  </Group>
                )}
                {plant.type === 'peashooter' && (
                  <Group>
                    <Circle cx={plant.x} cy={plant.y} r={20} color="#66bb6a" />
                    <Rect
                      x={plant.x + 8}
                      y={plant.y - 7}
                      width={16}
                      height={14}
                      color="#43a047"
                    />
                    <Circle cx={plant.x - 2} cy={plant.y - 5} r={4} color="#ffffff" />
                    <Circle cx={plant.x - 1} cy={plant.y - 5} r={2} color="#111111" />
                  </Group>
                )}
                {plant.type === 'snowpea' && (
                  <Group>
                    <Circle cx={plant.x} cy={plant.y} r={20} color="#4fc3f7" />
                    <Rect
                      x={plant.x + 8}
                      y={plant.y - 7}
                      width={16}
                      height={14}
                      color="#0288d1"
                    />
                  </Group>
                )}
                {plant.type === 'repeater' && (
                  <Group>
                    <Circle cx={plant.x} cy={plant.y} r={20} color="#43a047" />
                    <Rect
                      x={plant.x + 8}
                      y={plant.y - 10}
                      width={18}
                      height={10}
                      color="#2e7d32"
                    />
                    <Rect
                      x={plant.x + 8}
                      y={plant.y + 2}
                      width={18}
                      height={10}
                      color="#2e7d32"
                    />
                  </Group>
                )}
                {plant.type === 'wallnut' && (
                  <Group>
                    <Rect
                      x={plant.x - 18}
                      y={plant.y - 25}
                      width={36}
                      height={50}
                      color="#8d6e63"
                    />
                    <Circle cx={plant.x - 5} cy={plant.y - 8} r={3} color="#212121" />
                    <Circle cx={plant.x + 5} cy={plant.y - 8} r={3} color="#212121" />
                  </Group>
                )}
                {plant.type === 'chomper' && (
                  <Group>
                    <Circle cx={plant.x} cy={plant.y} r={22} color="#ab47bc" />
                    <Rect
                      x={plant.x + 2}
                      y={plant.y - 6}
                      width={18}
                      height={12}
                      color="#4a148c"
                    />
                  </Group>
                )}
                {plant.type === 'cherrybomb' && (
                  <Group>
                    <Circle cx={plant.x - 10} cy={plant.y + 5} r={16} color="#d32f2f" />
                    <Circle cx={plant.x + 10} cy={plant.y + 5} r={16} color="#c2185b" />
                  </Group>
                )}

                {/* Health Bar */}
                {hpRatio < 1 && (
                  <Group>
                    <Rect
                      x={plant.x - 20}
                      y={plant.y - 32}
                      width={40}
                      height={5}
                      color="rgba(0,0,0,0.5)"
                    />
                    <Rect
                      x={plant.x - 20}
                      y={plant.y - 32}
                      width={40 * hpRatio}
                      height={5}
                      color="#4caf50"
                    />
                  </Group>
                )}
              </Group>
            );
          })}

          {/* Projectiles */}
          {gameWorld.projectiles.map((p) => (
            <Group key={p.id}>
              <Circle
                cx={p.x}
                cy={p.y}
                r={7}
                color={p.slow ? '#29b6f6' : '#8bc34a'}
              />
              <Circle
                cx={p.x + 2}
                cy={p.y - 2}
                r={2.5}
                color="#ffffff"
              />
            </Group>
          ))}

          {/* Zombies */}
          {gameWorld.zombies.map((z) => {
            const zImg = zombieImages[z.type] || imgZombieNormal;
            const hpRatio = Math.max(0, z.health / z.maxHealth);

            return (
              <Group key={z.id}>
                {zImg ? (
                  <SkiaImage
                    image={zImg}
                    x={z.x - 30}
                    y={z.y - 45}
                    width={60}
                    height={80}
                    fit="contain"
                  />
                ) : (
                  <Group>
                    <Rect
                      x={z.x - 20}
                      y={z.y - 35}
                      width={40}
                      height={70}
                      color={z.isSlowed ? '#81d4fa' : '#689f38'}
                    />
                  </Group>
                )}

                {/* Zombie Health Bar */}
                {hpRatio < 1 && (
                  <Group>
                    <Rect
                      x={z.x - 25}
                      y={z.y - 52}
                      width={50}
                      height={6}
                      color="rgba(0,0,0,0.6)"
                    />
                    <Rect
                      x={z.x - 25}
                      y={z.y - 52}
                      width={50 * hpRatio}
                      height={6}
                      color={z.isSlowed ? '#00b0ff' : '#e53935'}
                    />
                  </Group>
                )}
              </Group>
            );
          })}

          {/* Suns */}
          {gameWorld.suns.map((sun) => (
            <Group key={sun.id}>
              <Circle
                cx={sun.x}
                cy={sun.y}
                r={24}
                color="rgba(255, 235, 59, 0.4)"
              />
              <Circle
                cx={sun.x}
                cy={sun.y}
                r={16}
                color="#ffeb3b"
              />
              <Circle
                cx={sun.x}
                cy={sun.y}
                r={11}
                color="#fff59d"
              />
            </Group>
          ))}
        </Group>
      </Canvas>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

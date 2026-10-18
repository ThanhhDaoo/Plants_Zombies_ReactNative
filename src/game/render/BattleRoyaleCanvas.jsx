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

  const camOffsetX = -camera.x + width / 2 + (camera.shakeX || 0);
  const camOffsetY = -camera.y + height / 2 + (camera.shakeY || 0);

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

          {/* Acid Patches */}
          {battleRoyaleEngine.acidPatches.map((patch) => (
            <Circle
              key={patch.id}
              cx={patch.x}
              cy={patch.y}
              r={patch.radius}
              color="rgba(198, 255, 0, 0.35)"
            />
          ))}

          {/* Ground Items (Loot & EXP) */}
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
              {item.type === 'exp' && (
                <Group>
                  <Circle cx={item.x} cy={item.y} r={9} color="rgba(0, 229, 255, 0.35)" />
                  <Circle cx={item.x} cy={item.y} r={5} color="#00e5ff" />
                  <Circle cx={item.x} cy={item.y} r={2} color="#ffffff" />
                </Group>
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

          {/* Enemy Projectiles (Boss Missiles) */}
          {battleRoyaleEngine.enemyProjectiles.map((proj) => (
            <Group key={proj.id}>
              <Circle cx={proj.x} cy={proj.y} r={proj.radius} color="#ff1744" />
              <Circle cx={proj.x} cy={proj.y} r={proj.radius * 0.45} color="#ffd600" />
            </Group>
          ))}

          {/* Shockwaves */}
          {battleRoyaleEngine.shockwaves.map((sw) => (
            <Circle
              key={sw.id}
              cx={sw.x}
              cy={sw.y}
              r={sw.radius}
              color={sw.color || 'rgba(233, 30, 99, 0.6)'}
              style="stroke"
              strokeWidth={5}
            />
          ))}

          {/* Zombies & Dr. Zomboss Mech */}
          {battleRoyaleEngine.zombies.map((z) => {
            const isBoss = z.type === 'zomboss_titan';
            const hpRatio = Math.max(0, z.health / z.maxHealth);

            if (isBoss) {
              return (
                <Group key={z.id}>
                  {/* Shadow */}
                  <Circle cx={z.x} cy={z.y + 20} r={z.radius * 1.1} color="rgba(0,0,0,0.45)" />

                  {/* Titan Mech Body */}
                  <Circle cx={z.x} cy={z.y} r={z.radius} color="#4a148c" />
                  <Circle cx={z.x} cy={z.y} r={z.radius * 0.75} color="#7b1fa2" />

                  {/* Mechanical Shoulder Cannons */}
                  <Rect
                    x={z.x - z.radius - 12}
                    y={z.y - 18}
                    width={22}
                    height={36}
                    color="#212121"
                  />
                  <Rect
                    x={z.x + z.radius - 10}
                    y={z.y - 18}
                    width={22}
                    height={36}
                    color="#212121"
                  />

                  {/* Laser Eye Visor */}
                  <Rect
                    x={z.x - 24}
                    y={z.y - 8}
                    width={48}
                    height={12}
                    color="#ff1744"
                  />
                  <Rect
                    x={z.x - 12}
                    y={z.y - 4}
                    width={24}
                    height={4}
                    color="#ffffff"
                  />

                  {/* Boss Overhead Health Bar */}
                  <Rect
                    x={z.x - 55}
                    y={z.y - z.radius - 20}
                    width={110}
                    height={10}
                    color="rgba(0,0,0,0.8)"
                  />
                  <Rect
                    x={z.x - 55}
                    y={z.y - z.radius - 20}
                    width={110 * hpRatio}
                    height={10}
                    color="#e91e63"
                  />
                </Group>
              );
            }

            const tex = zombieTextures[z.type] || imgZombieNormal;
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

                {/* Frozen Aura */}
                {z.isFrozen && (
                  <Circle
                    cx={z.x}
                    cy={z.y}
                    r={z.radius * 1.35}
                    color="rgba(0, 229, 255, 0.45)"
                  />
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

          {/* Player: Pea Hero with Skins & Pets */}
          {(() => {
            const skinId = player.skin || 'default';
            let bodyColor = '#66bb6a';
            let snoutColor = '#388e3c';

            if (skinId === 'ninja') {
              bodyColor = '#263238';
              snoutColor = '#102027';
            } else if (skinId === 'cowboy') {
              bodyColor = '#558b2f';
              snoutColor = '#33691e';
            } else if (skinId === 'cyberpunk') {
              bodyColor = '#00e5ff';
              snoutColor = '#00b0ff';
            } else if (skinId === 'arctic') {
              bodyColor = '#80deea';
              snoutColor = '#4dd0e1';
            }

            // Pet position
            const orbit = ((Date.now() / 800) % (Math.PI * 2));
            const petX = player.x + Math.cos(orbit) * 44;
            const petY = player.y + Math.sin(orbit) * 44;

            return (
              <Group>
                {/* Shadow */}
                <Circle
                  cx={player.x}
                  cy={player.y + 12}
                  r={player.radius}
                  color="rgba(0,0,0,0.3)"
                />

                {/* Arctic Frost Aura */}
                {skinId === 'arctic' && (
                  <Circle
                    cx={player.x}
                    cy={player.y}
                    r={130}
                    color="rgba(0, 229, 255, 0.15)"
                    style="stroke"
                    strokeWidth={2}
                  />
                )}

                {/* Dash Speed Ghost */}
                {player.isDashing && (
                  <Circle
                    cx={player.x - Math.cos(player.angle) * 30}
                    cy={player.y - Math.sin(player.angle) * 30}
                    r={player.radius * 0.9}
                    color={bodyColor}
                    opacity={0.4}
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
                <Circle cx={player.x} cy={player.y} r={player.radius} color={bodyColor} />

                {/* Skin Details: Ninja Headband */}
                {skinId === 'ninja' && (
                  <Rect
                    x={player.x - 16}
                    y={player.y - 12}
                    width={32}
                    height={7}
                    color="#d32f2f"
                  />
                )}

                {/* Skin Details: Cowboy Hat */}
                {skinId === 'cowboy' && (
                  <Group>
                    <Rect
                      x={player.x - 22}
                      y={player.y - player.radius - 6}
                      width={44}
                      height={6}
                      color="#4e342e"
                    />
                    <Rect
                      x={player.x - 14}
                      y={player.y - player.radius - 14}
                      width={28}
                      height={10}
                      color="#5d4037"
                    />
                  </Group>
                )}

                {/* Skin Details: Cyberpunk Core */}
                {skinId === 'cyberpunk' && (
                  <Circle cx={player.x} cy={player.y} r={6} color="#ff007f" />
                )}

                {/* Snout pointing at player.angle */}
                <Circle
                  cx={player.x + Math.cos(player.angle) * 22}
                  cy={player.y + Math.sin(player.angle) * 22}
                  r={9}
                  color={snoutColor}
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

                {/* Orbiting Pet Companion */}
                {player.pet && (
                  <Group>
                    {/* Pet Shadow */}
                    <Circle cx={petX} cy={petY + 6} r={10} color="rgba(0,0,0,0.25)" />

                    {player.pet === 'mini_sunflower' && (
                      <Group>
                        <Circle cx={petX} cy={petY} r={14} color="#fbc02d" />
                        <Circle cx={petX} cy={petY} r={8} color="#fff59d" />
                      </Group>
                    )}

                    {player.pet === 'mini_wallnut' && (
                      <Group>
                        <Circle cx={petX} cy={petY} r={13} color="#8d6e63" />
                        {player.wallnutShieldActive && (
                          <Circle
                            cx={player.x}
                            cy={player.y}
                            r={player.radius * 1.55}
                            color="#ffd54f"
                            style="stroke"
                            strokeWidth={3}
                          />
                        )}
                      </Group>
                    )}

                    {player.pet === 'mini_shroom' && (
                      <Group>
                        <Circle cx={petX} cy={petY} r={12} color="#ab47bc" />
                        <Circle cx={petX} cy={petY + 4} r={6} color="#e1bee7" />
                      </Group>
                    )}
                  </Group>
                )}
              </Group>
            );
          })()}
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

<template>
  <div
    ref="container"
    class="three-container"
  >
    <TresCanvas preset="realistic">
      <TresPerspectiveCamera
        :position="[0, 0, 3]"
        :look-at="[0, 0, 0]"
      />
      <TresMesh>
        <TresTorusGeometry :args="[0.5, 0.2, 8, 128]" />
        <TresMeshBasicMaterial color="orange" />
      </TresMesh>
      <TresAmbientLight :intensity="1" />
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
// import { TresCanvas } from "@tresjs/core";
import { onMounted, ref } from "vue";
// import { Application, SpriteMap, Character, SpriteMesh } from "sprite-craft";
import "sprite-craft/style.css";
import gsap from "gsap";

const container = ref<HTMLDivElement>();

// onMounted(() => {
//   if (!container.value) return;
//   const app = new Application(container.value);
//   app.render();

//   const sprite_map = app.usePlugin(SpriteMap);

//   app.assets
//     .loadTexture([
//       { name: "city", path: "/others/city.png" },
//       { name: "character", path: "/others/001_00.png" },
//     ])
//     .then(() => {
//       sprite_map.loadMap({
//         name: "sprite_city",
//         assets_name: "city",
//         children: [
//           // 背景
//           {
//             name: "background-city",
//             bounds: {
//               x: 64,
//               y: 2400,
//               w: 1594,
//               h: 320,
//             },
//             position: {
//               x: 0,
//               y: 0,
//               z: -10,
//             },
//             scale: 0.05,
//           },
//           // 云层
//           {
//             name: "cloud",
//             bounds: {
//               x: 64,
//               y: 400,
//               w: 1512,
//               h: 112,
//             },
//             position: {
//               x: 0,
//               y: 4,
//               z: -7,
//             },
//             scale: 0.05,
//           },
//           // 房屋
//           {
//             name: "house",
//             bounds: {
//               x: 85,
//               y: 1622,
//               w: 1714,
//               h: 245,
//             },
//             position: {
//               x: 0,
//               y: -0.25,
//               z: -0.1,
//             },
//             scale: 0.02,
//           },
//         ],
//       });

//       const character_01 = new SpriteMesh(app.assets.getTexture("character"), {
//         name: "character_01",
//         bounds: {
//           x: 0,
//           y: 0,
//           w: 46,
//           h: 77,
//         },
//         scale: 0.0065,
//         position: {
//           x: 0,
//           y: -2.1,
//           z: 0,
//         },
//         side: 2,
//       });
//       app.scene.add(character_01);

//       character_01.addAnimation({
//         name: "walk",
//         start_bounds: {
//           x: 0,
//           y: 0,
//           w: 46,
//           h: 77,
//         },
//         offset: 0,
//         time_scale: 0.6,
//         direction: "horizontal",
//         frame_count: 4,
//       });

//       character_01.addAnimation({
//         name: "idle",
//         start_bounds: {
//           x: 0,
//           y: 0,
//           w: 46,
//           h: 77,
//         },
//         offset: 0,
//         time_scale: 0.6,
//         direction: "horizontal",
//         frame_count: 1,
//       });

//       const keys: Record<"ArrowRight" | "ArrowLeft" | "Space", boolean> = {
//         ArrowLeft: false,
//         ArrowRight: false,
//         Space: false,
//       };

//       const speed = 1;
//       let isWalking = false;
//       const jumpHeight = 1;
//       let isJumping = false;

//       let animation: ReturnType<typeof gsap.to> | undefined = undefined;

//       function jump() {
//         if (isJumping) return;
//         isJumping = true;

//         const initY = character_01.position.y;
//         const _jumpHeight = initY + jumpHeight;

//         animation = gsap.to(character_01.position, {
//           y: _jumpHeight,
//           duration: 0.3,
//           yoyo: true,
//           repeat: 1,
//           ease: "power1.out",
//           onComplete: () => {
//             character_01.position.y = initY;
//             isJumping = false;
//           },
//         });
//       }

//       app.$on("render-loop", ({ delta, elapsed_time, fps }) => {
//         if (keys.ArrowRight) {
//           forward(delta);
//         }

//         if (keys.ArrowLeft) {
//           backward(delta);
//         }

//         if (keys.Space) {
//           jump();
//         }
//       });

//       window.addEventListener("keydown", (e) => {
//         console.log(e.key);

//         if (e.key === " ") {
//           keys.Space = true;
//         } else {
//           keys[e.key] = true;
//         }

//         if (["ArrowRight", "ArrowLeft"].includes(e.key)) {
//           if (isWalking) return;
//           isWalking = true;
//           character_01.playAnimation("walk");
//         }
//       });

//       window.addEventListener("keyup", (e) => {
//         if (e.key === " ") {
//           keys.Space = false;
//         } else {
//           keys[e.key] = false;
//         }

//         if (["ArrowRight", "ArrowLeft"].includes(e.key)) {
//           isWalking = false;
//           character_01.playAnimation("idle");
//         }
//       });

//       function forward(delta: number) {
//         character_01.rotation.y = 0;
//         setX(getX() + speed * delta);
//       }

//       function backward(delta: number) {
//         character_01.rotation.y = -Math.PI;
//         setX(getX() - speed * delta);
//       }

//       function getX() {
//         return character_01.position.x;
//       }

//       function setX(x: number) {
//         character_01.position.x = x;
//         app.camera.position.x = x;
//       }

//       // const character = app.usePlugin(Character, sprite_map, {
//       //   name: "character",
//       //   texture: app.assets.getTexture("character"),
//       //   bounds: {
//       //     x: 0,
//       //     y: 0,
//       //     w: 46,
//       //     h: 77,
//       //   },
//       //   scale: 0.0065,
//       //   position: {
//       //     x: 0,
//       //     y: -2.1,
//       //     z: 0,
//       //   },
//       //   map: [
//       //     {
//       //       name: "sprite_city",
//       //       spawn_points: {
//       //         x: 1,
//       //         y: -0,
//       //         z: 0,
//       //       },
//       //       boundary: {
//       //         min: -13,
//       //         max: 13,
//       //       },
//       //     },
//       //   ],
//       // });
//     });

//   // app.assets
//   //   .loadTexture({
//   //     name: "character",
//   //     path: "/others/001_00.png",
//   //   })
//   //   .then((texture) => {
//   //     const sprite = new SpriteMesh(texture, {
//   //       name: "pikachu",
//   //       bounds: {
//   //         x: 46 * 0,
//   //         y: 0,
//   //         w: 46,
//   //         h: 77,
//   //       },
//   //       scale: 0.003,
//   //     });
//   //     // 将精灵添加至场景
//   //     app.scene.add(sprite);

//   //     // sprite.update();

//   //     // 播放帧动画
//   //     // sprite.playAnimation("walk");
//   //   });
// });
</script>

<style scoped lang="less">
.three-container {
  width: 100vw;
  height: calc(100vh - 64px);
}
</style>

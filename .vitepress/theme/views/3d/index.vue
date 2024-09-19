<template>
  <div
    ref="container"
    class="three-container"
  >
    <!-- <TresCanvas preset="realistic">
      <TresPerspectiveCamera
        :position="[0, 0, 3]"
        :look-at="[0, 0, 0]"
      />
      <TresMesh>
        <TresTorusGeometry :args="[0.5, 0.2, 8, 128]" />
        <TresMeshBasicMaterial color="orange" />
      </TresMesh>
      <TresAmbientLight :intensity="1" />
    </TresCanvas> -->
  </div>
</template>

<script setup lang="ts">
// import { TresCanvas } from "@tresjs/core";
import { onMounted, ref } from "vue";
import { Application, SpriteMap, Character, SpriteMesh } from "sprite-craft";
import "sprite-craft/style.css";

const container = ref<HTMLDivElement>();

onMounted(() => {
  if (!container.value) return;
  const app = new Application(container.value);
  app.render();

  const sprite_map = app.usePlugin(SpriteMap);

  app.assets
    .loadTexture([
      { name: "city", path: "/others/city.png" },
      { name: "character", path: "/others/001_00.png" },
    ])
    .then(() => {
      sprite_map.loadMap({
        name: "sprite_city",
        assets_name: "city",
        children: [
          // 背景
          {
            name: "background-city",
            bounds: {
              x: 64,
              y: 2400,
              w: 1594,
              h: 320,
            },
            position: {
              x: 0,
              y: 0,
              z: -10,
            },
            scale: 0.05,
          },
          // 云层
          {
            name: "cloud",
            bounds: {
              x: 64,
              y: 400,
              w: 1512,
              h: 112,
            },
            position: {
              x: 0,
              y: 4,
              z: -7,
            },
            scale: 0.05,
          },
          // 房屋
          {
            name: "house",
            bounds: {
              x: 85,
              y: 1622,
              w: 1714,
              h: 245,
            },
            position: {
              x: 0,
              y: -0.25,
              z: -0.1,
            },
            scale: 0.02,
          },
        ],
      });

      const character_01 = new SpriteMesh(app.assets.getTexture("character"), {
        name: "character_01",
        bounds: {
          x: 0,
          y: 0,
          w: 46,
          h: 77,
        },
        scale: 0.0065,
        position: {
          x: 0,
          y: -2.1,
          z: 0,
        },
        side: 2,
      });
      app.scene.add(character_01);

      // character_01.position.x = -1;

      // character_01.rotateY(3 * Math.PI);

      function reverseMesh(mesh: SpriteMesh, direction: 2 | 3 = 2) {
        mesh.rotateY(Math.PI * direction);
      }

      character_01.addAnimation({
        name: "walk",
        start_bounds: {
          x: 0,
          y: 0,
          w: 46,
          h: 77,
        },
        offset: 0,
        time_scale: 0.8,
        direction: "horizontal",
        frame_count: 4,
      });

      character_01.addAnimation({
        name: "idle",
        start_bounds: {
          x: 0,
          y: 0,
          w: 46,
          h: 77,
        },
        offset: 0,
        time_scale: 0.8,
        direction: "horizontal",
        frame_count: 1,
      });

      const keys: Record<"ArrowRight" | "ArrowLeft", boolean> = {
        ArrowLeft: false,
        ArrowRight: false,
      };

      const speed = 0.01;
      let isWalking = false;

      document.addEventListener("keydown", (e) => {
        console.log(e.key);

        keys[e.key] = true;

        if (e.key === "ArrowRight") {
          console.log("ArrowRight isWalking", isWalking);

          if (isWalking) return;
          isWalking = true;
          // reverseMesh(character_01);
          character_01.rotateY(2 * Math.PI);

          character_01.playAnimation("walk");
        }

        if (e.key === "ArrowLeft") {
          console.log("ArrowLeft isWalking", isWalking);

          if (isWalking) return;
          isWalking = true;
          // reverseMesh(character_01, 3);
          character_01.rotateY(3 * Math.PI);

          character_01.playAnimation("walk");
        }
      });

      document.addEventListener("keyup", (e) => {
        keys[e.key] = false;

        if (["ArrowRight", "ArrowLeft"].includes(e.key)) {
          isWalking = false;
          character_01.playAnimation("idle");
          return;
        }

        // if (e.key === "ArrowRight") {
        //   isWalking = false;
        //   character_01.playAnimation("idle");
        //   return;
        // }

        // if (e.key === "ArrowLeft") {
        //   isWalking = false;
        //   character_01.playAnimation("idle");
        //   return;
        // }
      });

      action();

      function action() {
        if (keys.ArrowRight) {
          move();
        }

        if (keys.ArrowLeft) {
          move(-1);
        }

        requestAnimationFrame(action);
      }

      function move(direction: 1 | -1 = 1) {
        setX(getX() + speed * direction);
      }

      function getX() {
        return character_01.position.x;
      }

      function setX(x: number) {
        character_01.position.x = x;
        app.camera.position.x = x;
      }

      // const character = app.usePlugin(Character, sprite_map, {
      //   name: "character",
      //   texture: app.assets.getTexture("character"),
      //   bounds: {
      //     x: 0,
      //     y: 0,
      //     w: 46,
      //     h: 77,
      //   },
      //   scale: 0.0065,
      //   position: {
      //     x: 0,
      //     y: -2.1,
      //     z: 0,
      //   },
      //   map: [
      //     {
      //       name: "sprite_city",
      //       spawn_points: {
      //         x: 1,
      //         y: -0,
      //         z: 0,
      //       },
      //       boundary: {
      //         min: -13,
      //         max: 13,
      //       },
      //     },
      //   ],
      // });
    });

  // app.assets
  //   .loadTexture({
  //     name: "character",
  //     path: "/others/001_00.png",
  //   })
  //   .then((texture) => {
  //     const sprite = new SpriteMesh(texture, {
  //       name: "pikachu",
  //       bounds: {
  //         x: 46 * 0,
  //         y: 0,
  //         w: 46,
  //         h: 77,
  //       },
  //       scale: 0.003,
  //     });
  //     // 将精灵添加至场景
  //     app.scene.add(sprite);

  //     // sprite.update();

  //     // 播放帧动画
  //     // sprite.playAnimation("walk");
  //   });
});
</script>

<style scoped lang="less">
.three-container {
  width: 100vw;
  height: calc(100vh - 64px);
}
</style>

<template>
  <section class="gallery-page">
    <header class="gallery-toolbar">
      <div class="gallery-heading">
        <p>@gallery-engine/suite</p>
        <h1>Gallery</h1>
      </div>

      <div class="gallery-actions" role="group" aria-label="Layout">
        <button
          v-for="mode in layoutModes"
          :key="mode"
          type="button"
          :class="{ active: layoutMode === mode }"
          :aria-pressed="layoutMode === mode"
          @click="setLayoutMode(mode)"
        >
          {{ layoutLabels[mode] }}
        </button>
      </div>
    </header>

    <div class="gallery-meta" aria-live="polite">
      <span>{{ renderedCount }}</span>
      <span>{{ layoutLabels[layoutMode] }}</span>
    </div>

    <div
      ref="containerRef"
      class="gallery-engine-canvas"
      aria-label="Gallery images"
    />

    <Teleport to="body">
      <div
        v-if="previewState.visible && previewState.item"
        class="gallery-preview"
        @click.self="closePreview"
        @wheel.self.prevent="onPreviewWheelFallback"
      >
        <div class="gallery-preview__bar">
          <strong>{{ previewState.item.title ?? previewState.item.id }}</strong>
          <div class="gallery-preview__tools">
            <button type="button" aria-label="Zoom out" @click="zoomOut">
              -
            </button>
            <button type="button" aria-label="Reset zoom" @click="resetZoom">
              {{ zoomLabel }}
            </button>
            <button type="button" aria-label="Zoom in" @click="zoomIn">
              +
            </button>
            <button type="button" aria-label="Close preview" @click="closePreview">
              x
            </button>
          </div>
        </div>

        <button
          class="gallery-preview__nav gallery-preview__nav--prev"
          type="button"
          aria-label="Previous image"
          @click="prevPreview"
        >
          Prev
        </button>
        <figure ref="previewFigureRef" class="gallery-preview__figure">
          <img
            ref="previewImageRef"
            :src="previewState.item.src"
            :alt="previewState.item.alt ?? ''"
            :class="{ dragging: zoomState.dragging }"
            :style="previewImageStyle"
            @pointerdown="onPreviewPointerDown"
            @pointerup="onPreviewPointerUp"
            @pointercancel="onPreviewPointerUp"
          />
          <figcaption v-if="previewState.item.description">
            {{ previewState.item.description }}
          </figcaption>
        </figure>
        <button
          class="gallery-preview__nav gallery-preview__nav--next"
          type="button"
          aria-label="Next image"
          @click="nextPreview"
        >
          Next
        </button>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { GalleryImage } from "@gallery-engine/suite";
import getPictures from "../../utils/getPictures";
import { useGalleryEngine } from "./useGalleryEngine";
import type { GalleryLayoutMode } from "./useGalleryEngine";

type Picture = {
  readonly path: string;
  readonly name: string;
};

const layoutModes: readonly GalleryLayoutMode[] = ["masonry", "grid", "justified"];
const layoutLabels: Record<GalleryLayoutMode, string> = {
  masonry: "Masonry",
  grid: "Grid",
  justified: "Rows",
};

const { shuffleds } = getPictures();
const images = shuffleds.map(toGalleryImage);

const {
  closePreview,
  containerRef,
  layoutMode,
  nextPreview,
  onPreviewPointerDown,
  onPreviewPointerUp,
  onPreviewWheelFallback,
  previewFigureRef,
  previewImageRef,
  previewState,
  prevPreview,
  renderedCount,
  resetZoom,
  setLayoutMode,
  zoomIn,
  zoomOut,
  zoomState,
} = useGalleryEngine(images);

const zoomLabel = computed(() => `${Math.round(zoomState.value.zoom * 100)}%`);
const previewImageStyle = computed(() => ({
  transform: `translate3d(${zoomState.value.panX}px, ${zoomState.value.panY}px, 0) scale(${zoomState.value.zoom})`,
}));

function toGalleryImage(picture: Picture, index: number): GalleryImage {
  const size = inferImageSize(index, picture.name);

  return {
    id: createImageId(picture.path, index),
    src: picture.path,
    thumbnail: picture.path,
    alt: picture.name,
    title: picture.name,
    width: size.width,
    height: size.height,
    metadata: {
      source: "site/public",
    },
  };
}

function createImageId(path: string, index: number): string {
  const slug = path
    .replace(/^\//, "")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `gallery-${slug || String(index)}`;
}

function inferImageSize(index: number, name: string): { width: number; height: number } {
  const width = 900;
  const seed = [...name].reduce((total, char) => total + char.charCodeAt(0), index);
  const height = 560 + (seed % 5) * 90;

  return {
    width,
    height,
  };
}
</script>

<style scoped lang="less">
.gallery-page {
  max-width: min(1180px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 2.5rem 0 4.5rem;
}

.gallery-toolbar {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.gallery-heading {
  min-width: 0;

  p {
    margin: 0 0 0.25rem;
    color: var(--vp-c-text-2);
    font-size: 0.78rem;
  }

  h1 {
    margin: 0;
    color: var(--vp-c-text-1);
    font-size: clamp(2rem, 7vw, 4.5rem);
    line-height: 0.96;
  }
}

.gallery-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;

  button {
    height: 34px;
    padding: 0 0.85rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-2);
    font-size: 0.84rem;
    cursor: pointer;
    transition:
      border-color 0.2s,
      color 0.2s,
      background 0.2s;

    &:hover,
    &.active {
      border-color: var(--vp-c-brand-1);
      background: var(--vp-c-brand-soft);
      color: var(--vp-c-text-1);
    }
  }
}

.gallery-meta {
  display: flex;
  gap: 0.55rem;
  align-items: center;
  min-height: 24px;
  margin-bottom: 1.25rem;
  color: var(--vp-c-text-2);
  font-size: 0.84rem;

  span + span::before {
    content: "/";
    margin-right: 0.55rem;
    color: var(--vp-c-divider);
  }
}

.gallery-engine-canvas {
  position: relative;
  min-height: 420px;
  transition: height 0.24s ease;
}

:deep(.gallery-engine-item) {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider), transparent 20%);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 14px 42px rgba(0, 0, 0, 0.12);
  cursor: zoom-in;
  outline: none;
  transition:
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

:deep(.gallery-engine-item:hover),
:deep(.gallery-engine-item:focus-visible) {
  filter: brightness(1.04);
  box-shadow: 0 18px 52px rgba(0, 0, 0, 0.2);
}

:deep(.gallery-engine-image) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
}

.gallery-preview {
  position: fixed;
  inset: 0;
  z-index: calc(var(--z-i-top) + 3);
  display: grid;
  grid-template-columns: minmax(72px, 0.14fr) minmax(0, 1fr) minmax(72px, 0.14fr);
  align-items: center;
  padding: 5rem max(1rem, 4vw) 2rem;
  background: rgba(7, 8, 12, 0.88);
  backdrop-filter: blur(18px);
}

.gallery-preview__bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  height: 56px;
  padding: 0 max(1rem, 4vw);
  color: rgba(255, 255, 255, 0.92);
  background: rgba(7, 8, 12, 0.72);

  strong {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.92rem;
  }
}

.gallery-preview__tools {
  display: flex;
  gap: 0.5rem;

  button {
    min-width: 36px;
    height: 34px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    cursor: pointer;
  }
}

.gallery-preview__figure {
  display: grid;
  place-items: center;
  min-width: 0;
  margin: 0;

  img {
    display: block;
    max-width: min(100%, 1100px);
    max-height: calc(100vh - 8.5rem);
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 26px 80px rgba(0, 0, 0, 0.45);
    cursor: grab;
    touch-action: none;
    transform-origin: center center;
    transition: transform 0.18s ease;
    user-select: none;

    &.dragging {
      cursor: grabbing;
      transition: none;
    }
  }

  figcaption {
    margin-top: 1rem;
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.9rem;
  }
}

.gallery-preview__nav {
  justify-self: center;
  width: 64px;
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
}

@media (max-width: 720px) {
  .gallery-page {
    max-width: calc(100vw - 24px);
    padding-top: 1.5rem;
  }

  .gallery-toolbar {
    display: block;
  }

  .gallery-actions {
    justify-content: flex-start;
    margin-top: 1rem;
  }

  .gallery-preview {
    grid-template-columns: 1fr;
    padding: 4.5rem 0.75rem 1.25rem;
  }

  .gallery-preview__nav {
    position: fixed;
    bottom: 1rem;
    z-index: 2;
  }

  .gallery-preview__nav--prev {
    left: 1rem;
  }

  .gallery-preview__nav--next {
    right: 1rem;
  }

  .gallery-preview__figure img {
    max-height: calc(100vh - 9rem);
  }
}
</style>

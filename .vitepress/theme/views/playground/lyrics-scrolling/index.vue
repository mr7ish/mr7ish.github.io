<template>
  <section class="lyrics-demo">
    <section class="hero-tile">
      <div class="hero-copy">
        <p class="eyebrow">lyrics-scrolling</p>
        <h1>{{ activeTrack.title }}</h1>
        <p class="tagline">{{ activeTrack.artist }} / {{ activeTrack.album }}</p>
        <div class="hero-actions">
          <button class="primary-pill" type="button" @click="togglePlayback">
            <span class="button-icon" aria-hidden="true">{{ isPlaying ? "||" : ">" }}</span>
            {{ isPlaying ? "Pause" : "Play" }}
          </button>
          <button class="secondary-pill" type="button" @click="restartPlayback">
            <span class="button-icon" aria-hidden="true">R</span>
            Restart
          </button>
        </div>
      </div>

      <div class="cover-stage">
        <img :src="activeTrack.cover" :alt="`${activeTrack.title} cover`" />
      </div>
    </section>

    <section class="player-tile">
      <div class="track-strip" aria-label="Song list">
        <button
          v-for="(track, index) in tracks"
          :key="track.id"
          :class="['track-chip', { active: index === activeTrackIndex }]"
          type="button"
          @click="selectTrack(index)"
        >
          <span>{{ track.title }}</span>
          <small>{{ track.artist }}</small>
        </button>
      </div>

      <div class="player-grid">
        <div class="player-panel">
          <audio
            ref="audioElement"
            :src="activeTrack.audio"
            preload="metadata"
            @ended="playNext"
          />

          <div class="mini-cover">
            <img :src="activeTrack.cover" :alt="`${activeTrack.title} cover`" />
          </div>

          <div class="now-playing">
            <span class="caption">Now Playing</span>
            <strong>{{ activeTrack.title }}</strong>
            <span>{{ activeTrack.artist }}</span>
          </div>

          <div class="timeline">
            <input
              :max="timelineMaxMs"
              :value="playbackTimeMs"
              min="0"
              step="250"
              type="range"
              @input="seekFromInput"
            />
            <div class="time-row">
              <span>{{ formatTime(playbackTimeMs) }}</span>
              <span>{{ formatTime(timelineMaxMs) }}</span>
            </div>
          </div>

          <div class="control-row">
            <button class="icon-button" type="button" aria-label="Previous song" @click="playPrevious">
              {{ "<" }}
            </button>
            <button class="play-button" type="button" @click="togglePlayback">
              {{ isPlaying ? "Pause" : "Play" }}
            </button>
            <button class="icon-button" type="button" aria-label="Next song" @click="playNext">
              {{ ">" }}
            </button>
          </div>
        </div>

        <div class="lyrics-panel">
          <div class="lyrics-head">
            <span>{{ currentLyricTime }}</span>
            <strong>{{ currentLyricText }}</strong>
          </div>

          <LyricsScroller
            :current-time-ms="playbackTimeMs"
            :karaoke-fallback-duration-ms="2400"
            :line-height="54"
            :lines="lyricLines"
            :visible-line-count="9"
            align="center"
            highlight-color="#ffffff"
            highlight-glow-color="rgba(41, 151, 255, 0.34)"
            highlight-mode="karaoke"
            karaoke-mode="width-fill"
            placeholder="Lyrics will appear here."
            scroll-mode="smooth"
          />
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import {
  LyricsScroller,
  findActiveLyricIndex,
  parseLrc,
  stringifyLrcTime,
  useAudioPlaybackTime,
} from "lyrics-scrolling";
import "lyrics-scrolling/style.css";

type DemoTrack = {
  id: string;
  title: string;
  artist: string;
  album: string;
  audio: string;
  cover: string;
  lrc: string;
};

// @ts-ignore
const musicModules = import.meta.glob<string>("../../../../../site/music/*", {
  eager: true,
  import: "default",
});

// @ts-ignore
const coverModules = import.meta.glob<string>("../../../../../site/music/covers/*", {
  eager: true,
  import: "default",
});

// @ts-ignore
const lyricModules = import.meta.glob<string>("../../../../../site/music/lyrics/*.txt", {
  eager: true,
  query: "?raw",
  import: "default",
});

function assetFrom(modules: Record<string, string>, path: string) {
  const asset = modules[path];

  if (!asset) {
    throw new Error(`Missing lyrics-scrolling demo asset: ${path}`);
  }

  return asset;
}

function musicAsset(fileName: string) {
  return assetFrom(musicModules, `../../../../../site/music/${fileName}`);
}

function coverAsset(fileName: string) {
  return assetFrom(coverModules, `../../../../../site/music/covers/${fileName}`);
}

function lyricAsset(fileName: string) {
  return assetFrom(lyricModules, `../../../../../site/music/lyrics/${fileName}`);
}

const tracks: DemoTrack[] = [
  {
    id: "lover",
    title: "Lover",
    artist: "Taylor Swift",
    album: "Lover",
    audio: musicAsset("Taylor Swift - Lover - Lover.flac"),
    cover: coverAsset("Taylor Swift - Lover.jpg"),
    lrc: lyricAsset("Taylor Swift - Lover.txt"),
  },
  {
    id: "all-too-well",
    title: "All Too Well (10 Minute)",
    artist: "Taylor Swift",
    album: "RED",
    audio: musicAsset("Taylor Swift - All Too Well (10 Minute) - RED.flac"),
    cover: coverAsset("Taylor Swift - RED.jpg"),
    lrc: lyricAsset("Taylor Swift - All Too Well (10 Minute).txt"),
  },
  {
    id: "period",
    title: "\u53e5\u53f7",
    artist: "G.E.M. \u9093\u7d2b\u68cb",
    album: "\u6469\u5929\u52a8\u7269\u56ed",
    audio: musicAsset("G_E_M_ \u9093\u7d2b\u68cb - \u53e5\u53f7.ogg"),
    cover: coverAsset("G_E_M_ \u9093\u7d2b\u68cb.jpg"),
    lrc: lyricAsset("G_E_M_ \u9093\u7d2b\u68cb - \u53e5\u53f7.txt"),
  },
  {
    id: "happy-tears",
    title: "\u9ad8\u5174\u7684\u773c\u6cea",
    artist: "SPICY CHOCOLATE",
    album: "\u9ad8\u5174\u7684\u773c\u6cea",
    audio: musicAsset("SPICY CHOCOLATE - \u9ad8\u5174\u7684\u773c\u6cea.flac"),
    cover: coverAsset("SPICY CHOCOLATE - \u9ad8\u5174\u7684\u773c\u6cea.jpg"),
    lrc: lyricAsset("SPICY CHOCOLATE - \u9ad8\u5174\u7684\u773c\u6cea.txt"),
  },
  {
    id: "september",
    title: "\u4e5d\u6708",
    artist: "\u82cf\u6253\u7eff",
    album: "\u590f/\u72c2\u70ed",
    audio: musicAsset("\u82cf\u6253\u7eff - \u4e5d\u6708.ogg"),
    cover: coverAsset("\u82cf\u6253\u7eff - \u4e5d\u6708.jpg"),
    lrc: lyricAsset("\u82cf\u6253\u7eff - \u4e5d\u6708.txt"),
  },
];

const activeTrackIndex = ref(0);
const audioElement = ref<HTMLAudioElement | null>(null);

const activeTrack = computed(() => tracks[activeTrackIndex.value]);
const parsedLyrics = computed(() => parseLrc(activeTrack.value.lrc));
const lyricLines = computed(() => parsedLyrics.value.lines);
const fallbackMaxTimeMs = computed(() => {
  const lastLine = lyricLines.value.at(-1);
  return lastLine ? lastLine.timeMs + 4_000 : 180_000;
});

const {
  isPlaying,
  playbackTimeMs,
  restartPlayback,
  seekToTimeMs,
  timelineMaxMs,
  togglePlayback,
} = useAudioPlaybackTime({
  audioElement,
  fallbackMaxTimeMs,
});

const activeLyricIndex = computed(() =>
  findActiveLyricIndex(lyricLines.value, playbackTimeMs.value)
);
const currentLyric = computed(() => lyricLines.value[activeLyricIndex.value]);
const currentLyricText = computed(() => currentLyric.value?.text || activeTrack.value.title);
const currentLyricTime = computed(() =>
  currentLyric.value ? stringifyLrcTime(currentLyric.value.timeMs) : "[00:00.000]"
);

async function selectTrack(index: number) {
  if (index === activeTrackIndex.value) return;

  const shouldResume = isPlaying.value;
  activeTrackIndex.value = index;
  seekToTimeMs(0);

  await nextTick();
  audioElement.value?.load();

  if (shouldResume) {
    await audioElement.value?.play().catch(() => undefined);
  }
}

function playPrevious() {
  const previousIndex =
    activeTrackIndex.value === 0 ? tracks.length - 1 : activeTrackIndex.value - 1;
  selectTrack(previousIndex);
}

function playNext() {
  const nextIndex =
    activeTrackIndex.value === tracks.length - 1 ? 0 : activeTrackIndex.value + 1;
  selectTrack(nextIndex);
}

function seekFromInput(event: Event) {
  const target = event.target as HTMLInputElement;
  seekToTimeMs(Number(target.value));
}

function formatTime(timeMs: number) {
  const totalSeconds = Math.max(0, Math.floor(timeMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = `${totalSeconds % 60}`.padStart(2, "0");
  return `${minutes}:${seconds}`;
}
</script>

<style scoped lang="less">
.lyrics-demo {
  --action-blue: #0066cc;
  --action-blue-dark: #2997ff;
  --ink: #1d1d1f;
  --muted: #7a7a7a;
  --parchment: #f5f5f7;
  --dark-tile: #272729;
  --dark-tile-2: #252527;

  width: 100vw;
  min-height: calc(100vh - var(--vp-nav-height));
  margin: calc(var(--vp-nav-height) * -1) 0 0 50%;
  transform: translateX(-50%);
  color: var(--ink);
  background: #ffffff;
  font-family: "SF Pro Text", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.hero-tile,
.player-tile {
  width: 100%;
  padding: 80px 32px;
}

.hero-tile {
  min-height: min(760px, calc(100vh - var(--vp-nav-height)));
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(280px, 1.1fr);
  align-items: center;
  gap: 56px;
  background: var(--parchment);
}

.hero-copy {
  justify-self: end;
  max-width: 520px;
  text-align: center;
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: 0;
}

h1 {
  margin: 0;
  color: var(--ink);
  font-family: "SF Pro Display", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 56px;
  font-weight: 600;
  line-height: 1.07;
  letter-spacing: -0.28px;
}

.tagline {
  margin: 14px 0 0;
  color: var(--ink);
  font-size: 24px;
  font-weight: 300;
  line-height: 1.5;
  letter-spacing: 0;
}

.hero-actions,
.control-row,
.time-row,
.lyrics-head {
  display: flex;
  align-items: center;
}

.hero-actions {
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}

button {
  border: 0;
  font: inherit;
  cursor: pointer;
  transition: transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease;
}

button:active {
  transform: scale(0.95);
}

button:focus-visible,
input:focus-visible {
  outline: 2px solid #0071e3;
  outline-offset: 3px;
}

.primary-pill,
.secondary-pill,
.play-button {
  min-height: 44px;
  border-radius: 9999px;
}

.primary-pill,
.play-button {
  background: var(--action-blue);
  color: #ffffff;
}

.primary-pill,
.secondary-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 22px;
  font-size: 17px;
  line-height: 1.47;
  letter-spacing: 0;
}

.secondary-pill {
  border: 1px solid var(--action-blue);
  color: var(--action-blue);
  background: #ffffff;
}

.button-icon {
  display: inline-grid;
  min-width: 14px;
  place-items: center;
  font-size: 14px;
}

.cover-stage {
  justify-self: start;
  width: min(440px, 100%);
  aspect-ratio: 1;
}

.cover-stage img,
.mini-cover img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border-radius: 18px;
}

.cover-stage img {
  box-shadow: rgba(0, 0, 0, 0.22) 3px 5px 30px 0;
}

.player-tile {
  background: var(--dark-tile);
  color: #ffffff;
}

.track-strip,
.player-grid {
  width: min(1180px, 100%);
  margin: 0 auto;
}

.track-strip {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.track-chip {
  min-height: 76px;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  color: rgba(255, 255, 255, 0.76);
  background: var(--dark-tile-2);
  text-align: left;
}

.track-chip span,
.track-chip small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.track-chip span {
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.24;
  letter-spacing: 0;
}

.track-chip small {
  margin-top: 6px;
  color: #cccccc;
  font-size: 12px;
  line-height: 1.3;
  letter-spacing: 0;
}

.track-chip.active {
  border-color: var(--action-blue-dark);
  color: #ffffff;
}

.player-grid {
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(420px, 1fr);
  gap: 24px;
  margin-top: 24px;
}

.player-panel,
.lyrics-panel {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.18);
}

.player-panel {
  padding: 24px;
}

audio {
  display: none;
}

.mini-cover {
  aspect-ratio: 1;
}

.now-playing {
  display: grid;
  gap: 5px;
  margin-top: 24px;
}

.caption {
  color: #cccccc;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0;
}

.now-playing strong {
  font-size: 21px;
  font-weight: 600;
  line-height: 1.19;
  letter-spacing: 0;
}

.now-playing span:last-child {
  color: #cccccc;
  font-size: 17px;
  line-height: 1.47;
  letter-spacing: 0;
}

.timeline {
  margin-top: 24px;
}

input[type="range"] {
  width: 100%;
  accent-color: var(--action-blue-dark);
}

.time-row {
  justify-content: space-between;
  margin-top: 8px;
  color: #cccccc;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0;
}

.control-row {
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}

.icon-button {
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  color: var(--ink);
  background: rgba(210, 210, 215, 0.64);
  font-size: 28px;
  line-height: 1;
}

.play-button {
  min-width: 132px;
  padding: 11px 22px;
  font-size: 17px;
  line-height: 1.47;
  letter-spacing: 0;
}

.lyrics-panel {
  min-height: 600px;
  padding: 24px;
  overflow: hidden;
}

.lyrics-head {
  justify-content: space-between;
  gap: 20px;
  min-height: 48px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.lyrics-head span {
  flex: 0 0 auto;
  color: var(--action-blue-dark);
  font-size: 14px;
  line-height: 1.29;
  letter-spacing: 0;
}

.lyrics-head strong {
  min-width: 0;
  overflow: hidden;
  color: #ffffff;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.24;
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lyrics-panel :deep(.lyrics-scroller) {
  margin-top: 20px;
}

.lyrics-panel :deep(.lyrics-scroller__line) {
  justify-content: center;
  color: rgba(255, 255, 255, 0.42);
  font-family: "SF Pro Text", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 17px;
  letter-spacing: 0;
}

.lyrics-panel :deep(.lyrics-scroller__text-base),
.lyrics-panel :deep(.lyrics-scroller__text-fill) {
  white-space: nowrap;
}

@media (max-width: 960px) {
  .hero-tile,
  .player-grid {
    grid-template-columns: 1fr;
  }

  .hero-copy,
  .cover-stage {
    justify-self: center;
  }

  .cover-stage {
    width: min(360px, 78vw);
  }

  .track-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .lyrics-demo {
    margin-top: calc(var(--vp-nav-height) * -1);
  }

  .hero-tile,
  .player-tile {
    padding: 56px 18px;
  }

  h1 {
    font-size: 34px;
    line-height: 1.12;
    letter-spacing: 0;
  }

  .tagline {
    font-size: 19px;
  }

  .hero-actions {
    flex-wrap: wrap;
  }

  .track-strip {
    grid-template-columns: 1fr;
  }

  .lyrics-panel {
    min-height: 560px;
    padding: 18px;
  }

  .lyrics-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .lyrics-head strong {
    white-space: normal;
  }
}
</style>

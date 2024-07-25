import { nanoid } from "nanoid";
import { getSuffix } from "./getFileSuffix";

export type MusicTrack = {
  uuid: string;
  path: string;
  album?: string;
  cover?: string;
  lyric?: string;
  mainColor?: string;
  name: string;
  singer: string;
  type: string;
};

export default (): MusicTrack[] => {
  const covers = getCovers();
  const lyrics = getLyrics();
  // console.log("covers =>", covers);
  console.log("lyrics =>", lyrics);

  const modules: Record<string, { default: string }> = import.meta.glob(
    "../../../site/music/*",
    {
      eager: true,
    }
  );

  const musics = Object.values(modules).map((i) => {
    // console.log("default =>", i.default);
    // console.log("decode default =>", decodeURI(i.default));

    const basic = i.default;
    const decodeBasic = decodeURI(basic);

    const [useful] = decodeBasic.replace(/\/|music|assets/g, "").split(".");
    // console.log("useful =>", useful);

    // const info = useful.split("-").map((i) => i.replace(/\s+/g, ""));
    const info = useful.split("-").map((i) => i.trim());
    // console.log("info =>", info);

    return {
      uuid: nanoid(),
      path: basic,
      album: info[2],
      cover:
        covers.find((i) => i.album && i.album === info[2])?.path ??
        covers.find((i) => i.singer === info[0])?.path,
      lyric: lyrics.find((i) => i.name === info[1] && i.singer === info[0])
        ?.path,
      mainColor: mainColorTone.find(
        (i) => i.name === info[1] && i.singer === info[0]
      )?.color,
      name: info[1],
      singer: info[0],
      type: `${getSuffix(basic.split("?")[0])}`,
    };
  });

  return musics;
};

function getCovers() {
  const modules: Record<string, { default: string }> = import.meta.glob(
    "../../../site/music/covers/*",
    {
      eager: true,
    }
  );

  const covers = Object.values(modules).map((i) => {
    const basic = i.default;
    const decodeBasic = decodeURI(basic);

    const [useful] = decodeBasic
      .replace(/\/|music|covers|assets/g, "")
      .split(".");
    // console.log("useful =>", useful);

    // const info = useful.split("-").map((i) => i.replace(/\s+/g, ""));
    const info = useful.split("-").map((i) => i.trim());
    // console.log("info =>", info);

    return {
      path: basic,
      album: info[1],
      singer: info[0],
    };
  });

  return covers;
}

type Lyric = {
  path: string;
  name: string;
  singer: string;
};

function getLyrics() {
  const modules: Record<string, { default: string }> = import.meta.glob(
    "../../../site/music/lyrics/*",
    {
      eager: true,
    }
  );

  console.log("modules =>", modules);

  const lyrics: Lyric[] = [];

  for (const key in modules) {
    console.log("key =>", key.split("/"));
    const path = key.split("/");
    const [useful] = path[path.length - 1].split(".");
    const info = useful.split("-").map((i) => i.trim());
    console.log("info =>", info);

    lyrics.push({
      path: modules[key].default,
      name: info[1],
      singer: info[0],
    });
  }

  return lyrics;
}

const mainColorTone = [
  {
    name: "Lover",
    singer: "Taylor Swift",
    color: "#ffabc5",
  },
];

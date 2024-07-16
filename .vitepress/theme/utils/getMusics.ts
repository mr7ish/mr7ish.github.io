import { getSuffix } from "./getFileSuffix";

export type MusicTrack = {
  path: string;
  album?: string;
  cover?: string;
  name: string;
  singer: string;
  type: string;
};

export default (): MusicTrack[] => {
  const covers = getCovers();

  const modules: Record<string, { default: string }> = import.meta.glob(
    "../../../site/music/*",
    {
      eager: true,
    }
  );

  console.log(modules);

  const musics = Object.values(modules).map((i) => {
    console.log("default =>", i.default);
    console.log("decode default =>", decodeURI(i.default));

    // const basic = i.default.replace(/[\/public|\/music|\/assets]/g, "");
    // console.log("basic =>", basic);

    const basic = i.default;
    const decodeBasic = decodeURI(basic);

    const info = decodeBasic.replace(/\/|music|assets/g, "");
    // .split("-")
    // .map((i) => i.replace(/\s+/g, ""));
    console.log("info =>", info);

    const album = info[2];

    return {
      path: basic,
      album,
      cover: covers.find((i) => i.album === album)?.path,
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
    const basic = i.default.replace("/public/music/covers/", "");
    const info = decodeURI(basic.replace("." + getSuffix(i.default), ""))
      .split("-")
      .map((i) => i.replace(/\s+/g, ""));

    return {
      path: `/music/covers/${basic}`,
      album: info[1],
      singer: info[0],
    };
  });

  return covers;
}

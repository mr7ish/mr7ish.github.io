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
    "../../../site/public/music/*",
    {
      eager: true,
    }
  );

  console.log(modules);

  const musics = Object.values(modules).map((i) => {
    const basic = i.default.replace(/[\/public|\/music|\/assets]/g, "");
    console.log("basic =>", basic);

    const info = decodeURI(basic.replace("." + getSuffix(i.default), ""))
      .split("-")
      .map((i) => i.replace(/\s+/g, ""));
    console.log("info =>", info);

    const album = info[2];

    return {
      path: `/music/${basic}`,
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
    "../../../site/public/music/covers/*",
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

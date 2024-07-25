export type Lyric = {
  time: number;
  text: string;
};

export async function fetchLyrics(url: string) {
  return (await fetch(url)).text();
}

export async function parseLyrics(data: string) {
  // console.log("data =>", data);
  const lyrics: Lyric[] = [];

  const lines = data.split("\n");
  // console.log("lines =>", lines);

  const timeRegex = /\[(\d{2}):(\d{2}).(\d{2})\]/;

  for (const line of lines) {
    const match = timeRegex.exec(line);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3], 10);
      const time = minutes * 60 + seconds + milliseconds / 100;
      const text = line.replace(timeRegex, "").trim();
      if (text.length > 0) {
        lyrics.push({ time, text });
      }
    }
  }

  // console.log("lyrics =>", lyrics);
  return lyrics;
}

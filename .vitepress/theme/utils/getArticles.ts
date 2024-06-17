import moment from "moment";
import { deepClone } from "./deepClone";

export default () => {
  const modules = import.meta.glob("../../../site/articles/*.md", {
    // load modules immediately
    eager: true,
  });
  console.log("modules =>", modules);

  const rawArticles = Object.values(modules).map((m: any) => {
    const { __pageData } = m;
    return {
      relativePath: `/${(__pageData.relativePath as string).replace(
        ".md",
        ""
      )}`,
      ...(__pageData.frontmatter as SpecifiedFrontmatter),
    };
  });

  console.log("rawArticles =>", rawArticles);

  const { voids, reals } = sortByValueIsVoid(rawArticles, "createTime");

  console.log("voids =>", voids);
  console.log("reals =>", reals);

  const tags = getTimeTags(reals, (s) => s.createTime!, "month");
  console.log("tags =>", tags);

  const ascendingReals = sortByNumVal(reals, (a, b) => {
    return moment(a.createTime).valueOf() - moment(b.createTime).valueOf();
  });

  console.log("ascendingReals =>", ascendingReals);

  return {
    rawArticles,
    ascendingReals,
  };
};

function getTimeTags<T>(
  source: T[],
  getTime: (source: T) => string,
  type: "year" | "month" | "day"
) {
  const typeArr: string[] = [];

  const getTimeMapping = (t: T) => {
    return {
      year: moment(getTime(t)).year(),
      month: moment(getTime(t)).month() + 1,
      day: moment(getTime(t)).day(),
    };
  };

  source.map((t) => {
    const timeNum = getTimeMapping(t)[type] + "";
    if (!typeArr.includes(timeNum)) {
      typeArr.push(timeNum);
    }
  });

  return typeArr;
}

function sortByNumVal<T>(source: T[], compareFn: (a: T, b: T) => number) {
  const cloneSource = deepClone(source);
  return cloneSource.sort(compareFn);
}

function sortByValueIsVoid<T>(source: T[], key: keyof T) {
  const voids: T[] = [];
  const reals: T[] = [];
  source.map((i) => {
    if (i[key]) {
      reals.push(i);
    } else {
      voids.push(i);
    }
  });
  return {
    voids,
    reals,
  };
}

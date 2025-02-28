import moment from "moment";
import { deepClone } from "./deepClone";
import { SpecifiedFrontmatter } from "../../../env";

export default () => {
  const modules = import.meta.glob("../../../site/articles/*.md", {
    // load modules immediately
    eager: true,
  });

  const rawArticles = Object.values(modules)
    .map((m: any) => {
      const { __pageData } = m;
      return {
        relativePath: `/${(__pageData.relativePath as string).replace(
          ".md",
          ""
        )}`,
        ...(__pageData.frontmatter as SpecifiedFrontmatter),
      };
    })
    .filter((i) => !i.hidden);

  const { voids, reals } = sortByValueIsVoid(rawArticles, "createTime");

  const ascendingReals = sortByNumVal(reals, (a, b) => {
    return moment(a.createTime).valueOf() - moment(b.createTime).valueOf();
  });

  const sortedArticles = sortArticles(ascendingReals);

  return {
    rawArticles,
    ascendingReals,
    sortedArticles,
    undefinedAticles: {
      year: "void",
      articles: voids,
    },
  };
};

function sortArticles(
  ascendingReals: (SpecifiedFrontmatter & { relativePath: string })[]
) {
  const yearTags = getTimeTags(ascendingReals, (s) => s.createTime!, "year");

  const sortedArticles = yearTags.map((y) => {
    const yearArticles = ascendingReals.filter(
      (i) => moment(i.createTime).year() === +y
    );

    return {
      year: y,
      articles: yearArticles,
      children: getTimeTags(yearArticles, (s) => s.createTime!, "month").map(
        (m) => {
          const monthArticles = yearArticles.filter(
            (i) => moment(i.createTime).month() + 1 === +m
          );
          return {
            month: m,
            articles: monthArticles,
            children: getTimeTags(
              monthArticles,
              (s) => s.createTime!,
              "day"
            ).map((d) => {
              const dayArticles = monthArticles.filter(
                (i) => moment(i.createTime).date() === +d
              );
              return {
                day: d,
                articles: dayArticles,
              };
            }),
          };
        }
      ),
    };
  });

  return sortedArticles;
}

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
      day: moment(getTime(t)).date(),
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

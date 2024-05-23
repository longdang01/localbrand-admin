import namedColors from "color-name-list/dist/colornames.json";
import nearestColor from "nearest-color";
import chroma from "chroma-js";
// import download from "downloadjs";

export const colors = namedColors.reduce(
  (o, { name, hex }) => Object.assign(o, { [name]: hex }),
  {}
);

export const getColorName = nearestColor.from(colors);

export const getIconColor = (color:any) =>
  chroma(color).luminance() < 0.05 ? "#ddd" : "#222";

export const getTextColor = (color:any) => {
  if (chroma(color).luminance() < 0.05) {
    return chroma(color).brighten(2.5).hex();
  }
  return chroma(color).darken(1.5).hex();
};

export const presetColors = [
  "#000",
  "#ff6f61",
  "#5f4b8b",
  "#88b04b",
  "#92a8d1",
  "#f7cac9",
  "#955251",
  "#b163a3",
  "#009473",
  "#dd4124",
  "#d94f70",
  "#45b5aa",
  "#f0c05a",
  "#5a5b9f",
  "#9b1b30",
  "#decdbe",
  "#53b0ae",
  "#e2583e",
  "#7bc4c4",
  "#bf1932",
  "#c74375",
  "#9bb7d4",
  "#fff",
];

// export const buildDownload = (color) => {
//   const cv = document.createElement("canvas");
//   cv.height = 1920;
//   cv.width = 1080;
//   const ctx = cv.getContext("2d");
//   ctx.fillStyle = color;
//   ctx.fillRect(0, 0, cv.width, cv.height);
//   return download(cv.toDataURL(), `${color}.png`.replace("#", ""), "image/png");
// };

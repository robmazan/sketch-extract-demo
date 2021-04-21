import { css, SerializedStyles } from "@emotion/react";

export const pxToRem = (px: number): number => px / 16;

export type FontProps = {
  fontSize: number,
  fontName: string,
  color: string,
};
type FontWeight = "Bold" | "Medium" | "Regular";
const weightMap: Record<FontWeight, string> = {
  Bold: "700",
  Medium: "500",
  Regular: "400",
}
export const fontProps: (font: FontProps) => SerializedStyles = ({ color, fontName, fontSize }) => {
  const [family, weight] = fontName.split("-");
  return css`
    font-family: ${family};
    font-weight: ${weightMap[weight as FontWeight]};
    font-size: ${pxToRem(fontSize)}rem;
    color: ${color};
  `;
};

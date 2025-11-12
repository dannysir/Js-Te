import {COLORS} from "../constants.js";

export const colorize = (text, color) => `${color}${text}${COLORS.reset}`;

export const green = (text) => colorize(text, COLORS.green + COLORS.bold);
export const red = (text) => colorize(text, COLORS.red + COLORS.bold);
export const bold = (text) => colorize(text, COLORS.bold);
export const yellow = (text) => colorize(text, COLORS.yellow + COLORS.bold);
export const cyan = (text) => colorize(text, COLORS.cyan + COLORS.bold);
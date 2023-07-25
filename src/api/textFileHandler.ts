import { fetchWithTimeout } from "./fetchWithTimeout";

// テキストファイル取得（GET）
export const getTextFile = async (url: string) => {
  return await (await fetchWithTimeout("GET", url)).text();
};

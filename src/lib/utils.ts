import { clsx, type ClassValue } from "clsx";
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parse = (req: NextRequest) => {
  let domain = req.headers.get("host") as string;
  // remove www. from domain and convert to lowercase
  domain = domain.replace("www.", "").toLowerCase();

  // path is the path of the URL (e.g. dub.co/stats/github -> /stats/github)
  let path = req.nextUrl.pathname;

  // fullPath is the full URL path (along with search params)
  const searchParams = req.nextUrl.searchParams.toString();
  const searchParamsString = searchParams.length > 0 ? `?${searchParams}` : "";
  const fullPath = `${path}${searchParamsString}`;

  // Here, we are using decodeURIComponent to handle foreign languages like Hebrew
  const key = decodeURIComponent(path.split("/")[1]); // key is the first part of the path (e.g. dub.co/stats/github -> stats)
  const fullKey = decodeURIComponent(path.slice(1)); // fullKey is the full path without the first slash (to account for multi-level subpaths, e.g. d.to/github/repo -> github/repo)

  return { domain, path, fullPath, key, fullKey, searchParamsString };
};

export const getOrderTotal = (
  pkgs: number,
  kg_per_bag: number,
  sampleUsed: number
) => {
  return pkgs * kg_per_bag - sampleUsed;
};

export const getAverageScore = (score: {
  appearance: number;
  taste: number;
  liquor: number;
  infusion: number;
  grading: number;
}) => {
  const { appearance, taste, liquor, infusion, grading } = score;
  return ((appearance + liquor + taste + infusion + grading) / 50).toFixed(2);
};

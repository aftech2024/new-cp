import { useEffect, useState } from "react";
import { BLOG_DATA_PATH, type BlogEdition, type BlogIndexEntry } from "@/data/blog";

type LoadState<T> = { status: "loading" } | { status: "ready"; data: T } | { status: "error"; notFound: boolean };

const requests = new Map<string, Promise<unknown>>();

/**
 * Fetch a JSON file from dist/blog-data once per page load. A missing file
 * falls through to the SPA's index.html, so anything that isn't JSON counts
 * as not found.
 */
function loadJson<T>(path: string): Promise<T> {
  let request = requests.get(path);
  if (!request) {
    request = fetch(path, { headers: { accept: "application/json" } }).then((res) => {
      if (!res.ok || !(res.headers.get("content-type") ?? "").includes("json")) {
        throw new Error(res.ok || res.status === 404 ? "not_found" : `http_${res.status}`);
      }
      return res.json();
    });
    request.catch(() => requests.delete(path)); // let a later visit retry
    requests.set(path, request);
  }
  return request as Promise<T>;
}

function useJson<T>(path: string): LoadState<T> {
  const [state, setState] = useState<LoadState<T>>({ status: "loading" });
  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    loadJson<T>(path).then(
      (data) => active && setState({ status: "ready", data }),
      (error: Error) => active && setState({ status: "error", notFound: error.message === "not_found" }),
    );
    return () => {
      active = false;
    };
  }, [path]);
  return state;
}

export function useBlogIndex() {
  return useJson<BlogIndexEntry[]>(`${BLOG_DATA_PATH}/index.json`);
}

export function useBlogEdition(slug: string) {
  return useJson<BlogEdition>(`${BLOG_DATA_PATH}/${encodeURIComponent(slug)}.json`);
}

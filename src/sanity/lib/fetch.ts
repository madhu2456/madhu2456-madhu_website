type LiveSanityFetch = typeof import("./live")["sanityFetch"];
type LiveSanityFetchResult = Awaited<ReturnType<LiveSanityFetch>>;

/**
 * Safe Sanity fetch wrapper used by portfolio rendering paths.
 * If Sanity credentials/network fail, return null data so the site still renders.
 */
export const sanityFetch = (async (...args: unknown[]) => {
  try {
    const { sanityFetch: liveSanityFetch } = await import("./live");
    return await (liveSanityFetch as (...params: unknown[]) => Promise<unknown>)(
      ...args,
    );
  } catch (error) {
    console.error("Sanity fetch failed; rendering with fallback data.", error);
    return { data: null } as LiveSanityFetchResult;
  }
}) as LiveSanityFetch;

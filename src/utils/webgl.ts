/*
 * Shared WebGL capability detection.
 *
 * Used by the Character renderer and the TechStack Canvas so that both agree
 * on whether a WebGL context can actually be created, and so the probe does
 * not leak a live context into the browser's limited pool.
 *
 * The result is cached for the lifetime of the page (WebGL availability will
 * not change while the app is running).
 */
let cached: boolean | null = null;

export const isWebGLAvailable = (): boolean => {
  if (cached !== null) {
    return cached;
  }

  if (typeof window === "undefined") {
    cached = false;
    return false;
  }

  let probe: HTMLCanvasElement | null = null;

  try {
    probe = document.createElement("canvas");

    const attributes: WebGLContextAttributes = {
      failIfMajorPerformanceCaveat: true,
    };

    const gl2: WebGL2RenderingContext | null = probe.getContext(
      "webgl2",
      attributes
    );

    const gl: WebGLRenderingContext | null = gl2
      ? null
      : probe.getContext("webgl", attributes);

    const context = gl2 ?? (gl as (WebGL2RenderingContext | WebGLRenderingContext) | null);

    cached = Boolean(context);

    // Immediately release the probe context so it never counts towards the
    // browser's pool of live WebGL contexts.
    if (context) {
      const extension = context.getExtension("WEBGL_lose_context");
      if (extension && typeof (extension as any).loseContext === "function") {
        (extension as any).loseContext();
      }
    }

    return cached;
  } catch {
    cached = false;
    return false;
  } finally {
    // Defensive: if the probe canvas still exists but we did not release it,
    // make sure it can be garbage collected.
    probe = null;
  }
};
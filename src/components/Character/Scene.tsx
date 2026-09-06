import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import { isWebGLAvailable } from "../../utils/webgl";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef(new THREE.Scene());

  const { setLoading } = useLoading();

  useEffect(() => {
    const canvasContainer = canvasDiv.current;

    if (!canvasContainer) {
      return;
    }

    /*
     * Never allow a WebGL failure to crash the entire portfolio.
     *
     * Some browsers, embedded previews, privacy settings, GPU drivers,
     * or hardware configurations can disable WebGL completely.
     */
    if (!isWebGLAvailable()) {
      console.warn(
        "WebGL is unavailable. Character animation has been disabled."
      );

      setLoading(100);

      return;
    }

    let renderer: THREE.WebGLRenderer | null = null;

    /*
     * Guards against the async character loader (and any other late
     * callbacks) continuing to run against a renderer that has already
     * been disposed, e.g. when React StrictMode mounts -> unmounts ->
     * mounts during development.
     */
    let disposed = false;

    try {
      const rect = canvasContainer.getBoundingClientRect();

      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);

      const aspect = width / height;

      /*
       * WebGL renderer creation is isolated so a browser-level WebGL
       * failure cannot take down the React application.
       */
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });

      renderer.setSize(width, height);
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 2)
      );

      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;

      canvasContainer.appendChild(renderer.domElement);

      const scene = sceneRef.current;

      const camera = new THREE.PerspectiveCamera(
        14.5,
        aspect,
        0.1,
        1000
      );

      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer | undefined;

      const clock = new THREE.Clock();

      const light = setLighting(scene);

      const progress = setProgress((value) =>
        setLoading(value)
      );

      const { loadCharacter } = setCharacter(
        renderer,
        scene,
        camera
      );

      let animationFrameId = 0;

      let debounce: number | undefined;

      let mouse = {
        x: 0,
        y: 0,
      };

      let interpolation = {
        x: 0.1,
        y: 0.2,
      };

      /*
       * Character loading
       */
      loadCharacter()
        .then((gltf) => {
          if (!gltf || !renderer || disposed) {
            return;
          }

          const animations = setAnimations(gltf);

          if (hoverDivRef.current) {
            animations.hover(
              gltf,
              hoverDivRef.current
            );
          }

          mixer = animations.mixer;

          const character = gltf.scene;

          scene.add(character);

          headBone =
            character.getObjectByName("spine006") ||
            null;

          screenLight =
            character.getObjectByName("screenlight") ||
            null;

          progress.loaded().then(() => {
            window.setTimeout(() => {
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });

          /*
           * Resize handler
           *
           * Keep the same function reference so cleanup
           * actually removes the listener.
           */
          const handleWindowResize = () => {
            handleResize(
              renderer!,
              camera,
              canvasDiv,
              character
            );
          };

          window.addEventListener(
            "resize",
            handleWindowResize
          );

          resizeHandlerRef.current = handleWindowResize;
        })
        .catch((error) => {
          console.error(
            "Failed to load character model:",
            error
          );

          /*
           * The character is decorative. Its failure must never
           * prevent the rest of the portfolio from working.
           */
          setLoading(100);
        });

      /*
       * Mouse
       */
      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => {
          mouse = { x, y };
        });
      };

      /*
       * Touch
       */
      const onTouchMove = (event: TouchEvent) => {
        handleTouchMove(event, (x, y) => {
          mouse = { x, y };
        });
      };

      const onTouchStart = () => {
        debounce = window.setTimeout(() => {
          canvasContainer.addEventListener(
            "touchmove",
            onTouchMove
          );
        }, 200);
      };

      const onTouchEnd = () => {
        if (debounce !== undefined) {
          window.clearTimeout(debounce);
          debounce = undefined;
        }

        canvasContainer.removeEventListener(
          "touchmove",
          onTouchMove
        );

        handleTouchEnd(
          (
            x,
            y,
            interpolationX,
            interpolationY
          ) => {
            mouse = { x, y };

            interpolation = {
              x: interpolationX,
              y: interpolationY,
            };
          }
        );
      };

      /*
       * Use one stable listener instead of wrapping the handler
       * inside another anonymous function.
       */
      document.addEventListener(
        "mousemove",
        onMouseMove
      );

      canvasContainer.addEventListener(
        "touchstart",
        onTouchStart
      );

      canvasContainer.addEventListener(
        "touchend",
        onTouchEnd
      );

      /*
       * Animation loop
       */
      const animate = () => {
        if (!renderer) {
          return;
        }

        animationFrameId =
          window.requestAnimationFrame(animate);

        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );

          light.setPointLight(screenLight);
        }

        const delta = clock.getDelta();

        if (mixer) {
          mixer.update(delta);
        }

        renderer.render(scene, camera);
      };

      animate();

      /*
       * Store resize handler for cleanup.
       */
      return () => {
        disposed = true;

        if (debounce !== undefined) {
          window.clearTimeout(debounce);
        }

        window.cancelAnimationFrame(
          animationFrameId
        );

        document.removeEventListener(
          "mousemove",
          onMouseMove
        );

        canvasContainer.removeEventListener(
          "touchstart",
          onTouchStart
        );

        canvasContainer.removeEventListener(
          "touchend",
          onTouchEnd
        );

        canvasContainer.removeEventListener(
          "touchmove",
          onTouchMove
        );

        if (resizeHandlerRef.current) {
          window.removeEventListener(
            "resize",
            resizeHandlerRef.current
          );

          resizeHandlerRef.current = null;
        }

        scene.clear();

        if (renderer) {
          renderer.dispose();

          renderer.forceContextLoss();

          if (
            renderer.domElement.parentNode ===
            canvasContainer
          ) {
            canvasContainer.removeChild(
              renderer.domElement
            );
          }
        }
      };
    } catch (error) {
      /*
       * Critical safety net.
       *
       * If WebGLRenderer itself throws despite our detection,
       * keep the portfolio alive.
       */
      console.error(
        "Character WebGL initialization failed:",
        error
      );

      setLoading(100);

      if (renderer) {
        renderer.dispose();
      }

      return;
    }
  }, [setLoading]);

  return (
    <div className="character-container">
      <div
        className="character-model"
        ref={canvasDiv}
      >
        <div className="character-rim" />

        <div
          className="character-hover"
          ref={hoverDivRef}
        />
      </div>
    </div>
  );
};

/*
 * Stable reference for the resize listener.
 *
 * It lives outside the effect so TypeScript/React can keep
 * the exact function reference required for cleanup.
 */
const resizeHandlerRef: {
  current:
    | (() => void)
    | null;
} = {
  current: null,
};

export default Scene;
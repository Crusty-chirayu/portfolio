import * as THREE from "three";
import {
  Component,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import { isWebGLAvailable } from "../utils/webgl";

/* -------------------------------------------------------------------------- */
/* Error boundary                                                             */
/*                                                                            */
/* Even if WebGL becomes unavailable after detection, the portfolio should   */
/* never turn into a completely blank page.                                  */
/* -------------------------------------------------------------------------- */

type WebGLErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type WebGLErrorBoundaryState = {
  hasError: boolean;
};

class WebGLErrorBoundary extends Component<
  WebGLErrorBoundaryProps,
  WebGLErrorBoundaryState
> {
  state: WebGLErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error) {
    console.warn(
      "Three.js/WebGL failed to initialize. Using static fallback.",
      error
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

/* -------------------------------------------------------------------------- */
/* Assets                                                                     */
/* -------------------------------------------------------------------------- */

const textureLoader = new THREE.TextureLoader();

const imageUrls = [
  "/images/react2.webp",
  "/images/next2.webp",
  "/images/node2.webp",
  "/images/express.webp",
  "/images/mongo.webp",
  "/images/mysql.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
];

const textures = imageUrls.map((url) => textureLoader.load(url));

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = [...Array(30)].map(() => ({
  scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
}));

/* -------------------------------------------------------------------------- */
/* 3D sphere                                                                  */
/* -------------------------------------------------------------------------- */

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return;

    delta = Math.min(0.1, delta);

    const impulse = vec
      .copy(api.current.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />

      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />

      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

/* -------------------------------------------------------------------------- */
/* Physics pointer                                                             */
/* -------------------------------------------------------------------------- */

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({
  vec = new THREE.Vector3(),
  isActive,
}: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;

    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );

    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

/* -------------------------------------------------------------------------- */
/* Static fallback                                                            */
/* -------------------------------------------------------------------------- */

const fallbackTechnologies = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express",
  "MongoDB",
  "MySQL",
];

const TechStackFallback = () => {
  return (
    <div className="techstack techstack-fallback">
      <div className="techstack-fallback-header">
        <span className="techstack-label">TECHNOLOGY</span>

        <h2>
          TOOLS I
          <br />
          <span>BUILD WITH.</span>
        </h2>

        <p>
          A practical stack spanning frontend, backend, databases,
          and modern application development.
        </p>
      </div>

      <div className="techstack-grid">
        {fallbackTechnologies.map((technology, index) => (
          <div
            className="techstack-card"
            key={technology}
          >
            <span className="techstack-card-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="techstack-card-name">
              {technology}
            </span>

            <span
              className="techstack-card-arrow"
              aria-hidden="true"
            >
              ↗
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  /* Check WebGL only after the browser has mounted. */
  useEffect(() => {
    setWebGLAvailable(isWebGLAvailable());
  }, []);

  /*
   * Mount the heavy WebGL canvas only once the section approaches the
   * viewport. This prevents the Character renderer and the physics canvas
   * from holding two live WebGL contexts simultaneously during page load,
   * which can exhaust the browser's limited GPU context pool in normal
   * Chrome/Edge when acceleration is restricted.
   */
  useEffect(() => {
    const node = sectionRef.current;

    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      /* Older browsers: mount immediately. */
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px", threshold: 0 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
    /*
     * Re-run when the WebGL check resolves: on first render the fallback
     * (which has no section ref) is shown, so this effect must attach the
     * observer only after the WebGL branch has mounted the ref'd element.
     */
  }, [webGLAvailable]);

  /* ------------------------------------------------------------------------ */
  /* Scroll activation                                                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const handleScroll = () => {
      const workSection = document.getElementById("work");

      if (!workSection) {
        setIsActive(false);
        return;
      }

      const threshold =
        workSection.getBoundingClientRect().top + window.scrollY;

      setIsActive(window.scrollY > threshold - window.innerHeight * 0.75);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    const headerLinks = Array.from(
      document.querySelectorAll(".header a")
    );

    const cleanupTimers: number[] = [];

    const handleHeaderClick = () => {
      const interval = window.setInterval(handleScroll, 10);

      const timeout = window.setTimeout(() => {
        window.clearInterval(interval);
      }, 1000);

      cleanupTimers.push(interval, timeout);
    };

    headerLinks.forEach((element) => {
      element.addEventListener("click", handleHeaderClick);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      headerLinks.forEach((element) => {
        element.removeEventListener("click", handleHeaderClick);
      });

      cleanupTimers.forEach((timer) => {
        window.clearInterval(timer);
        window.clearTimeout(timer);
      });
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Materials                                                                */
  /* ------------------------------------------------------------------------ */

  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 1,
          clearcoat: 0.1,
        })
    );
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Fallback while checking WebGL                                            */
  /* ------------------------------------------------------------------------ */

  if (!webGLAvailable) {
    return <TechStackFallback />;
  }

  /* ------------------------------------------------------------------------ */
  /* WebGL version                                                            */
  /* ------------------------------------------------------------------------ */

  return (
    <WebGLErrorBoundary fallback={<TechStackFallback />}>
      <div className="techstack" ref={sectionRef}>
        <h2>MY TECHSTACK</h2>

        {inView && (
        <Canvas
          shadows
          gl={{
            alpha: true,
            stencil: false,
            depth: true,
            antialias: false,
          }}
          dpr={[1, 1.5]}
          camera={{
            position: [0, 0, 20],
            fov: 32.5,
            near: 1,
            far: 100,
          }}
          onCreated={(state) => {
            state.gl.toneMappingExposure = 1.5;
          }}
          className="tech-canvas"
          fallback={<TechStackFallback />}
        >
          <ambientLight intensity={1} />

          <spotLight
            position={[20, 20, 25]}
            penumbra={1}
            angle={0.2}
            color="white"
            castShadow
            shadow-mapSize={[512, 512]}
          />

          <directionalLight
            position={[0, 5, -4]}
            intensity={2}
          />

          <Physics gravity={[0, 0, 0]}>
            <Pointer isActive={isActive} />

            {spheres.map((props, index) => (
              <SphereGeo
                key={index}
                {...props}
                material={
                  materials[index % materials.length]
                }
                isActive={isActive}
              />
            ))}
          </Physics>

          <Environment
            files="/models/char_enviorment.hdr"
            environmentIntensity={0.5}
            environmentRotation={[0, 4, 2]}
          />

          <EffectComposer enableNormalPass={false}>
            <N8AO
              color="#0f002c"
              aoRadius={2}
              intensity={1.15}
            />
          </EffectComposer>
        </Canvas>
        )}
      </div>
    </WebGLErrorBoundary>
  );
};

export default TechStack;
import React, { Suspense, useRef, useState } from "react";
import { Canvas, RootState, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  OrbitControls,
  Stage,
  Decal,
  Html,
} from "@react-three/drei";
import { Texture } from "three";

export default function App(): JSX.Element {
  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  React.useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 900;

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ fov: 40 }}>
      {isMobile ? (
        <Html>
          <p>Please open this web page on a desktop device</p>
        </Html>
      ) : (
        <Scene />
      )}
    </Canvas>
  );
}

function Scene(): JSX.Element {
  const ref = useRef();
  let [step, setStep] = useState(1);

  return (
    <>
      <Suspense fallback={null}>
        <Stage
          //@ts-ignore
          controls={ref}
          preset="rembrandt"
          intensity={1}
          environment="city"
        >
          false
          <Model state={step} />
          false
        </Stage>
        <Html>
          <button onClick={() => setStep(step === 6 ? (step = 0) : step + 1)}>
            Next
          </button>
        </Html>
      </Suspense>
      <OrbitControls
        //@ts-ignore
        ref={ref}
        makeDefault
        enabled={false}
      />
      <CameraControl state={step} />
    </>
  );
}

function CameraControl(props: { state: number }): null {
  const controls = useThree((state) => state.controls);
  useFrame(() => {
    switch (props.state) {
      case 2:
        //@ts-ignore
        controls?.setAzimuthalAngle(2.34);
        break;
      case 3:
        //@ts-ignore
        controls?.setAzimuthalAngle(5.4);
        break;
      case 4:
        //@ts-ignore
        controls?.setAzimuthalAngle(8.4);
        break;
      case 5:
        //@ts-ignore
        controls?.setAzimuthalAngle(6.4);
        break;
      case 6:
        //@ts-ignore
        controls?.setAzimuthalAngle(2.34);
    }
  });
  return null;
}

function getDecal(status: number): JSX.Element {
  const [
    texture,
    textureImageTwo,
    textureImageThree,
    textureImageFour,
    textureImageSix,
    textureImageSeven,
  ]: Texture[] = useTexture([
    "/f1.png",
    "/f2.png",
    "/f3.png",
    "/f4.png",
    "/f5.png",
    "/f6.png",
  ]);

  switch (status) {
    case 2:
      return (
        <Decal
          position={[-42, 4, 2]}
          rotation={[-1.5, -0.6, -1.2]}
          scale={[110, 110, 110]}
          map={textureImageTwo}
        />
      );
    case 3:
      return (
        <Decal
          position={[-6, -78, -4]}
          rotation={[-10.7, -6.2, -14.4]}
          scale={[133, 133, 133]}
          map={textureImageThree}
        />
      );
    case 4:
      return (
        <Decal
          position={[-24, 32, 38]}
          rotation={[-1.5, -6.0, -1.5]}
          scale={[100, 100, 100]}
          map={textureImageFour}
        />
      );
    case 5:
      return (
        <Decal
          position={[-10, -80, 0]}
          rotation={[-1.5, -6.3, -1.5]}
          scale={[110, 110, 110]}
          map={textureImageSeven}
        />
      );
    case 6:
      return (
        <Decal
          position={[-12, 30, 34]}
          rotation={[-1.8, -6.3, 1.8]}
          scale={[100, 100, 100]}
          map={textureImageSix}
        />
      );
    default:
      return (
        <Decal
          position={[-41.8, -32.4, -117.2]}
          rotation={[1.8, 0.6, -3.5]}
          scale={[56.16, 64.8, 64.8]}
          map={texture}
        />
      );
  }
}

function Model(props: any): JSX.Element {
  //@ts-ignore
  const { nodes } = useGLTF("/handSelected.glb");
  const refMesh = useRef();

  useFrame((state: RootState) => {
    const t: number = state.clock.getElapsedTime();
    //@ts-ignore
    refMesh.current!.rotation.z = 0.1 + (1 + Math.sin(t / 1.5)) / 30;
  });

  return (
    <group {...props} ref={refMesh} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.arm.geometry}
        material={nodes.arm.material}
        position={[-11.47, 36.0, -10.32]}
        rotation={[3.5, -0.9, 5.0]}
        scale={0.37}
      >
        {getDecal(props.state)}
      </mesh>
    </group>
  );
}

import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Lights from "./Lights.jsx";
import { Level } from "./Level.jsx";
import Player from "./Player.jsx";
import useGame from "./stores/useGame.jsx";
import { isMobile } from "react-device-detect";

export default function Experience() {
    const blocksCount = useGame((state) => state.blocksCount);

    return (
        <>
            {/* <OrbitControls makeDefault /> */}

            <color args={["#bdedfc"]} attach="background" />

            {!isMobile && (
                <Physics debug={false}>
                    <Lights />
                    <Level count={blocksCount} />
                    <Player />
                </Physics>
            )}
        </>
    );
}

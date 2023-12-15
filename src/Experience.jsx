import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Lights from "./Lights.jsx";
import { Level } from "./Level.jsx";
import Player from "./Player.jsx";

export default function Experience() {
    return (
        <>
            {/* <OrbitControls makeDefault /> */}

            <Physics debug={false}>
                <Lights />
                <Level />
                <Player />
            </Physics>
        </>
    );
}

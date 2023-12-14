import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Lights from "./Lights.jsx";
import Level from "./Level.jsx";

export default function Experience() {
    return (
        <>
            <OrbitControls makeDefault />

            <Physics debug>
                <Lights />
                <Level />
            </Physics>
        </>
    );
}

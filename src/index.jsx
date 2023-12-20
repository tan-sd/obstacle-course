import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import { KeyboardControls } from "@react-three/drei";
import Interface from "./Interface.jsx";

const root = ReactDOM.createRoot(document.querySelector("#root"));

console.log(
    "%cGithub Repository: https://github.com/tan-sd/obstacle-course",
    "color: #9370DB"
);
console.log("%c— Obstacle Course", "color: #777777");

root.render(
    <KeyboardControls
        map={[
            { name: "forward", keys: ["ArrowUp", "KeyW"] },
            { name: "backward", keys: ["ArrowDown", "KeyS"] },
            { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
            { name: "rightward", keys: ["ArrowRight", "KeyD"] },
            { name: "jump", keys: ["Space"] },
            { name: "enter", keys: ["Enter"] },
        ]}
    >
        <Canvas
            shadows
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [2.5, 4, 6],
            }}
        >
            <Experience />
        </Canvas>
        <Interface />
    </KeyboardControls>
);

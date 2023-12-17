import { useKeyboardControls } from "@react-three/drei";
import useGame from "./stores/useGame";
import { useEffect, useRef, useState } from "react";
import { addEffect } from "@react-three/fiber";

export default function Interface() {
    const forward = useKeyboardControls((state) => state.forward);
    const backward = useKeyboardControls((state) => state.backward);
    const leftward = useKeyboardControls((state) => state.leftward);
    const rightward = useKeyboardControls((state) => state.rightward);
    const jump = useKeyboardControls((state) => state.jump);
    const enter = useKeyboardControls((state) => state.enter);

    const restart = useGame((state) => state.restart);
    const phase = useGame((state) => state.phase);
    const time = useRef();

    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleReset = () => {
        setInputValue(null);
    };

    useEffect(() => {
        const unsubscribeEffect = addEffect(() => {
            const state = useGame.getState();
            let elapsedTime = 0;
            if (state.phase === "playing") {
                elapsedTime = Date.now() - state.startTime;
                handleReset();
            } else if (state.phase === "ended")
                elapsedTime = state.endTime - state.startTime;
            elapsedTime /= 1000;
            elapsedTime = elapsedTime.toFixed(2);

            if (time.current) time.current.textContent = elapsedTime;
        });

        return () => {
            unsubscribeEffect();
        };
    }, []);

    return (
        <div className="interface">
            <div ref={time} className="time">
                0.00
            </div>
            {phase === "ended" && (
                <div className="scoreboard">
                    <div className="title">LEADERBOARD</div>
                    <div className="board">
                        <div className="first">
                            <div className="index first">1</div>
                            <div className="name">KengBoon</div>
                            <div className="score">6.50</div>
                        </div>
                        <div className="second">
                            <div className="index second">2</div>
                            <div className="name">Seth</div>
                            <div className="score">6.50</div>
                        </div>
                        <div className="third">
                            <div className="index third">3</div>
                            <div className="name">Rachel</div>
                            <div className="score">6.50</div>
                        </div>
                        <div className="divider">. . .</div>
                        <div className="rest">
                            <div className="index rest">4</div>
                            <div className="inputCompartment">
                                <input
                                    className="name input"
                                    placeholder="Enter your name"
                                    maxLength="10"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                />
                                {inputValue && (
                                    <kbd
                                        className={`enterBtn ${
                                            enter ? "active" : ""
                                        }`}
                                    >
                                        Enter
                                    </kbd>
                                )}
                            </div>
                            <div className="score">6.50</div>
                        </div>
                    </div>
                    <div className="restart" onClick={restart}>
                        Restart
                    </div>
                </div>
            )}
            {(phase === "playing" || phase === "ready") && (
                <div className="controls">
                    <div className="raw">
                        <div className={`key ${forward ? "active" : ""}`}></div>
                    </div>
                    <div className="raw">
                        <div
                            className={`key ${leftward ? "active" : ""}`}
                        ></div>
                        <div
                            className={`key ${backward ? "active" : ""}`}
                        ></div>
                        <div
                            className={`key ${rightward ? "active" : ""}`}
                        ></div>
                    </div>
                    <div className="raw">
                        <div
                            className={`key large ${jump ? "active" : ""}`}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
}

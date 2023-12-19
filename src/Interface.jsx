import { useKeyboardControls } from "@react-three/drei";
import useGame from "./stores/useGame";
import { useEffect, useRef, useState } from "react";
import { addEffect, useFrame } from "@react-three/fiber";
import { pushData, getData } from "./backend/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSpinner,
    faCheck,
    faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

export default function Interface() {
    const forward = useKeyboardControls((state) => state.forward);
    const backward = useKeyboardControls((state) => state.backward);
    const leftward = useKeyboardControls((state) => state.leftward);
    const rightward = useKeyboardControls((state) => state.rightward);
    const jump = useKeyboardControls((state) => state.jump);

    const restart = useGame((state) => state.restart);
    const phase = useGame((state) => state.phase);
    const register = useGame((state) => state.register);
    const changeToRegister = useGame((state) => state.changeToRegister);
    const time = useRef();

    const nickname = useGame((state) => state.nickname);

    const [inputValue, setInputValue] = useState("");

    const [leaderboardData, setLeaderboardData] = useState([]);

    const [entryPosition, setEntryPosition] = useState("");

    const [pressSubmit, setPressSubmit] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [disableRestart, setDisableRestart] = useState(false);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleReset = () => {
        setInputValue("");
    };

    const handlePush = async () => {
        setSubmitting(true);
        setDisableRestart(true);

        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();

        try {
            await pushData(
                nickname,
                time.current.textContent,
                currentDate,
                currentTime
            );
            setSubmitted(true);
        } catch (error) {
            console.error("Error pushing data:", error);
        } finally {
            setSubmitting(false);
        }
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

        const fetchLeaderboardData = async () => {
            var data = await getData();
            if (data) {
                const leaderboardEntries = Object.entries(data)
                    .map(([key, entry]) => ({
                        id: key,
                        name: entry.name,
                        score: parseFloat(entry.score),
                    }))
                    .sort((a, b) => a.score - b.score);
                setLeaderboardData(leaderboardEntries);
            }
        };

        fetchLeaderboardData();

        return () => {
            unsubscribeEffect();
        };
    }, []);

    useEffect(() => {
        if (phase === "ended") {
            const newEntry = {
                id: "newEntry",
                name: nickname,
                score: parseFloat(time.current.textContent),
            };
            leaderboardData[leaderboardData.length] = newEntry;

            const leaderboardEntries = Object.entries(leaderboardData)
                .map(([key, entry]) => ({
                    id: key,
                    name: entry.name,
                    score: parseFloat(entry.score),
                }))
                .sort((a, b) => a.score - b.score);

            const newEntryPosition = leaderboardEntries.findIndex(
                (entry) =>
                    entry.name === nickname &&
                    entry.score === parseFloat(time.current.textContent)
            );

            if (newEntryPosition >= 3) {
                leaderboardEntries[3] = newEntry;
            }

            setEntryPosition(newEntryPosition);

            setLeaderboardData(leaderboardEntries);
        }
    }, [phase]);

    return (
        <div className="interface">
            {phase === "ready" && (
                <div ref={time} className="time">
                    0.00
                </div>
            )}
            {phase === "register" && (
                <div className="register">
                    <input
                        className="registerInput"
                        type="text"
                        placeholder="Nickname"
                        maxLength={10}
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <button
                        className="registerBtn"
                        onClick={() => register(inputValue)}
                        disabled={!inputValue.trim()}
                    >
                        Let's go!
                    </button>
                </div>
            )}
            {phase === "ended" && (
                <div className="scoreboard">
                    <div className="title">LEADERBOARD</div>
                    <div className="board">
                        {leaderboardData.slice(0, 3).map((entry, index) => (
                            <div
                                key={entry.id}
                                className={`entry ${
                                    index == 0 && entryPosition == 0
                                        ? "highlighted"
                                        : index == 1 && entryPosition == 1
                                        ? "highlighted"
                                        : index == 2 && entryPosition == 2
                                        ? "highlighted"
                                        : ""
                                }`}
                            >
                                <div
                                    className={`index ${
                                        index === 0
                                            ? "first"
                                            : "" || index === 1
                                            ? "second"
                                            : "" || index === 2
                                            ? "third"
                                            : ""
                                    }`}
                                >
                                    {index + 1}
                                </div>
                                <div className="name">{entry.name}</div>
                                <div className="score">{entry.score}</div>
                            </div>
                        ))}
                        <div className="divider">. . .</div>
                        {leaderboardData.slice(3, 4).map((entry) => (
                            <div
                                key={entry.id}
                                className={`entry ${
                                    entryPosition >= 3 ? "highlighted" : ""
                                }`}
                            >
                                <div className={`index`}>
                                    {entryPosition >= 3
                                        ? parseInt(entryPosition) + 1
                                        : 4}
                                </div>
                                <div className="name">{entry.name}</div>
                                <div className="score">{entry.score}</div>
                            </div>
                        ))}
                    </div>
                    <div
                        className={`submit ${
                            submitting || submitted ? "disabled" : ""
                        }`}
                        onClick={() => {
                            handlePush();
                            setPressSubmit(true);
                        }}
                    >
                        {submitting && (
                            <FontAwesomeIcon icon={faSpinner} spin />
                        )}
                        {!submitting && submitted && (
                            <FontAwesomeIcon icon={faCheck} />
                        )}
                        {!submitting && !submitted && "Submit"}
                    </div>
                    <div
                        className="restart"
                        onClick={() => {
                            restart();
                            setSubmitting(false);
                            setSubmitted(false);
                            setDisableRestart(false);
                            setEntryPosition("");
                            if (pressSubmit === false) {
                                leaderboardData.splice(
                                    parseInt(entryPosition),
                                    1
                                );
                            }
                            setPressSubmit(false);
                        }}
                    >
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
            {phase !== "register" && (
                <div className="nicknameContainer">
                    <div className="nickname">Playing as {nickname}</div>
                    {(phase === "ended" || phase === "ready") && (
                        <div
                            className="changeNickname"
                            onClick={() => {
                                changeToRegister();
                                setSubmitting(false);
                                setSubmitted(false);
                                setDisableRestart(false);
                                if (pressSubmit === false) {
                                    leaderboardData.splice(
                                        parseInt(entryPosition),
                                        1
                                    );
                                }
                                setPressSubmit(false);
                            }}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

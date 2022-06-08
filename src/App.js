import { useEffect, useRef, useState } from "react";
import style from "./App.module.css";
import { Alphabets } from "./constants/constants";

let alphasChanged = 0;
let gameBegan = 0;
let penalty = 0;
const beginAlpha = Alphabets[Math.ceil(Math.random() * 26)];

function App() {
	const [alphaShown, setAlphaShown] = useState(beginAlpha);
	const [alphaEntered, setAlphaEntered] = useState("");
	const [isWrongAlpha, setIsWrongAlpha] = useState(false);
	const [backspaceOrDeletePressed, setBackspaceOrDeletePressed] =
		useState(false);
	const [now, setNow] = useState(null);
	const [start, setStart] = useState(null);
	const [lastBest, setLastBest] = useState(0);
	const [completionMessage, setCompletionMessage] = useState("");

	useEffect(() => {
		const lastBestLocal = localStorage.getItem("stopgame");
		if (lastBestLocal) {
			setLastBest(lastBestLocal);
		}
	}, []);
	const interval = useRef();

	let secondsPassed = 0;
	if (start != null && now != null) {
		secondsPassed = (now - start) / 1000 + penalty * 0.5;
	}

	if (alphasChanged === 20) {
		const lastBestLocal = localStorage.getItem("stopgame");

		if (Number(lastBestLocal) === 0) {
			localStorage.setItem("stopgame", secondsPassed);
			setCompletionMessage("Success");
			setLastBest(secondsPassed);
		} else if (Number(lastBestLocal) > Number(secondsPassed)) {
			localStorage.setItem("stopgame", secondsPassed);
			setLastBest(secondsPassed);
			setCompletionMessage("Success");
		} else if (Number(lastBestLocal) < Number(secondsPassed)) {
			alphasChanged = 0;
			setCompletionMessage("Try Again");
		}
		setAlphaEntered("");
		clearInterval(interval.current);
	}

	const handleInput = (e) => {
		gameBegan++;

		if (gameBegan === 1) {
			try {
				setNow(Date.now());
				setStart(Date.now());
				clearInterval(interval?.current);
				interval.current = setInterval(() => {
					setNow(Date.now());
				}, 62.5);
			} catch (err) {
				console.log(err);
			}
		}
		const alphabet = e.target.value;

		setAlphaEntered(alphabet);
		if (alphabet[alphabet.length - 1] === alphaShown) {
			if (!backspaceOrDeletePressed) {
				setAlphaShown(Alphabets[Math.floor(Math.random() * 26)]);
				alphasChanged++;
				setIsWrongAlpha(false);
			}
		} else if (alphabet[alphabet.length - 1] !== alphaShown) {
			if (!backspaceOrDeletePressed) {
				setIsWrongAlpha(true);
				penalty++;
			}
		}
	};

	const handleReset = () => {
		alphasChanged = 0;
		gameBegan = 0;
		penalty = 0;
		setStart(null);
		clearInterval(interval?.current);
		setCompletionMessage("");
		setAlphaEntered("");
	};

	const handleBackspaceAndDelete = (e) => {
		const key = e.key;
		if (key === "Backspace" || key === "Delete") {
			setBackspaceOrDeletePressed(true);
		} else {
			setBackspaceOrDeletePressed(false);
		}
	};

	return (
		<div className={style["main-container"]}>
			<h1>Type The Alphabet</h1>
			<p>
				Typing game to see how fast you can type. Timer starts when you do :)
			</p>
			<div
				style={{ color: isWrongAlpha ? "red" : "white" }}
				className={style["letter-container"]}>
				{completionMessage !== "" ? completionMessage : alphaShown}
			</div>
			<div className={style["input-container"]}>
				<input
					className={style["input"]}
					placeholder="Enter Alphabets To Start Playing"
					type={"text"}
					onInput={handleInput}
					onKeyDown={handleBackspaceAndDelete}
					value={alphaEntered}
					autoFocus={true}
					onBlur={({ target }) => target.focus()}></input>
				<button className={style.restart} onClick={handleReset} type="button">
					Restart
				</button>
			</div>
			<p>
				Time: <span>{secondsPassed}s</span>
			</p>
			<p>
				my best time: <span>{lastBest}s</span>
			</p>
		</div>
	);
}

export default App;

import "../styles/GameScreen.css";
import { useState, useEffect, useRef } from "react";
import DisplayCookies from "./DisplayCookies";
import UpgradeButton from "./UpgradeButton";
import FunctionButton from "./FunctionButton";
import clickerImg from "../assets/clicker.png";
import ovenImg from "../assets/oven.png";
import farmImg from "../assets/farm.png";
import robotImg from "../assets/robot.png";
import factoryImg from "../assets/factory.png";
import flourImg from "../assets/flour.png";
import timeImg from "../assets/time.png";
import quantumImg from "../assets/quantum.png";
import alienImg from "../assets/alien.png";
import interdimensionalImg from "../assets/interdimensional.png";
import BackgroundSound from "/BackgroundSound.mp3";
import CookieClickSound from "/CookieClickSound.mp3";

const icons = [
  clickerImg,
  ovenImg,
  farmImg,
  robotImg,
  factoryImg,
  flourImg,
  timeImg,
  quantumImg,
  alienImg,
  interdimensionalImg,
];

export default function GameScreen() {
  const numberStyle = {
    fontSize: "70px",
    color: "red",
    marginTop: "0",
    marginBottom: "-30px",
  };

  const hrStyle = {
    border: "0",
    width: "100%",
    backgroundColor: "grey",
    height: "1px",
  };

  let [state, setState] = useState(null);
  // console.log("state", state);
  const [displayCookies, setDisplayCookies] = useState(0);

  // Show How To Play message
  const [show, setShow] = useState(false);

  // Play/pause background sound
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(BackgroundSound));

  function toggleSound() {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  // get items from local storage
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("state"));
    if (savedState) {
      setState(savedState);
    } else {
      setState({
        cookies: 100,
        cps: 1,
        purchasedItems: [],
      });
    }
  }, []);

  // add "state" to localstorage if there isn't one, use "state" as dependency, if state changes, run useEffect again
  useEffect(() => {
    if (state !== null) {
      localStorage.setItem("state", JSON.stringify(state));
    }
  }, [state]);

  // Fetch upgrade items from API
  const [upgrades, setUpgrades] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://cookie-upgrade-api.vercel.app/api/upgrades"
      );
      const data = await response.json();
      setUpgrades(data);
    }
    fetchData();
  }, []);

  // Set timer for auto cps increment
  useEffect(() => {
    const interval = setInterval(() => {
      // update state using setState, using a function
      setState((currentState) => ({
        ...currentState,
        cookies: currentState.cookies + currentState.cps,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [state?.cps]); //ensure the effect rerun if state.cps changes

  // Play sound when clicking cookie + increase cookie count
  function playCookieSound() {
    const cookieSound = new Audio(CookieClickSound);
    cookieSound.play();
  }

  function cookieClick() {
    setState((prevState) => ({
      ...prevState,
      cookies: prevState.cookies + 1,
    }));
    playCookieSound();
  }

  // function set for the display cookies run smoothly
  useEffect(() => {
    if (state !== null) {
      const displayInterval = setInterval(() => {
        setDisplayCookies(
          (currentDisplayCookies) => currentDisplayCookies + state.cps / 10 // ensure displayCookie increase smoothly over time rather than a big jumps
        );
      }, 100);
      return () => clearInterval(displayInterval);
    }
  }, [state?.cps]); // when state.cps changes, it clears the prev interval and starts a new one

  useEffect(() => {
    if (state !== null) {
      setDisplayCookies(state.cookies);
    }
  }, [state?.cookies]);

  if (state === null) {
    return <div>calculating cookies...</div>;
  }

  // Reset game
  function resetGame() {
    setState({
      cookies: 100,
      cps: 1,
      purchasedItems: [],
    });
    localStorage.clear();
  }

  return (
    <div className="game-screen">
      <div className="game-button">
        <FunctionButton
          buttonName={"How to play"}
          onClick={() => setShow(!show)}
        />
        {show && (
          <div className="overlay" onClick={() => setShow(false)}>
            <p className="popupMessage">
              The game produces 1 cookie per second. You earn additional cookies
              with each click on the "cookie" button. To boost cookie
              production: Purchase upgrades as you collect enough cookies.
              Example upgrade: The "enhanced oven" costs 500 cookies. It
              increases production to 5 cookies per second. Challenge: See how
              many cookies you can create! Have fun!
            </p>
          </div>
        )}

        <FunctionButton buttonName={"Reset Game"} onClick={resetGame} />

        <FunctionButton
          buttonName={"Sound on/off"}
          onClick={toggleSound}
          style={{ cursor: "pointer", padding: "10px", fontSize: "16px" }}
          onMouseEnter={() => {
            document.body.style.cursor = "pointer";
          }}
          onMouseLeave={() => {
            document.body.style.cursor = "auto";
          }}
        />
      </div>

      <p style={numberStyle} id="cookies">
        {Math.floor(displayCookies)}
      </p>
      <br />
      <h2>{state.cps} cps</h2>
      <br />

      <DisplayCookies cookieClick={cookieClick} />

      <hr style={hrStyle} />
      <h2 className="upgrade-title">Upgrade List ⚡️ </h2>
      <div className="list-style">
        {upgrades.map((upgrade, index) => (
          <UpgradeButton
            upgrade={upgrade}
            key={upgrade.id}
            iconSrc={icons[index]}
            state={state}
            setState={setState}
          />
        ))}
      </div>
    </div>
  );
}

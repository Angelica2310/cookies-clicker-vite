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
    color: "#1A7AB8",
    marginTop: "0",
    marginBottom: "-30px",
  };

  const listStyle = {
    display: "grid",
    gridTemplateColumns: "auto auto auto auto auto",
    justifyContent: "space-evenly",
    textAlign: "center",
    gap: "30px",
    fontSize: "11px",
    color: "#1A7AB8",
    marginBottom: "30px",
  };

  const hrStyle = {
    border: "0",
    width: "100%",
    backgroundColor: "grey",
    height: "1px",
  };

  // Fetch upgrade items from API
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://cookie-upgrade-api.vercel.app/api/upgrades"
      );
      const data = await response.json();
      setItems(data);
    }
    fetchData();
  }, []);

  // Load saved values from localStorage
  const [cookies, setCookies] = useState(() => {
    return Number(localStorage.getItem("cookies")) || 0;
  });
  const [cps, setCps] = useState(() => {
    return Number(localStorage.getItem("cps")) || 1;
  });

  // Set timer for auto cps increment
  useEffect(() => {
    const interval = setInterval(() => {
      setCookies((current) => current + cps);
    }, 1000);

    return () => clearInterval(interval);
  }, [cps]);

  // Save cookies and cps to localStorage
  useEffect(() => {
    localStorage.setItem("cookies", cookies);
  }, [cookies]);

  useEffect(() => {
    localStorage.setItem("cps", cps);
  }, [cps]);

  // Function when click button, cookies increase
  function cookieClick() {
    setCookies(cookies + 1);
  }

  // Buy upgrade function
  function buyUpgrade(item) {
    if (cookies >= item.cost) {
      setCookies(cookies - item.cost);
      setCps(cps + item.increase);
    }
  }

  // Reset the game function
  function resetGame() {
    setCookies(0);
    setCps(1);
    localStorage.clear();
  }

  // Show How To Play message
  const [show, setShow] = useState(false);

  // Play/pause background sound
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(BackgroundSound));

  const toggleSound = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

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
        {cookies}
      </p>
      <br />
      <h2>{cps} cps</h2>
      <br />
      <DisplayCookies cookieClick={cookieClick} />
      <hr style={hrStyle} />
      <h2 className="upgrade-title">Upgrade List</h2>
      <div style={listStyle}>
        {items.map((item, index) => (
          <UpgradeButton
            buyUpgrade={buyUpgrade}
            item={item}
            key={item.id}
            iconSrc={icons[index]}
            cookies={cookies}
          />
        ))}
      </div>
    </div>
  );
}

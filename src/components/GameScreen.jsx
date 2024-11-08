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
    color: "#1A7AB8",
    marginTop: "0",
    marginBottom: "-30px",
  };

  const hrStyle = {
    border: "0",
    width: "100%",
    backgroundColor: "grey",
    height: "1px",
  };

  // Fetch upgrade items from API

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

  function loadItems() {
    try {
      const storedItems = JSON.parse(localStorage.getItem("items"));
      return Array.isArray(storedItems) ? storedItems : [];
    } catch (error) {
      console.log("Failed", error);
      return [];
    }
  }
  const [items, setItems] = useState(loadItems());

  // Set timer for auto cps increment
  useEffect(() => {
    const interval = setInterval(() => {
      setCookies((current) => current + cps);
    }, 1000);

    return () => clearInterval(interval);
  }, [cps]);

  // Save cookies and cps and countUpgrade to localStorage
  useEffect(() => {
    localStorage.setItem("cookies", cookies);
  }, [cookies]);

  useEffect(() => {
    localStorage.setItem("cps", cps);
  }, [cps]);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  });

  // Function when click button, cookies increase
  function playCookieSound() {
    const cookieSound = new Audio(CookieClickSound);
    cookieSound.play();
  }

  function cookieClick() {
    setCookies(cookies + 1);
    playCookieSound();
  }

  // Buy upgrade function
  function buyUpgrade(item) {
    if (cookies >= item.cost) {
      setCookies(cookies - item.cost);
      setCps(cps + item.increase);

      // Function when click buy upgrade, quantity counted
      const tempItems = [...items]; // creates a new array tempItems by copying the values from the original items array
      const tempUpgrade = tempItems.find(
        // find the target item that macthes with specified id
        (targetitem) => targetitem.id === item.id
      );
      tempUpgrade.owned = tempUpgrade.owned ? tempUpgrade.owned + 1 : 1; // update the 'owned' property of the found item

      setItems(tempItems);
      // console.log(tempItems);
      // save the quantity to local storage
      localStorage.setItem("items", JSON.stringify(tempItems));
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

  function toggleSound() {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
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
        {cookies}
      </p>
      <br />
      <h2>{cps} cps</h2>
      <br />

      <DisplayCookies cookieClick={cookieClick} />

      <hr style={hrStyle} />
      <h2 className="upgrade-title">Upgrade List ⚡️ </h2>
      <div className="list-style">
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

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

  // Fetch upgrade items from API

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

  // Load saved values from localStorage
  const [cookies, setCookies] = useState(() => {
    return Number(localStorage.getItem("cookies")) || 100;
  });
  const [cps, setCps] = useState(() => {
    return Number(localStorage.getItem("cps")) || 1;
  });

  function loadItems() {
    try {
      const storedItems = JSON.parse(localStorage.getItem("upgrades"));
      return Array.isArray(storedItems) ? storedItems : [];
    } catch (error) {
      console.log("Failed", error);
      return [];
    }
  }

  const [upgrades, setUpgrades] = useState(loadItems());

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
    localStorage.setItem("upgrades", JSON.stringify(upgrades));
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
  function buyUpgrade(upgrade) {
    if (cookies >= upgrade.cost) {
      setCookies(cookies - upgrade.cost);
      setCps(cps + upgrade.increase);

      // check if the upgrade has saved in local storage
      const savedUpgrade = upgrades.find((u) => u.id === upgrade.id);
      console.log("savedUpgrade", savedUpgrade);
      upgrade.quantity = savedUpgrade ? savedUpgrade.quantity : 0;

      console.log("upgrade", upgrade);

      // Function when click buy upgrade, quantity counted
      const tempItems = [...upgrades]; // creates a new array tempItems by copying the values from the original upgrades array using spread operator
      const tempUpgrade = tempItems.find(
        // find the target upgrade that matches with specified id
        (targetItem) => targetItem.id === upgrade.id
      );
      tempUpgrade.owned = tempUpgrade.owned ? tempUpgrade.owned + 1 : 1; // update the 'owned' property of the found upgrade

      setUpgrades(tempItems);
      // console.log(tempItems);

      // Update the upgrades array with the new tempItems array and save to local storage
      const existingItemsIndex = upgrade.findIndex((i) => i.id === upgrade.id);
      if (existingItemsIndex !== -1) {
        upgrades[existingItemsIndex].quantity = upgrade.quantity;
      } else {
        upgrades.push({ ...upgrade });
      }

      // save the quantity to local storage
      localStorage.setItem("clickedItem", JSON.stringify(upgrade));
    }
    console.log(upgrade.owned);
  }

  // Reset the game function
  function resetGame() {
    setCookies(100);
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
        {upgrades.map((upgrade, index) => (
          <UpgradeButton
            buyUpgrade={buyUpgrade}
            upgrade={upgrade}
            key={upgrade.id}
            iconSrc={icons[index]}
            cookies={cookies}
          />
        ))}
      </div>
    </div>
  );
}

import { useRef } from "react";
import "../styles/UpgradeButton.css";
import Icon from "./Icon";
import CoinSound from "/CoinSound.mp3";
import NotEnoughCookieSound from "/NotEnoughCookieSound.mp3";

export default function UpgradeButton({ upgrade, iconSrc, state, setState }) {
  const coinSound = useRef(new Audio(CoinSound));

  function playCoinSound() {
    coinSound.current.currentTime = 0;
    coinSound.current
      .play()
      .catch((error) => console.log("Audio error:", error));
  }
  function errorSound() {
    const error = new Audio(NotEnoughCookieSound);
    error.play();
  }

  function findQuantity(upgradeId) {
    // console.log("state", state.purchasedItems);
    return (
      state?.purchasedItems.filter((upgrade) => upgrade.id === upgradeId) // filter the 'purchasedItems' array and return new array that match the given upgradeId
        .length || 0
    ); // count how many items was found in the filtered array. If state.purchasedItems is null or undefined, return 0
  }

  const handleBuyButton = (upgrade) => {
    if (state.cookies >= upgrade.cost) {
      setState((prevState) => ({
        ...prevState,
        cookies: prevState.cookies - upgrade.cost,
        cps: prevState.cps + upgrade.increase,
        purchasedItems: [...prevState.purchasedItems, upgrade],
      }));
      playCoinSound();
    } else {
      errorSound();
    }
  };

  return (
    <div className="list-item">
      <p style={{ color: "red" }}>Quantity: {findQuantity(upgrade.id)}</p>
      <h3>{upgrade.name}</h3>
      <p>Cost: 🍪 {upgrade.cost}</p>
      <p>Effect: +{upgrade.increase}cps</p>
      <div className="icon-button">
        <Icon src={iconSrc} alt={`${upgrade.name} icon`} />
        <div
          onClick={() => {
            if (state.cookies < upgrade.cost) {
              errorSound();
            }
          }}
          style={{
            cursor: state.cookies < upgrade.cost ? "not-allowed" : "pointer",
          }}
        >
          <button
            onClick={() => {
              if (state.cookies >= upgrade.cost) {
                handleBuyButton(upgrade);
              }
            }}
            style={{
              backgroundColor:
                state.cookies < upgrade.cost ? "lightgrey" : "#365411",
              pointerEvents: state.cookies < upgrade.cost ? "none" : "auto",
            }}
          >
            buy
          </button>
        </div>
      </div>
    </div>
  );
}

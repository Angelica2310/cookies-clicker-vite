import "../styles/UpgradeButton.css";
import Icon from "./Icon";
import CoinSound from "/CoinSound.mp3";
import NotEnoughCookieSound from "/NotEnoughCookieSound.mp3";

export default function UpgradeButton({
  buyUpgrade,
  upgrade,
  iconSrc,
  cookies,
}) {
  function coinSound() {
    const coin = new Audio(CoinSound);
    coin.play();
  }
  function errorSound() {
    const error = new Audio(NotEnoughCookieSound);
    error.play();
  }

  return (
    <div className="list-item">
      <p style={{ color: "red" }}>Quantity: {upgrade.owned || 0}</p>
      <h3>{upgrade.name}</h3>
      <p>Cost: 🍪 {upgrade.cost}</p>
      <p>Effect: +{upgrade.increase}cps</p>
      <div className="icon-button">
        <Icon src={iconSrc} alt={`${upgrade.name} icon`} />
        <div
          onClick={() => {
            if (cookies < upgrade.cost) {
              errorSound();
            }
          }}
          style={{
            cursor: cookies < upgrade.cost ? "not-allowed" : "pointer",
          }}
        >
          <button
            onClick={() => {
              if (cookies >= upgrade.cost) {
                coinSound();
                buyUpgrade(upgrade);
              }
            }}
            style={{
              backgroundColor: cookies < upgrade.cost ? "lightgrey" : "#365411",
              pointerEvents: cookies < upgrade.cost ? "none" : "auto",
            }}
          >
            buy
          </button>
        </div>
      </div>
    </div>
  );
}

import "../styles/UpgradeButton.css";
import Icon from "./Icon";
import CoinSound from "/CoinSound.mp3";
import NotEnoughCookieSound from "/NotEnoughCookieSound.mp3";

export default function UpgradeButton({ buyUpgrade, item, iconSrc, cookies }) {
  const coinSound = () => {
    const coin = new Audio(CoinSound);
    coin.play();
  };
  const errorSound = () => {
    const error = new Audio(NotEnoughCookieSound);
    error.play();
  };

  return (
    <div className="list-item">
      <h3>{item.name}</h3>
      <p>Cost: 🍪 {item.cost}</p>
      <p>Effect: +{item.increase}cps</p>
      <div className="icon-button">
        <Icon src={iconSrc} alt={`${item.name} icon`} />
        <div
          onClick={() => {
            if (cookies < item.cost) {
              errorSound();
            }
          }}
          style={{
            cursor: cookies < item.cost ? "not-allowed" : "pointer",
          }}
        >
          <button
            onClick={() => {
              if (cookies >= item.cost) {
                coinSound();
                buyUpgrade(item);
              }
            }}
            style={{
              opacity: cookies < item.cost ? 0.5 : 1,
              pointerEvents: cookies < item.cost ? "none" : "auto",
            }}
          >
            buy
          </button>
        </div>
      </div>
    </div>
  );
}

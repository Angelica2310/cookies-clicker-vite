import cookiesImg from "../assets/cookies.png";
import "../styles/DisplayCookies.css";

export default function DisplayCookies({ cookieClick }) {
  return (
    <div>
      <img
        id="cookies-btn"
        src={cookiesImg}
        alt="cookie image"
        width="200px"
        onClick={cookieClick}
      />
    </div>
  );
}

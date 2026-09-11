import { Link } from "react-router-dom";

export default function HomeButton() {
  return (
    <Link to="/" className="home-button" aria-label="Back to home">
      ← Home
    </Link>
  );
}
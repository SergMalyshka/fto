import { Link } from "react-router-dom";
import style from './Home.module.css'
import Auth from "../utils/auth";

const Home = () => {
  return (
    <div>
        <div>
        <img src="/pt-logo.png" alt="a logo with a caduceus and a tagline" className={style.fade}></img>
        </div>
      <div>
      {Auth.loggedIn() ? (
        <p>Access the <Link to="/Dashboard">Dashboard</Link></p>
      ) : ( 
      <p>
        Please <Link to="/DoctorLogin">login</Link> to continue
      </p>)}
      </div>
    </div>
  );
};

export default Home;

import { Link, useLocation } from 'react-router-dom';
import style from './NavTabs.module.css'
import Auth from '../../utils/auth';

// Here we are using object destructuring assignment to pluck off our variables from the props object
// We assign them to their own variable names
function NavTabs() {
  const currentPage = useLocation().pathname;

  return (
    <ul className={`nav nav-item ${style.navigation}`}>
      <li className={`nav nav-item ${style.navItem}`}>
        <Link
          to="/"
          className={currentPage === '/' ? `${style.activeTab} nav-link` : `${style.inactive} nav-link`}
        >
          Home
        </Link>
      </li>

      <li className={`nav nav-item ${style.navItem}`}>
        <Link
          to="/Dashboard"
          className={currentPage === '/Dashboard' ? `${style.activeTab} nav-link` : `${style.inactive} nav-link`}
        >
          Dashboard
        </Link>
      </li>
      <li className={`nav nav-item ${style.navItem}`}>
        <Link
          to="/SignIn"
          className={currentPage === '/SignIn' ? `${style.activeTab} nav-link` : `${style.inactive} nav-link`}
        >
          Patient Sign-In
        </Link>
        </li>
        <li className={`nav nav-item ${style.navItem}`}>
        <Link
          to="/AddDoctor"
          className={currentPage === '/AddDoctor' ? `${style.activeTab} nav-link` : `${style.inactive} nav-link`}
        >
          Create Login
        </Link>
      </li>
      {Auth.loggedIn() ? (
      <button className={`${style.button}`} onClick={Auth.logout}>Logout</button>
      ) : (
        
      <li className={`nav nav-item ${style.navItem}`}>
        <Link
          to="/DoctorLogin"
          className={currentPage === '/DoctorLogin' ? `${style.activeTab} nav-link` : `${style.inactive} nav-link`}
        >
          Login
        </Link>
      </li>)}
    </ul>
  );
}

export default NavTabs;

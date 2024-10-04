import style from "./SignIn.module.css";
import { useState } from "react";

import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";

import Auth from "../utils/auth";

const DoctorLogin = () => {
  const [formState, setFormState] = useState({ username: "", password: "" });
  const [login, { error }] = useMutation(LOGIN_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await login({
        variables: { ...formState },
      });

      if (!data) {
        setErrorMessage("Login unsucessful");
        return;
      }

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    setFormState({
      username: "",
      password: "",
    });
  };

  return (
    <div>
      {Auth.loggedIn() ? (
        <div>
          <p className={`${style.option}`}>Login Sucessful</p>
        </div>
      ) : (
        <div className={`${style.signin}`}>
          <p className={`${style.option}`}>Login</p>
          <form
            className={`form ${style.severityForm}`}
            onSubmit={handleFormSubmit}
          >
            <input
              value={formState.username}
              placeholder="Username"
              name="username"
              type="username"
              onChange={handleChange}
              className={`form-control ${style.formItem}`}
            />
            <input
              value={formState.password}
              placeholder="********"
              name="password"
              type="password"
              onChange={handleChange}
              className={`form-control ${style.formItem}`}
            />
            <button className={`btn btn-warning ${style.button}`} type="submit">
              Login
            </button>

            {error && (
              <div>
                <p className={style.error}>{error.message}</p>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default DoctorLogin;

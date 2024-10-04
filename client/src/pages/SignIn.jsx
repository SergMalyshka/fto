import style from "./SignIn.module.css";
import { useState } from "react";
import validator from "../utils/validator";
import { ADD_PATIENT, PATIENT_LOOKUP, ADD_VISIT } from "../utils/mutations";
import { getDateNow } from "../utils/date";
import Auth from "../utils/auth";
import { Link } from "react-router-dom";
import LoginPrompt from "../components/LoginPrompt/LoginPrompt";


import { useMutation } from "@apollo/client";

export default function SignIn() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [reason, setReason] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [signInSuccess, setSignInSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [renderSignUp, setRenderSignUp] = useState(false);
  const [closure, setClosure] = useState("");
  const [signInButton, setSignInButton] = useState(true);
  const [userId, setUserId] = useState("");

  const [getPatient] = useMutation(PATIENT_LOOKUP);
  const [addPatient] = useMutation(ADD_PATIENT);
  const [addVIsit] = useMutation(ADD_VISIT);

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    if (!renderSignUp) {
      if (!firstName || !lastName || !dob) {
        setErrorMessage("Please complete all fields prior to submitting");
        return;
      }

      if (!validator(dob)) {
        setErrorMessage("Check the date for validity, use MM/DD/YYYY format");
        return;
      }

      try {
        const search = await getPatient({
          variables: { firstName: firstName, lastName: lastName, dob: dob },
        });
        setUserId(search.data.getPatient._id);
        setSignInSuccess(true);
        setSuccessMessage("Patient found!");
        setErrorMessage("");
        setSignInButton(false);
      } catch (err) {
        setErrorMessage(
          "Patient not found, complete all fields to sign one up"
        );
        setRenderSignUp(true);
      }
    }

    if (renderSignUp) {
      if (!medicalHistory || !allergies || !medications) {
        setErrorMessage("Please complete all fields prior to submitting");
        return;
      }
      try {
        const search = await addPatient({
          variables: {
            firstName: firstName,
            lastName: lastName,
            dob: dob,
            medicalHistory: medicalHistory,
            allergies: allergies,
            medications: medications,
          },
        });
        setSuccessMessage("Patient added to database");
        setUserId(search.data.addPatient._id);
        setSignInSuccess(true);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleCompleteCheckIn = async (e) => {
    e.preventDefault();
    setClosure("Check in completed successfully");
    try {
      const newVisit = await addVIsit({variables: {date: getDateNow(), status: "Waiting", severity: severity, reason: reason, patient: userId}})
    } catch (err) {
      console.log(err);
    }
    setErrorMessage("");
    setRenderSignUp(false);
    setSignInSuccess(false);
    setFirstName("");
    setLastName("");
    setDob("");
    setAllergies("");
    setMedicalHistory("");
    setMedications("");
    setReason("");
    setSignInButton(true);
  };

  const handleSignInChange = (e) => {
    const { name, value, id } = e.target;
    setClosure("");
    if (name === "firstName") {
      setFirstName(value);
    } else if (name === "lastName") {
      setLastName(value);
    } else if (name === "dob") {
      setDob(value);
    } else if (name === "medicalHistory") {
      setMedicalHistory(value);
    } else if (name === "allergies") {
      setAllergies(value);
    } else if (name === "medications") {
      setMedications(value);
    }
  };

  const handleSeverityChange = (e) => {
    const { name, value, id } = e.target;
    if (name === "visitReason") {
      setReason(value);
    } else if (id === "btnradio1") {
      setSeverity("Critical");
    } else if (id === "btnradio2") {
      setSeverity("Semi-Urgent");
    } else {
      setSeverity("Non-Urgent");
    }
  };

  return (
    <div>
      {Auth.loggedIn() ? (
        <div>
          <div className={`${style.signin}`}>
            <p className={`${style.option}`}>Sign In</p>
            <form
              className={`form ${style.severityForm}`}
              onSubmit={handleSignInSubmit}
            >
              <input
                value={firstName}
                name="firstName"
                onChange={handleSignInChange}
                type="text"
                placeholder="First Name"
                className={`form-control ${style.formItem}`}
              />

              <input
                value={lastName}
                name="lastName"
                onChange={handleSignInChange}
                type="text"
                placeholder="Last Name"
                className={`form-control ${style.formItem}`}
              />
              <input
                value={dob}
                name="dob"
                onChange={handleSignInChange}
                type="text"
                placeholder="Date of Birth (MM/DD/YYYY)"
                className={`form-control ${style.formItem}`}
              ></input>

              {renderSignUp && (
                <div>
                  <textarea
                    value={medicalHistory}
                    name="medicalHistory"
                    onChange={handleSignInChange}
                    type="text"
                    placeholder="Medical History, separated by a comma"
                    className={`form-control ${style.formItem}`}
                  ></textarea>
                  <textarea
                    value={allergies}
                    name="allergies"
                    onChange={handleSignInChange}
                    type="text"
                    placeholder="Allergies, separated by a comma"
                    className={`form-control ${style.formItem}`}
                  ></textarea>
                  <textarea
                    value={medications}
                    name="medications"
                    onChange={handleSignInChange}
                    type="text"
                    placeholder="Medications, separated by a comma"
                    className={`form-control ${style.formItem}`}
                  ></textarea>
                </div>
              )}

              {errorMessage && (
                <div>
                  <p className={style.error}>{errorMessage}</p>
                </div>
              )}

              {signInButton && (
                <div>
                  <button
                    className={`btn btn-warning ${style.button}`}
                    type="submit"
                  >
                    Sign-In
                  </button>
                </div>
              )}
            </form>
          </div>

          {signInSuccess && (
            <div>
              <hr className={`${style.horizontal}`}></hr>
              <p className={style.loggedIn}>{successMessage}</p>
              <form
                className={style.severityForm}
                onSubmit={handleCompleteCheckIn}
              >
                <input
                  value={reason}
                  name="visitReason"
                  onChange={handleSeverityChange}
                  type="text"
                  placeholder="Reason for today's visit"
                  className={`form-control ${style.formItem}`}
                ></input>

                <p className={style.severityText}>Severity</p>
                <div
                  className={`btn-group ${style.severity}`}
                  role="group"
                  aria-label="Basic radio toggle button group"
                >
                  <input
                    onChange={handleSeverityChange}
                    type="radio"
                    className={`btn-check`}
                    name="btnradio"
                    id="btnradio1"
                    autoComplete="off"
                  />
                  <label className="btn btn-outline-danger" htmlFor="btnradio1">
                    Critical
                  </label>

                  <input
                    onChange={handleSeverityChange}
                    type="radio"
                    className={`btn-check`}
                    name="btnradio"
                    id="btnradio2"
                    autoComplete="off"
                  />
                  <label
                    className={`btn btn-outline-warning ${style.semi}`}
                    htmlFor="btnradio2"
                  >
                    Semi-Urgent
                  </label>

                  <input
                    onChange={handleSeverityChange}
                    type="radio"
                    className="btn-check"
                    name="btnradio"
                    id="btnradio3"
                    autoComplete="off"
                  />
                  <label
                    className={`btn btn-outline-success`}
                    htmlFor="btnradio3"
                  >
                    Non-Urgent
                  </label>
                </div>
                <button
                  className={`btn btn-warning ${style.button}`}
                  type="submit"
                >
                  Complete Visit Check-in
                </button>
              </form>
            </div>
          )}
          {closure && (
            <div>
              <p className={style.severityText}>{closure}</p>
            </div>
          )}
        </div>
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
}

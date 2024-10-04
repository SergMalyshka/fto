import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_VISIT } from '../utils/mutations';
import { QUERY_SINGLE_VISIT } from '../utils/queries';
import PatientDetails from "../components/PatientDetails/PatientDetails";
import PreviousNotes from '../components/PreviousNotes/PreviousNotes';
import styles from './VisitForm.module.css';
import style from "../components/VisitList/VisitList.module.css"
import PreviousVisits from '../components/PreviousVisits/PreviousVisits';


const VisitForm = () => {
  const [notes, setNotes] = useState('');
  const [updateVisit] = useMutation(UPDATE_VISIT);

  const { visitId } = useParams();
  const { loading, error, data, refetch } = useQuery(QUERY_SINGLE_VISIT, {
    variables: { id: visitId }
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await updateVisit({
        variables: { id: visitId, notes },
      });
      refetch();
      setNotes('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading visit details</div>;
  }

  const visitData = data.getOneVisit;
  const fullName = visitData.patient.firstName + " " + visitData.patient.lastName;

  return (
    <>
      <h2 className={styles.header}>{`${fullName} - ${visitData.reason}`}</h2>
      <form className="flex-row justify-center justify-space-between-md align-center"
        onSubmit={handleFormSubmit}>
        <div className='row'>
          <div className='col-4'><PatientDetails data={visitData} /> {/* Pass patient data to PatientDetails */}</div>
          <div className='col-8'>
            <div className={`row ${styles.inputBox}`}>
              <div className="text-center notebox">
                <textarea
                  rows='10'
                  placeholder="Notes"
                  value={notes}
                  className="form-input"
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>
            </div>
            <div className={`row ${styles.saveButton}`}>
              <button className={`${style.buttonPushable} ${styles.save} ${style.buttonFront} ${style.btntxt}`}>
                <span>
                  Save Note
                </span>
              </button>
            </div>
            <div className="col-12 ">
            </div>
            {error && (
              <div>
                This didn't work 😡
              </div>
            )}
          </div>
        </div>


      </form>
      <PreviousNotes data={visitData} />


      <PreviousVisits data={visitData.patient.visits} id={visitId}/>
    </>
  );
};

export default VisitForm;
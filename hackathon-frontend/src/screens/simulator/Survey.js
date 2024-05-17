import React, { useState } from "react";
import "./Survey.css"
import Companies from "../../components/simulator/Companies";
import Simulation from "./Simulation";
import Loading from "../../components/Loading";

import { useNavigate } from "react-router-dom";
import axios from 'axios';
import swal from "sweetalert";

import { Form, Button } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";

function Survey() {
    const [loading, setLoading] = useState(false);
    const [money, setMoney] = useState();
    const [company, setCompany] = useState('');
    const [companyWord, setCompanyWord] = useState('');
    const [result, setResult] = useState({});

    const [modalCompanies, setModalCompanies] = useState(false);
    const [openSimulation, setOpenSimulation] = useState(false);

    const getData = async () => {
        setLoading(true)
        if (isNaN(money) || money <= 0 || company === '') {
            setLoading(false)
            swal('Error', 'Error, please fill out the fields..', 'error');
        } else {
            try {
                const response = await axios.post('http://127.0.0.1:5000/api/data', { money: money, company: companyWord });
                setResult(response.data);
                setOpenSimulation(true)
                swal('Nice!', 'It works!.', 'success');
            } catch (error) {
                swal('Error', 'Error, try again.', 'error');
            } finally {
                setLoading(false)
            }
        }
    };

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <>
            <div className="survey-container">
                <div className="survey-left">
                    <h1>Investment Simulator</h1>
                    <p>{companyWord}</p>
                    <p>Did you ever think about putting some of your hard earned money into invertments? Let's take a look at how much your making and which company might interest you!</p>
                </div>

                <div className="survey-right">
                    <h2>Select a Company</h2>
                    <Button onClick={() => { setModalCompanies(true) }} style={{
                        width: '40%', fontSize: '25px', borderRadius: '20px'
                    }}
                        variant={company == '' ? "danger" : "success"} type="submit">
                        {company == '' ? 'Select' : company + ' Selected'}
                    </Button>
                    <hr />
                    <h2>How much money do you spend? (USD)</h2>

                    <Form.Control
                        style={{ width: '90%', fontFamily: 'QuicksandRegular', fontSize: '20px', backgroundColor: '#EEEEEE' }}
                        type='number'
                        placeholder='$'
                        onChange={(event) => setMoney(parseInt(event.target.value))}
                        value={money}
                    />
                    <Button style={{
                        width: '40%', fontSize: '25px', borderRadius: '20px', marginTop: '30px'
                    }}
                        variant="danger" onClick={() => {getData()}}>
                        Submit
                    </Button>

                </div>
            </div>
            {modalCompanies && <Companies setModalCompanies={setModalCompanies} setCompany={setCompany} setCompanyWord={setCompanyWord} />}
            {openSimulation && <Simulation company={company} result={result}/>}
        </>
    );
}
export default Survey;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Simulation.css';
import Loading from "../../components/Loading";
import MakeComment from "../../components/simulator/Post";

import { db } from "../../firebase";
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

import swal from 'sweetalert';
import { Form, Button } from 'react-bootstrap';
import { AgChartsReact } from 'ag-charts-react';

function Simulation({ company, result }) {
    const navigate = useNavigate();
    const userId = getAuth().currentUser.uid
    const [loading, setLoading] = useState(false);
    const [modalMakeComment, setModalMakeComment] = useState(false);

    const data = result.data;

    const startValue2 = data[0].value;
    const endValue2 = data[data.length - 1].value;
    const profitLossColor2 = endValue2 > startValue2 ? 'green' : 'red';
    const profitLossLine2 = [
        { month: data[0].month, value: startValue2 },
        { month: data[data.length - 1].month, value: endValue2 }
    ]

    const numFormatter = new Intl.NumberFormat("en-US");
    const tooltip = {
        renderer: ({ title, datum, xKey, yKey }) => ({
          title,
          content: `${datum[xKey]}: ${numFormatter.format(datum[yKey])}`,
        }),
    };

    const options = {
        data: data,
        title: {
            text: "3 Month Investment",
        },
        series: [
            {
                xKey: 'month',
                yKey: 'value',
                marker: { enabled: false},
                title: 'Last 90 Days',
                tooltip
            },
            {
                type: 'line',
                xKey: 'month',
                yKey: 'value',
                data: profitLossLine2,
                stroke: profitLossColor2, 
                lineDash: [6, 3],
                marker: { enabled: false },
                title: 'Profit/Loss',
                tooltip
            }
        ]
    };

    const pred = result.pred;
    const firstPart = pred.slice(0, pred.length - 30);
    const last30Days = pred.slice(pred.length - 31);

    const startValue = pred[0].value;
    const endValue = pred[pred.length - 1].value;
    const profitLossColor = endValue > startValue ? 'green' : 'red';
    const profitLossLine = [
        { month: pred[0].month, value: startValue },
        { month: pred[pred.length - 1].month, value: endValue }
    ]

    const options2 = {
        title: {
            text: "Next Month Prediction",
        },
        data: pred,
        series: [
            {
                type: 'line',
                xKey: 'month',
                yKey: 'value',
                data: firstPart,
                stroke: 'blue',
                marker: { enabled: false},
                title: 'Last 70 Days'
            },
            {
                type: 'line',
                xKey: 'month',
                yKey: 'value',
                data: last30Days,
                stroke: 'orange',
                marker: { enabled: false},
                title: 'Next 30 Days'
            },
            {
                type: 'line',
                xKey: 'month',
                yKey: 'value',
                data: profitLossLine,
                stroke: profitLossColor, 
                lineDash: [6, 3],
                marker: { enabled: false },
                title: 'Profit/Loss'
            }
        ]
    };

    const [userName, setUserName] = useState('');
    const fetchUser = async () => {
        try {
            const docUser = await getDoc(doc(db, 'users', userId))
            setUserName(docUser.data().name);
        } catch (error) {
            console.log("Error.");
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchUser();
            } catch (error) {
                swal('Error', 'Error, try again.', 'warning');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <>
            { modalMakeComment && <MakeComment setModalMakeComment={setModalMakeComment} user={userName} data={data}/>}
            <div className="simulation-container">
                <h1>{company} Investment</h1>
                <div className="container-chart">
                    <AgChartsReact options={options} />
                </div>
                
                <div className="buttons-chart">
                    <Button style={{
                        width: '20%', fontSize: '25px', borderRadius: '20px', margin: '30px'
                    }}
                        variant="danger" onClick={() => { navigate('/') }}>
                        Close
                    </Button>
                    <Button style={{
                        width: '20%', fontSize: '25px', borderRadius: '20px', margin: '30px'
                    }}
                        variant="success" onClick={() => {setModalMakeComment(true)}}>
                        Share
                    </Button>
                </div>

                <div className="container-chart">
                    <AgChartsReact options={options2} />
                </div>
                <br></br>
            </div>
        </>
    );
}

export default Simulation;
import './Chart.css';
import { AgChartsReact } from 'ag-charts-react';

function Chart({ data }) {
    const options = {
        data: data,
        series: [{
            xKey: 'month',
            yKey: 'value',
        }],
    };

    return (
        <AgChartsReact options={options} />
    );
}

export default Chart
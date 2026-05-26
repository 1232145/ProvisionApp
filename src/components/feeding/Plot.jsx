import React from 'react'
import Button from '../Button';

const PLOTS = ["Outside Plot", "Inside Plot"];

function Plot({ setPlot, data }) {

    return (
        <div className="plot">
            <p>Plot: {data}</p>
            <div className="plot-bt">
                {PLOTS.map((item, index) => (
                    <Button
                        handleData={setPlot}
                        value={item}
                        key={index}
                        selected={item === data}
                    />
                ))}
                <Button handleData={setPlot} value="" />
            </div>
        </div>
    )
}

export default Plot

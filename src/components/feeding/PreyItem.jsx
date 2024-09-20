import React from 'react'
import Button from '../Button'
import { useState } from 'react'

function PreyItem({setPreyItem, data}) {
    const [preyI, setPreyI] = useState(["H", "U", "R", "S", "UF", "A", "HD", "T", "H or R", "E"]);
    const dropdownValues = ["ALE", "AS", "B", "BR", "C", "CA", "CH", "CU", "CUS", "D", "DR", "EEL", "EP", "EW", "F", "FS", "G", "GH", "I", "J", 
    "K", "KF", "L", "LA/H", "LA/HD", "LA/R", "LA/S", "LA/UF", "M", "MF", "O", "P", "PL", "PS", "PUF",
    "Q", "RF", "RG", "ROS", "RS", "SB", "SH", "SM", "SN", "SP", "SS", "SY", "T", "TC", "U", "UF1", "UF1-SI2016", 
    "UFEER2016", "UF-PI2017", "UFSI2015", "UG", "LA/UF", "UI", "V", "W", "X", "Y", "Z"];

    const addPreyIOption = (data) => {
        setPreyI([...preyI, data]);
    }

    return (
        <div className="prey-item">
            <p>Prey Item: {data}</p>
            <div className="prey-item-bt">
                {
                    preyI.map((item, index) => {
                        return (
                            <Button key={index} 
                            value={item} 
                            handleData={setPreyItem}
                            selected={item === data}
                            />
                        )
                    })
                }
                <Button handleData={setPreyItem} value=""/>
                <Button handleData={setPreyItem} value="drop-down" selected={data} dropdownValues={dropdownValues} />
            </div>
        </div>
    )
}

export default PreyItem

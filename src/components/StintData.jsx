import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import Island from './stintl/Island'
import Species from './stintl/Species'
import Name from './stintl/Name'
import ObserverLocation from './stintl/ObserverLocation'
import DataTable from './stintl/DataTable';
import Date from '../Date'
import Timer from './Timer';
import Comment from './Comment';
import { saveAs } from 'file-saver';
import FeedingData from './FeedingData';
import { Button, Input, Row, Col } from 'antd';

const styles = {
    startStint: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #d9d9d9',
        padding: '30px',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        width: '50%',
        margin: '2.5% auto',
        backgroundColor: '#f9f9f9',
        maxWidth: '900px',
    },

    form: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '20px',
        width: '100%',
    },

    header: {
        marginBottom: '3.5%'
    },

    leftColumn: {
        padding: '20px',
        flex: '1',
        textAlign: 'left',
    },

    fixedInfo: {
        marginBottom: '3.5%'
    },

    rightColumn: {
        padding: '7.5px',
        flex: '1',
        textAlign: 'right',
    },

    labelContainer: {
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 0',
        borderBottom: '1px solid #e0e0e0',
    },

    label: {
        fontWeight: 'bold',
        fontSize: '14px',
        color: '#333',
        marginRight: '10px',
    },

    btnContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        marginTop: '20px',
        gap: '10px',
        padding: '10px 0',
    },

    navigateBtn: {
        width: '25%',
        backgroundColor: '#1890ff',
        borderColor: '#1890ff',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '4px',
        textAlign: 'center',
    },

    saveBtn: {
        width: '25%',
        backgroundColor: 'green',
        borderColor: 'green',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '4px',
        textAlign: 'center',
    },

    fileInput: {
        width: '50%',
        padding: '8px',
    },

    inputField: {
        width: '85%',
        height: '25px'
    },
};

function StintData() {
    //feeding data
    const initialFeeding = {
        FeedingID: 1,
        Nest: "",
        Time_Arrive: "",
        Time_Depart: "",
        Provider: "",
        Number_of_Items: [
            {
                Recipient: "",
                Prey_Item: "",
                Prey_Size: "",
            }
        ],
        Plot_Status: "Outside Plot",
        Comment: ""
    }

    //stint data
    const [stint, setStint] = useState({
        StintID: null,
        Stint_Type: "Chick Provisioning",
        Island: "",
        Species: "",
        Prey_Size_Method: "Numeric",
        Prey_Size_Reference: "Culmen length",
        FirstName: "",
        LastName: "",
        Observer_Location: "",
        Date_Time_Start: "",
        Date_Time_End: "",
        Comment: "",
        feedingData: [initialFeeding]
    });

    const [stintID, setStintID] = useState(`${stint.Island}-${stint.Species}-${stint.Date_Time_Start}-${stint.FirstName}-${stint.LastName}`)

    //display stintl/feeding data
    const [isOpenF, setIsOpenF] = useState(false);
    const fileInput = useRef(null);

    /**
     * Sets the island data in stintl
     * @param {*} val 
     */
    const setIsland = (val) => {
        setStint({ ...stint, Island: val });
    }

    /**
     * Sets the species data in stintl
     * @param {*} val 
     */
    const setSpecies = (val) => {
        setStint({ ...stint, Species: val });
    }

    /**
     * Sets the first or last name data in stitnl
     * @param {*} val 
     * @param {*} type 
     */
    const setName = (val, type) => {
        if (type === "first") {
            setStint({ ...stint, FirstName: val })
        }
        else {
            setStint({ ...stint, LastName: val });
        }
    }

    /**
     * Sets the observer location data in stintl
     * @param {*} val 
     */
    const setObserverLocation = (val) => {
        setStint({ ...stint, Observer_Location: val })
    }

    /**
     * Sets the time arrive data to the current time and time depart data to empty
     */
    const setTimeArrive = () => {
        setStint({ ...stint, Date_Time_Start: Date.getDate(), Date_Time_End: "" })
    }

    /**
     * Sets the time depart data to the current time
     */
    const setTimeDepart = () => {
        setStint({ ...stint, Date_Time_End: Date.getDate() })
    }

    /**
     * Sets the feeding data in stintl
     * @param {*} value 
     */
    const setFeedings = (value) => {
        setStint({ ...stint, feedingData: value });
    }

    /**
     * Sets the comment in stint data
     * @param {*} value 
     */
    const setComment = (value) => {
        setStint({ ...stint, Comment: value });
    }

    const simpleHash = (input) => {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash.toString(36); // Convert to base-36 for shorter representation
    };

    /**
     * Converts json data to a string representation of csv
     * @param {*} json 
     * @returns 
     */
    const jsonToCSV = (json) => {
        const header = [
            'StintID', 'Stint_Type', 'Island', 'Species', 'Prey_Size_Method', 'Prey_Size_Reference',
            'FirstName', 'LastName', 'Observer_Location', 'Date_Time_Start', 'Date_Time_End', 'Stint_Comment',
            'FeedingID', 'Nest', 'Time_Arrive', 'Time_Depart', 'Provider', 'Recipient', 'Prey_Item', 'Prey_Size',
            'Number_of_Items', 'Plot_Status', 'Feeding_Comment'
        ];
        const csvRows = [header.join(',')];

        json.feedingData.forEach(feeding => {
            feeding.Number_of_Items.forEach(item => {
                //careful with Number_of_Items as it is not an integer anymore but JSON so feeding.Number_of_Items.length
                const row = [
                    json.StintID, json.Stint_Type, json.Island, json.Species, json.Prey_Size_Method, json.Prey_Size_Reference,
                    json.FirstName, json.LastName, json.Observer_Location, json.Date_Time_Start, json.Date_Time_End, json.Comment,
                    feeding.FeedingID, feeding.Nest, feeding.Time_Arrive, feeding.Time_Depart, feeding.Provider, item.Recipient,
                    item.Prey_Item, item.Prey_Size, feeding.Number_of_Items.length, feeding.Plot_Status, feeding.Comment
                ];
                csvRows.push(row.join(','));
            });
        });

        return csvRows.join('\n');
    };

    /**
     * Converts csv data to stint JSON object
     * @param {*} csv 
     * @returns 
     */
    function csvToJson(csv) {
        const lines = csv.split('\n');
        const dataLines = lines.slice(1);

        const feedingData = [];

        let currentFeedingID = null;
        let currentFeeding = null;
        let currentNumberOfItems = [];

        for (const line of dataLines) {
            const values = line.split(',');
            const feedingID = values[12];

            if (feedingID !== currentFeedingID) {
                if (currentFeedingID !== null) {
                    currentFeeding.Number_of_Items = currentNumberOfItems;
                    feedingData.push(currentFeeding);
                }
                currentFeedingID = feedingID;
                currentFeeding = {
                    FeedingID: feedingID,
                    Nest: values[13],
                    Time_Arrive: values[14],
                    Time_Depart: values[15],
                    Provider: values[16],
                };
                currentNumberOfItems = [];
            }

            currentNumberOfItems.push({
                Recipient: values[17],
                Prey_Item: values[18],
                Prey_Size: values[19],
            });

            currentFeeding.Plot_Status = values[21];
            currentFeeding.Comment = values[22];
        }

        currentFeeding.Number_of_Items = currentNumberOfItems;
        feedingData.push(currentFeeding);

        const stintData = dataLines[0].split(',');

        const jsonObject = {
            StintID: stintData[0],
            Stint_Type: stintData[1],
            Island: stintData[2],
            Species: stintData[3],
            Prey_Size_Method: stintData[4],
            Prey_Size_Reference: stintData[5],
            FirstName: stintData[6],
            LastName: stintData[7],
            Observer_Location: stintData[8],
            Date_Time_Start: stintData[9],
            Date_Time_End: stintData[10],
            Comment: stintData[11],
            feedingData: feedingData,
        };

        return jsonObject;
    }

    const handleSaveClick = () => {
        let csv = '';
        let data = stint;
        data.StintID = stintID;
        const emptyFields = [];
        const excludeKey = ["Comment"]; //this can be missing in data

        //Check for missing fields in stint data
        Object.entries(data).forEach(([key, value]) => {
            if (value === "" && !excludeKey.includes(key)) {
                emptyFields.push(`Stint: ${key}`);
            }
        })

        // Check for missing fields in feeding data
        data.feedingData.forEach((feeding, feedingIndex) => {
            Object.keys(feeding).forEach(key => {
                if (Array.isArray(feeding[key])) {
                    feeding[key].forEach((item, itemIndex) => {
                        Object.keys(item).forEach(itemKey => {
                            if (item[itemKey] === '') {
                                emptyFields.push(`Feeding ${feedingIndex + 1}, Item ${itemIndex + 1}: ${itemKey}`);
                            }
                        });
                    });
                } else {
                    if (feeding[key] === '' && !excludeKey.includes(key)) {
                        emptyFields.push(`Feeding ${feedingIndex + 1}: ${key}`);
                    }
                }
            });
        });

        if (emptyFields.length > 0) {
            alert(`Missing fields:\n${emptyFields.join('\n')}`);
            return;
        }

        // If all information is filled
        csv += jsonToCSV(data);

        const file = new Blob([csv], { type: 'text/csv;charset=utf-8' });

        const dowloadName = stintID;

        saveAs(file, dowloadName);
    }

    const handleOpenClick = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const csv = e.target.result;
            const stintl = csvToJson(csv);

            setStint(stintl);
        };

        reader.onerror = () => {
            alert('Error reading the CSV file.');
        };

        reader.readAsText(file);
    }

    //detect change in stint to create stintID
    useEffect(() => {
        setStintID(`${stint.Island}-${stint.Species}-${stint.Date_Time_Start}-${stint.FirstName}-${stint.LastName}`.replace(" ", "-"));
    }, [stint])

    return (
        <div>
            {
                !isOpenF ?
                    (
                        <>
                            <div style={styles.startStint}>
                                <h1 style={styles.header}>Provision App</h1>
                                <Row gutter={16} style={styles.form}>
                                    <Col xs={24} md={12} style={styles.leftColumn}>
                                        <div style={styles.fixedInfo}>
                                            <div style={styles.labelContainer}>
                                                <span style={styles.label}>StintID:</span>{simpleHash(stintID)}
                                            </div>
                                            <div style={styles.labelContainer}>
                                                <span style={styles.label}>Stint type:</span> {stint.Stint_Type}
                                            </div>
                                            <div style={styles.labelContainer}>
                                                <span style={styles.label}>Prey size method:</span> {stint.Prey_Size_Method}
                                            </div>
                                            <div style={styles.labelContainer}>
                                                <span style={styles.label}>Prey size reference:</span> {stint.Prey_Size_Reference}
                                            </div>
                                        </div>
                                        <Island setIsland={setIsland} data={stint.Island} styles={styles} />
                                        <Species setSpecies={setSpecies} data={stint.Species} styles={styles} />
                                        <Comment setComment={setComment} data={stint.Comment} styles={styles} />
                                    </Col>
                                    <Col xs={24} md={12} style={styles.rightColumn}>
                                        <Name setName={setName} data={{ first: stint.FirstName, last: stint.LastName }} styles={styles} />
                                        <ObserverLocation setObs={setObserverLocation} data={stint.Observer_Location} styles={styles} />
                                        <Timer setTime={setTimeArrive} data={stint.Date_Time_Start} label="Time start" description="Time start" styles={styles} />
                                        <Timer setTime={setTimeDepart} data={stint.Date_Time_End} label="Time depart" description="Time depart" styles={styles} />
                                    </Col>
                                </Row>

                                {/* Button and File Input */}
                                <div style={styles.btnContainer}>
                                    <Button
                                        type="primary"
                                        style={styles.navigateBtn}
                                        onClick={() => setIsOpenF(!isOpenF)}
                                    >
                                        {!isOpenF ? 'Open Feeding' : 'Back to Stint'}
                                    </Button>
                                    <Button
                                        type="primary"
                                        style={styles.saveBtn}
                                        onClick={handleSaveClick}
                                    >
                                        Save file
                                    </Button>
                                    <Input
                                        type="file"
                                        ref={fileInput}
                                        style={styles.fileInput}
                                        accept=".csv"
                                        onChange={(e) => handleOpenClick(e)}
                                    />
                                </div>
                                <div style={{maxWidth: '100%', overflowX: 'auto'}}>
                                    <DataTable stint={stint} />
                                </div>
                            </div>
                        </>
                    )
                    :
                    (
                        <>
                            <div>
                                <FeedingData
                                    initialFeeding={initialFeeding}
                                    setFeedings={setFeedings}
                                    feedings={stint.feedingData}
                                    isOpen={isOpenF}
                                    onToggle={() => setIsOpenF(!isOpenF)}
                                    styles={styles}
                                />
                            </div>
                        </>
                    )
            }
        </div >
    )
}

export default StintData

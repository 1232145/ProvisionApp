import React, { useEffect, useState } from 'react';
import Island from './stintl/Island'
import Species from './stintl/Species'
import Name from './stintl/Name'
import ObserverLocation from './stintl/ObserverLocation'
import DataTable from './stintl/DataTable';
import Timer from './Timer';
import Comment from './Comment';
import { saveAs } from 'file-saver';
import FeedingData from './FeedingData';
import { Button, Row, Col, Upload, Modal, notification, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const { ipcRenderer } = window.require('electron');

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
        margin: '0.5% auto',
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
        width: '100%',
        padding: '8px',
    },

    inputField: {
        width: '40%',
        height: '25px',
        overflowX: 'auto',
        marginLeft: '5px'
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
        Name: "",
        Observer_Location: "",
        Date_Time_Start: "",
        Date_Time_End: "",
        Comment: "",
        feedingData: [initialFeeding]
    });

    const [config, setConfig] = useState(null);

    const [stintID, setStintID] = useState(`${stint.Island}-${stint.Species}-${stint.Date_Time_Start}-${stint.Name}`);

    //display stintl/feeding data
    const [isOpenF, setIsOpenF] = useState(false);

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
     */
    const setName = (val) => {
        setStint({ ...stint, Name: val });
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
    const setTimeArrive = (time) => {
        setStint({ ...stint, Date_Time_Start: time });
    };

    /**
     * Sets the time depart data to the current time
     */
    const setTimeDepart = (time) => {
        setStint({ ...stint, Date_Time_End: time });
    };

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

    const handleSwitchToFeeding = () => {
        setIsOpenF(!isOpenF)
        ipcRenderer.send('autosave', stint);
    }

    /**
     * Converts json data to a string representation of csv
     * @param {*} json 
     * @returns 
     */
    const jsonToCSV = (json) => {
        const header = [
            'StintID', 'Stint_Type', 'Island', 'Species', 'Prey_Size_Method', 'Prey_Size_Reference',
            'Name', 'Observer_Location', 'Date_Time_Start', 'Date_Time_End', 'Stint_Comment',
            'FeedingID', 'Nest', 'Time_Arrive', 'Time_Depart', 'Provider', 'Recipient', 'Prey_Item', 'Prey_Size',
            'Number_of_Items', 'Plot_Status', 'Feeding_Comment'
        ];
        const csvRows = [header.join(',')];

        json.feedingData.forEach(feeding => {
            feeding.Number_of_Items.forEach(item => {
                //careful with Number_of_Items as it is not an integer anymore but JSON so feeding.Number_of_Items.length
                const row = [
                    json.StintID, json.Stint_Type, json.Island, json.Species, json.Prey_Size_Method, json.Prey_Size_Reference,
                    json.Name, json.Observer_Location, json.Date_Time_Start, json.Date_Time_End, json.Comment,
                    feeding.FeedingID, feeding.Nest, feeding.Time_Arrive, feeding.Time_Depart, feeding.Provider, item.Recipient,
                    item.Prey_Item, item.Prey_Size, feeding.Number_of_Items.length, feeding.Plot_Status, feeding.Comment
                ];
                csvRows.push(row.join(','));
            });
        });

        return csvRows.join('\n');
    };

    /**
     * Converts CSV data to stint JSON object with validation
     * @param {string} csv - CSV data as a string
     * @returns {object|null} JSON object or null if format is incorrect
     */
    function csvToJson(csv) {
        const lines = csv.replace(/\r\n/g, '\n').split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
            console.error("Invalid CSV: Not enough data.");
            return stint;
        }

        // Define the required headers in order
        const requiredHeaders = [
            "StintID", "Stint_Type", "Island", "Species", "Prey_Size_Method", "Prey_Size_Reference",
            "Name", "Observer_Location", "Date_Time_Start", "Date_Time_End", "Stint_Comment",
            "FeedingID", "Nest", "Time_Arrive", "Time_Depart", "Provider", "Recipient",
            "Prey_Item", "Prey_Size", "Number_of_Items", "Plot_Status", "Feeding_Comment"
        ];

        // Extract headers from CSV
        const headers = lines[0].split(',').map(header => header.trim());

        // Validate headers
        const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
        if (missingHeaders.length > 0) {
            message.error(`Invalid CSV: Missing headers -> ${missingHeaders.join(", ")}`);
            return stint;
        }

        const dataLines = lines.slice(1);
        const feedingData = [];
        let currentFeedingID = null;
        let currentFeeding = null;
        let currentNumberOfItems = [];

        for (const line of dataLines) {
            const values = line.split(',').map(value => value.trim());
            const rowData = Object.fromEntries(headers.map((key, index) => [key, values[index] || null]));

            const feedingID = rowData["FeedingID"];

            if (feedingID && feedingID !== currentFeedingID) {
                if (currentFeedingID !== null) {
                    currentFeeding.Number_of_Items = currentNumberOfItems;
                    feedingData.push(currentFeeding);
                }
                currentFeedingID = feedingID;
                currentFeeding = {
                    FeedingID: feedingID,
                    Nest: rowData["Nest"],
                    Time_Arrive: rowData["Time_Arrive"],
                    Time_Depart: rowData["Time_Depart"],
                    Provider: rowData["Provider"],
                    Plot_Status: rowData["Plot_Status"],
                    Comment: rowData["Feeding_Comment"]
                };
                currentNumberOfItems = [];
            }

            if (rowData["Recipient"] || rowData["Prey_Item"] || rowData["Prey_Size"]) {
                currentNumberOfItems.push({
                    Recipient: rowData["Recipient"],
                    Prey_Item: rowData["Prey_Item"],
                    Prey_Size: rowData["Prey_Size"]
                });
            }
        }

        if (currentFeeding) {
            currentFeeding.Number_of_Items = currentNumberOfItems;
            feedingData.push(currentFeeding);
        }

        const firstRowData = Object.fromEntries(headers.map((key, index) => [key, dataLines[0]?.split(',')[index]?.trim() || null]));

        const jsonObject = {
            StintID: firstRowData["StintID"],
            Stint_Type: firstRowData["Stint_Type"],
            Island: firstRowData["Island"],
            Species: firstRowData["Species"],
            Prey_Size_Method: firstRowData["Prey_Size_Method"],
            Prey_Size_Reference: firstRowData["Prey_Size_Reference"],
            Name: firstRowData["Name"],
            Observer_Location: firstRowData["Observer_Location"],
            Date_Time_Start: firstRowData["Date_Time_Start"],
            Date_Time_End: firstRowData["Date_Time_End"],
            Comment: firstRowData["Stint_Comment"],
            feedingData: feedingData
        };

        return jsonObject;
    }

    /**
     * Converts CSV data to a config object
     * @param {*} csv 
     * @returns {object|null} JSON object or null if format is incorrect
     */
    function configToJson(csv) {
        const lines = csv.replace(/\r\n/g, '\n').split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
            console.error("Invalid CSV: Not enough data.");
            return config;
        }

        const requiredHeaders = ["Name", "Island", "ObserverLocation", "Nest", "Provider", "Recipient", "PreySize", "PreyItem", "MaxEntries", "ButtonWithSize"];
        const headers = lines[0].split(',').map(header => header.trim());

        // Check if all required headers exist
        const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
        if (missingHeaders.length > 0) {
            message.error(`Invalid CSV: Missing headers -> ${missingHeaders.join(", ")}`);
            return config;
        }

        const json = {};
        headers.forEach((key, index) => {
            const values = lines.slice(1)
                .map(line => line.split(',')[index]?.trim())  // Trim and handle undefined values
                .filter(value => value !== undefined && value !== '');  // Filter out empty values

            // Ensure only the first valid value is taken for specific keys
            if (["MaxEntries", "ButtonWithSize", "size"].includes(key)) {
                json[key] = values.length > 0 ? values[0] : null;
            } else {
                json[key] = values;
            }
        });

        return json;
    }

    const handleSaveClick = () => {
        let csv = '';
        let data = stint;
        data.StintID = simpleHash(stintID);
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
            Modal.error({
                title: 'Missing Required Fields',
                content: (
                    <div style={{ overflowY: 'auto' }}>
                        <p>Please fill in the following fields:</p>
                        <ul>
                            {emptyFields.map((field, index) => (
                                <li key={index}>{field}</li>
                            ))}
                        </ul>
                    </div>
                ),
            });
            return;
        }

        // If all information is filled
        csv += jsonToCSV(data);

        const file = new Blob([csv], { type: 'text/csv;charset=utf-8' });

        const dowloadName = stintID;

        saveAs(file, dowloadName);
    }

    const handleOpenClick = (event, type) => {
        try {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const csv = e.target.result;

                    if (type === 'stint') {
                        const stint = csvToJson(csv);
                        setStint(stint);
                    }
                    else if (type === 'config') {
                        const config = configToJson(csv);
                        setConfig(config);
                    }
                } catch (error) {
                    message.error('Error parsing CSV:', error);
                    alert('Error processing the CSV file. Please check the format.');
                }
            };

            reader.onerror = (error) => {
                message.error('Error reading file:', error);
                alert('Error reading the CSV file.');
            };

            reader.readAsText(file);
        } catch (error) {
            message.error('Unexpected error:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    };

    const handleLoadLastSave = () => {
        try {
            ipcRenderer.removeAllListeners('load-auto-save');
            ipcRenderer.send('check-auto-save');

            ipcRenderer.on('load-auto-save', (event, data) => {
                try {
                    if (data) {
                        setStint(data);
                    } else {
                        notification.info({
                            message: 'No Auto-Save Data',
                            description: 'It looks like there is no auto-save data available at the moment.',
                            placement: 'topRight',
                            duration: 1.5,
                        });
                    }
                } catch (error) {
                    message.error('Error loading auto-save data:', error);
                    alert('Error loading auto-save data.');
                }
            });
        } catch (error) {
            message.error('Unexpected error:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    };

    //detect change in stint to create stintID
    useEffect(() => {
        setStintID(`${stint.Island}-${stint.Species}-${stint.Date_Time_Start}-${stint.Name}`.replace(" ", "-"));
    }, [stint])

    useEffect(() => {
        ipcRenderer.on('warn-close', () => {
            const shouldClose = window.confirm('You have unsaved changes. Are you sure you want to exit?');

            if (shouldClose) {
                // Send confirmation to main process to close the window
                ipcRenderer.send('confirm-close');
            }
        });

        // Cleanup when the component is unmounted
        return () => {
            ipcRenderer.removeAllListeners('warn-close');
        };
    }, []);

    return (
        <div>
            {
                !isOpenF ?
                    (
                        <>
                            <div style={styles.startStint}>
                                <h1 style={styles.header}>Provisioning App</h1>
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
                                        <Island setIsland={setIsland} data={stint.Island} styles={styles} config={config} />
                                        <Species setSpecies={setSpecies} data={stint.Species} styles={styles} />
                                        <Comment setComment={setComment} data={stint.Comment} styles={styles} />
                                    </Col>
                                    <Col xs={24} md={12} style={styles.rightColumn}>
                                        <Name setName={setName} data={stint.Name} styles={styles} config={config} />
                                        <ObserverLocation setObs={setObserverLocation} data={stint.Observer_Location} styles={styles} config={config} />
                                        <Timer setTime={setTimeArrive} data={stint.Date_Time_Start} label="Start Stint Time" description="Start Stint Time" styles={styles} hasInput={false} />
                                        <Timer setTime={setTimeDepart} data={stint.Date_Time_End} label="End Stint Time" description="End Stint Time" styles={styles} hasInput={false} />
                                    </Col>
                                </Row>

                                {/* Button and File Input */}
                                <div style={styles.btnContainer}>
                                    <Button
                                        type="primary"
                                        style={{ ...styles.navigateBtn, flex: 1, marginRight: '10px' }} // Adjust margin as needed
                                        onClick={() => handleSwitchToFeeding()}
                                    >
                                        {!isOpenF ? 'Open Feeding' : 'Back to Stint'}
                                    </Button>
                                    <Button
                                        type="primary"
                                        style={{ ...styles.saveBtn, flex: 1, marginRight: '10px' }} // Adjust margin as needed
                                        onClick={handleSaveClick}
                                    >
                                        Save file
                                    </Button>
                                    <Upload
                                        accept=".csv"
                                        showUploadList={false}
                                        beforeUpload={(file) => {
                                            handleOpenClick({ target: { files: [file] } }, 'stint');
                                            return false; // Prevent automatic upload
                                        }}
                                        style={{ flex: 1, marginRight: '10px' }} // Adjust margin as needed
                                    >
                                        <Button icon={<UploadOutlined />} style={{ width: '100%' }}>Upload File</Button>
                                    </Upload>
                                    <Upload
                                        accept=".csv"
                                        showUploadList={false}
                                        beforeUpload={(file) => {
                                            handleOpenClick({ target: { files: [file] } }, 'config');
                                            return false; // Prevent automatic upload
                                        }}
                                        style={{ flex: 1 }} // No margin needed here to fill space
                                    >
                                        <Button icon={<UploadOutlined />} style={{ width: '100%' }}>Upload Config</Button>
                                    </Upload>
                                </div>

                                <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
                                    <DataTable stint={stint} />
                                    <Button style={{ width: '100%' }} onClick={() => handleLoadLastSave()}>Load Save</Button>
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
                                    stint={stint}
                                    feedings={stint.feedingData}
                                    isOpen={isOpenF}
                                    onToggle={handleSwitchToFeeding}
                                    styles={styles}
                                    config={config}
                                />
                            </div>
                        </>
                    )
            }
        </div >
    )
}

export default StintData

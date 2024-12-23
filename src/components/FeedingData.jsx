import Plot from './feeding/Plot';
import Nest from './feeding/Nest';
import NumberItems from './feeding/NumberItems';
import PreyItem from './feeding/PreyItem';
import PreySize from './feeding/PreySize';
import Provider from './feeding/Provider';
import Recipient from './feeding/Recipient';
import Timer from './Timer';
import Comment from './Comment';
import { useState, useEffect } from 'react';
import React from 'react';
import { Button, Input, Checkbox, message, Modal, Collapse } from 'antd';  // Import Ant Design components

const { Panel } = Collapse;
const { ipcRenderer } = window.require('electron');

function FeedingData({ initialFeeding, stint, feedings, setFeedings, isOpen, onToggle, styles, config }) {
    styles = {
        ...styles,
        outerContainer: {
            border: '1px solid #d9d9d9',
            margin: '10px 50px',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#f9f9f9',
        },
        upperMenuContainer: {
            border: '1px solid black',
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            justifyContent: 'space-around',
            padding: '10px',
            gap: '2px',
            borderBottom: 'none',
            borderRadius: '8px',
        },
        lowerMenuContainer: {

        },
        stintlContainer: {
            border: '1px solid black',
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            justifyContent: 'space-evenly',
            padding: '10px',
            gap: '2px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
        },
        timerBtnContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '30%',
        },
        plotNoItemBtn: {
            marginLeft: '15px',
            marginRight: '15px',
        },
        feedingsContainer: {
            display: 'flex',
            flexDirection: 'column',
            width: '550px',
            height: '200px',
            margin: '12.5px',
            border: '1px solid black',
            justifyContent: 'space-between',
            padding: '12px',
            borderRadius: '8px',
        },
        feedingItemListContainer: {
            flexGrow: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '5px',
            alignItems: 'flex-start',
        },
        flexRowCenter: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        feedHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '12.5px'
        },
        selectedBtn: {
            backgroundColor: 'green',
            color: 'white',
        },
        closedFeeding: {
            backgroundColor: 'blue',
            color: 'white',
        },
        headContainer: {
            display: 'flex',
            flexDirection: 'column',
        },

        feedingItemContainer: {
            border: '1px solid gray',
            borderRadius: '8px',
            padding: '15px',
            height: 'auto',
            width: config !== null || config !== undefined ? `${config?.ButtonWithSize[0]}px` : 'auto', //adjustable
            minWidth: '150px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        },
        feedingItemButtonContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'stretch',
            gap: '10px',
        }
    }

    /**
     * this stores and handles input feeding data
     */
    const [feeding, setFeeding] = useState(initialFeeding);

    //for current feeding data index
    const [index, setIndex] = useState(0);

    //for closing index
    const [closedIndex, setClosedIndex] = useState([]);
    const [displayClosed, setDisplayClosed] = useState(true);
    const [isClosedFeedingShown, setIsClosedFeedingShown] = useState(false);

    const toggleClosedFeeding = () => {
        setIsClosedFeedingShown(!isClosedFeedingShown);
        displayClosedFeeding(!isClosedFeedingShown);
    };


    //a temporary feeding for later checking with feeding to compare differences
    const [feedingTemp, setFeedingTemp] = useState(feeding);

    //index of the number of items (for setting data at index)
    const [nIndex, setNIndex] = useState(0);

    /**
     * this handles button input for plot data
     * @param {*} Plot
     */
    const setPlot = (Plot) => {
        setFeeding({ ...feeding, Plot_Status: Plot });
    }

    /**
     * this handles button input for nest data
     * @param {*} Nest
     */
    const setNest = (Nest) => {
        setFeeding({ ...feeding, Nest: Nest });
    }

    /**
     * this handles button input for provider data
     * @param {*} Provider 
     */
    const setProvider = (Provider) => {
        setFeeding({ ...feeding, Provider: Provider });
    }

    /**
     * this handles input for number of items
     * @param {*} n 
     */
    const setNumberItems = (item) => {
        setFeeding({ ...feeding, Number_of_Items: item });
    }

    /**
    * this handles button input for recipent data
    * @param {*} Recipent 
    */
    const setRecipient = (Recipient) => {
        let items = [...{ ...feeding }.Number_of_Items];
        let item = items[nIndex];
        item.Recipient = Recipient;

        setNumberItems(items);
    }

    /**
     * this handles button input for prey item data
     * @param {*} Prey_Item 
     */
    const setPreyItem = (Prey_Item) => {
        let items = [...{ ...feeding }.Number_of_Items];
        let item = items[nIndex];
        item.Prey_Item = Prey_Item;

        setNumberItems(items);
    }

    /**
     * this handles button input for prey size data
     * @param {*} Prey_Size 
     */
    const setPreySize = (Prey_Size) => {
        let items = [...{ ...feeding }.Number_of_Items];
        let item = items[nIndex];
        item.Prey_Size = Prey_Size;

        setNumberItems(items);
    }

    /**
     * this sets the time arrive data and time depart data to empty
     */
    const setTimeArrive = (time) => {
        // Extract only the 'HH:mm' part from the datetime string
        setFeeding({ ...feeding, Time_Arrive: time, Time_Depart: "" });
    }

    /**
     * this sets the time depart data
     */
    const setTimeDepart = (time) => {
        setFeeding({ ...feeding, Time_Depart: time });
    }

    /**
     * 
     */
    const setComment = (value) => {
        setFeeding({ ...feeding, Comment: value });
    }

    /**
     * saves feeding tab at index
     * @param {} index 
     */
    function handleSaveFeeding(index) {
        let newFeedings = [...feedings];
        newFeedings[index] = feeding;
        setFeedings(newFeedings);
        //stamp the temporary feeding
        setFeedingTemp(feeding);
    }

    /**
     * this adds a new empty feeding data
     */
    const handleNewFeeding = () => {
        setFeeding({ ...initialFeeding, FeedingID: feedings.length + 1 });
        setFeedings([...feedings, initialFeeding]);
        setIndex(feedings.length);
        //stamp the temporary feeding
        setFeedingTemp(feeding);
        setNIndex(0);
    }

    const displayItemsMessage = (data, message) => {
        return (
            <div>
                {message}
                <Collapse style={{ width: '100%', overflowY: 'auto' }}>
                    <Panel header="View Details" key="1">
                        <ul>
                            {data.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </Panel>
                </Collapse>
            </div>
        )
    }

    /**
     * this deletes feeding data at current index
     */
    const handleDeleteFeeding = () => {
        if (feedings.length > 1) {
            const ignore = ["FeedingID"];
            const filled = [];

            Object.entries(feedings[index]).forEach(([key, value]) => {
                if (!ignore.includes(key)) {
                    if (Array.isArray(value)) {
                        value.forEach((item, i) => {
                            Object.entries(item).forEach(([keyItem, field]) => {
                                if (field !== "") {
                                    filled.push(`Item ${i + 1}: ${keyItem}`);
                                }
                            });
                        });
                    } else if (value !== "") {
                        filled.push(value);
                    }
                }
            });

            const confirmDelete = () => {
                const newData = feedings.filter((item, i) => i !== index);
                setFeedings(newData);

                if (index === 0) {
                    handleOpenFeeding(0);
                } else {
                    handleOpenFeeding(index - 1);
                }
            };

            if (filled.length === 0) {
                confirmDelete();
            }
            else {
                Modal.confirm({
                    title: 'Confirm Deletion',
                    content: displayItemsMessage(filled, `You have ${filled.length} data filled at feeding ${index + 1}.`),
                    onOk: confirmDelete,
                    onCancel() { },
                });
            }
        }
        else {
            message.error("You cannot delete the only feeding.");
        }
    };

    /**
     * this handles the switching of indexent feeding data to existing feeding data and updating that indexent feeding data if any changes
     * @param {*} e the feeding data ID to switch to
     */
    const handleOpenFeeding = (index) => {
        //Move to another feeding data
        setIndex(index);
        const openF = feedings[index];
        setFeeding(openF);
        //stamp the temporary feeding
        setFeedingTemp(feeding);
        setNIndex(0);
    }

    const handleCloseFeeding = (index) => {
        const emptyFields = [];

        // Collect empty fields into the array
        Object.entries(feedingTemp).forEach(([field, value]) => {
            if (field === 'Comment') return;  // Skip "Comment"

            if (Array.isArray(value)) {
                value.forEach((item, i) => {
                    Object.entries(item).forEach(([itemField, itemValue]) => {
                        if (itemValue === '') {
                            emptyFields.push(`Item ${i + 1} > ${itemField}`);
                        }
                    });
                });
            } else if (value === '') {
                emptyFields.push(field);
            }
        });

        if (emptyFields.length > 0) {
            message.error({
                content: displayItemsMessage(emptyFields, " Please fill in the following fields:"),
                duration: 5,
            });
            return;
        }

        // Handle success scenario
        if (emptyFields.length === 0) {
            // If all fields are filled, close the feeding
            setClosedIndex(prevClosedIndex =>
                prevClosedIndex.includes(index)
                    ? prevClosedIndex.filter(item => item !== index)
                    : [...prevClosedIndex, index]
            );

            // Show success message
            message.success({
                content: `Feeding ${index + 1} has been closed.`,
                style: { marginTop: '20px' },
                duration: 3,
            });
        }

        // Make the closed tab disappear
        displayClosedFeeding(false);
    };

    const displayClosedFeeding = (bool) => {
        setDisplayClosed(bool);
    }

    //feature: when open feeding tab, switch to the latest feeding tab
    useEffect(() => {
        //index == 0 could be removed?
        if (feedings.length > 0 && index === 0) {
            handleOpenFeeding(feedings.length - 1);
        }
    }, [feedings.length])

    //feature: auto save
    useEffect(() => {
        //if there is a change, save that change
        if (feedingTemp !== feeding) {
            handleSaveFeeding(index);
            ipcRenderer.send('autosave', stint);
        }
    }, [feeding])

    return (
        <>
            <div style={styles.outerContainer}>
                <div style={styles.feedHeader}>
                    {isOpen && (
                        <Button type="primary" onClick={onToggle}>
                            Back to Stint
                        </Button>
                    )}
                    <h1 style={{
                        margin: '0',
                        textAlign: 'center',
                        flexGrow: '1'
                    }}>Feeding {index + 1}</h1>
                </div>

                <div style={styles.headContainer}>
                    <div style={styles.upperMenuContainer}>
                        <div style={styles.timerBtnContainer}>
                            <Timer setTime={setTimeArrive} data={feeding.Time_Arrive} label="Time start" description="Time start" styles={styles} hasDatePicker={false} format='hh:mm:ss' />
                            <Timer setTime={setTimeDepart} data={feeding.Time_Depart} label="Time depart" description="Time depart" styles={styles} hasDatePicker={false} format='hh:mm:ss' />
                        </div>

                        <div style={styles.plotNoItemBtn}>
                            <Plot setPlot={setPlot} data={feeding.Plot_Status} />
                        </div>
                    </div>
                    <div style={{ ...styles.upperMenuContainer, ...styles.lowerMenuContainer }}>
                        <div style={{ flexShrink: 1, minWidth: '0' }}>
                            <NumberItems setNumberItems={setNumberItems} data={feeding.Number_of_Items} changeIndex={setNIndex} nIndex={nIndex} styles={styles} />
                        </div>

                        <div style={{ flexShrink: 1, minWidth: '0' }}>
                            <div style={styles.feedingsContainer}>
                                <div style={styles.flexRowCenter}>
                                    <p style={{ marginRight: '7.5px' }}>Show Closed Feeding:</p>
                                    <Checkbox checked={isClosedFeedingShown} onChange={toggleClosedFeeding} />
                                </div>

                                <div style={styles.feedingItemListContainer}>
                                    {feedings.map((item, i) => {
                                        if (closedIndex.includes(i) && !displayClosed) {
                                            return null;
                                        }

                                        const value = `Feeding ${i + 1}` + (item.Nest !== "" ? `: ${item.Nest}` : "");

                                        return (
                                            <Input
                                                key={i}
                                                value={value}
                                                type="button"
                                                onClick={() => handleOpenFeeding(i)}
                                                style={{
                                                    ...(index === i ? styles.selectedBtn : { marginBottom: '8px' }),
                                                    width: 'auto',
                                                    flexGrow: 1, // Ensure buttons grow
                                                    minWidth: '150px', // Ensure a min width for wrapping
                                                }}
                                            />
                                        );
                                    })}
                                </div>

                                <div style={{ ...styles.flexRowCenter, marginTop: '12.5px' }}>
                                    <Button type="primary" onClick={handleNewFeeding} style={{ marginRight: '8px' }}>New</Button>
                                    <Button type="default" onClick={handleDeleteFeeding} style={{ marginRight: '8px' }}>Delete</Button>
                                    <Button type="dashed" onClick={() => handleCloseFeeding(index)}>Close</Button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div style={styles.stintlContainer}>
                    <Nest setNest={setNest} data={feeding.Nest} styles={styles} config={config} />
                    <Provider setProvider={setProvider} data={feeding.Provider} styles={styles} config={config} />
                    <Recipient setRecipient={setRecipient} data={feeding.Number_of_Items[nIndex].Recipient} styles={styles} config={config} />
                    <PreySize setPreySize={setPreySize} data={feeding.Number_of_Items[nIndex].Prey_Size} styles={styles} config={config} />
                    <PreyItem setPreyItem={setPreyItem} data={feeding.Number_of_Items[nIndex].Prey_Item} styles={styles} config={config} />
                </div>

                <div>
                    <Comment setComment={setComment} data={feeding.Comment} styles={styles} />
                </div>
            </div>
        </>
    );
}

export default FeedingData;
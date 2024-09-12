import Plot from './feeding/Plot';
import Nest from './feeding/Nest';
import NumberItems from './feeding/NumberItems';
import PreyItem from './feeding/PreyItem';
import PreySize from './feeding/PreySize';
import Provider from './feeding/Provider';
import Recipient from './feeding/Recipient';
import Timer from './Timer';
import Date from '../Date';
import Comment from './Comment';
import './ToggleBtn.css'
import { useState, useEffect } from 'react';
import React from 'react';
import { Button, Input, Checkbox, message } from 'antd';  // Import Ant Design components

function FeedingData({ initialFeeding, feedings, setFeedings, isOpen, onToggle, styles }) {
    styles = {
        ...styles,
        outerContainer: {
            border: '1px solid #d9d9d9',
            margin: '30px 50px',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#f9f9f9',
        },
        upperMenuContainer: {
            border: '1px solid black',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',  // Allow wrapping for smaller screens
            justifyContent: 'space-around',
            padding: '20px',
            gap: '20px',  // Add spacing between columns
            borderBottom: 'none'
        },
        lowerMenuContainer: {

        },
        stintlContainer: {
            border: '1px solid black',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',  // Allow wrapping for smaller screens
            justifyContent: 'space-evenly',
            padding: '20px',
            gap: '20px',  // Add spacing between components
        },
        timerBtnContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '30%'
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
        },
        feedingItemListContainer: {
            flexGrow: 1,
            overflowY: 'auto', // Enable vertical scrolling if needed
            display: 'flex',
            flexDirection: 'row', // Align buttons in a row
            flexWrap: 'wrap',     // Allow buttons to wrap when there is no more space
            gap: '5px',          // Add some spacing between buttons
            alignItems: 'flex-start', // Align items to the top
        },
        flexRowCenter: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',  // Add this to allow wrapping
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
     * this sets the time arrive data to the indexent time and time depart data to empty
     */
    const setTimeArrive = () => {
        setFeeding({ ...feeding, Time_Arrive: Date.getTime(), Time_Depart: "" })
    }

    /**
     * this sets the time depart data to the indexent time
     */
    const setTimeDepart = () => {
        setFeeding({ ...feeding, Time_Depart: Date.getTime() })
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

    /**
     * this deletes feeding data at current index
     */
    const handleDeleteFeeding = () => {
        if (feedings.length > 1) {
            let removed = false;

            const ignore = ["FeedingID"];
            const filled = [];

            Object.entries(feedings[index]).forEach(([key, value]) => {
                if (!ignore.includes(key)) {
                    if (Array.isArray(value)) {
                        Object.values(value).forEach((item, i) => {
                            Object.entries(item).forEach(([keyItem, field]) => {
                                if (field !== "") {
                                    removed = true;
                                    filled.push(`Item ${i + 1}: ` + keyItem);
                                }
                            })
                        })
                    }
                    else if (value !== "") {
                        removed = true;
                        filled.push(value);
                    }
                }
            })

            if (!removed) {
                const newData = feedings.filter((item, i) => i !== index);
                setFeedings(newData);

                if (index === 0) {
                    handleOpenFeeding(0);
                }
                else {
                    handleOpenFeeding(index - 1);
                }
            }
            else {
                alert(`Unable to delete: you have data filled at feeding ${index + 1}. Specifically at: ${filled}`)
            }
        }
    }

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
    
        // Format the missing fields message
        let messageContent = 'Please fill in the following fields:\n';
        if (emptyFields.length > 0) {
            messageContent += emptyFields.join('\n');
        }
    
        // Limit message length and provide more details if needed
        const maxLength = 200; // Adjust based on your requirements
        if (messageContent.length > maxLength) {
            messageContent = messageContent.substring(0, maxLength) + '... (more details)';
        }
    
        if (emptyFields.length > 0) {
            message.error({
                content: (
                    <div style={{ maxWidth: '600px', maxHeight: '400px', overflowY: 'auto' }}>
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{messageContent}</pre>
                    </div>
                ),
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
                            <Timer setTime={setTimeArrive} data={feeding.Time_Arrive} label="Time start" description="Time start" styles={styles} />
                            <Timer setTime={setTimeDepart} data={feeding.Time_Depart} label="Time depart" description="Time depart" styles={styles} />
                        </div>

                        <div style={styles.plotNoItemBtn}>
                            <Plot setPlot={setPlot} data={feeding.Plot_Status} />
                        </div>
                    </div>
                    <div style={{ ...styles.upperMenuContainer, ...styles.lowerMenuContainer }}>
                        <div>
                            <NumberItems setNumberItems={setNumberItems} data={feeding.Number_of_Items} changeIndex={setNIndex} nIndex={nIndex} styles={styles} />
                        </div>

                        <div style={styles.feedingsList}>
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
                    <Nest setNest={setNest} data={feeding.Nest} />
                    <Provider setProvider={setProvider} data={feeding.Provider} />
                    <Recipient setRecipient={setRecipient} data={feeding.Number_of_Items[nIndex].Recipient} />
                    <PreySize setPreySize={setPreySize} data={feeding.Number_of_Items[nIndex].Prey_Size} />
                    <PreyItem setPreyItem={setPreyItem} data={feeding.Number_of_Items[nIndex].Prey_Item} />
                </div>

                <div>
                    <Comment setComment={setComment} data={feeding.Comment} styles={styles} />
                </div>
            </div>
        </>
    );
}

export default FeedingData;
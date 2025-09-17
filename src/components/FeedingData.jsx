import Plot from './feeding/Plot';
import Nest from './feeding/Nest';
import NumberItems from './feeding/NumberItems';
import PreyItem from './feeding/PreyItem';
import PreySize from './feeding/PreySize';
import Provider from './feeding/Provider';
import Recipient from './feeding/Recipient';
import Timer from './Timer';
import Comment from './Comment';
import { useState, useEffect, useMemo, useReducer } from 'react';
import React from 'react';
import { Button, Input, Checkbox, message, Modal, Collapse } from 'antd';  // Import Ant Design components
import { useAutoSave } from '../hooks/useAutoSave';
import { ConfigProvider } from '../contexts/ConfigContext';
import { StylesProvider } from '../contexts/StylesContext';
import { FeedingProvider } from '../contexts/FeedingContext';

// Default arrays for feeding components (moved outside to avoid re-creation)
const defaultProviders = ["BA", "BL", "BR", "FR", "S", "U", "UA", "UB", "UC", "X", "AA", "AB", "BMB", "KF", "KM", "SMB", "TA"];
const defaultRecipients = ["A", "A1", "B", "UC", "U", "K", "O", "S", "M", "Y", "C", "N", "R", "T", "UA"];
const defaultPreySizes = ["0.25", "0.5", "0.75", "1", "1.25", "1.5", "1.75", "2", "2.25", "2.5", "2.75", "3", "3.25", "Unknown"];
const defaultPreyItems = ["H", "U", "R", "S", "UF", "A", "HD", "T", "H or R", "E", "ALE", "AS", "B", "BR", "C", "CA", "CH", "CU", "CUS", "D", "DR", "EEL", "EP", "EW", "F", 
  "FS", "G", "GH", "I", "J", "K", "KF", "L", "LA/H", "LA/HD", "LA/R", "LA/S", "LA/UF", 
  "M", "MF", "O", "P", "PL", "PS", "PUF", "Q", "RF", "RG", "ROS", "RS", "SB", "SH", 
  "SM", "SN", "SP", "SS", "SY", "T", "TC", "U", "UF1", "UF1-SI2016", "UFEER2016", 
  "UF-PI2017", "UFSI2015", "UG", "LA/UF", "UI", "V", "W", "X", "Y", "Z"];
const defaultNests = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"];

// Feeding state reducer for better state management
const feedingReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PLOT':
            return { ...state, feeding: { ...state.feeding, Plot_Status: action.payload } };
        case 'SET_NEST':
            return { ...state, feeding: { ...state.feeding, Nest: action.payload } };
        case 'SET_PROVIDER':
            return { ...state, feeding: { ...state.feeding, Provider: action.payload } };
        case 'SET_NUMBER_ITEMS':
            return { ...state, feeding: { ...state.feeding, Number_of_Items: action.payload } };
        case 'SET_RECIPIENT':
            return { ...state, feeding: { ...state.feeding, Number_of_Items: action.payload } };
        case 'SET_PREY_SIZE':
            return { ...state, feeding: { ...state.feeding, Number_of_Items: action.payload } };
        case 'SET_PREY_ITEM':
            return { ...state, feeding: { ...state.feeding, Number_of_Items: action.payload } };
        case 'SET_TIME_ARRIVE':
            return { ...state, feeding: { ...state.feeding, Time_Arrive: action.payload, Time_Depart: "" } };
        case 'SET_TIME_DEPART':
            return { ...state, feeding: { ...state.feeding, Time_Depart: action.payload } };
        case 'SET_COMMENT':
            return { ...state, feeding: { ...state.feeding, Comment: action.payload } };
        case 'SET_FEEDING':
            return { ...state, feeding: action.payload, feedingTemp: state.feeding };
        case 'SET_INDEX':
            return { ...state, index: action.payload };
        case 'SET_NINDEX':
            return { ...state, nIndex: action.payload };
        case 'SET_FEEDING_TEMP':
            return { ...state, feedingTemp: action.payload };
        case 'BATCH_UPDATE':
            // For multiple updates in one action
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

function FeedingData({ initialFeeding, stint, feedings, setFeedings, isOpen, onToggle, styles, config }) {
    // Initialize debounced auto-save hook (1 second delay)
    const debouncedAutoSave = useAutoSave(1000);
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

    // Max entries for feeding data dropdowns (default: 10)
    const [maxEntries, setMaxEntries] = useState(10);

    // Memoized sliced config - computed once, eliminates 5x re-renders in child components
    const slicedConfig = useMemo(() => {
        return {
            Provider: config?.Provider ? config.Provider.slice(0, maxEntries) : defaultProviders.slice(0, maxEntries),
            Recipient: config?.Recipient ? config.Recipient.slice(0, maxEntries) : defaultRecipients.slice(0, maxEntries),
            PreySize: config?.PreySize ? config.PreySize.slice(0, maxEntries) : defaultPreySizes.slice(0, maxEntries),
            PreyItem: config?.PreyItem ? config.PreyItem.slice(0, maxEntries) : defaultPreyItems.slice(0, maxEntries),
            Nest: config?.Nest ? config.Nest.slice(0, maxEntries) : defaultNests.slice(0, maxEntries),
            // Include dropdown values (remaining items)
            ProviderDropdown: config?.Provider ? config.Provider.slice(maxEntries) : defaultProviders.slice(maxEntries),
            RecipientDropdown: config?.Recipient ? config.Recipient.slice(maxEntries) : defaultRecipients.slice(maxEntries),
            PreySizeDropdown: config?.PreySize ? config.PreySize.slice(maxEntries) : defaultPreySizes.slice(maxEntries),
            PreyItemDropdown: config?.PreyItem ? config.PreyItem.slice(maxEntries) : defaultPreyItems.slice(maxEntries),
            NestDropdown: config?.Nest ? config.Nest.slice(maxEntries) : defaultNests.slice(maxEntries),
        };
    }, [config, maxEntries]);

    // Initialize feeding state with useReducer for better state management
    const [feedingState, dispatchFeeding] = useReducer(feedingReducer, {
        feeding: initialFeeding,
        feedingTemp: initialFeeding,
        index: 0,
        nIndex: 0
    });

    // Destructure for easier access
    const { feeding, feedingTemp, index, nIndex } = feedingState;

    //for closing index (keeping as separate state since it's independent)
    const [closedIndex, setClosedIndex] = useState([]);
    const [displayClosed, setDisplayClosed] = useState(true);
    const [isClosedFeedingShown, setIsClosedFeedingShown] = useState(false);

    const toggleClosedFeeding = () => {
        setIsClosedFeedingShown(!isClosedFeedingShown);
        displayClosedFeeding(!isClosedFeedingShown);
    };

    /**
     * this handles button input for plot data
     * @param {*} Plot
     */
    const setPlot = (Plot) => {
        dispatchFeeding({ type: 'SET_PLOT', payload: Plot });
    }

    /**
     * this handles button input for nest data
     * @param {*} Nest
     */
    const setNest = (Nest) => {
        dispatchFeeding({ type: 'SET_NEST', payload: Nest });
    }

    /**
     * this handles button input for provider data
     * @param {*} Provider 
     */
    const setProvider = (Provider) => {
        dispatchFeeding({ type: 'SET_PROVIDER', payload: Provider });
    }

    /**
     * this handles input for number of items
     * @param {*} n 
     */
    const setNumberItems = (item) => {
        dispatchFeeding({ type: 'SET_NUMBER_ITEMS', payload: item });
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
        dispatchFeeding({ type: 'SET_TIME_ARRIVE', payload: time });
    }

    /**
     * this sets the time depart data
     */
    const setTimeDepart = (time) => {
        dispatchFeeding({ type: 'SET_TIME_DEPART', payload: time });
    }

    /**
     * 
     */
    const setComment = (value) => {
        dispatchFeeding({ type: 'SET_COMMENT', payload: value });
    }

    // Helper function for NumberItems component
    const setNIndex = (value) => {
        dispatchFeeding({ type: 'SET_NINDEX', payload: value });
    }

    // Memoized feeding actions for context (prevents unnecessary re-renders)
    const feedingActions = useMemo(() => ({
        setPlot,
        setNest,
        setProvider,
        setNumberItems,
        setRecipient,
        setPreySize,
        setPreyItem,
        setTimeArrive,
        setTimeDepart,
        setComment,
        setNIndex,
        handleSaveFeeding,
        handleNewFeeding,
        handleOpenFeeding
    }), []);

    /**
     * saves feeding tab at index
     * @param {} index 
     */
    function handleSaveFeeding(index) {
        let newFeedings = [...feedings];
        newFeedings[index] = feeding;
        setFeedings(newFeedings);
        //stamp the temporary feeding
        dispatchFeeding({ type: 'SET_FEEDING_TEMP', payload: feeding });
    }

    /**
     * this adds a new empty feeding data
     */
    const handleNewFeeding = () => {
        const nextId = (feedings?.length || 0) + 1;
        const newFeeding = { ...initialFeeding, FeedingID: nextId };
        
        // Update multiple state values in one dispatch
        dispatchFeeding({ 
            type: 'BATCH_UPDATE', 
            payload: {
                feeding: newFeeding,
                feedingTemp: newFeeding,
                index: feedings.length,
                nIndex: 0
            }
        });
        
        setFeedings([...
            feedings,
            newFeeding
        ]);
    }

    const displayItemsMessage = (data, message) => {
        return (
            <div>
                {message}
                <Collapse 
                    style={{ width: '100%', overflowY: 'auto' }}
                    items={[
                        {
                            key: '1',
                            label: 'View Details',
                            children: (
                                <ul>
                                    {data.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            )
                        }
                    ]}
                />
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
    const handleOpenFeeding = (openIndex) => {
        //Move to another feeding data
        const openF = feedings[openIndex];
        
        // Update multiple state values in one dispatch
        dispatchFeeding({ 
            type: 'BATCH_UPDATE', 
            payload: {
                index: openIndex,
                feeding: openF,
                feedingTemp: feeding, // stamp the current feeding as temp
                nIndex: 0
            }
        });
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

    // Auto-save whenever feeding data changes (debounced)
    useEffect(() => {
        if (feedingTemp !== feeding) {
            handleSaveFeeding(index);
            debouncedAutoSave(stint);
        }
    }, [feeding, feedingTemp, handleSaveFeeding, index, stint, debouncedAutoSave])

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
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        fontSize: '14px',
                        whiteSpace: 'nowrap'
                    }}>
                        <span>Max:</span>
                        <Input
                            type="number"
                            min="1"
                            max="20"
                            value={maxEntries}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (isNaN(value) || value < 1) {
                                    setMaxEntries(1);
                                } else if (value > 20) {
                                    setMaxEntries(20);
                                } else {
                                    setMaxEntries(value);
                                }
                            }}
                            style={{ 
                                width: "60px", 
                                textAlign: "center"
                            }}
                            size="small"
                        />
                    </div>
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
                    <ConfigProvider
                        config={config}
                        slicedConfig={slicedConfig}
                        maxEntries={maxEntries}
                        setMaxEntries={setMaxEntries}
                    >
                        <StylesProvider styles={styles}>
                            <FeedingProvider
                                feedingState={feedingState}
                                dispatchFeeding={dispatchFeeding}
                                feedingActions={feedingActions}
                            >
                                <Nest data={feeding.Nest} />
                                <Provider data={feeding.Provider} />
                                <Recipient data={feeding.Number_of_Items[nIndex].Recipient} />
                                <PreySize data={feeding.Number_of_Items[nIndex].Prey_Size} />
                                <PreyItem data={feeding.Number_of_Items[nIndex].Prey_Item} />
                            </FeedingProvider>
                        </StylesProvider>
                    </ConfigProvider>
                </div>

                <div>
                    <Comment setComment={setComment} data={feeding.Comment} styles={styles} />
                </div>
            </div>
        </>
    );
}

export default FeedingData;
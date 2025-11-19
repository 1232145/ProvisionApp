import Plot from './feeding/Plot';
import Nest from './feeding/Nest';
import NumberItems from './feeding/NumberItems';
import PreyItem from './feeding/PreyItem';
import PreySize from './feeding/PreySize';
import Provider from './feeding/Provider';
import Recipient from './feeding/Recipient';
import Timer from './Timer';
import Comment from './Comment';
import { useState, useEffect, useMemo, useReducer, useCallback, useRef } from 'react';
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

/**
 * Feeding state reducer for managing feeding data state
 * Handles all state updates for feeding data using reducer pattern
 * @param {object} state - Current feeding state object containing feeding, feedingTemp, index, nIndex
 * @param {object} action - Action object with type and payload
 * @param {string} action.type - Action type (e.g., 'SET_PLOT', 'SET_NEST', 'SET_NUMBER_ITEMS')
 * @param {*} action.payload - Action payload data
 * @returns {object} New state object
 */
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

/**
 * FeedingData component - Main component for managing feeding data entries
 * Handles multiple feeding entries, each containing nest, provider, recipient, prey items, and timing information
 * Provides UI for entering feeding details, managing multiple feedings, and closing feedings
 * @param {object} props - Component props
 * @param {object} props.initialFeeding - Template object for creating new feeding entries
 * @param {object} props.stint - The parent stint data object
 * @param {Array} props.feedings - Array of feeding data objects
 * @param {Function} props.setFeedings - Callback to update the feedings array
 * @param {boolean} props.isOpen - Whether the feeding data view is currently open
 * @param {Function} props.onToggle - Callback to toggle between stint and feeding views
 * @param {object} props.styles - Style object for component styling
 * @param {object|null} props.config - Config object containing dropdown options, or null if no config loaded
 * @returns {JSX.Element} The feeding data entry interface
 */
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
            width: 'auto', //adjustable
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
    const [maxEntries, setMaxEntries] = useState(5);

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

    // Use refs to access latest values without causing re-renders
    const feedingRef = useRef(feeding);
    const nIndexRef = useRef(nIndex);
    const feedingsRef = useRef(feedings);
    
    // Update refs when values change
    useEffect(() => {
        feedingRef.current = feeding;
        nIndexRef.current = nIndex;
        feedingsRef.current = feedings;
    }, [feeding, nIndex, feedings]);

    //for closing index (keeping as separate state since it's independent)
    const [closedIndex, setClosedIndex] = useState([]);
    const [displayClosed, setDisplayClosed] = useState(true);
    const [isClosedFeedingShown, setIsClosedFeedingShown] = useState(false);

    const toggleClosedFeeding = () => {
        setIsClosedFeedingShown(!isClosedFeedingShown);
        displayClosedFeeding(!isClosedFeedingShown);
    };

    /**
     * Sets the plot status for the current feeding (e.g., "Inside Plot", "Outside Plot")
     * @param {string} Plot - The plot status value
     */
    const setPlot = useCallback((Plot) => {
        dispatchFeeding({ type: 'SET_PLOT', payload: Plot });
    }, [dispatchFeeding]);

    /**
     * Sets the nest identifier for the current feeding
     * @param {string} Nest - The nest identifier (e.g., "P1", "P2")
     */
    const setNest = useCallback((Nest) => {
        dispatchFeeding({ type: 'SET_NEST', payload: Nest });
    }, [dispatchFeeding]);

    /**
     * Sets the provider identifier for the current feeding
     * @param {string} Provider - The provider code (e.g., "BA", "BL", "FR")
     */
    const setProvider = useCallback((Provider) => {
        dispatchFeeding({ type: 'SET_PROVIDER', payload: Provider });
    }, [dispatchFeeding]);

    /**
     * Sets the entire Number_of_Items array for the current feeding
     * @param {Array} item - Array of item objects, each containing Recipient, Prey_Item, and Prey_Size
     */
    const setNumberItems = useCallback((item) => {
        dispatchFeeding({ type: 'SET_NUMBER_ITEMS', payload: item });
    }, [dispatchFeeding]);

    /**
     * Sets the recipient for the currently selected item in Number_of_Items
     * Updates the recipient value at the current nIndex position
     * @param {string} Recipient - The recipient identifier (e.g., "A", "B", "C")
     */
    const setRecipient = useCallback((Recipient) => {
        // Use refs to get latest values without dependency issues
        const currentFeeding = feedingRef.current;
        const currentNIndex = nIndexRef.current;
        let items = [...currentFeeding.Number_of_Items];
        let item = items[currentNIndex];
        item.Recipient = Recipient;

        dispatchFeeding({ type: 'SET_NUMBER_ITEMS', payload: items });
    }, [dispatchFeeding]);

    /**
     * Sets the prey item identifier for the currently selected item in Number_of_Items
     * Updates the prey item value at the current nIndex position
     * @param {string} Prey_Item - The prey item code (e.g., "H", "U", "R", "S")
     */
    const setPreyItem = useCallback((Prey_Item) => {
        // Use refs to get latest values without dependency issues
        const currentFeeding = feedingRef.current;
        const currentNIndex = nIndexRef.current;
        let items = [...currentFeeding.Number_of_Items];
        let item = items[currentNIndex];
        item.Prey_Item = Prey_Item;

        dispatchFeeding({ type: 'SET_NUMBER_ITEMS', payload: items });
    }, [dispatchFeeding]);

    /**
     * Sets the prey size value for the currently selected item in Number_of_Items
     * Updates the prey size value at the current nIndex position
     * @param {string} Prey_Size - The prey size value (e.g., "0.25", "0.5", "1.0")
     */
    const setPreySize = useCallback((Prey_Size) => {
        // Use refs to get latest values without dependency issues
        const currentFeeding = feedingRef.current;
        const currentNIndex = nIndexRef.current;
        let items = [...currentFeeding.Number_of_Items];
        let item = items[currentNIndex];
        item.Prey_Size = Prey_Size;

        dispatchFeeding({ type: 'SET_NUMBER_ITEMS', payload: items });
    }, [dispatchFeeding]);

    /**
     * Sets the arrival time for the current feeding
     * Also clears the departure time when arrival time is set
     * @param {string} time - The arrival time string
     */
    const setTimeArrive = useCallback((time) => {
        // Extract only the 'HH:mm' part from the datetime string
        dispatchFeeding({ type: 'SET_TIME_ARRIVE', payload: time });
    }, [dispatchFeeding]);

    /**
     * Sets the departure time for the current feeding
     * @param {string} time - The departure time string
     */
    const setTimeDepart = useCallback((time) => {
        dispatchFeeding({ type: 'SET_TIME_DEPART', payload: time });
    }, [dispatchFeeding]);

    /**
     * Sets the comment text for the current feeding
     * @param {string} value - The comment text to set
     */
    const setComment = useCallback((value) => {
        dispatchFeeding({ type: 'SET_COMMENT', payload: value });
    }, [dispatchFeeding]);

    /**
     * Sets the current index for Number_of_Items array (which item is currently being edited)
     * Helper function for NumberItems component to track which item in the array is selected
     * @param {number} value - The index of the selected item (0-based)
     */
    const setNIndex = useCallback((value) => {
        dispatchFeeding({ type: 'SET_NINDEX', payload: value });
    }, [dispatchFeeding]);

    /**
     * Saves the current feeding data to the feedings array at the specified index
     * Also updates the feedingTemp state to mark the current feeding as saved
     * @param {number} index - The index in the feedings array where to save the current feeding
     */
    const handleSaveFeeding = useCallback((index) => {
        // Use functional form to avoid dependency on feedings
        setFeedings(prevFeedings => {
            // Ensure prevFeedings is an array
            const feedingsArray = Array.isArray(prevFeedings) ? prevFeedings : [];
            const newFeedings = [...feedingsArray];
            // Ensure index is valid
            if (index >= 0 && index < newFeedings.length) {
                newFeedings[index] = feeding;
            }
            return newFeedings;
        });
        //stamp the temporary feeding
        dispatchFeeding({ type: 'SET_FEEDING_TEMP', payload: feeding });
    }, [feeding, setFeedings]);

    /**
     * Creates a new empty feeding entry and adds it to the feedings array
     * Automatically assigns the next FeedingID and switches to the new feeding
     * @returns {void}
     */
    const handleNewFeeding = useCallback(() => {
        // Use ref to get latest feedings value (safely)
        const currentFeedings = feedingsRef.current;
        // Ensure currentFeedings is an array
        const feedingsArray = Array.isArray(currentFeedings) ? currentFeedings : [];
        
        const nextId = feedingsArray.length + 1;
        const newFeeding = { ...initialFeeding, FeedingID: nextId };
        
        // Update multiple state values in one dispatch (do this first, before updating feedings)
        dispatchFeeding({ 
            type: 'BATCH_UPDATE', 
            payload: {
                feeding: newFeeding,
                feedingTemp: newFeeding,
                index: feedingsArray.length,
                nIndex: 0
            }
        });
        
        // Then update the feedings array
        setFeedings(prevFeedings => {
            const prevArray = Array.isArray(prevFeedings) ? prevFeedings : [];
            return [...prevArray, newFeeding];
        });
    }, [initialFeeding, setFeedings]);

    /**
     * Creates a collapsible message display component for showing lists of items
     * Used in modals to display arrays of data (e.g., filled fields, empty fields)
     * @param {Array} data - Array of items to display in the list
     * @param {string} message - The message text to display above the list
     * @returns {JSX.Element} React component with collapsible list
     */
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
     * Deletes the feeding data at the current index
     * Shows a confirmation modal if the feeding has filled data
     * Automatically switches to the previous feeding (or first feeding if deleting index 0)
     * Prevents deletion if it's the only remaining feeding
     */
    const handleDeleteFeeding = () => {
        const feedingsArray = Array.isArray(feedings) ? feedings : [];
        if (feedingsArray.length > 1) {
            const ignore = ["FeedingID"];
            const filled = [];

            const currentFeeding = feedingsArray[index];
            if (!currentFeeding) return; // Safety check

            Object.entries(currentFeeding).forEach(([key, value]) => {
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
                const feedingsArray = Array.isArray(feedings) ? feedings : [];
                const newData = feedingsArray.filter((item, i) => i !== index);
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
     * Switches to a different feeding in the feedings array
     * Saves the current feeding state before switching
     * Updates the feeding state, index, and nIndex to the selected feeding
     * @param {number} openIndex - The index of the feeding to switch to (0-based)
     */
    const handleOpenFeeding = useCallback((openIndex) => {
        // Use feedings prop directly (most up-to-date) instead of ref
        const feedingsArray = Array.isArray(feedings) ? feedings : [];
        const currentFeeding = feedingRef.current;
        const openF = feedingsArray[openIndex];
        
        if (!openF) return; // Safety check
        
        // Update multiple state values in one dispatch
        dispatchFeeding({ 
            type: 'BATCH_UPDATE', 
            payload: {
                index: openIndex,
                feeding: openF,
                feedingTemp: currentFeeding, // stamp the current feeding as temp
                nIndex: 0
            }
        });
    }, [feedings]);

    /**
     * Closes a feeding by marking it as closed (adds to closedIndex array)
     * Validates that all required fields are filled before closing
     * Shows error message if any required fields are missing
     * @param {number} index - The index of the feeding to close
     */
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

    /**
     * Controls the visibility of closed feedings in the feeding list
     * @param {boolean} bool - True to show closed feedings, false to hide them
     */
    const displayClosedFeeding = (bool) => {
        setDisplayClosed(bool);
    }

    //feature: when open feeding tab, switch to the latest feeding tab (only on initial mount or when feedings array grows)
    const prevFeedingsLengthRef = useRef(feedings?.length || 0);
    useEffect(() => {
        const feedingsArray = Array.isArray(feedings) ? feedings : [];
        const currentLength = feedingsArray.length;
        const prevLength = prevFeedingsLengthRef.current;
        
        // Only auto-switch to latest feeding if:
        // 1. Feedings array just grew (new feeding was added)
        // 2. AND we're currently at index 0 (initial state)
        // 3. AND there are feedings available
        if (currentLength > prevLength && index === 0 && feedingsArray.length > 0) {
            handleOpenFeeding(feedingsArray.length - 1);
        }
        
        // Update ref for next comparison
        prevFeedingsLengthRef.current = currentLength;
    }, [feedings, index, handleOpenFeeding])

    // Auto-save whenever feeding data changes (debounced)
    useEffect(() => {
        // Ensure feedings is an array before saving
        const feedingsArray = Array.isArray(feedings) ? feedings : [];
        if (feedingTemp !== feeding && index >= 0 && index < feedingsArray.length) {
            handleSaveFeeding(index);
            debouncedAutoSave(stint);
        }
    }, [feeding, feedingTemp, handleSaveFeeding, index, stint, debouncedAutoSave, feedings])

    // Memoized feeding actions for context (prevents unnecessary re-renders)
    // Note: handleSaveFeeding is NOT included here to avoid infinite loops
    // It depends on 'feeding' which changes frequently
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
        handleNewFeeding,
        handleOpenFeeding
    }), [
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
        handleNewFeeding,
        handleOpenFeeding
    ]);

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
                        <select
                            value={maxEntries}
                            onChange={(e) => setMaxEntries(parseInt(e.target.value))}
                            style={{ 
                                width: "60px", 
                                textAlign: "center",
                                padding: "2px",
                                borderRadius: "4px",
                                border: "1px solid #d9d9d9"
                            }}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
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
                                    {(Array.isArray(feedings) ? feedings : []).map((item, i) => {
                                        if (closedIndex.includes(i) && !displayClosed) {
                                            return null;
                                        }
                                        
                                        // Safety check for undefined item
                                        if (!item) {
                                            return null;
                                        }

                                        const value = `Feeding ${i + 1}` + (item?.Nest !== "" ? `: ${item.Nest}` : "");

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
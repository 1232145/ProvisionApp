import Plot from './feeding/Plot';
import Nest from './feeding/Nest';
import NumberItems from './feeding/NumberItems';
import PreyItem from './feeding/PreyItem';
import PreySize from './feeding/PreySize';
import Provider from './feeding/Provider';
import Recipient from './feeding/Recipient';
import Timer from './Timer';
import Date from '../Date';
import { useState, useEffect } from 'react';
import React from 'react';

function FeedingData({ initialFeeding, feedings, setFeedings }) {

    /**
     * this stores and handles input feeding data
     */
    const [feeding, setFeeding] = useState(initialFeeding);
    const [index, setIndex] = useState(0);
    const [closedIndex, setClosedIndex] = useState([]);
    const [displayClosed, setDisplayClosed] = useState(true);

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
     * this adds an item to Number_of_Items in feeding data
     * @param {*} item 
     */
    const addNumberItems = (item) => {
        setNumberItems([...feeding.Number_of_Items, item])
    }

    /**
    * this handles button input for recipent data
    * @param {*} Recipent 
    */
    const setRecipient = (Recipient) => {
        let items = [...{...feeding}.Number_of_Items];
        let item = items[nIndex];
        item.Recipient = Recipient;

        setNumberItems(items);
    }

    /**
     * this handles button input for prey item data
     * @param {*} Prey_Item 
     */
    const setPreyItem = (Prey_Item) => {
        let items = [...{...feeding}.Number_of_Items];
        let item = items[nIndex];
        item.Prey_Item = Prey_Item;

        setNumberItems(items);
    }

    /**
     * this handles button input for prey size data
     * @param {*} Prey_Size 
     */
    const setPreySize = (Prey_Size) => {
        let items = [...{...feeding}.Number_of_Items];
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
        if (closedIndex.includes(index)) {
            let newArr = [...closedIndex];
            newArr = newArr.filter(item => item !== index);

            setClosedIndex(newArr);
            return;
        }

        setClosedIndex([...closedIndex, index]);

    }

    const displayClosedFeeding = (bool) => {
        setDisplayClosed(bool);
    }

    //feature: when open feeding tab, switch to the latest feeding tab
    useEffect(() => {
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
            <div className="outer-container">
                {/* <div className="display-buttons">
                    <div>
                        <button onClick={() => displayClosedFeeding(false)}>Hide closed feeding</button>
                        <button onClick={() => displayClosedFeeding(true)}>Show closed feeding</button>
                    </div>
                    <div className='displayM'>
                        <p>Hide closed: {displayClosed ? "false" : "true"}</p>
                        <p>Is closed: {closedIndex.includes(index) ? "true" : "false"}</p>
                    </div>
                </div> */}

                <div className="feed_header">
                    Feeding {index + 1}{feeding.Nest !== "" && `: ${feeding.Nest}`}
                </div>

                <div className="menu-container">
                    <Timer setArrive={setTimeArrive} setDepart={setTimeDepart} data={{ arrive: feeding.Time_Arrive, depart: feeding.Time_Depart }} />

                    <div>

                        <Plot setPlot={setPlot} data={feeding.Plot_Status} />
                        <NumberItems addData={addNumberItems} data={feeding.Number_of_Items} changeIndex={setNIndex} nIndex={nIndex}/>
                    </div>

                    <div>
                        <div>
                            <button onClick={() => displayClosedFeeding(false)}>Hide closed feeding</button>
                            <button onClick={() => displayClosedFeeding(true)}>Show closed feeding</button>
                        </div>

                        <p>Open Feedings:</p>
                        {
                            feedings.map((item, i) => {
                                if (closedIndex.includes(i) && !displayClosed) {
                                    return;
                                }

                                const value = `Feeding ${i + 1}` + (item.Nest !== "" ? `: ${item.Nest}` : "");

                                return (
                                    <input key={i} value={value} type="button"
                                        onClick={() => handleOpenFeeding(i)}
                                        className={index === i && "selected-btn"}
                                    />
                                )
                            })
                        }
                        <div>
                            <button onClick={() => handleNewFeeding()}>New</button>
                            <button onClick={() => handleCloseFeeding(index)}>Close</button>
                        </div>
                    </div>
                </div>

                <div className="stintl-container">

                    <Nest setNest={setNest} data={feeding.Nest} />
                    <Provider setProvider={setProvider} data={feeding.Provider} />
                    <Recipient setRecipient={setRecipient} data={feeding.Number_of_Items[nIndex].Recipient} />
                    <PreySize setPreySize={setPreySize} data={feeding.Number_of_Items[nIndex].Prey_Size} />
                    <PreyItem setPreyItem={setPreyItem} data={feeding.Number_of_Items[nIndex].Prey_Item} />
                </div>
            </div>
        </>
    );
}

export default FeedingData;
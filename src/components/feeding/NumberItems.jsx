import React from 'react'
import { Button, Space, Row, Col, Modal, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

function NumberItems({ data, changeIndex, nIndex, setNumberItems, styles }) {
    styles = {
        ...styles,
        numberItemsContainer: {
            display: 'flex',
            flexDirection: 'column',
            width: '500px',
            height: '150px',
            margin: '12.5px',
            border: '1px solid black',
            justifyContent: 'space-between',
            padding: '0px 10px',
        },
        itemsListContainer: {
            flexGrow: 1,
            overflowY: 'auto', // Enable vertical scrolling if needed
            display: 'flex',
            flexDirection: 'row', // Align buttons in a row
            flexWrap: 'wrap',     // Allow buttons to wrap when there is no more space
            gap: '5px',          // Add some spacing between buttons
            alignItems: 'flex-start', // Align items to the top
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
        },
        selectedBtn: {
            backgroundColor: 'green',
            color: 'white',
        },
        unselectedBtn: {
            backgroundColor: 'lightgrey',
        },
        buttonStyle: {
            margin: '5px',
            padding: '5px 10px',
            cursor: 'pointer',
            width: '80px',  // Set consistent button width
        }
    };

    const initial_item = {
        Recipient: "",
        Prey_Item: "",
        Prey_Size: "",
    }

    // Add 1 more item to NumberItems
    const handleAddData = () => {
        setNumberItems([...data, initial_item])
        handleChangeItem(data.length);
    }

    // Changes the item to the specified index in data (NumberItems)
    const handleChangeItem = (index) => {
        changeIndex(index)
    }

    // Delete the item at the current index, with validation
    const handleDeleteData = () => {
        if (data.length > 1) {
            let hasData = false;
            const filledFields = [];

            Object.entries(data[nIndex]).forEach(([key, val]) => {
                if (val !== "") {
                    hasData = true;
                    filledFields.push(key);
                }
            });

            if (!hasData) {
                const newData = data.filter((_, i) => i !== nIndex);
                setNumberItems(newData);

                // Adjust the current index
                changeIndex(nIndex === 0 ? 0 : nIndex - 1);
            } else {
                Modal.warning({
                    title: 'Cannot Delete Item',
                    content: `Data is filled in the following fields: ${filledFields.join(', ')}. Clear these fields before deleting.`,
                });
            }
        } else {
            message.warning('Cannot delete the last remaining item.');
        }
    }

    return (
        <div style={styles.numberItemsContainer}>
            <p>Number of Items: {data.length}</p>

            {/* Scrollable area for the items */}
            <div style={styles.itemsListContainer}>
                {data.map((_, index) => {
                    const itemNumber = index + 1;
                    return (
                        <Button
                            key={index}
                            type={nIndex === index ? "primary" : "default"}
                            onClick={() => handleChangeItem(index)}
                            style={{ ...(nIndex === index ? styles.selectedBtn : styles.unselectedBtn), ...styles.buttonStyle }}
                        >
                            Item {itemNumber}
                        </Button>
                    );
                })}
            </div>

            {/* Fixed Add/Delete button section */}
            <div style={styles.buttonContainer}>
                <Button type="dashed" onClick={handleAddData} icon={<PlusOutlined />} size="large">
                    Add item
                </Button>
                <Button type="danger" onClick={handleDeleteData} icon={<DeleteOutlined />} size="large">
                    Delete item
                </Button>
            </div>
        </div>
    )
}

export default NumberItems;

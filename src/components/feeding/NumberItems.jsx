import React from 'react'
import { Button, Space, Row, Col, Modal, message } from 'antd';

function NumberItems({ data, changeIndex, nIndex, setNumberItems, styles }) {
    styles = {
        ...styles,
        numberItemsContainer: {
            ...styles.feedingsContainer,
        },
        itemsListContainer: {
            ...styles.feedingItemListContainer,
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

    const deleteData = () => {
        const newData = data.filter((_, i) => i !== nIndex);
        setNumberItems(newData);

        // Adjust the current index
        changeIndex(nIndex === 0 ? 0 : nIndex - 1);
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
                Modal.confirm({
                    title: 'Confirm Deletion',
                    content: 'Are you sure you want to delete this item?',
                    onOk: deleteData,
                    onCancel() { },
                });
            } else {
                Modal.confirm({
                    title: 'Cannot Delete Item',
                    content: `Data is filled in the following fields: ${filledFields.join(', ')}. Clear these fields before deleting.`,
                    onOk: deleteData,
                    onCancel() {}
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
            <div style={styles.flexRowCenter}>
                <Button type="primary" onClick={handleAddData} style={{ marginRight: '8px' }}>
                    New
                </Button>
                <Button onClick={handleDeleteData}>
                    Delete
                </Button>
            </div>
        </div>
    )
}

export default NumberItems;

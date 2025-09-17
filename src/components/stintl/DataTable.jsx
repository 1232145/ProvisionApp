import React, { useState } from 'react';
import { Button, Table, Collapse } from 'antd';
const styles = {
  column: {
    maxWidth: '70px',
    overflow: 'auto',
  }
}

function DataTable(props) {
  const [showData, setShowData] = useState(false);
  const [activeKeys, setActiveKeys] = useState([]);

  const stint = props.stint;

  const handleShowData = () => {
    const newShowData = !showData;

    setShowData(newShowData);

    // Ensure both panels are open when showing the data
    if (newShowData) {
      setActiveKeys(['1', '2']);  // Open both panels
    } else {
      setActiveKeys([]);  // Close all panels
    }
  };

  const handleCollapseChange = (keys) => {
    setActiveKeys(keys);

    // If no panels are open, hide the data
    if (keys.length === 0) {
      setShowData(false);
    } else {
      setShowData(true);
    }
  };

  const stintColumns = [
    {
      title: '#', key: 'rownum', width: 60,
      render: (text, record, index) => (index + 1)
    },
    {
      title: 'Type', dataIndex: 'Stint_Type', key: 'Stint_Type', width: 150,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'Island', dataIndex: 'Island', key: 'Island', width: 150,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'Species', dataIndex: 'Species', key: 'Species', width: 150,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'Prey Size Method', dataIndex: 'Prey_Size_Method', key: 'Prey_Size_Method', width: 200,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'Prey Size Reference', dataIndex: 'Prey_Size_Reference', key: 'Prey_Size_Reference', width: 150,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'First Name', dataIndex: 'First_Name', key: 'First_Name', width: 150,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'Last Name', dataIndex: 'Last_Name', key: 'Last_Name', width: 150,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'Observer Location', dataIndex: 'Observer_Location', key: 'Observer_Location', width: 150,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'Date Time Start', dataIndex: 'Date_Time_Start', key: 'Date_Time_Start', width: 150,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'Date Time End', dataIndex: 'Date_Time_End', key: 'Date_Time_End', width: 150,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
  ];


  const feedingColumns = [
    { title: '#', key: 'rownum', width: 60, render: (text, record, index) => (index + 1) },
    { title: 'Feeding ID', dataIndex: 'FeedingID', key: 'FeedingID', width: 100, render: text => (
      <div style={styles.column}>
        {text}
      </div>
    ) },
    { title: 'Nest', dataIndex: 'Nest', key: 'Nest', width: 150, render: text => (
      <div style={styles.column}>
        {text}
      </div>
    ) },
    { title: 'Time Arrive', dataIndex: 'Time_Arrive', key: 'Time_Arrive', width: 150 },
    { title: 'Time Depart', dataIndex: 'Time_Depart', key: 'Time_Depart', width: 150 },
    { title: 'Provider', dataIndex: 'Provider', key: 'Provider', width: 150 },
    {
      title: 'Recipient',
      key: 'Recipient',
      render: (text, record) => (
        <div>
          {record.Number_of_Items.map((item, index) => (
            <div key={`${record.FeedingID}-recipient-${index}`} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.Recipient || '_'}
            </div>
          ))}
        </div>
      ),
      width: 150
    },
    {
      title: 'Prey Size',
      key: 'Prey_Size',
      render: (text, record) => (
        <div>
          {record.Number_of_Items.map((item, index) => (
            <div key={`${record.FeedingID}-preysize-${index}`} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.Prey_Size || '_'}
            </div>
          ))}
        </div>
      ),
      width: 150
    },
    {
      title: 'Prey Item',
      key: 'Prey_Item',
      render: (text, record) => (
        <div>
          {record.Number_of_Items.map((item, index) => (
            <div key={`${record.FeedingID}-preyitem-${index}`} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.Prey_Item || '_'}
            </div>
          ))}
        </div>
      ),
      width: 150
    },
    { title: 'Plot Status', dataIndex: 'Plot_Status', key: 'Plot_Status', width: 150 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      {/* Centered Button Container */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Button type="primary" onClick={handleShowData}>
          {showData ? "Hide data" : "Show data"}
        </Button>
      </div>

      {showData && (
        <div>
          <Collapse
            activeKey={activeKeys}
            onChange={handleCollapseChange}
            style={{ marginBottom: '20px' }}
            items={[
              {
                key: '1',
                label: 'Stint Data',
                children: (
                  <Table
                    dataSource={[stint]}
                    columns={stintColumns}
                    pagination={false}
                    rowKey="StintID"
                    scroll={{ x: 600 }}
                  />
                )
              },
              {
                key: '2',
                label: 'Feeding Data',
                children: (
                  <Table
                    dataSource={stint.feedingData}
                    columns={feedingColumns}
                    pagination={false}
                    rowKey="FeedingID"
                    scroll={{ x: 800 }}
                  />
                )
              }
            ]}
          />

          {/* Add instruction for scrolling */}
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Use your finger to scroll to the right to see the rest of the data.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;

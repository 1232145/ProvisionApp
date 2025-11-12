import React, { useState } from 'react';
import { Button, Table, Collapse } from 'antd';
const styles = {
  column: {
    minWidth: '100px',
    overflow: 'auto',
    whiteSpace: 'nowrap',
  }
}

/**
 * DataTable component displays stint and feeding data in collapsible tables
 * Allows users to view all stint and feeding information in a tabular format
 * @param {object} props - Component props
 * @param {object} props.stint - The stint data object containing stint info and feedingData array
 */
function DataTable(props) {
  const [showData, setShowData] = useState(false);
  const [activeKeys, setActiveKeys] = useState([]);

  const stint = props.stint;

  /**
   * Toggles the visibility of the data tables
   * When showing data, automatically opens both stint and feeding data panels
   * When hiding data, closes all panels
   */
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

  /**
   * Handles changes to the collapsible panels (opening/closing)
   * Updates which panels are active and hides data if all panels are closed
   * @param {Array<string>} keys - Array of active panel keys (e.g., ['1', '2'])
   */
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
      title: '#', key: 'rownum', width: 80,
      render: (text, record, index) => (index + 1)
    },
    {
      title: 'Type', dataIndex: 'Stint_Type', key: 'Stint_Type', width: 180,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'Island', dataIndex: 'Island', key: 'Island', width: 180,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'Species', dataIndex: 'Species', key: 'Species', width: 180,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'Prey Size Method', dataIndex: 'Prey_Size_Method', key: 'Prey_Size_Method', width: 220,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'Prey Size Reference', dataIndex: 'Prey_Size_Reference', key: 'Prey_Size_Reference', width: 200,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'First Name', dataIndex: 'First_Name', key: 'First_Name', width: 180,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'Last Name', dataIndex: 'Last_Name', key: 'Last_Name', width: 180,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'Observer Location', dataIndex: 'Observer_Location', key: 'Observer_Location', width: 200,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'Date Time Start', dataIndex: 'Date_Time_Start', key: 'Date_Time_Start', width: 200,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
    {
      title: 'Date Time End', dataIndex: 'Date_Time_End', key: 'Date_Time_End', width: 200,
      render: text => (
        <div style={styles.column}>
          {text}
        </div>
      )
    },
  ];


  const feedingColumns = [
    { title: '#', key: 'rownum', width: 80, render: (text, record, index) => (index + 1) },
    { title: 'Feeding ID', dataIndex: 'FeedingID', key: 'FeedingID', width: 120, render: text => (
      <div style={styles.column}>
        {text}
      </div>
    ) },
    { title: 'Nest', dataIndex: 'Nest', key: 'Nest', width: 180, render: text => (
      <div style={styles.column}>
        {text}
      </div>
    ) },
    { title: 'Time Arrive', dataIndex: 'Time_Arrive', key: 'Time_Arrive', width: 180 },
    { title: 'Time Depart', dataIndex: 'Time_Depart', key: 'Time_Depart', width: 180 },
    { title: 'Provider', dataIndex: 'Provider', key: 'Provider', width: 180 },
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
      width: 180
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
      width: 180
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
      width: 180
    },
    { title: 'Plot Status', dataIndex: 'Plot_Status', key: 'Plot_Status', width: 180 },
  ];

  return (
    <div style={{ padding: '20px', boxSizing: 'border-box', width: '100%' }}>
      {/* Centered Button Container */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Button type="primary" onClick={handleShowData}>
          {showData ? "Hide data" : "Show data"}
        </Button>
      </div>

      {showData && (
        <div style={{ width: '100%' }}>
          <Collapse
            activeKey={activeKeys}
            onChange={handleCollapseChange}
            style={{ marginBottom: '20px', width: '100%' }}
            items={[
              {
                key: '1',
                label: 'Stint Data',
                children: (
                  <div style={{ width: '100%', overflowX: 'auto' }}>
                    <Table
                      dataSource={[stint]}
                      columns={stintColumns}
                      pagination={false}
                      rowKey="StintID"
                      scroll={{ x: true }}
                      style={{ width: '100%' }}
                    />
                  </div>
                )
              },
              {
                key: '2',
                label: 'Feeding Data',
                children: (
                  <div style={{ width: '100%', overflowX: 'auto' }}>
                    <Table
                      dataSource={stint.feedingData}
                      columns={feedingColumns}
                      pagination={false}
                      rowKey="FeedingID"
                      scroll={{ x: true }}
                      style={{ width: '100%' }}
                    />
                  </div>
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

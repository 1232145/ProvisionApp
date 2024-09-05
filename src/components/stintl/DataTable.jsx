import React, { useState } from 'react';
import { Button, Table, Collapse } from 'antd';

const { Panel } = Collapse;

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
    { title: 'Stint ID', dataIndex: 'StintID', key: 'StintID', width: 100 },
    { title: 'Type', dataIndex: 'Stint_Type', key: 'Stint_Type', width: 150 },
    { title: 'Island', dataIndex: 'Island', key: 'Island', width: 150 },
    { title: 'Species', dataIndex: 'Species', key: 'Species', width: 150 },
    { title: 'Prey Size Method', dataIndex: 'Prey_Size_Method', key: 'Prey_Size_Method', width: 200 },
    { title: 'Prey Size Reference', dataIndex: 'Prey_Size_Reference', key: 'Prey_Size_Reference', width: 200 },
    { title: 'First Name', dataIndex: 'FirstName', key: 'FirstName', width: 150 },
    { title: 'Last Name', dataIndex: 'LastName', key: 'LastName', width: 150 },
    { title: 'Observer Location', dataIndex: 'Observer_Location', key: 'Observer_Location', width: 200 },
    { title: 'Date Time Start', dataIndex: 'Date_Time_Start', key: 'Date_Time_Start', width: 200 },
    { title: 'Date Time End', dataIndex: 'Date_Time_End', key: 'Date_Time_End', width: 200 },
  ];

  const feedingColumns = [
    { title: 'Feeding ID', dataIndex: 'FeedingID', key: 'FeedingID', width: 100 },
    { title: 'Nest', dataIndex: 'Nest', key: 'Nest', width: 150 },
    { title: 'Time Arrive', dataIndex: 'Time_Arrive', key: 'Time_Arrive', width: 150 },
    { title: 'Time Depart', dataIndex: 'Time_Depart', key: 'Time_Depart', width: 150 },
    { title: 'Provider', dataIndex: 'Provider', key: 'Provider', width: 150 },
    {
      title: 'Recipient',
      key: 'Recipient',
      render: (text, record) => (
        <div>
          {record.Number_of_Items.map((item, index) => (
            <div key={index} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.Recipient}
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
            <div key={index} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.Prey_Item}
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
            <div key={index} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.Prey_Size}
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
          >
            <Panel header="Stint Data" key="1">
              <Table
                dataSource={[stint]}
                columns={stintColumns}
                pagination={false}
                rowKey="StintID"
                scroll={{ x: 1200 }}  // Adjust this value based on your content
              />
            </Panel>
            <Panel header="Feeding Data" key="2">
              <Table
                dataSource={stint.feedingData}
                columns={feedingColumns}
                pagination={false}
                rowKey="FeedingID"
                scroll={{ x: 1200 }}  // Adjust this value based on your content
              />
            </Panel>
          </Collapse>
        </div>
      )}
    </div>
  );
}

export default DataTable;

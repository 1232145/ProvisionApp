import React, { useState } from 'react';
import { Button, Table, Collapse } from 'antd';

const styles = {
  column: {
    minWidth: '100px',
    overflow: 'auto',
    whiteSpace: 'nowrap',
  }
}

function DataTable(props) {
  const [showData, setShowData] = useState(false);
  const [activeKeys, setActiveKeys] = useState([]);

  const stint = props.stint;

  const handleShowData = () => {
    const newShowData = !showData;
    setShowData(newShowData);
    setActiveKeys(newShowData ? ['1', '2'] : []);
  };

  const handleCollapseChange = (keys) => {
    setActiveKeys(keys);
    setShowData(keys.length > 0);
  };

  const renderCell = (text) => (
    <div style={styles.column}>{text}</div>
  );

  const stintColumns = [
    { title: '#', key: 'rownum', width: 50, render: (_, __, index) => index + 1 },
    { title: 'Type', dataIndex: 'Stint_Type', key: 'Stint_Type', width: 180, render: renderCell },
    { title: 'Island', dataIndex: 'Island', key: 'Island', width: 150, render: renderCell },
    {
      title: 'Species', dataIndex: 'Species', key: 'Species', width: 150,
      render: (val) => renderCell(Array.isArray(val) ? val.join(' & ') : (val || ''))
    },
    { title: 'Prey Size Method', dataIndex: 'Prey_Size_Method', key: 'Prey_Size_Method', width: 180, render: renderCell },
    { title: 'Prey Size Ref', dataIndex: 'Prey_Size_Reference', key: 'Prey_Size_Reference', width: 160, render: renderCell },
    { title: 'First Name', dataIndex: 'First_Name', key: 'First_Name', width: 130, render: renderCell },
    { title: 'Last Name', dataIndex: 'Last_Name', key: 'Last_Name', width: 130, render: renderCell },
    { title: 'Obs Location', dataIndex: 'Observer_Location', key: 'Observer_Location', width: 160, render: renderCell },
    { title: 'Start Time', dataIndex: 'Date_Time_Start', key: 'Date_Time_Start', width: 170, render: renderCell },
    { title: 'End Time', dataIndex: 'Date_Time_End', key: 'Date_Time_End', width: 170, render: renderCell },
    { title: 'Comment', dataIndex: 'Comment', key: 'Comment', width: 200, render: renderCell },
  ];

  const feedingColumns = [
    { title: '#', key: 'rownum', width: 50, render: (_, __, index) => index + 1 },
    { title: 'Feeding ID', dataIndex: 'FeedingID', key: 'FeedingID', width: 100, render: renderCell },
    { title: 'Nest', dataIndex: 'Nest', key: 'Nest', width: 100, render: renderCell },
    { title: 'Time Arrive', dataIndex: 'Time_Arrive', key: 'Time_Arrive', width: 130, render: renderCell },
    { title: 'Time Depart', dataIndex: 'Time_Depart', key: 'Time_Depart', width: 130, render: renderCell },
    { title: 'Provider', dataIndex: 'Provider', key: 'Provider', width: 110, render: renderCell },
    {
      title: 'Recipient', key: 'Recipient', width: 120,
      render: (_, record) => (
        <div>
          {record.Number_of_Items.map((item, i) => (
            <div key={`${record.FeedingID}-r-${i}`} style={{ whiteSpace: 'nowrap' }}>
              {item.Recipient || '—'}
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Prey Item', key: 'Prey_Item', width: 120,
      render: (_, record) => (
        <div>
          {record.Number_of_Items.map((item, i) => (
            <div key={`${record.FeedingID}-pi-${i}`} style={{ whiteSpace: 'nowrap' }}>
              {item.Prey_Item || '—'}
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Prey Size', key: 'Prey_Size', width: 110,
      render: (_, record) => (
        <div>
          {record.Number_of_Items.map((item, i) => (
            <div key={`${record.FeedingID}-ps-${i}`} style={{ whiteSpace: 'nowrap' }}>
              {item.Prey_Size || '—'}
            </div>
          ))}
        </div>
      )
    },
    { title: '# Items', key: 'num_items', width: 80, render: (_, record) => record.Number_of_Items.length },
    { title: 'Plot', dataIndex: 'Plot_Status', key: 'Plot_Status', width: 140, render: renderCell },
    { title: 'Feeding Species', dataIndex: 'Species', key: 'FeedingSpecies', width: 140, render: renderCell },
    { title: 'Comment', dataIndex: 'Comment', key: 'FeedingComment', width: 200, render: renderCell },
  ];

  return (
    <div style={{ padding: '20px', boxSizing: 'border-box', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Button type="primary" onClick={handleShowData}>
          {showData ? 'Hide data' : 'Show data'}
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
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Scroll right to see all columns.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;

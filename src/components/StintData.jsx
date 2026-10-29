import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Col, Modal, Row, Upload, message, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import Island from './stintl/Island';
import Species from './stintl/Species';
import Name from './stintl/Name';
import ObserverLocation from './stintl/ObserverLocation';
import DataTable from './stintl/DataTable';
import Timer from './Timer';
import Comment from './Comment';
import FeedingData from './FeedingData';
import ValidationSummary from './ValidationSummary';
import { useAutoSave } from '../hooks/useAutoSave';
import platformFS from '../utils/platform';
import {
  createEmptyFeeding,
  createInitialStint,
  getMissingFieldLabels,
  hasMeaningfulStintData,
  isValidStintDateTime,
  normalizeStint,
} from '../domain/models';
import { parseConfigCsv, parseStintCsv, stintToCsv } from '../utils/csv';

const styles = {
  startStint: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #d9d9d9',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#f9f9f9',
    boxSizing: 'border-box',
  },
  form: { width: '100%' },
  header: { marginBottom: '3.5%' },
  leftColumn: { padding: '20px', textAlign: 'left', minWidth: 0 },
  fixedInfo: { marginBottom: '3.5%' },
  rightColumn: { padding: '20px', textAlign: 'right', minWidth: 0 },
  labelContainer: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 0',
    borderBottom: '1px solid #e0e0e0',
  },
  label: { fontWeight: 'bold', fontSize: '16px', color: '#333', marginRight: '10px' },
  btnContainer: {
    display: 'grid',
    width: '100%',
    marginTop: '20px',
    gap: '10px',
    padding: '10px 0',
  },
  navigateBtn: {
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    textAlign: 'center',
    minWidth: 0,
    width: '100%',
  },
  saveBtn: {
    backgroundColor: 'green',
    borderColor: 'green',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    textAlign: 'center',
    minWidth: 0,
    width: '100%',
  },
  inputField: {
    width: '60%',
    height: '32px',
    overflowX: 'auto',
    marginLeft: '5px',
    fontSize: '14px',
    padding: '4px 8px',
    boxSizing: 'border-box',
  },
  inputContainer: { width: '100%', marginBottom: '15px' },
};

function StintData() {
  const initialFeeding = useMemo(() => createEmptyFeeding(1), []);
  const [stint, setStint] = useState(createInitialStint);
  const [config, setConfig] = useState(null);
  const [isOpenF, setIsOpenF] = useState(false);
  const [saveFileExists, setSaveFileExists] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const isDirtyRef = useRef(false);
  const latestStintRef = useRef(stint);
  const hasInitializedAutoSaveRef = useRef(false);

  const processedConfig = config;
  const stintID = useMemo(() => {
    const species = Array.isArray(stint.Species) ? stint.Species.join('-') : (stint.Species || '');
    return `${stint.Island}-${species}-${stint.Date_Time_Start}-${stint.First_Name} ${stint.Last_Name}`
      .replace(/\s+/g, '-');
  }, [stint.Island, stint.Species, stint.Date_Time_Start, stint.First_Name, stint.Last_Name]);

  const setIsland = useCallback((value) => {
    setStint((previous) => ({ ...previous, Island: value }));
  }, []);

  const setSpecies = useCallback((value) => {
    setStint((previous) => ({ ...previous, Species: value }));
  }, []);

  const setName = useCallback((value) => {
    if (typeof value === 'string') {
      const parts = value.trim().split(/\s+/);
      setStint((previous) => ({
        ...previous,
        First_Name: parts[0] || '',
        Last_Name: parts.slice(1).join(' ') || '',
      }));
      return;
    }

    setStint((previous) => ({
      ...previous,
      First_Name: value?.First_Name || '',
      Last_Name: value?.Last_Name || '',
    }));
  }, []);

  const setObserverLocation = useCallback((value) => {
    setStint((previous) => ({ ...previous, Observer_Location: value }));
  }, []);

  const startTimeRef = useRef(stint.Date_Time_Start);
  useEffect(() => {
    startTimeRef.current = stint.Date_Time_Start;
  }, [stint.Date_Time_Start]);

  const setTimeArrive = useCallback((time) => {
    setStint((previous) => ({ ...previous, Date_Time_Start: time }));
  }, []);

  const setTimeDepart = useCallback((time) => {
    if (time && startTimeRef.current && isValidStintDateTime(time) && isValidStintDateTime(startTimeRef.current)) {
      const start = moment(startTimeRef.current, 'MM/DD/YYYY HH:mm', true);
      const end = moment(time, 'MM/DD/YYYY HH:mm', true);
      if (start.isValid() && end.isValid() && end.isBefore(start)) {
        message.error('End time cannot be before start time.');
        return;
      }
    }
    setStint((previous) => ({ ...previous, Date_Time_End: time }));
  }, []);

  const setFeedings = useCallback((value) => {
    setStint((previous) => {
      const currentFeedings = Array.isArray(previous.feedingData) ? previous.feedingData : [];
      const nextFeedings = typeof value === 'function' ? value(currentFeedings) : value;
      return { ...previous, feedingData: Array.isArray(nextFeedings) ? nextFeedings : [] };
    });
  }, []);

  const setComment = useCallback((value) => {
    setStint((previous) => ({ ...previous, Comment: value }));
  }, []);

  const handleSwitchToFeeding = useCallback((getFeedings) => {
    let stintToSave = stint;
    if (typeof getFeedings === 'function' && isOpenF) {
      const latestFeedings = getFeedings();
      stintToSave = { ...stint, feedingData: latestFeedings };
      setStint((previous) => ({ ...previous, feedingData: latestFeedings }));
    }
    setIsOpenF((previous) => !previous);
    platformFS.saveAutoSave(stintToSave).catch((error) => {
      console.error('Error saving when switching views:', error);
    });
  }, [isOpenF, stint]);

  const handleSaveClick = useCallback(() => {
    const data = normalizeStint({ ...stint, StintID: stintID });
    const missingFields = getMissingFieldLabels(data);

    if (missingFields.length > 0) {
      Modal.warning({
        title: 'This stint is not ready to save',
        content: (
          <ValidationSummary
            fields={missingFields}
            message="Complete the required information below before saving the CSV file."
          />
        ),
        okText: 'Return to form',
        width: 560,
      });
      return;
    }

    const fileName = `${stintID}.csv`.replace(/[/\\:]/g, '_');
    platformFS.saveFile(stintToCsv(data), fileName)
      .then((fileUri) => {
        if (fileUri?.canceled) return;
        isDirtyRef.current = false;
        message.success(`File saved: ${fileName}`);
      })
      .catch((error) => {
        console.error('Error saving file:', error);
        message.error('Failed to save file. Please try again.');
      });
  }, [stint, stintID]);

  const handleOpenClick = useCallback((event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const csv = String(loadEvent.target.result || '');
      const result = type === 'stint' ? parseStintCsv(csv) : parseConfigCsv(csv);

      if (result.errors.length > 0) {
        message.error(result.errors[0]);
        return;
      }

      if (type === 'stint') {
        const safeStint = normalizeStint(result.data);
        setStint(safeStint);
        latestStintRef.current = safeStint;
        isDirtyRef.current = true;
        if (hasMeaningfulStintData(safeStint)) {
          platformFS.saveAutoSave(safeStint).catch((error) => {
            console.error('Error auto-saving imported stint:', error);
          });
        }
        message.success('Stint data loaded.');
      } else {
        setConfig(result.data);
        message.success('Configuration loaded.');
      }
    };
    reader.onerror = () => message.error('Unable to read the selected CSV file.');
    reader.readAsText(file);
  }, []);

  const handleLoadLastSave = useCallback(async () => {
    try {
      const data = await platformFS.loadAutoSave();
      if (data && hasMeaningfulStintData(data)) {
        setStint(normalizeStint(data));
        notification.success({
          message: 'Data loaded',
          description: 'Auto-save data loaded successfully.',
          placement: 'topRight',
          duration: 2,
        });
      } else {
        notification.info({
          message: 'No auto-save data',
          description: 'No usable auto-save data was found.',
          placement: 'topRight',
          duration: 1.5,
        });
      }
    } catch (error) {
      console.error('Error loading auto-save:', error);
      message.error(`Error loading auto-save data: ${error.message}`);
    }
  }, []);

  const debouncedAutoSave = useAutoSave(1000);
  useEffect(() => {
    latestStintRef.current = stint;
    if (!hasInitializedAutoSaveRef.current) {
      hasInitializedAutoSaveRef.current = true;
      return undefined;
    }

    isDirtyRef.current = true;
    debouncedAutoSave(stint);
    return undefined;
  }, [stint, debouncedAutoSave]);

  useEffect(() => {
    let active = true;
    platformFS.checkSaveFileStatus().then((status) => {
      if (!active) return;
      setSaveFileExists(status.exists);
      setLastSaveTime(status.lastModified);
    }).catch((error) => console.error('Error checking save file status:', error));

    const unsubscribe = platformFS.onSaveFileStatus?.((status) => {
      if (!active) return;
      setSaveFileExists(status.exists);
      setLastSaveTime(status.lastModified);
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    const handleClose = async () => {
      if (platformFS.getPlatform() === 'capacitor' || !isDirtyRef.current) {
        platformFS.confirmClose();
        return;
      }

      if (window.confirm('You have unsaved changes. Are you sure you want to exit?')) {
        try {
          if (hasMeaningfulStintData(latestStintRef.current)) {
            await platformFS.saveAutoSave(latestStintRef.current);
          }
        } catch (error) {
          console.error('Error performing final auto-save before exit:', error);
        }
        platformFS.confirmClose();
      }
    };

    return platformFS.onCloseWarning(handleClose);
  }, []);

  return (
    <div className="app-shell">
      {!isOpenF ? (
        <>
          <div className="stint-card" style={styles.startStint}>
            <h1 style={styles.header}>Provisioning App</h1>
            <Row gutter={[16, 8]} style={styles.form}>
              <Col xs={24} md={12} style={styles.leftColumn}>
                <div style={styles.fixedInfo}>
                  <div style={styles.labelContainer}><span style={styles.label}>Stint ID:</span>{stintID}</div>
                  <div style={styles.labelContainer}><span style={styles.label}>Stint type:</span>{stint.Stint_Type}</div>
                  <div style={styles.labelContainer}><span style={styles.label}>Prey size method:</span>{stint.Prey_Size_Method}</div>
                  <div style={styles.labelContainer}><span style={styles.label}>Prey size reference:</span>{stint.Prey_Size_Reference}</div>
                </div>
                <Island setIsland={setIsland} data={stint.Island} styles={styles} config={processedConfig} />
                <Species setSpecies={setSpecies} data={stint.Species} styles={styles} config={processedConfig} />
                <Comment setComment={setComment} data={stint.Comment} styles={styles} />
              </Col>
              <Col xs={24} md={12} style={styles.rightColumn}>
                <Name
                  setName={setName}
                  data={{ First_Name: stint.First_Name, Last_Name: stint.Last_Name }}
                  styles={styles}
                  config={processedConfig}
                />
                <ObserverLocation
                  setObs={setObserverLocation}
                  data={stint.Observer_Location}
                  styles={styles}
                  config={processedConfig}
                />
                <Timer setTime={setTimeArrive} data={stint.Date_Time_Start} label="Start stint time" description="Now" styles={styles} hasDatePicker />
                <Timer
                  setTime={setTimeDepart}
                  data={stint.Date_Time_End}
                  label="End stint time"
                  description="Now"
                  styles={styles}
                  hasDatePicker
                  minDate={stint.Date_Time_Start ? moment(stint.Date_Time_Start, 'MM/DD/YYYY HH:mm', true) : null}
                />
              </Col>
            </Row>

            <div className="stint-actions" style={styles.btnContainer}>
              <Button className="stint-action" onClick={handleLoadLastSave}>Load save</Button>
              <Button className="stint-action" type="primary" style={styles.navigateBtn} onClick={() => handleSwitchToFeeding()}>Open feeding</Button>
              <Button className="stint-action" type="primary" style={styles.saveBtn} onClick={handleSaveClick}>Save file</Button>
              <Upload
                className="stint-action-slot"
                accept=".csv"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleOpenClick({ target: { files: [file] } }, 'stint');
                  return false;
                }}
              >
                <Button className="stint-action" icon={<UploadOutlined />}>Upload file</Button>
              </Upload>
              <Upload
                className="stint-action-slot"
                accept=".csv"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleOpenClick({ target: { files: [file] } }, 'config');
                  return false;
                }}
              >
                <Button className="stint-action" icon={<UploadOutlined />}>Upload config</Button>
              </Upload>
            </div>
          </div>

          <div className="data-table-shell">
            <DataTable stint={{ ...stint, StintID: stintID }} />
            {lastSaveTime && saveFileExists && (
              <div className="last-save-time">Last saved: {new Date(lastSaveTime).toLocaleString()}</div>
            )}
          </div>
        </>
      ) : (
        <FeedingData
          initialFeeding={initialFeeding}
          setFeedings={setFeedings}
          stint={stint}
          feedings={stint.feedingData}
          isOpen={isOpenF}
          onToggle={handleSwitchToFeeding}
          styles={styles}
          config={config}
        />
      )}
    </div>
  );
}

export default StintData;

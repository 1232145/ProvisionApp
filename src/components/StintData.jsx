import React, { useEffect, useState, useMemo, useCallback } from "react";
import Island from "./stintl/Island";
import Species from "./stintl/Species";
import Name from "./stintl/Name";
import ObserverLocation from "./stintl/ObserverLocation";
import DataTable from "./stintl/DataTable";
import Timer from "./Timer";
import Comment from "./Comment";
import { saveAs } from "file-saver";
import FeedingData from "./FeedingData";
import { Button, Row, Col, Upload, Modal, notification, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useAutoSave } from "../hooks/useAutoSave";
const { ipcRenderer } = window.require("electron");

const styles = {
  startStint: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #d9d9d9",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    width: "85%",
    margin: "0.5% auto",
    backgroundColor: "#f9f9f9",
  },

  form: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "20px",
    width: "100%",
  },

  header: {
    marginBottom: "3.5%",
  },

  leftColumn: {
    padding: "20px",
    flex: "1",
    textAlign: "left",
  },

  fixedInfo: {
    marginBottom: "3.5%",
  },

  rightColumn: {
    padding: "20px",
    flex: "1",
    textAlign: "right",
  },

  labelContainer: {
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 0",
    borderBottom: "1px solid #e0e0e0",
  },

  label: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "#333",
    marginRight: "10px",
  },

  btnContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    marginTop: "20px",
    gap: "10px",
    padding: "10px 0",
  },

  navigateBtn: {
    flex: "1",
    backgroundColor: "#1890ff",
    borderColor: "#1890ff",
    color: "white",
    padding: "8px 16px",
    borderRadius: "4px",
    textAlign: "center",
    minWidth: "150px",
  },

  saveBtn: {
    flex: "1",
    backgroundColor: "green",
    borderColor: "green",
    color: "white",
    padding: "8px 16px",
    borderRadius: "4px",
    textAlign: "center",
    minWidth: "150px",
  },

  inputField: {
    width: "60%",
    height: "32px",
    overflowX: "auto",
    marginLeft: "5px",
    fontSize: "14px",
    padding: "4px 8px",
  },

  inputContainer: {
    width: "100%",
    marginBottom: "15px",
  },
};

/**
 * StintData component - Main component for managing stint and feeding data
 * Handles stint information entry, feeding data management, CSV import/export, and auto-save functionality
 * Provides UI for entering observer information, stint details, and switching to feeding data entry
 * @returns {JSX.Element} The main stint data entry interface
 */
function StintData() {
  //feeding data
  const initialFeeding = {
    FeedingID: 1,
    Nest: "",
    Time_Arrive: "",
    Time_Depart: "",
    Provider: "",
    Number_of_Items: [
      {
        Recipient: "",
        Prey_Item: "",
        Prey_Size: "",
      },
    ],
    Plot_Status: "Outside Plot",
    Comment: "",
  };

  //stint data
  const [stint, setStint] = useState({
    StintID: null,
    Stint_Type: "Chick Provisioning",
    Island: "",
    Species: "",
    Prey_Size_Method: "Numeric",
    Prey_Size_Reference: "Culmen length",
    First_Name: "",
    Last_Name: "",
    Observer_Location: "",
    Date_Time_Start: "",
    Date_Time_End: "",
    Comment: "", 
    feedingData: [initialFeeding],
  });

  const [config, setConfig] = useState(null);

  // Memoize config processing to prevent expensive re-parsing
  const processedConfig = useMemo(() => {
    if (!config) return null;
    
    // Config is already processed by configToJson, but we can add additional optimizations here
    return config;
  }, [config]);

  const [stintID, setStintID] = useState(
    `${stint.Island}-${stint.Species}-${stint.Date_Time_Start}-${stint.First_Name} ${stint.Last_Name}`
  );

  //display stintl/feeding data
  const [isOpenF, setIsOpenF] = useState(false);

  // Auto-save file status
  const [saveFileExists, setSaveFileExists] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);


  /**
   * Sets the island value in the stint data state
   * @param {string} val - The island name to set
   */
  const setIsland = useCallback((val) => {
    setStint(prev => ({ ...prev, Island: val }));
  }, []);

  /**
   * Sets the species value in the stint data state
   * @param {string} val - The species name to set
   */
  const setSpecies = useCallback((val) => {
    setStint(prev => ({ ...prev, Species: val }));
  }, []);

  /**
   * Sets the first and last name in the stint data state
   * Supports both string format (full name) and object format ({First_Name, Last_Name})
   * @param {string|object} val - Either a full name string or an object with First_Name and Last_Name properties
   */
  const setName = useCallback((val) => {
    // backward compatibility: if a single string is provided, try splitting
    if (typeof val === 'string') {
      const parts = val.trim().split(/\s+/);
      const first = parts[0] || "";
      const last = parts.slice(1).join(" ") || "";
      setStint(prev => ({ ...prev, First_Name: first, Last_Name: last }));
    } else if (val && typeof val === 'object') {
      setStint(prev => ({ ...prev, First_Name: val.First_Name || "", Last_Name: val.Last_Name || "" }));
    } else {
      setStint(prev => ({ ...prev, First_Name: "", Last_Name: "" }));
    }
  }, []);

  /**
   * Sets the observer location value in the stint data state
   * @param {string} val - The observer location to set
   */
  const setObserverLocation = useCallback((val) => {
    setStint(prev => ({ ...prev, Observer_Location: val }));
  }, []);

  /**
   * Sets the start date/time for the stint
   * @param {string} time - The date/time string for when the stint started
   */
  const setTimeArrive = useCallback((time) => {
    setStint(prev => ({ ...prev, Date_Time_Start: time }));
  }, []);

  /**
   * Sets the end date/time for the stint
   * @param {string} time - The date/time string for when the stint ended
   */
  const setTimeDepart = useCallback((time) => {
    setStint(prev => ({ ...prev, Date_Time_End: time }));
  }, []);

  /**
   * Sets the feeding data array in the stint data state
   * @param {Array|Function} value - Array of feeding data objects or a function that returns an array
   */
  const setFeedings = useCallback((value) => {
    if (typeof value === 'function') {
      // If value is a function, call it with current feedingData
      setStint(prev => {
        const currentFeedings = Array.isArray(prev.feedingData) ? prev.feedingData : [];
        const newFeedings = value(currentFeedings);
        const feedingsArray = Array.isArray(newFeedings) ? newFeedings : [];
        return { ...prev, feedingData: feedingsArray };
      });
    } else {
      // Ensure value is always an array
      const feedingsArray = Array.isArray(value) ? value : [];
      setStint(prev => ({ ...prev, feedingData: feedingsArray }));
    }
  }, []);

  /**
   * Sets the comment text in the stint data state
   * @param {string} value - The comment text to set
   */
  const setComment = useCallback((value) => {
    setStint(prev => ({ ...prev, Comment: value }));
  }, []);

  /**
   * Toggles between stint data view and feeding data view
   * Also triggers auto-save when switching views
   */
  const handleSwitchToFeeding = () => {
    setIsOpenF(!isOpenF);
    // Auto-save when switching between stint and feeding
    ipcRenderer.send("autosave", stint);
  };

  /**
   * Checks if a CSV value needs to be quoted (contains special characters or leading/trailing whitespace)
   * @param {*} value - The value to check
   * @returns {boolean} True if the value needs quoting in CSV format
   */
  const csvNeedsQuoting = (value) => {
    const s = value == null ? "" : String(value);
    return /[",\n\r]/.test(s) || /^\s|\s$/.test(s);
  };

  /**
   * Escapes a value for CSV format by doubling quotes and wrapping in quotes if needed
   * @param {*} value - The value to escape
   * @returns {string} The escaped CSV value
   */
  const csvEscape = (value) => {
    const s = value == null ? "" : String(value);
    const escaped = s.replace(/"/g, '""');
    return csvNeedsQuoting(escaped) ? `"${escaped}"` : escaped;
  };

  /**
   * Converts an array of rows to a CSV string
   * @param {Array<Array>} rows - Array of row arrays, where each row is an array of values
   * @returns {string} CSV formatted string
   */
  const csvStringifyRows = (rows) => rows.map((row) => row.map(csvEscape).join(",")).join("\n");

  /**
   * Parses a CSV string into a 2D array of rows and columns
   * Handles quoted fields, escaped quotes, and newlines within quoted fields
   * @param {string} text - The CSV string to parse
   * @returns {Array<Array<string>>} Array of rows, where each row is an array of field values
   */
  const csvParse = (text) => {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          const next = text[i + 1];
          if (next === '"') {
            field += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          field += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          row.push(field);
          field = "";
        } else if (ch === '\n') {
          row.push(field);
          rows.push(row);
          row = [];
          field = "";
        } else if (ch === '\r') {
          // ignore CR
        } else {
          field += ch;
        }
      }
    }
    // flush last field/row
    if (inQuotes) {
      // unclosed quote - treat as literal
      inQuotes = false;
    }
    row.push(field);
    // only push row if it has any content
    if (row.length > 1 || (row.length === 1 && row[0] !== "")) {
      rows.push(row);
    }
    return rows;
  };

  /**
   * Converts a stint JSON object to CSV format
   * Creates a flattened CSV where each row represents one feeding item
   * @param {object} json - The stint data object containing stint info and feedingData array
   * @returns {string} CSV formatted string ready for file download
   */
  const jsonToCSV = (json) => {
    const header = [
      "StintID",
      "Stint_Type",
      "Island",
      "Species",
      "Prey_Size_Method",
      "Prey_Size_Reference",
      "First_Name",
      "Last_Name",
      "Observer_Location",
      "Date_Time_Start",
      "Date_Time_End",
      "Stint_Comment",
      "FeedingID",
      "Nest",
      "Time_Arrive",
      "Time_Depart",
      "Provider",
      "Recipient",
      "Prey_Item",
      "Prey_Size",
      "Number_of_Items",
      "Plot_Status",
      "Feeding_Comment",
    ];
    const csvRows = [header];

    const feedingDataArray = Array.isArray(json.feedingData) ? json.feedingData : [];
    feedingDataArray.forEach((feeding) => {
      feeding.Number_of_Items.forEach((item) => {
        //careful with Number_of_Items as it is not an integer anymore but JSON so feeding.Number_of_Items.length
        const row = [
          json.StintID,
          json.Stint_Type,
          json.Island,
          json.Species,
          json.Prey_Size_Method,
          json.Prey_Size_Reference,
          json.First_Name,
          json.Last_Name,
          json.Observer_Location,
          json.Date_Time_Start,
          json.Date_Time_End,
          json.Comment,
          feeding.FeedingID,
          feeding.Nest,
          feeding.Time_Arrive,
          feeding.Time_Depart,
          feeding.Provider,
          item.Recipient,
          item.Prey_Item,
          item.Prey_Size,
          feeding.Number_of_Items.length,
          feeding.Plot_Status,
          feeding.Comment,
        ];
        csvRows.push(row);
      });
    });

    return csvStringifyRows(csvRows);
  };

  /**
   * Converts CSV data to stint JSON object with validation
   * @param {string} csv - CSV data as a string
   * @returns {object|null} JSON object or null if format is incorrect
   */
  function csvToJson(csv) {
    const rowsRaw = csvParse(csv);
    // filter out completely empty rows
    const rows = rowsRaw.filter((r) => r.some((v) => (v ?? '').trim() !== ''));
    if (rows.length < 2) {
      console.error("Invalid CSV: Not enough data.");
      return stint;
    }

    // Define the required headers in order
    const requiredHeaders = [
      "StintID",
      "Stint_Type",
      "Island",
      "Species",
      "Prey_Size_Method",
      "Prey_Size_Reference",
      // support either split or legacy Name
      "First_Name",
      "Last_Name",
      "Observer_Location",
      "Date_Time_Start",
      "Date_Time_End",
      "Stint_Comment",
      "FeedingID",
      "Nest",
      "Time_Arrive",
      "Time_Depart",
      "Provider",
      "Recipient",
      "Prey_Item",
      "Prey_Size",
      "Number_of_Items",
      "Plot_Status",
      "Feeding_Comment",
    ];

    // Extract headers from CSV
    const headers = rows[0].map((header) => String(header).trim());

    // Validate headers
    const hasSplitName = headers.includes("First_Name") && headers.includes("Last_Name");
    const hasLegacyName = headers.includes("Name");
    const missingHeaders = requiredHeaders.filter((header) => {
      if (header === "First_Name" || header === "Last_Name") {
        return !(hasSplitName || hasLegacyName);
      }
      return !headers.includes(header);
    });
    if (missingHeaders.length > 0) {
      message.error(
        `Invalid CSV: Missing headers -> ${missingHeaders.join(", ")}`
      );
      return stint;
    }
    const headerIndex = headers.reduce((acc, key, idx) => {
      acc[key] = idx;
      return acc;
    }, {});

    const dataRows = rows.slice(1);

    // Group feeding rows by FeedingID preserving first-seen order
    const feedingMap = new Map();
    const feedingOrder = [];
    for (const values of dataRows) {
      const get = (key) => {
        const i = headerIndex[key];
        return i == null ? null : (values[i] ?? null);
      };
      const feedingID = get("FeedingID");
      if (!feedingID) continue;
      if (!feedingMap.has(feedingID)) {
        feedingMap.set(feedingID, {
          FeedingID: feedingID,
          Nest: get("Nest"),
          Time_Arrive: get("Time_Arrive"),
          Time_Depart: get("Time_Depart"),
          Provider: get("Provider"),
          Plot_Status: get("Plot_Status"),
          Comment: get("Feeding_Comment"),
          Number_of_Items: [],
        });
        feedingOrder.push(feedingID);
      }
      const hasItem = (get("Recipient") || get("Prey_Item") || get("Prey_Size"));
      if (hasItem) {
        feedingMap.get(feedingID).Number_of_Items.push({
          Recipient: get("Recipient"),
          Prey_Item: get("Prey_Item"),
          Prey_Size: get("Prey_Size"),
        });
      }
    }

    const feedingData = feedingOrder.map((id) => feedingMap.get(id));

    const firstRow = dataRows[0] || [];
    const pick = (key) => {
      const i = headerIndex[key];
      return i == null ? null : (firstRow[i] ?? null);
    };

    const firstName = hasSplitName ? pick("First_Name") : (pick("Name") || "").split(/\s+/)[0] || "";
    const lastName = hasSplitName ? pick("Last_Name") : (() => {
      const nm = pick("Name") || "";
      const parts = nm.trim().split(/\s+/);
      return parts.slice(1).join(" ") || "";
    })();

    const jsonObject = {
      StintID: pick("StintID"),
      Stint_Type: pick("Stint_Type"),
      Island: pick("Island"),
      Species: pick("Species"),
      Prey_Size_Method: pick("Prey_Size_Method"),
      Prey_Size_Reference: pick("Prey_Size_Reference"),
      First_Name: firstName,
      Last_Name: lastName,
      Observer_Location: pick("Observer_Location"),
      Date_Time_Start: pick("Date_Time_Start"),
      Date_Time_End: pick("Date_Time_End"),
      Comment: pick("Stint_Comment"),
      feedingData: feedingData,
    };

    return jsonObject;
  }

  /**
   * Converts CSV config file data to a JSON object
   * Parses the config CSV and extracts unique values for each column (e.g., Species, Island, etc.)
   * @param {string} csv - CSV string from the config file
   * @returns {object|null} Config object with arrays of values for each column, or null if format is incorrect
   */
  function configToJson(csv) {
    const rowsRaw = csvParse(csv);
    const rows = rowsRaw.filter((r) => r.some((v) => (v ?? '').trim() !== ''));
    if (rows.length < 2) {
      console.error("Invalid CSV: Not enough data.");
      return config;
    }

    const requiredHeaders = [
      "Name",
      "Island",
      "ObserverLocation",
      "Nest",
      "Provider",
      "Recipient",
      "PreySize",
      "PreyItem",
      "Species",
    ];
    const headers = rows[0].map((header) => String(header).trim());

    // Check if all required headers exist
    const missingHeaders = requiredHeaders.filter(
      (header) => !headers.includes(header)
    );
    if (missingHeaders.length > 0) {
      message.error(
        `Invalid CSV: Missing headers -> ${missingHeaders.join(", ")}`
      );
      return config;
    }

    const json = {};
    headers.forEach((key, index) => {
      const values = rows
        .slice(1)
        .map((r) => (r[index] == null ? "" : String(r[index]).trim()))
        .filter((value) => value !== "");

      // Store all values for each key
      json[key] = values;
    });

    return json;
  }

  /**
   * Handles the save button click event
   * Validates all required fields are filled, converts stint data to CSV, and triggers file download
   * Shows error modal if any required fields are missing
   */
  const handleSaveClick = () => {
    let csv = "";
    let data = stint;
    data.StintID = stintID;
    const emptyFields = [];
    const excludeKey = ["Comment"]; //this can be missing in data

    //Check for missing fields in stint data
    Object.entries(data).forEach(([key, value]) => {
      if (value === "" && !excludeKey.includes(key)) {
        emptyFields.push(`Stint: ${key}`);
      }
    });

    // Check for missing fields in feeding data
    const feedingDataArray = Array.isArray(data.feedingData) ? data.feedingData : [];
    feedingDataArray.forEach((feeding, feedingIndex) => {
      Object.keys(feeding).forEach((key) => {
        if (Array.isArray(feeding[key])) {
          feeding[key].forEach((item, itemIndex) => {
            Object.keys(item).forEach((itemKey) => {
              if (item[itemKey] === "") {
                emptyFields.push(
                  `Feeding ${feedingIndex + 1}, Item ${
                    itemIndex + 1
                  }: ${itemKey}`
                );
              }
            });
          });
        } else {
          if (feeding[key] === "" && !excludeKey.includes(key)) {
            emptyFields.push(`Feeding ${feedingIndex + 1}: ${key}`);
          }
        }
      });
    });

    if (emptyFields.length > 0) {
      Modal.error({
        title: "Missing Required Fields",
        content: (
          <div style={{ overflowY: "auto" }}>
            <p>Please fill in the following fields:</p>
            <ul>
              {emptyFields.map((field, index) => (
                <li key={index}>{field}</li>
              ))}
            </ul>
          </div>
        ),
      });
      return;
    }

    // If all information is filled
    csv += jsonToCSV(data);

    const file = new Blob([csv], { type: "text/csv;charset=utf-8" });

    const dowloadName = stintID;

    saveAs(file, dowloadName);
  };

  /**
   * Handles file upload/opening for both stint CSV files and config CSV files
   * Reads the file, parses CSV, and updates the appropriate state
   * @param {Event} event - File input change event
   * @param {string} type - Type of file: "stint" for stint data CSV or "config" for config CSV
   */
  const handleOpenClick = (event, type) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const csv = e.target.result;

          if (type === "stint") {
            const stint = csvToJson(csv);
            // Ensure feedingData is always an array
            const safeStint = {
              ...stint,
              feedingData: Array.isArray(stint.feedingData) ? stint.feedingData : [initialFeeding]
            };
            setStint(safeStint);
          } else if (type === "config") {
            const config = configToJson(csv);
            setConfig(config);
          }
        } catch (error) {
          message.error("Error parsing CSV:", error);
          alert("Error processing the CSV file. Please check the format.");
        }
      };

      reader.onerror = (error) => {
        message.error("Error reading file:", error);
        alert("Error reading the CSV file.");
      };

      reader.readAsText(file);
    } catch (error) {
      message.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  /**
   * Loads the last auto-saved data from the file system
   * Communicates with Electron main process to retrieve auto-save file
   * Shows success/error notifications based on the result
   */
  const handleLoadLastSave = () => {
    try {
      ipcRenderer.removeAllListeners("load-auto-save");
      ipcRenderer.send("check-auto-save");

      ipcRenderer.on("load-auto-save", (event, data) => {
        try {
          if (data) {
            // Ensure feedingData is always an array
            const safeData = {
              ...data,
              feedingData: Array.isArray(data.feedingData) ? data.feedingData : [initialFeeding]
            };
            setStint(safeData);
            notification.success({
              message: "Data Loaded",
              description: "Auto-save data loaded successfully.",
              placement: "topRight",
              duration: 2,
            });
          } else {
            notification.info({
              message: "No Auto-Save Data",
              description: "No auto-save data found.",
              placement: "topRight",
              duration: 1.5,
            });
          }
        } catch (error) {
          message.error("Error loading auto-save data:", error);
          alert("Error loading auto-save data.");
        }
      });
    } catch (error) {
      message.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  //detect change in stint to create stintID
  useEffect(() => {
    setStintID(
      `${stint.Island}-${stint.Species}-${stint.Date_Time_Start}-${stint.First_Name} ${stint.Last_Name}`
        .replace(/\s+/g, "-")
    );
  }, [stint]);

  // Initialize debounced auto-save hook (1 second delay)
  const debouncedAutoSave = useAutoSave(1000);

  // Auto-save whenever stint data changes (debounced)
  useEffect(() => {
    debouncedAutoSave(stint);
  }, [stint, debouncedAutoSave]);

  // Listen for save file status updates
  useEffect(() => {
    const handleSaveFileStatus = (event, { exists, lastModified }) => {
      // Only update state if values actually changed to prevent unnecessary re-renders
      setSaveFileExists(prevExists => prevExists !== exists ? exists : prevExists);
      setLastSaveTime(prevTime => prevTime !== lastModified ? lastModified : prevTime);
    };

    ipcRenderer.on("save-file-status", handleSaveFileStatus);

    return () => {
      ipcRenderer.removeListener("save-file-status", handleSaveFileStatus);
    };
  }, []);

  // Component initialization - check if save file exists
  useEffect(() => {
    checkSaveFileExists();
  }, []);

  /**
   * Checks if an auto-save file exists on the file system
   * Sends IPC message to Electron main process to check for save file
   */
  const checkSaveFileExists = () => {
    ipcRenderer.send("check-save-file-exists");
  };

  useEffect(() => {
    ipcRenderer.on("warn-close", () => {
      const shouldClose = window.confirm(
        "You have unsaved changes. Are you sure you want to exit?"
      );

      if (shouldClose) {
        // Send confirmation to main process to close the window
        ipcRenderer.send("confirm-close");
      }
    });

    // Cleanup when the component is unmounted
    return () => {
      ipcRenderer.removeAllListeners("warn-close");
    };
  }, []);

  return (
    <div>
      {!isOpenF ? (
        <>
          <div style={styles.startStint}>
            <h1 style={styles.header}>Provisioning App</h1>
            <Row gutter={16} style={styles.form}>
              <Col xs={24} md={12} style={styles.leftColumn}>
                <div style={styles.fixedInfo}>
                  <div style={styles.labelContainer}>
                    <span style={styles.label}>StintID:</span>
                    {stintID}
                  </div>
                  <div style={styles.labelContainer}>
                    <span style={styles.label}>Stint type:</span>{" "}
                    {stint.Stint_Type}
                  </div>
                  <div style={styles.labelContainer}>
                    <span style={styles.label}>Prey size method:</span>{" "}
                    {stint.Prey_Size_Method}
                  </div>
                  <div style={styles.labelContainer}>
                    <span style={styles.label}>Prey size reference:</span>{" "}
                    {stint.Prey_Size_Reference}
                  </div>
                </div>
                <Island
                  setIsland={setIsland}
                  data={stint.Island}
                  styles={styles}
                  config={processedConfig}
                />
                <Species
                  setSpecies={setSpecies}
                  data={stint.Species}
                  styles={styles}
                  config={processedConfig}
                />
                <Comment
                  setComment={setComment}
                  data={stint.Comment}
                  styles={styles}
                />
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
                <Timer
                  setTime={setTimeArrive}
                  data={stint.Date_Time_Start}
                  label="Start Stint Time"
                  description="Start Stint Time"
                  styles={styles}
                  hasInput={false}
                  hasButton={false}
                />
                <Timer
                  setTime={setTimeDepart}
                  data={stint.Date_Time_End}
                  label="End Stint Time"
                  description="End Stint Time"
                  styles={styles}
                  hasInput={false}
                  hasButton={false}
                />
              </Col>
            </Row>

            {/* Button and File Input */}
            <div style={styles.btnContainer}>
              <Button
                type="primary"
                style={{ ...styles.navigateBtn, flex: 1, marginRight: "10px" }} // Adjust margin as needed
                onClick={() => handleSwitchToFeeding()}
              >
                {!isOpenF ? "Open Feeding" : "Back to Stint"}
              </Button>
              <Button
                type="primary"
                style={{ ...styles.saveBtn, flex: 1, marginRight: "10px" }} // Adjust margin as needed
                onClick={handleSaveClick}
              >
                Save file
              </Button>
              <Upload
                accept=".csv"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleOpenClick({ target: { files: [file] } }, "stint");
                  return false; // Prevent automatic upload
                }}
                style={{ flex: 1, marginRight: "10px" }} // Adjust margin as needed
              >
                <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                  Upload File
                </Button>
              </Upload>
              <Upload
                accept=".csv"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleOpenClick({ target: { files: [file] } }, "config");
                  return false; // Prevent automatic upload
                }}
                style={{ flex: 1 }} // No margin needed here to fill space
              >
                <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                  Upload Config
                </Button>
              </Upload>
            </div>

            <div style={{ maxWidth: "100%", overflowX: "auto" }}>
              <DataTable stint={stint} />
              
              {/* Conditional Load Save Button */}
              {saveFileExists && (
                <div style={{ marginTop: "10px" }}>
                  <Button
                    style={{ width: "100%", marginBottom: "8px" }}
                    onClick={() => handleLoadLastSave()}
                  >
                    Load Save
                  </Button>
                  {lastSaveTime && (
                    <div style={{ 
                      textAlign: "center", 
                      fontSize: "12px", 
                      color: "#666",
                      fontStyle: "italic"
                    }}>
                      Last saved: {new Date(lastSaveTime).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
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
          </div>
        </>
      )}
    </div>
  );
}

export default StintData;

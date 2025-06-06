// Convert camelCase or snake_case keys to readable labels
function toReadableLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

// Format date to dd/mm/yyyy
function formatDate(dateString) {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (e) {
    return dateString; // Return original if parsing fails
  }
}

// Clear the General Info container
function clearGeneralInfoTable() {
  const container = document.getElementById("general-info-container");
  if (container) {
    container.innerHTML = "";
  }
}

// Create and manage the back button
let createdBackButton = null;

function createBackButton() {
  if (createdBackButton) return createdBackButton;

  const backBtn = document.createElement("button");
  backBtn.id = "dynamic-back-btn";
  backBtn.textContent = "Back";
  backBtn.style.cssText = `
    display: none;
    margin: 20px auto;
    padding: 10px 20px;
    background-color: #3774A5;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  `;

  backBtn.addEventListener("mouseover", () => {
    backBtn.style.backgroundColor = "#0056b3";
  });

  backBtn.addEventListener("mouseout", () => {
    backBtn.style.backgroundColor = "#3774A5";
  });

  backBtn.addEventListener("click", () => {
    clearGeneralInfoTable();
    showAllButtons();
    currentCategory = null;
  });

  document.body.appendChild(backBtn);
  createdBackButton = backBtn;
  return backBtn;
}

// Hide all buttons except back button
function hideAllButtonsExceptBack() {
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.style.display = "none";
  });

  document
    .querySelectorAll(".controls-container > *:not(#general-info-heading)")
    .forEach((element) => {
      element.style.display = "none";
    });

  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const fetchBtn = document.getElementById("fetch-btn");

  if (startDateInput) startDateInput.style.display = "none";
  if (endDateInput) endDateInput.style.display = "none";
  if (fetchBtn) fetchBtn.style.display = "none";

  document.querySelectorAll("button:not(#dynamic-back-btn)").forEach((btn) => {
    btn.style.display = "none";
  });

  if (createdBackButton) {
    createdBackButton.style.display = "block";
  }
}

// Show all buttons and controls (reset to initial state)
function showAllButtons() {
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.style.display = "";
  });

  document.querySelectorAll(".controls-container > *").forEach((element) => {
    element.style.display = "";
  });

  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const fetchBtn = document.getElementById("fetch-btn");

  if (startDateInput) startDateInput.style.display = "";
  if (endDateInput) endDateInput.style.display = "";
  if (fetchBtn) fetchBtn.style.display = "";

  document.querySelectorAll("button:not(#dynamic-back-btn)").forEach((btn) => {
    btn.style.display = "";
  });

  if (createdBackButton) {
    createdBackButton.style.display = "none";
    createdBackButton.remove();
    createdBackButton = null;
  }
}

// Create properly formatted CSV with wide columns
function createCSVFromGeneralInfo(dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length === 0) return "";
  
  const csvRows = [];
  
  // Add UTF-8 BOM and separator declaration for Excel
  csvRows.push("\uFEFFsep=,");
  
  // Add header
  csvRows.push('"#","Field","Value"');
  
  // Helper function to properly escape CSV values
  const escapeCsv = (value) => {
    if (value === null || value === undefined) return '';
    return `"${String(value).replace(/"/g, '""')}"`;
  };

  dataArray.forEach((data) => {
    // Format dates for CSV
    const formattedPeriodStart = formatDate(data.periodStart);
    const formattedPeriodEnd = formatDate(data.periodEnd);
    
    // Add main fields
    csvRows.push(`1,${escapeCsv("Name of the DISCOM")},${escapeCsv(data.nameOfDiscom)}`);
    csvRows.push(`2,${escapeCsv("i) Year of Establishment")},${escapeCsv(data.yearOfEstablishment)}`);
    csvRows.push(`2,${escapeCsv("ii) Government/Public/Private")},${escapeCsv(data.ownershipType)}`);
    
    // Add contact details
    csvRows.push(`3,${escapeCsv("DISCOM's Contact details & Address")},`);
    csvRows.push(`i,${escapeCsv("City/Town/Village")},${escapeCsv(data.contactCity)}`);
    csvRows.push(`ii,${escapeCsv("District")},${escapeCsv(data.contactDistrict)}`);
    csvRows.push(`iii,${escapeCsv("State")},${escapeCsv(data.contactState)},Pin,${escapeCsv(data.contactPin)}`);
    csvRows.push(`iv,${escapeCsv("Telephone")},${escapeCsv(data.contactTelephone)},Fax,${escapeCsv(data.contactFax)}`);
    
    // Add registered office details
    csvRows.push(`4,${escapeCsv("Registered Office")},`);
    csvRows.push(`i,${escapeCsv("Company's Chief Executive Name")},${escapeCsv(data.ceoName)}`);
    csvRows.push(`ii,${escapeCsv("Designation")},${escapeCsv(data.ceoDesignation)}`);
    csvRows.push(`iii,${escapeCsv("Address")},${escapeCsv(data.ceoAddress)}`);
    csvRows.push(`iv,${escapeCsv("City/Town/Village")},${escapeCsv(data.ceoCity)},P.O.,${escapeCsv(data.ceoPO)}`);
    csvRows.push(`v,${escapeCsv("District")},${escapeCsv(data.ceoDistrict)}`);
    csvRows.push(`vi,${escapeCsv("State")},${escapeCsv(data.ceoState)},Pin,${escapeCsv(data.ceoPin)}`);
    csvRows.push(`vii,${escapeCsv("Telephone")},${escapeCsv(data.ceoTelephone)},Fax,${escapeCsv(data.ceoFax)}`);
    
    // Add nodal officer details
    csvRows.push(`5,${escapeCsv("Nodal Officer Details*")},`);
    csvRows.push(`i,${escapeCsv("Nodal Officer Name (Designated at DISCOM's)")},${escapeCsv(data.nodalOfficerName)}`);
    csvRows.push(`ii,${escapeCsv("Designation")},${escapeCsv(data.nodalOfficerDesignation)}`);
    csvRows.push(`iii,${escapeCsv("Address")},${escapeCsv(data.nodalOfficerAddress)}`);
    csvRows.push(`iv,${escapeCsv("City/Town/Village")},${escapeCsv(data.nodalOfficerCity)},P.O.,${escapeCsv(data.nodalOfficerPO)}`);
    csvRows.push(`v,${escapeCsv("District")},${escapeCsv(data.nodalOfficerDistrict)}`);
    csvRows.push(`vi,${escapeCsv("State")},${escapeCsv(data.nodalOfficerState)},Pin,${escapeCsv(data.nodalOfficerPin)}`);
    csvRows.push(`vii,${escapeCsv("Telephone")},${escapeCsv(data.nodalOfficerTelephone)},Fax,${escapeCsv(data.nodalOfficerFax)}`);
    
    // Add energy manager details
    csvRows.push(`6,${escapeCsv("Energy Manager Details*")},`);
    csvRows.push(`i,${escapeCsv("Name")},,${escapeCsv(data.energyManagerName)}`);
    csvRows.push(`ii,${escapeCsv("Designation")},${escapeCsv(data.energyManagerDesignation)},Whether EA or EM,${escapeCsv(data.energyManagerType)}`);
    csvRows.push(`iii,${escapeCsv("EA/EM Registration No.")},,${escapeCsv(data.energyManagerRegNo)}`);
    csvRows.push(`iv,${escapeCsv("Telephone")},,Fax,${escapeCsv(data.energyManagerFax)}`);
    csvRows.push(`v,${escapeCsv("Mobile")},${escapeCsv(data.energyManagerMobile)},E-mail ID,${escapeCsv(data.energyManagerEmail)}`);
    
    // Add period of information
    csvRows.push(`7,${escapeCsv("Period of Information")},`);
    csvRows.push(`,${escapeCsv("Year of (FY) information including Date and Month (Start & End)")},${escapeCsv(formattedPeriodStart)} - ${escapeCsv(formattedPeriodEnd)}`);
  });
  
  return csvRows.join("\n");
}

// Create Download Button with proper Excel formatting
function createDownloadButton(dataArray) {
  const csvData = createCSVFromGeneralInfo(dataArray);
  
  // Create a Blob with the CSV data
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const downloadBtn = document.createElement("a");
  downloadBtn.href = url;
  downloadBtn.download = "general_info.csv";
  downloadBtn.textContent = "Download Excel";
  downloadBtn.style.cssText = `
    display: block;
    margin: 10px auto 20px auto;
    padding: 8px 12px;
    background-color: #3374A5;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    width: 100px;
    text-align: center;
    box-sizing: border-box;
    text-decoration: none;
  `;

  downloadBtn.addEventListener("mouseover", () => {
    downloadBtn.style.backgroundColor = "#0056b3";
  });

  downloadBtn.addEventListener("mouseout", () => {
    downloadBtn.style.backgroundColor = "#3374A5";
  });

  return downloadBtn;
}

// Display General Info array with formatted dates
function displayGeneralInfoArray(dataArray) {
  let container = document.getElementById("general-info-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "general-info-container";
    container.style.cssText = `
      width: 100%;
      max-width: 1200px;
      margin: 20px auto;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;
    document.body.appendChild(container);
  }

  container.innerHTML = "";

  const heading = document.createElement("h2");
  heading.textContent = "General Info";
  heading.style.cssText = `
    text-align: center;
    margin-bottom: 20px;
    color: #333;
    font-size: 24px;
  `;
  container.appendChild(heading);

  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const startDate = formatDate(startDateInput ? startDateInput.value : "");
  const endDate = formatDate(endDateInput ? endDateInput.value : "");

  const dateRangeDiv = document.createElement("div");
  dateRangeDiv.style.cssText = `
    text-align: center;
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: bold;
    color: #666;
  `;
  dateRangeDiv.textContent = `Data for: ${startDate || "N/A"} to ${
    endDate || "N/A"
  }`;
  container.appendChild(dateRangeDiv);

  const periodTable = document.createElement("table");
  periodTable.style.cssText = `
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    background-color: white;
  `;

  const periodData = {
    "Period Start": startDate || "N/A",
    "Period End": endDate || "N/A",
  };

  for (const key in periodData) {
    const row = document.createElement("tr");

    const cellKey = document.createElement("td");
    cellKey.textContent = key;
    cellKey.style.cssText = `
      font-weight: bold;
      border: 1px solid #ddd;
      padding: 12px;
      width: 40%;
      background-color: #f0f0f0;
    `;

    const cellValue = document.createElement("td");
    cellValue.textContent = periodData[key];
    cellValue.style.cssText = `
      border: 1px solid #ddd;
      padding: 12px;
    `;

    row.appendChild(cellKey);
    row.appendChild(cellValue);
    periodTable.appendChild(row);
  }

  container.appendChild(periodTable);

  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    const noDataMsg = document.createElement("div");
    noDataMsg.textContent = "No General Info data available.";
    noDataMsg.style.cssText = `
      text-align: center;
      padding: 20px;
      font-style: italic;
      color: #666;
    `;
    container.appendChild(noDataMsg);
    return;
  }

  dataArray.forEach((data, index) => {
    const table = document.createElement("table");
    table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      margin-bottom: 30px;
      background-color: white;
    `;

    if (dataArray.length > 1) {
      const recordTitle = document.createElement("h3");
      recordTitle.textContent = `Record ${index + 1}`;
      recordTitle.style.cssText = `
        color: #333;
        margin-top: 20px;
        margin-bottom: 10px;
      `;
      container.appendChild(recordTitle);
    }

    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key] !== null && key !== "id") {
        const row = document.createElement("tr");

        const cellKey = document.createElement("td");
        cellKey.textContent = toReadableLabel(key);
        cellKey.style.cssText = `
          font-weight: bold;
          border: 1px solid #ddd;
          padding: 12px;
          width: 40%;
          background-color: #f8f9fa;
        `;

        const cellValue = document.createElement("td");
        // Format date fields appropriately
        let displayValue = data[key];
        if (key.toLowerCase().includes("date") || key.toLowerCase().includes("period")) {
          displayValue = formatDate(data[key]);
        }
        cellValue.textContent = displayValue;
        cellValue.style.cssText = `
          border: 1px solid #ddd;
          padding: 12px;
        `;

        row.appendChild(cellKey);
        row.appendChild(cellValue);
        table.appendChild(row);
      }
    }

    container.appendChild(table);
  });

  const downloadBtn = createDownloadButton(dataArray);
  container.appendChild(downloadBtn);

  const backBtn = createBackButton();
  container.appendChild(backBtn);
  backBtn.style.display = "block";

  hideAllButtonsExceptBack();
}

// Fetch General Info
async function fetchGeneralInfo() {
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const startDate = startDateInput ? startDateInput.value : "";
  const endDate = endDateInput ? endDateInput.value : "";

  if (!startDate || !endDate) {
    alert("Please select both start and end dates.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:8080/api/data/general-info",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 204) {
      alert("No General Info data found.");
      clearGeneralInfoTable();
      return;
    }

    if (!response.ok) throw new Error("Failed to fetch General Info");

    const data = await response.json();
    displayGeneralInfoArray(data);
  } catch (error) {
    console.error("Error fetching General Info:", error);
    alert("Error fetching General Info. Check console.");
  }
}

// Track selected category
let currentCategory = null;

function setCategory(category) {
  if (currentCategory !== category) {
    if (currentCategory === "general-info") {
      clearGeneralInfoTable();
    }
    currentCategory = category;
  }
}

// Setup buttons
function setupCategoryButtons() {
  const buttons = document.querySelectorAll(".category-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.id === "general-info-btn") {
        setCategory("general-info");
      } else {
        const cat = btn.getAttribute("data-category") || "other";
        setCategory(cat);
      }
    });
  });
}

function setupFetchButton() {
  const fetchBtn = document.getElementById("fetch-btn");
  if (!fetchBtn) return;

  fetchBtn.addEventListener("click", () => {
    if (currentCategory === "general-info") {
      fetchGeneralInfo();
    } else {
      clearGeneralInfoTable();
    }
  });
}

// Init on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  setupCategoryButtons();
  setupFetchButton();
});
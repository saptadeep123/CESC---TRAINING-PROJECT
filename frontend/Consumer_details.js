document.addEventListener("DOMContentLoaded", () => {
  // Helper function to format date as dd/mm/yyyy
  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // DOM element references
  const fetchBtn = document.getElementById("fetch-btn");
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const dataTable = document.getElementById("data-table");
  const tableHead = dataTable.querySelector("thead");
  const tableBody = document.getElementById("table-body");
  const clearBtn = document.getElementById("clear-btn");
  const submitBtn = document.getElementById("submit-btn");
  const actionsDiv = document.querySelector(".actions");
  const dateRangeDisplay = document.getElementById("date-range-display");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const backBtn = document.getElementById("back");

  // State variables
  let selectedCategory = null;
  let isConsumerDetailVisible = false;
  let originalData = [];

  // Create dynamic download button
  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "Download Excel";
  downloadBtn.id = "download-btn";
  downloadBtn.className = "btn btn-primary";
  downloadBtn.style.marginLeft = "10px";
  downloadBtn.style.display = "none";
  actionsDiv.appendChild(downloadBtn);

  // Header container for dynamic headings
  const headersContainer = document.createElement("div");
  headersContainer.id = "dynamic-headers-container";
  headersContainer.style.cssText = `
    text-align: center;
    margin-bottom: 20px;
    font-family: Arial, sans-serif;
  `;

  const header1 = document.createElement("h1");
  header1.textContent = "Details of Consumers";
  header1.style.cssText = `
    margin: 0;
    font-size: 28px;
    color: #222;
    font-weight: bold;
  `;

  const header2 = document.createElement("h3");
  header2.textContent = "Summary of Energy";
  header2.style.cssText = `
    margin: 5px 0 10px 0;
    font-size: 20px;
    color: #555;
    font-weight: normal;
  `;

  const header3 = document.createElement("div");
  header3.id = "date-range-header";
  header3.style.cssText = `
    font-size: 16px;
    color: #777;
  `;

  headersContainer.appendChild(header1);
  headersContainer.appendChild(header2);
  headersContainer.appendChild(header3);

  // Helper functions
  function insertHeaders() {
    if (!headersContainer.parentNode) {
      dataTable.parentNode.insertBefore(headersContainer, dataTable);
    }
  }

  function removeHeaders() {
    if (headersContainer.parentNode) {
      headersContainer.parentNode.removeChild(headersContainer);
    }
  }

  function hideAllButtonsExceptBack() {
    categoryButtons.forEach((btn) => (btn.style.display = "none"));
    document
      .querySelectorAll(
        ".controls-container > *:not(#consumer-detail-heading-wrapper)"
      )
      .forEach((el) => {
        if (el.id !== "back") el.style.display = "none";
      });
    if (startDateInput) startDateInput.style.display = "none";
    if (endDateInput) endDateInput.style.display = "none";
    if (fetchBtn) fetchBtn.style.display = "none";
    document
      .querySelectorAll("button:not(#back):not(#clear-btn):not(#submit-btn)")
      .forEach((btn) => {
        btn.style.display = "none";
      });
  }

  function showAllButtons() {
    categoryButtons.forEach((btn) => (btn.style.display = ""));
    document
      .querySelectorAll(".controls-container > *")
      .forEach((el) => (el.style.display = ""));
    if (startDateInput) startDateInput.style.display = "";
    if (endDateInput) endDateInput.style.display = "";
    if (fetchBtn) fetchBtn.style.display = "";
    document
      .querySelectorAll("button:not(#back)")
      .forEach((btn) => (btn.style.display = ""));
    if (backBtn) backBtn.style.display = "none";
    removeHeaders();
    downloadBtn.style.display = "none";
  }

  // Initialize back button
  if (backBtn) backBtn.style.display = "none";

  // Category button event handlers
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const newCategory = button.textContent.trim();
      if (
        (selectedCategory === "Consumer Detail" ||
          selectedCategory === "General Info") &&
        newCategory !== selectedCategory
      ) {
        tableHead.innerHTML = "";
        tableBody.innerHTML = "";
        dataTable.style.display = "none";
        actionsDiv.style.display = "none";
        dateRangeDisplay.style.display = "none";
        isConsumerDetailVisible = false;
        removeHeaders();
        downloadBtn.style.display = "none";
      }
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      selectedCategory = newCategory;
    });
  });

  // Fetch data handler
  fetchBtn.addEventListener("click", async () => {
    if (selectedCategory !== "Consumer Detail") return;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!startDate || !endDate) {
      alert("Please select both dates!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/data/fetch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      originalData = data;

      insertHeaders();
      header3.textContent = `Data for: ${formatDate(startDate)} to ${formatDate(
        endDate
      )}`;
      renderTableHeader();
      renderTable(data);

      dateRangeDisplay.style.display = "block";
      dataTable.style.display = "table";
      actionsDiv.style.display = "flex";
      isConsumerDetailVisible = true;
      hideAllButtonsExceptBack();
      if (backBtn) backBtn.style.display = "block";
      downloadBtn.style.display = "inline-block";
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to retrieve data. Please try again.");
    }
  });

  // Back button handler
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      dataTable.style.display = "none";
      actionsDiv.style.display = "none";
      dateRangeDisplay.style.display = "none";
      tableHead.innerHTML = "";
      tableBody.innerHTML = "";
      startDateInput.value = "";
      endDateInput.value = "";
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      selectedCategory = null;
      isConsumerDetailVisible = false;
      originalData = [];
      showAllButtons();
      removeHeaders();
    });
  }

  // Table rendering functions
  function renderTableHeader() {
    tableHead.innerHTML = "";
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
      <th><input type="checkbox" id="select-all"></th>
      <th>S.No</th>
      <th>Type of Consumers</th>
      <th>Category of Consumers (EHT/HT/LT/Others)</th>
      <th>Voltage Level (In Voltage)</th>
      <th>No of Consumers</th>
      <th>Total Consumption (In MU)</th>
      <th>Remarks (Source of data)</th>
    `;
    tableHead.appendChild(headerRow);

    document.getElementById("select-all").addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      document.querySelectorAll(".row-checkbox").forEach((checkbox) => {
        checkbox.checked = isChecked;
        checkbox.dispatchEvent(new Event("change"));
      });
    });
  }

  function renderTable(data) {
    tableBody.innerHTML = "";
    let totalConsumerCount = 0;
    let totalConsumption = 0;

    data.forEach((item, index) => {
      const consumerCount = parseFloat(item.consumerCount) || 0;
      const totalCons = parseFloat(item.totalConsumption) || 0;
      totalConsumerCount += consumerCount;
      totalConsumption += totalCons;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" class="row-checkbox"></td>
        <td>${item.serialNumber || index + 1}</td>
        <td>${item.consumerType || ""}</td>
        <td>${item.consumerCategory || ""}</td>
        <td><input type="text" value="${item.voltageDescription || ""}" disabled></td>
        <td><input type="text" value="${consumerCount}" disabled></td>
        <td><input type="text" value="${totalCons}" disabled></td>
        <td><input type="text" value="${item.remarks || ""}" disabled></td>
      `;
      tableBody.appendChild(row);
    });

    // Add total row with bold text
    const totalRow = document.createElement("tr");
    totalRow.style.backgroundColor = "grey"; // Light gray background for highlight
    totalRow.innerHTML = `
      <td colspan="5" style="text-align: right;">Total:</td>
      <td><input type="text" value="${totalConsumerCount}" disabled style="font-weight: bold; background-color: #f0f0f0;"></td>
      <td><input type="text" value="${totalConsumption.toFixed(
        2
      )}" disabled style="font-weight: bold; background-color: #f0f0f0;"></td>
      <td></td>
    `;
    tableBody.appendChild(totalRow);

    // Add row checkbox handlers
    document.querySelectorAll(".row-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const row = e.target.closest("tr");
        const inputs = row.querySelectorAll('input[type="text"]');
        if (inputs.length === 4) {
          inputs[0].disabled = true;
          inputs[3].disabled = true;
          inputs[1].disabled = !e.target.checked;
          inputs[2].disabled = !e.target.checked;
          row.classList.toggle("editable-row", e.target.checked);
        }
      });
    });
  }

  // Clear button handler
  clearBtn.addEventListener("click", () => {
    if (selectedCategory === "Consumer Detail") {
      renderTable([...originalData]);
      document.getElementById("select-all").checked = false;
    }
  });

  // Submit button handler
  submitBtn.addEventListener("click", async () => {
    if (selectedCategory !== "Consumer Detail") return;

    const editedRows = [];
    document.querySelectorAll("#table-body tr").forEach((row, index) => {
      const checkbox = row.querySelector(".row-checkbox");
      if (checkbox?.checked) {
        const inputs = row.querySelectorAll('input[type="text"]');
        const id = originalData[index]?.id;
        if (id !== undefined) {
          editedRows.push({
            id,
            consumerCount: parseInt(inputs[1].value, 10),
            totalConsumption: parseFloat(inputs[2].value),
          });
        }
      }
    });

    if (editedRows.length === 0) {
      alert("Please select and edit at least one row before saving.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/data/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedRows),
      });

      if (!response.ok) throw new Error("Failed to save edits.");
      alert("Changes saved successfully!");
      fetchBtn.click();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving changes. Please try again.");
    }
  });

  // Excel Download Functionality

  downloadBtn.addEventListener("click", () => {
    if (selectedCategory !== "Consumer Detail" || originalData.length === 0) {
      alert("No data available to download.");
      return;
    }

    // Load SheetJS library if needed
    if (typeof XLSX === "undefined") {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      script.onload = generateExcel;
      document.head.appendChild(script);
    } else {
      generateExcel();
    }

    function generateExcel() {
      try {
        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const wsData = [];

        // Add empty row at the top for better spacing
        wsData.push([]);

        // Add titles with empty cells for merging (will span all columns)
        //please ignore these long spaces these are to bring the headers at the center in the downloaded excel sheet
        wsData.push([
          "                                                                                                                                                                     Details of Consumers",
          "",
          "",
          "",
          "",
          "",
          "",
        ]);
        wsData.push([
          "                                                                                                                                                                       Summary of Energy",
          "",
          "",
          "",
          "",
          "",
          "",
        ]);
        wsData.push([
          `                                                                                                                                                     Period From ${formatDate(
            startDateInput.value
          )} to ${formatDate(endDateInput.value)}`,
          "",
          "",
          "",
          "",
          "",
          "",
        ]);
        wsData.push([]); // Empty row after titles

        // Add headers (column titles)
        wsData.push([
          "S.No",
          "Type of Consumers",
          "Category of Consumer (EHT/HT/LT/Others)",
          "Voltage Level (in Voltage)",
          "No of Consumers",
          "Total Consumption (in MU)",
          "Remarks (Source of data)",
        ]);

        // Add data rows
        originalData.forEach((item, index) => {
          wsData.push([
            item.serialNumber || index + 1,
            item.consumerType || "",
            item.category || "",
            item.voltageLevel || "",
            item.consumerCount || 0,
            (parseFloat(item.totalConsumption) || 0).toFixed(2),
            item.remarks || "",
          ]);
        });

        // Calculate totals
        const totals = originalData.reduce(
          (acc, item) => {
            acc.consumerCount += parseFloat(item.consumerCount) || 0;
            acc.totalConsumption += parseFloat(item.totalConsumption) || 0;
            return acc;
          },
          { consumerCount: 0, totalConsumption: 0 }
        );

        // Add total row
        wsData.push([
          "",
          "",
          "",
          "Total:",
          totals.consumerCount,
          totals.totalConsumption.toFixed(2),
          "",
        ]);

        // Create worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(wsData);

        // Set column widths
        worksheet["!cols"] = [
          { width: 8 }, // S.No
          { width: 35 }, // Type of Consumers
          { width: 40 }, // Category
          { width: 25 }, // Voltage Level
          { width: 15 }, // No of Consumers
          { width: 22 }, // Total Consumption
          { width: 40 }, // Remarks
        ];

        // Merge cells for the title rows (rows 1-3)
        worksheet["!merges"] = [
          { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }, // Row 1 (Details of Consumers)
          { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } }, // Row 2 (Summary of Energy)
          { s: { r: 3, c: 0 }, e: { r: 3, c: 6 } }, // Row 3 (Date Range)
        ];

        // Apply styles to title rows (rows 1-3)
        for (let row = 1; row <= 3; row++) {
          const cell = XLSX.utils.encode_cell({ r: row, c: 0 });
          if (!worksheet[cell]) {
            worksheet[cell] = { t: "s", v: wsData[row][0] };
          }
          worksheet[cell].s = {
            font: {
              bold: true,
              sz: row === 1 ? 16 : row === 2 ? 14 : 12,
            },
            alignment: {
              horizontal: "center",
              vertical: "center",
            },
          };
        }

        // Style the header row (row 5)
        for (let col = 0; col < 7; col++) {
          const cell = XLSX.utils.encode_cell({ r: 5, c: col });
          if (worksheet[cell]) {
            worksheet[cell].s = {
              font: { bold: true, color: { rgb: "FFFFFF" } },
              fill: { fgColor: { rgb: "4472C4" } },
              alignment: { horizontal: "center" },
            };
          }
        }

        // Style the total row
        const totalRow = wsData.length - 1;
        for (let col = 0; col < 7; col++) {
          const cell = XLSX.utils.encode_cell({ r: totalRow, c: col });
          if (worksheet[cell]) {
            worksheet[cell].s = {
              font: { bold: true },
              alignment: { horizontal: col === 4 ? "right" : "left" },
            };
          }
        }

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Consumer Details");

        // Generate and download file
        XLSX.writeFile(
          workbook,
          `Consumer_Details_${formatDate(startDateInput.value)}_to_${formatDate(
            endDateInput.value
          )}.xlsx`
        );
      } catch (error) {
        console.error("Error generating Excel:", error);
        alert("Error generating Excel file. Please try again.");
      }
    }
  });
});

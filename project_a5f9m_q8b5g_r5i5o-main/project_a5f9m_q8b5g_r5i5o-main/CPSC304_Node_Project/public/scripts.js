/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */




// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}


async function resetItems_SellsTable() {
    const response = await fetch("/initiate-Items_Sells", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetItems_SellsResultMsg');
        messageElement.textContent = "items_sells table initiated successfully!";
        fetchItems_SellsTableData();
    } else {
        alert("Error initiating table!");
    }
}

async function insertItems_SellsTable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertItems_SellsItemId').value;
    const categoryValue = document.getElementById('insertItems_SellsCategory').value;
    const startdateValue = document.getElementById('insertItems_SellsStartDate').value;
    const ccnumValue = document.getElementById('insertItems_SellsCreditCardNumber').value;

    const response = await fetch('/insert-Items_Sells', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            category: categoryValue,
            date: startdateValue,
            cc: ccnumValue,
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertItem_SellsResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchItems_SellsTableData()
    } else {
       
        if(responseData.err == 2291){
            messageElement.textContent = "Foreign Key doesn't exist !";
        } else {
            messageElement.textContent = "Error inserting data!";
        }
    }
}

async function fetchAndDisplayItems_Sells() {
    const tableElement = document.getElementById('Items_SellsTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/Items_Sells', {
        method: 'GET'
    });
    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function deleteItems_Sells(event) {
    event.preventDefault();

    const idValue = document.getElementById('deleteItemId').value;

    const response = await fetch('/delete-Items_Sells', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateDeleteItems_SellsMsg');

    if (responseData.success) {
        messageElement.textContent = "Data deleted successfully!";
        fetchItems_SellsTableData()
    } else {
        messageElement.textContent = "Error deleting data!";
    }
}

//FORSALEITEMS_LISTEDAT_WINS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
async function resetForSaleItems_ListedAt_WinsTable() {
    const response = await fetch("/initiate-ForSaleItems_ListedAt_Wins", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetForSaleItems_ListedAt_WinsResultMsg');
        messageElement.textContent = "ForSaleItems_ListedAt_Wins table initiated successfully!";
        fetchForSaleItems_ListedAt_WinsTableData();
    } else {
        alert("Error initiating table!");
    }
}

// async function fetchAndDisplayForSaleItems_ListedAt_Wins() {
//     const tableElement = document.getElementById('ForSaleItems_ListedAt_WinsTable');
//     const tableBody = tableElement.querySelector('tbody');

//     const response = await fetch('/ForSaleItems_ListedAt_Wins', {
//         method: 'GET'
//     });

//     const responseData = await response.json();
//     const tableContent = responseData.data;

//     // Always clear old, already fetched data before new fetching process.
//     if (tableBody) {
//         tableBody.innerHTML = '';
//     }

//     tableContent.forEach(user => {
//         const row = tableBody.insertRow();
//         user.forEach((field, index) => {
//             const cell = row.insertCell(index);
//             cell.textContent = field;
//         });
//     });
// }

async function join_Appraiser_And_Appraises(event) {
    event.preventDefault(); // Prevent default form submission

    const appraiserID = document.getElementById('appraiserID').value;

    // Ensure result table and message placeholder exist
    const resultsTable = document.getElementById('resultsTable');
    const resultMsg = document.getElementById('joinResultMsg');
    const tableBody = resultsTable.querySelector('tbody');

    try {
        const response = await fetch('/api/join_Appraiser_And_Appraises', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ appraiserID }),
        });

        const responseData = await response.json();
        console.log("API Response Data:", responseData); // Log the API response here

        // Check if 'data' exists and is an array
        if (responseData.success && Array.isArray(responseData.data) && responseData.data.length > 0) {
            const demotableContent = responseData.data;

            // Clear the table body before adding new rows
            if (tableBody) {
                tableBody.innerHTML = '';
            }

            // Loop through rows and populate the table
            demotableContent.forEach(rowData => {
                const row = tableBody.insertRow();
                rowData.forEach(cellData => {
                    const cell = row.insertCell();
                    cell.textContent = cellData;
                });
            });

            resultsTable.style.display = "table"; // Show the table
            resultMsg.textContent = ""; // Clear any error message
        } else {
            resultsTable.style.display = "none"; // Hide the table
            resultMsg.textContent = responseData.message || "No results found.";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        resultMsg.textContent = "An error occurred while fetching data.";
    }
}

async function getMaxBid(event) {
    event.preventDefault(); // Prevent default form submission

    const itemID = document.getElementById('itemID').value;

    // Ensure result table and message placeholder exist
    const resultsTable = document.getElementById('maxBidResultsTable');
    const resultMsg = document.getElementById('maxBidResultMsg');
    const tableBody = resultsTable.querySelector('tbody');

    try {
        const response = await fetch('/api/max_bid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemID }),
        });

        const responseData = await response.json();
        console.log("API Response Data:", responseData); // Log the API response

        if (responseData.success && responseData.data.length > 0) {
            const demotableContent = responseData.data;

            // Clear the table body before adding new rows
            if (tableBody) {
                tableBody.innerHTML = '';
            }

            // Loop through rows and populate the table
            demotableContent.forEach(rowData => {
                const row = tableBody.insertRow();
                rowData.forEach(cellData => {
                    const cell = row.insertCell();
                    cell.textContent = cellData;
                });
            });

            resultsTable.style.display = "table"; // Show the table
            resultMsg.textContent = ""; // Clear any error message
        } else {
            resultsTable.style.display = "none"; // Hide the table
            resultMsg.textContent = responseData.message || "No bids found for this ITEMID.";
        }
    } catch (error) {
        console.error("No bids found for this ITEMID:", error);
        resultMsg.textContent = "An error occurred while fetching data.";
    }
}

async function divisionOperation(event) {
    event.preventDefault();
    const tableElement = document.getElementById('divisionQuery');
    const tableBody = tableElement.querySelector('tbody');
    const resultMsg = document.getElementById('divisionResultMsg');

    const response = await fetch('/api/division', { method: 'GET' });
    const responseData = await response.json();
    console.log("API Response Data:", responseData);
    // Always clear old data
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    if (responseData.success && responseData.data.length > 0) {
        const demotableContent = responseData.data;

        // Clear the table body before adding new rows
        if (tableBody) {
            tableBody.innerHTML = '';
        }

        // Loop through rows and populate the table
        demotableContent.forEach(rowData => {
            const row = tableBody.insertRow();
            const cell = row.insertCell();
            cell.textContent = rowData[0];  // Extract licensePlate from the inner array
        });

        tableElement.style.display = "table"; // Show the table
        resultMsg.textContent = ""; // Clear any error message
    } else {
        document.getElementById('divisionResultMsg').textContent = 'No vehicles found.';
        tableElement.style.display = 'none';
    }
}

// async function insertForSaleItems_ListedAt_WinsTable(event) {
//     event.preventDefault();

//     const idValue = document.getElementById('insertForSaleItems_ListedAt_WinsItemId').value;
//     const dateValue = document.getElementById('insertForSaleItems_ListedAt_WinsDate').value;
//     const timeValue = document.getElementById('insertForSaleItems_ListedAt_WinsTime').value;
//     const addressValue = document.getElementById('insertForSaleItems_ListedAt_WinsAddress').value;
//     const sPriceValue = document.getElementById('insertForSaleItems_ListedAt_WinsStartPrice').value;
//     const fPriceValue = document.getElementById('insertForSaleItems_ListedAt_WinsFinalPrice').value;
//     const ccValue = document.getElementById('insertForSaleItems_ListedAt_WinsCreditCardNumber').value;
//     const conditionValue = document.getElementById('insertForSaleItems_ListedAt_WinsCategory').value;



//     const response = await fetch('/insert-ForSaleItems_ListedAt_Wins', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             id: idValue,
//             listdate: dateValue,
//             time: timeValue,
//             address: addressValue,
//             sPrice: sPriceValue,
//             fPrice: fPriceValue,
//             cc: ccValue,
//             condition: conditionValue
//         })
//     });

//     const responseData = await response.json();
//     const messageElement = document.getElementById('insertForSaleItems_ListedAt_WinsResultMsg');

//     if (responseData.success) {
//         messageElement.textContent = "Data inserted successfully!";
//         fetchForSaleItems_ListedAt_WinsTableData()
//     } else {
//         if (responseData.err == 2291) {
//             messageElement.textContent = "Foreign Key doesn't exist !";
//         } else {
//             messageElement.textContent = "Error inserting data!";
//         }
//     }
// }

async function selectDeliveryVehicleTable(event) {
    event.preventDefault();
    const plateValue = document.getElementById("selectPlate").value;
    const plateNloadValue = document.getElementById("AndOrPlate/Load").value;
    const compValue = document.getElementById("comparisonOperatorDropdown").value;
    const payloadValue = document.getElementById("selectPayload").value;
    const loadNmakeValue = document.getElementById("AndOrLoad/Make").value;
    const makeValue = document.getElementById("selectMakeModel").value;



    const response = await fetch('/select-DeliveryVehicle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            plate: plateValue,
            plateNload: plateNloadValue,
            loadcomp: compValue,
            payload: payloadValue,
            loadNmake: loadNmakeValue,
            make: makeValue,
        })
    });

    const tableElement = document.getElementById('Items_SellsSelectTable');
    const tableBody = tableElement.querySelector('tbody');


    const responseData = await response.json();
    const tableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}
//FORSALEITEMS_LISTEDAT_WINS ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//AUCTIONEER vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv


async function fetchAndDisplayAuctioneerAttributes(event) {
    event.preventDefault();
    const tableElement = document.getElementById('AuctioneerAttributesTable');
    const tableBody = tableElement.querySelector('tbody');
    const tableHeader = document.getElementById('AuctioneerAttributesHeader');

  

    const selectedColumns = [];

    if (document.getElementById('StartDate').checked) {
        selectedColumns.push('StartDate');
    }
    if (document.getElementById('EmployeeId').checked) {
        selectedColumns.push('EmployeeId');
    }
    if (document.getElementById('HourlyWage').checked) {
        selectedColumns.push('HourlyWage');
    }
    if (document.getElementById('AuctioneerName').checked) {
        selectedColumns.push('AuctioneerName');
    }

    // Check if column is selected and if employeeID is selected
    if (selectedColumns.length === 0 ) {
        alert('Please select at least one column and enter an Employee ID.');
        return;
    }

    try {
        // Send the selected columns and employee ID to the server
        const response = await fetch('/projectionAuctioneer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                attributes: selectedColumns,
            }),
        });

        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        // Get the response data
        const data = await response.json();
        console.log("API Response Data:", data);
        const tableData = data.data;
        console.log('Table Data:', tableData);
        tableBody.innerHTML = '';
        tableHeader.innerHTML = '';

        selectedColumns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column;
            tableHeader.appendChild(th);
        });

        // Populate table body with data
        tableData.forEach(row => {
            const tr = document.createElement('tr');

            // If the row is an array, handle it accordingly
            selectedColumns.forEach((column, index) => {
                const td = document.createElement('td');
                td.textContent = row[index] || 'N/A';  // Access each value by its index
                tr.appendChild(td);
            });

            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error('Error fetching Auctioneer data:', error);
        alert('Error fetching data');
    }
}

//AUCTIONEER ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//AUCTIONSESSION_OPERATES HAVING BY vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

async function fetchAndDisplayAuctionSessions(event) {
    event.preventDefault();
    const tableElement = document.getElementById('selectedAuctionSessionsTable');
    const tableBody = tableElement.querySelector('tbody');
    const numberItemsVal = document.getElementById('insertNumber').value;

    const response = await fetch('/AuctionSession_Operates', {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
    },
        body: JSON.stringify({
            numberItems: numberItemsVal
        })
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function nestedAggregationAuctionSessions_Operates(event) {
    event.preventDefault();
    const tableElement = document.getElementById('comissionPercentAuctionSessionsTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/NestedAuctionSession_Operates', { method: 'GET' });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}
//UPDATEAUCTIONSESSION
async function updateAuctionSession_Operates(event) {
    event.preventDefault();
    const dateValue = document.getElementById('pkDate').value;
    const timeValue = document.getElementById('pkTime').value;
    const addressValue = document.getElementById('pkAddress').value;
    let totalAttendeesValue = document.getElementById('updateTotalAttendees').value;
    let phoneNumberValue = document.getElementById('updatePhoneNumber').value;
    let numItemsValue = document.getElementById('updateNumItems').value;
    let commissionPercentValue = document.getElementById('updateCommissionPercent').value;
    let employeeIdValue = document.getElementById('updateEmployeeId').value;
    if(!totalAttendeesValue) totalAttendeesValue =0;
    if(!phoneNumberValue) phoneNumberValue =0;
    if(!numItemsValue) numItemsValue =0;
    if(!commissionPercentValue) commissionPercentValue =0;

    const response = await fetch('update-AuctionSession_Operates', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            auctiondate: dateValue,
            time: timeValue,
            address: addressValue,
            totalAttendees: totalAttendeesValue,
            phoneNumber: phoneNumberValue,
            numItems: numItemsValue,
            commissionPercent: commissionPercentValue,
            employeeId: employeeIdValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateAuctionSessionResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data updated successfully!";
        fetchAndDisplayAuctionSession_Operates_Table();
    } else {
        if (responseData.err == 2291) {
            messageElement.textContent = "Foreign Key doesn't exist !";
        } else {
            messageElement.textContent = "Error inserting data!";
        }
    }
}

async function fetchAndDisplayAuctionSession_Operates_Table() {
    const tableElement = document.getElementById('updateAuctionSessionTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/fetchAuctionSession_Operates_Table', { method: 'GET' });
    const responseData = await response.json();
    const demotableContent = responseData.data;

    
    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.

window.onload = function () {
    checkDbConnection();
    fetchItems_SellsTableData();
    // fetchForSaleItems_ListedAt_WinsTableData();
    fetchAndDisplayAuctionSession_Operates_Table();
    document.getElementById("insertItems_SellsForm").addEventListener("submit", insertItems_SellsTable);
    document.getElementById("resetItems_SellsTable").addEventListener("click", resetItems_SellsTable);
    document.getElementById("deleteItems_SellsForm").addEventListener("submit", deleteItems_Sells);
    // document.getElementById("resetForSaleItems_ListedAt_WinsTable").addEventListener("click", resetForSaleItems_ListedAt_WinsTable);
    // document.getElementById("insertForSaleItems_ListedAt_WinsForm").addEventListener("submit", insertForSaleItems_ListedAt_WinsTable);
    document.getElementById("join_Appraiser_And_Appraises_Form").addEventListener("submit", join_Appraiser_And_Appraises);
    document.getElementById("selectDeliveryVehicleForm").addEventListener("submit", selectDeliveryVehicleTable);
    document.getElementById("max_bid_form").addEventListener("submit", getMaxBid);
    document.getElementById("divisionQueryForm").addEventListener("submit", divisionOperation);
    document.getElementById("selectAuctionSession_OperatesForm").addEventListener("submit", fetchAndDisplayAuctionSessions);
    document.getElementById("comissionPercentForm").addEventListener("submit", nestedAggregationAuctionSessions_Operates);
    document.getElementById("employeeProjectionForm").addEventListener("submit", fetchAndDisplayAuctioneerAttributes);
    document.getElementById("updateAuctionSessionForm").addEventListener("submit", updateAuctionSession_Operates);
    document.getElementById("selectAuctionSession_OperatesForm").addEventListener("submit", fetchAndDisplayAuctionSessions);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}

function fetchItems_SellsTableData() {
    fetchAndDisplayItems_Sells();
}


// function fetchForSaleItems_ListedAt_WinsTableData() {
//     fetchAndDisplayForSaleItems_ListedAt_Wins();
// }



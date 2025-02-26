const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

//ITEMS_SELLS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//!!! add foreign keys and cascades
async function initiateItems_SellsTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Items_Sells CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Items_Sells (
                    itemID NUMBER PRIMARY KEY,
                    category VARCHAR2(255),
                    startDate date,
                    creditCardNumber NUMBER NOT NULL,
                    FOREIGN KEY (creditCardNumber) REFERENCES Customers(creditCardNumber) ON DELETE CASCADE
                )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertItems_Sells(itemID, category, startDate, creditCardNumber) {
    console.log("inserting....");
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Items_Sells (itemID, category, startDate, creditCardNumber) VALUES (:itemID, :category, TRUNC(TO_DATE(:startDate,'YYYY-MM-DD')), :creditCardNumber)`,
            [itemID, category, startDate, creditCardNumber],
            { autoCommit: true }
        );
        return {
            insertResult: result.rowsAffected && result.rowsAffected > 0,
            err: 0
        };
    }).catch((err) => {
        return {
            insertResult: 0,
            err: err.errorNum
        };
    });
}

async function fetchItems_SellsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Items_Sells');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function deleteItems_Sells(itemID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Items_Sells WHERE itemID = :itemID`,
            [itemID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });

}
//ITEMS_SELLS ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


//FORSALEITEMS_LISTEDAT_WINS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//!!! add foreign keys and cascades
async function initiateForSaleItems_ListedAt_WinsTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE ForSaleItems_ListedAt_Wins`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE ForSaleItems_ListedAt_Wins (
                    itemID INT PRIMARY KEY,
                    listed_date DATE NOT NULL,
                    time VARCHAR(255) NOT NULL,
                    address VARCHAR(255) NOT NULL,
                    creditCardNumber INT NOT NULL,
                    startPrice INT,
                    finalPrice INT,
                    condition VARCHAR(255),
                    FOREIGN KEY (listed_date, time, address) REFERENCES AuctionSession_Operates(event_date, time, address) ON DELETE CASCADE,
                    FOREIGN KEY (creditCardNumber) REFERENCES Customers(creditCardNumber) ON DELETE CASCADE
                )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchForSaleItems_ListedAt_WinsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM ForSaleItems_ListedAt_Wins');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertForSaleItems_ListedAt_Wins(itemID, listdate, time, address, sPrice, fPrice, cc, condtion) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO ForSaleItems_ListedAt_Wins (itemID, listed_date, time, address, creditCardNumber, startPrice, finalPrice, condition) VALUES (:itemID, TO_DATE(:listDate,'YYYY-MM-DD'), :time, :address, :sPrice, :fPrice, :cc, :condtion)`,
            [itemID, listdate, time, address, sPrice, fPrice, cc, condtion],
            { autoCommit: true }
        );

        return {
            insertResult: result.rowsAffected && result.rowsAffected > 0,
            err: 0
        };
    }).catch((err) => {
        return {
            insertResult: 0,
            err: err.errorNum
        };
    });
}

//FORSALEITEMS_LISTEDAT_WINS ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

async function join_Appraiser_And_Appraises(appraiserID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT appraiserName, itemID
            FROM Appraiser a, Appraises ap
            WHERE a.appraiserID = ap.appraiserID 
               AND a.appraiserID = :appraiserID`,
            [appraiserID], // Bind the appraiserID
        );
        console.log("Query Result:", result.rows);
        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function maxBid_GroupBy(itemID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT itemID, MAX(amount) AS maxBid
            FROM Bids_Receive_Places 
            WHERE itemID = :itemID
            GROUP BY itemID`,
            [itemID], // Bind the itemID
        );
        console.log("Query Result:", result.rows);
        return result.rows.length > 0 ? result.rows : null;
    }).catch(() => {
        return false;
    });
}

async function divisionOperation() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT DISTINCT licensePlate
            FROM CollectsFrom C
            WHERE NOT EXISTS 
                ((SELECT address 
                    FROM StorageFacility)
                    MINUS
                    (SELECT CF.address 
                    FROM CollectsFrom CF 
                    WHERE CF.licensePlate = C.licensePlate))`
        );
        console.log("Query Result:", result.rows);
        return result.rows.length > 0 ? result.rows : null;
    }).catch(() => {
        return false;
    });
}

async function selectDeliveryVehicleTable(plate, plateNload, loadcomp, payload, loadNmake, make) {
    if (loadcomp === "lessThan") {
        loadcomp = "<";
    }
    let query = `SELECT * FROM DeliveryVehicle WHERE licensePlate = '${plate}' ${plateNload} payloadCapacity ${loadcomp} ${payload} ${loadNmake} makeModel = '${make}'`
    console.log(query);

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query
        );
        console.log("finished query");
        return result.rows;
    }).catch(() => {
        return [];
    });
}
//AUCTIONSESSIONS
async function fetchAuctionSessionsFromDb(numberItems) {
    let query = `SELECT address, phoneNumber FROM AuctionSession_Operates GROUP BY address, phoneNumber HAVING min(numItems) >= ${numberItems}`;
    console.log(query);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query
        );
        console.log("finished query");
        return result.rows;
    }).catch(() => {
        return [];
    });
}
async function fetchNestedAuctionSessionsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT	 A1.event_date, AVG(A1.commissionPercent) FROM AuctionSession_Operates A1 GROUP BY A1.event_date HAVING AVG(A1.commissionPercent) > ( SELECT AVG(A2.commissionPercent) FROM  AuctionSession_Operates A2)'
        );
        console.log("finished query");
        return result.rows;
    }).catch(() => {
        return [];
    });
}
//AUCTIONSESSIONS

async function projectionAuctioneer(attributes, employeeID) {
    // Build the SQL query dynamically based on the requested attributes
    const selectedColumns = attributes.join(', ');
    const query = `SELECT ${selectedColumns} FROM Auctioneer`;
    console.log(`Executing query: ${query}`);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query);
        console.log(`Executing query: `, result.rows);
        return result.rows;
    }).catch((err) => {
        console.error('Error in projectionAuctioneer:', err.message);
        return [];
    });
}
//AUCTIONSESSIONSUPDATES
async function updateAuctionSessions(auctiondate, time, address, totalAttendees, phoneNumber, numItems, commissionPercent, employeeId) {
    let query = `UPDATE AuctionSession_Operates SET employeeID = ${employeeId}, phoneNumber = ${phoneNumber}, totalAttendees = ${totalAttendees}, numItems = ${numItems}, commissionPercent = ${commissionPercent} WHERE event_date = TO_DATE('${auctiondate}', 'YYYY-MM-DD') AND time = '${time}' AND address = '${address}'`
    console.log(query);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query);
        await connection.commit();
        // Return result
        return {
            insertResult: result.rowsAffected && result.rowsAffected > 0,
            err: 0
        };
    }).catch((err) => {
        return {
            insertResult: 0,
            err: err.errorNum
        };

    });
}

async function fetchUpdatedAuctionSessionsFromDb() {

    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM AuctionSession_Operates');

        return result.rows;
    }).catch(() => {
        return [];
    });
}


module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable,
    insertDemotable,
    updateNameDemotable,
    countDemotable,
    initiateItems_SellsTable,
    insertItems_Sells,
    fetchItems_SellsFromDb,
    deleteItems_Sells,
    initiateForSaleItems_ListedAt_WinsTable,
    fetchForSaleItems_ListedAt_WinsFromDb,
    fetchAuctionSessionsFromDb,
    insertForSaleItems_ListedAt_Wins,
    join_Appraiser_And_Appraises,
    maxBid_GroupBy,
    divisionOperation,
    selectDeliveryVehicleTable,
    fetchNestedAuctionSessionsFromDb,
    updateAuctionSessions,
    fetchUpdatedAuctionSessionsFromDb,
    projectionAuctioneer
};

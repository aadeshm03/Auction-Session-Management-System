const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCount
        });
    } else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});


//ITEMS_SELLS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
router.post("/initiate-Items_Sells", async (req, res) => {
    const initiateResult = await appService.initiateItems_SellsTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/Items_Sells', async (req, res) => {
    const tableContent = await appService.fetchItems_SellsFromDb();
    res.json({data: tableContent});
});

router.post("/insert-Items_Sells", async (req, res) => {
    const { id, category, date, cc } = req.body;
    console.log(req.body);
    const result = await appService.insertItems_Sells(id, category, date, cc);
    if (result.insertResult) {
        res.json({ success: true,
            err: 0
         });
    } else {
        res.status(500).json({ success: false,
            err: result.err
         });
    }
});

router.delete("/delete-Items_Sells", async (req,res)=> {
    const {id} = req.body;
    const deleteResult = await appService.deleteItems_Sells(id);
    if(deleteResult) {
        res.json({ success: true});
    } else {
        res.status(500).json({ success: false});
    }
});

//ITEMS_SELLS ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//FORSALEITEMS_LISTEDAT_WINS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
router.post("/initiate-ForSaleItems_ListedAt_Wins", async (req, res) => {
    const initiateResult = await appService.initiateForSaleItems_ListedAt_WinsTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/ForSaleItems_ListedAt_Wins', async (req, res) => {
    const tableContent = await appService.fetchForSaleItems_ListedAt_WinsFromDb();
    res.json({data: tableContent});
});

router.post("/insert-ForSaleItems_ListedAt_Wins", async (req, res) => {
    const { id, listdate, time, address, sPrice, fPrice, cc, condition } = req.body;
    console.log(req.body);
    const result = await appService.insertForSaleItems_ListedAt_Wins(id, listdate, time, address, sPrice, fPrice, cc, condition);
    if (result.insertResult) {
        res.json({ success: true, 
            err: 0
         });
    } else {
        res.status(500).json({ success: false,
            err: result.err
         });
    }
});


//FORSALEITEMS_LISTEDAT_WINS ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

router.post('/api/join_Appraiser_And_Appraises', async (req, res) => {
    const { appraiserID } = req.body;

    if (!appraiserID) {
        return res.status(400).send({ error: 'appraiserID is required' });
    }

    try {
        const data = await appService.join_Appraiser_And_Appraises(appraiserID);

        if (data && data.length > 0) {
            res.json({ success: true, data });  // Include 'data' in the response
        } else {
            res.status(404).json({ success: false, message: "No results found." });
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Error fetching data." });
    }
});

router.post('/api/max_bid', async (req, res) => {
    const { itemID } = req.body;

    if (!itemID) {
        return res.status(400).send({ error: 'ITEMID is required' });
    }

    const data = await appService.maxBid_GroupBy(itemID);
    if (data) {
        res.json({ success: true, data });
    } else {
        res.json({ success: false, message: 'No bids found' });
    }
    
});

router.get('/api/division', async (req, res) => {
    const data = await appService.divisionOperation();
    if (data) {
        
        res.json({ success: true, data });
    } else {
        res.json({ success: false, message: 'Error fetching data' });
    }
    
});




router.post("/select-DeliveryVehicle", async (req, res) => {
    const { plate, plateNload, loadcomp, payload, loadNmake, make } = req.body;
    console.log(req.body);
    const tableContent = await appService.selectDeliveryVehicleTable(plate, plateNload, loadcomp, payload, loadNmake, make);
    res.json({ data: tableContent });
});
//AUCTIONSESSIONS
router.post('/AuctionSession_Operates', async (req, res) => {
    const{numberItems} = req.body;
    const tableContent = await appService.fetchAuctionSessionsFromDb(numberItems);
    res.json({data: tableContent});
});
router.get('/NestedAuctionSession_Operates', async (req, res) => {
    const tableContent = await appService.fetchNestedAuctionSessionsFromDb();
    res.json({data: tableContent});
});



//AUCTIONSESSIONS

router.post("/projectionAuctioneer", async (req, res) => {
    const { attributes } = req.body;

    // Validate that attributes are provided and are an array
    if (!attributes || !Array.isArray(attributes) || attributes.length === 0) {
        return res.status(400).json({ 
            success: false, 
            message: "A non-empty array of attributes is required" 
        });
    }

    try {
        const result = await appService.projectionAuctioneer(attributes); // Adjust to your actual data-fetching logic.
        res.json({ success: true, data: result });
    } catch (err) {
        console.error('Error in /Auctioneer:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
//AUCTIONSESSIONSUPDATES
router.post("/update-AuctionSession_Operates", async (req, res) => {
    const {auctiondate, time, address, totalAttendees, phoneNumber, numItems, commissionPercent, employeeId} = req.body;
    console.log(req.body);
    const result = await appService.updateAuctionSessions(auctiondate, time, address, totalAttendees, phoneNumber, numItems, commissionPercent, employeeId);
    if(result.insertResult){
        res.json({
            success: true,
            err: 0
        });
    } else {
        res.status(500).json({
            success: false,
            err: result.err
        });
    }
});

router.get('/fetchAuctionSession_Operates_Table', async (req, res) => {
    const tableContent = await appService.fetchUpdatedAuctionSessionsFromDb();
    res.json({data: tableContent});
});


module.exports = router;

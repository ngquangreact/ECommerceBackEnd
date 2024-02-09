const express = require("express");
const router = express.Router();
const { 
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getEnquiry,
    getAllEnquiry
} = require("../controller/enqCtrl");
const {authMiddleware,isAdminMiddleware} = require("../middlewares/authMiddleware");

router.post('/',createEnquiry);

router.put('/:id',authMiddleware,isAdminMiddleware,updateEnquiry);

router.delete('/:id',authMiddleware,isAdminMiddleware,deleteEnquiry);

router.get('/',getAllEnquiry);
router.get('/:id',getEnquiry);


module.exports = router;
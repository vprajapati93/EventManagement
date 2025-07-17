const {generateInquiry,fetchallInquires,slotAvailableForInquiryAtGivenDate,checkExisitingInquiry} = require('../controller/inquiry.controller');
const Router = require('express');
const express = require('express');
// const upload = require('../middlewares/multer.middleware.js');
// const verifyJWT = require('../middlewares/auth.middleware.js');

const router = Router();
router.use(express.json());

router.route("/generateInquiry").post(generateInquiry);
router.route("/fetchAllInquires").get(fetchallInquires);
router.route("/fetchInquiry/:phonenumber").get(checkExisitingInquiry);
router.route("/checkForInquiry/:eventDate").get(slotAvailableForInquiryAtGivenDate);


module.exports = router;
const express = require('express');
const router = express.Router();

const auth = require('../controllers/authController');
const balance = require('../controllers/balanceController');
const trs = require('../controllers/trsController');
const verify = require('../middlewares/authMiddleware');
const services = require('../controllers/servicesController');
const { getBanner } = require('../controllers/bannerController');
const profile = require('../controllers/profileController');
const { updateProfile } = require('../controllers/profileController');


console.log("verify middleware:", verify);
console.log("trs.pay:", trs.pay);
console.log("balance.getBalance:", balance.getBalance);
console.log("balance.topUp:", balance.topUp);
console.log("auth.register:", auth.register);
console.log("auth.login:", auth.login);


router.post('/register', auth.register);
router.post('/login', auth.login);


router.get('/balance', verify, balance.getBalance);
router.post('/topup', verify, balance.topUp);
router.post('/trs', verify, trs.pay);
router.get('/history', verify, trs.getHistory);
router.get('/services', verify, services.getServices);
router.get('/public', getBanner);
router.get('/profile', verify, profile.getProfile);
router.put('/profile', verify, updateProfile);



module.exports = router;

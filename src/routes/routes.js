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


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Register dan Login User
 */
router.post('/register', auth.register);
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login user dan mendapatkan JWT Token
 *     tags: [Auth]
 */
router.post('/login', auth.login);



/**
 * @swagger
 * tags:
 *   name: Balance
 *   description: Cek dan Top Up Saldo
 */
/**
 * @swagger
 * /api/balance:
 *   get:
 *     summary: Ambil saldo user
 *     security:
 *       - bearerAuth: []
 *     tags: [Balance]
 */
router.get('/balance', verify, balance.getBalance);

/**
 * @swagger
 * /api/topup:
 *   post:
 *     summary: Top Up Saldo User
 *     security:
 *       - bearerAuth: []
 *     tags: [Balance]
 */
router.post('/topup', verify, balance.topUp);



/**
 * @swagger
 * tags:
 *   name: Transaction
 *   description: Pembayaran dan Riwayat Transaksi
 */
/**
 * @swagger
 * /api/trs:
 *   post:
 *     summary: Pembayaran layanan
 *     security:
 *       - bearerAuth: []
 *     tags: [Transaction]
 */
router.post('/trs', verify, trs.pay);

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Ambil riwayat transaksi user
 *     security:
 *       - bearerAuth: []
 *     tags: [Transaction]
 */
router.get('/history', verify, trs.getHistory);



/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Layanan yang tersedia
 */
/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Ambil daftar layanan
 *     security:
 *       - bearerAuth: []
 *     tags: [Services]
 */
router.get('/services', verify, services.getServices);



/**
 * @swagger
 * tags:
 *   name: Public
 *   description: Data publik yang bisa diakses tanpa login
 */
/**
 * @swagger
 * /api/public:
 *   get:
 *     summary: Ambil daftar banner public
 *     tags: [Public]
 */
router.get('/public', getBanner);



/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Kelola profil user
 */
/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Ambil profil user
 *     security:
 *       - bearerAuth: []
 *     tags: [Profile]
 */
router.get('/profile', verify, profile.getProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update profil user (nama atau foto)
 *     security:
 *       - bearerAuth: []
 *     tags: [Profile]
 */
router.put('/profile', verify, updateProfile);



module.exports = router;

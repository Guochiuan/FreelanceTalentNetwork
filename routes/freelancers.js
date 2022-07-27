const express = require('express');
const router = express.Router();
const freelancers = require('../controllers/freelancers');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateFreelancer } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Freelancer = require('../models/freelancer');

router.route('/')
    .get(catchAsync(freelancers.index))
    .post(isLoggedIn, upload.array('image'), validateFreelancer, catchAsync(freelancers.createFreelancer))


router.get('/new', isLoggedIn, freelancers.renderNewForm)

router.route('/:id')
    .get(catchAsync(freelancers.showFreelancer))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateFreelancer, catchAsync(freelancers.updateFreelancer))
    .delete(isLoggedIn, isAuthor, catchAsync(freelancers.deleteFreelancer));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(freelancers.renderEditForm))



module.exports = router;
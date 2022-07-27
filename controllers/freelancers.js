const Freelancer = require('../models/freelancer');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = 'pk.eyJ1IjoiYWN0dWFyaWFsd2FuZyIsImEiOiJjbDB1MDRtaTgwajcxM2ZwNzU2dTl1dGhwIn0.LDVHyvB2HjR3UYROrsqFWQ';
// const mapBoxToken = process.env.MAPBOX_TOKEN;



const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const freelancers = await Freelancer.find({}).populate('popupText');
    res.render('freelancers/index', { freelancers })
}

module.exports.renderNewForm = (req, res) => {
    res.render('freelancers/new');
}

module.exports.createFreelancer = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.freelancer.location,
        limit: 1
    }).send()
    const freelancer = new Freelancer(req.body.freelancer);
    freelancer.geometry = geoData.body.features[0].geometry;
    freelancer.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    freelancer.author = req.user._id;
    await freelancer.save();
    console.log(freelancer);
    req.flash('success', 'Successfully made a new freelancer!');
    res.redirect(`/freelancers/${freelancer._id}`)
}

module.exports.showFreelancer = async (req, res,) => {
    const freelancer = await Freelancer.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!freelancer) {
        req.flash('error', 'Cannot find that freelancer!');
        return res.redirect('/freelancers');
    }
    res.render('freelancers/show', { freelancer });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const freelancer = await Freelancer.findById(id)
    if (!freelancer) {
        req.flash('error', 'Cannot find that freelancer!');
        return res.redirect('/freelancers');
    }
    res.render('freelancers/edit', { freelancer });
}

module.exports.updateFreelancer = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const freelancer = await Freelancer.findByIdAndUpdate(id, { ...req.body.freelancer });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    freelancer.images.push(...imgs);
    await freelancer.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await freelancer.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated freelancer!');
    res.redirect(`/freelancers/${freelancer._id}`)
}

module.exports.deleteFreelancer = async (req, res) => {
    const { id } = req.params;
    await Freelancer.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted freelancer')
    res.redirect('/freelancers');
}
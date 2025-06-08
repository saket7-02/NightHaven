
const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner}=require("../middleware.js");

const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing=(req,res,next)=> {
    let {error}=listingSchema.validate(req.body);
        if(error) {
            throw new ExpressError(400,error);
        } else {
            next();
        }
}



//Index Route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing))


//new route
router.get("/new",isLoggedIn,listingController.renderNewForm)




//Show Route
router.get("/:id",wrapAsync(listingController.showListing))

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))


//update route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))


//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))



module.exports=router;
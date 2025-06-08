const express=require("express");
const router=express.Router({mergeParams:true});
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");

const validateReview=(req,res,next)=> {
    let {error}=reviewSchema.validate(req.body);
        if(error) {
            throw new ExpressError(400,error);
        } else {
            next();
        }
}

const reviewController=require("../controllers/reviews.js");
//Reviews
//Post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destryReview))

module.exports=router;
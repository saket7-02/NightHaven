const Listing=require("./models/listing.js");
const Review=require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=> {
    if(!req.isAuthenticated()) {
        //redirect url save
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=> {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=> {
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async (req,res,next)=> {
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    console.log(review);
    if(!review.author.equals(res.locals.currUser._id)) {
            req.flash("error","Review can be only deleted by its author!!")
            return res.redirect(`/listings/${id}`)
        }
        next();
}
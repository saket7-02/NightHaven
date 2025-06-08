const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken })
const ExpressError=require("../utils/ExpressError.js");


module.exports.index=async (req,res)=> {
    let {category,search}=req.query;
    let allListings=await Listing.find({});

    if(category!=undefined) {
        allListings=await Listing.find({category});;
    }
    if(search!=undefined) {
        let location=search;
        allListings=await Listing.find({location});
    }
    if(allListings.length==0) {
        throw new ExpressError(200,"We are working to get there!!")
    }
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=> {
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req,res)=> {
    let{id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    }}).populate("owner");
    if(!listing) {
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing=async(req,res)=> {
    let response=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
})
  .send();
        
        let url=req.file.path;
        let filename=req.file.filename;
        const newListing=new Listing(req.body.listing);//ek object return karega jisme sab combined hoga
        newListing.owner=req.user._id;
        newListing.image={url,filename};
        newListing.geometry=response.body.features[0].geometry;
        newListing.category=req.body.listing.category;
        let savedListing=await newListing.save();
        console.log(savedListing);
        
        req.flash("success","New Listing Created!");
        res.redirect("/listings");   
}

module.exports.renderEditForm=async (req,res)=> {
    let{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing) {
        req.flash("error","Listing you requested for doesnot exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing=async (req,res)=> {
    let {id}=req.params;
    let newListing=req.body.listing;
    await Listing.findByIdAndUpdate(id,{...newListing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res)=> {
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
}
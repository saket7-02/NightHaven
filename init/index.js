const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js")
const path=require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

}


const dbUrl=process.env.ATLASDB_URL;

console.log("DB URL from env:", dbUrl);

main().then(()=> {
    console.log("connected to db");
})
.catch(err => console.log(err));



async function main() {
  await mongoose.connect(dbUrl);
}

const initDB=async()=> {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=> {
      return {
        ...obj,owner:"68456a1d3067d02cc2b6d6ef"
      }
    })
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();
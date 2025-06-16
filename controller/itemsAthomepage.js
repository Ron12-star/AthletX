const Product=require("../models/productschema.js");

const HomePageItem=async(req, res) => {
  try{
    const allProduct=await Product.find();//i fatched products from mongoDB compass

    const HighDiscountProducts=allProduct.filter(product=>product.discount>=60);
    const LowDiscountProducts=allProduct.filter(product=>product.discount<60);
    // console.log("Fetched Products:", product);
    // return res.render("home.ejs", { session: req.session,product }); 
    return res.render("home.ejs",{session:req.session,HighDiscountProducts,
      LowDiscountProducts})
  }
  catch(err){
    console.error("Error fetching products:", err);
    res.status(500).send("Error loading homepage");
  }

}

module.exports={HomePageItem};
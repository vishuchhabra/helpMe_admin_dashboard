const Post = require("../models/post");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Post.findById(id)
    .populate("category")
    .exec((err, post) => {
      if (err) {
        return res.status(400).json({
          error: "Post not found"
        });
      }
      req.post = post;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }
    //destructure the fields
    const { name, description, address, category, amountDonated } = fields;

    // Protecting the money to donated more
    if (!name || !description || !address || !category || amountDonated!=0) {
      return res.status(400).json({
        error: "Please include all fields"
      });
    }

    let post = new Post(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      post.photo.data = fs.readFileSync(file.photo.path);
      post.photo.contentType = file.photo.type;
    }
    // console.log(post);

    //save to the DB
    post.save((err, post) => {
      if (err) {
        console.log(err)
        res.status(400).json({
          error: "Saving Post in DB failed"
        });
      }
      res.json(post);
    });
  });
};

exports.getProduct = (req, res) => {
  req.post.photo = undefined;
  return res.json(req.post);
};

//middleware
exports.photo = (req, res, next) => {
  if (req.post.photo.data) {
    res.set("Content-Type", req.post.photo.contentType);
    return res.send(req.post.photo.data);
  }
  next();
};

// delete controllers
exports.deleteProduct = (req, res) => {
  let post = req.post;
  //update the value of post instead of deleting
  Post.updateOne({_id:post._id},{$set:{archive:true}}).exec((err,data)=>{
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the post"
      });
    }
    res.json({
      message: "Deletion was a success",
      data
    });
  });
};

// delete controllers
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    //updation code
    let post = req.post;
    post = _.extend(post, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      post.photo.data = fs.readFileSync(file.photo.path);
      post.photo.contentType = file.photo.type;
    }
    // console.log(post);

    //save to the DB
    post.save((err, post) => {
      if (err) {
        res.status(400).json({
          error: "Updation of post failed"
        });
      }
      res.json(post);
    });
  });
};

//post listing

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 10000;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Post.find({archive:false})
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "NO post FOUND"
        });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Post.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NO category found"
      });
    }
    res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map(prod => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } }
      }
    };
  });

  Post.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed"
      });
    }
    next();
  });
};

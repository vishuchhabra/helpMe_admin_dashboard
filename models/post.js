const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
{
    archive:{
      type:Boolean,
      default:false
    },
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32
    },
    address:{
      type:String,
      required:true,
      maxlength:2000
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000
    },
    amountDonated: {
      type: Number,
      trim: true,
      default:0
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true
    },
    photo: {
      data: Buffer,
      contentType: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);

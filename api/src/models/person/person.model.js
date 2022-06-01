const mongoose = require("mongoose");
const { GENDERS } = require("../enum");

const personSchema = new mongoose.Schema(
  {
    name: { type: String },
    gender: { type: String, enum: GENDERS },
    dob: { type: Date },
    pob: { type: String },
    job: { type: String },
    biography: { type: String },
    avatarUrl: { type: String },
    images: { type: [String] },
    // joined: {type: [mongoose.SchemaTypes.ObjectId], ref: ""}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Person", personSchema);

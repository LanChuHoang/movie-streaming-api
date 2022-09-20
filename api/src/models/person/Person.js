const mongoose = require("mongoose");
const { GENDERS, JOBS } = require("../enum");

const personSchema = new mongoose.Schema(
  {
    name: { type: String },
    gender: { type: String, enum: GENDERS },
    dob: { type: Date },
    pob: { type: String },
    job: { type: String, enum: JOBS },
    biography: { type: String },
    avatarUrl: { type: String },
    images: { type: [String] },
    tmdbID: { type: Number },
    // joined: {type: [mongoose.SchemaTypes.ObjectId], ref: ""}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Person", personSchema);

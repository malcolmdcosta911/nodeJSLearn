const mongoose = require("mongoose");
const Joi = require("joi");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
      },
      isGold: {
        type: Boolean,
        required: true,
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true, //check ?
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    default: Date.now,
    required: true,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

rentalSchema.static({
  lookup: function (customerId, movieId) {
    return this.findOne({
      "customer._id": customerId,
      "movie._id": movieId,
    });
  },
  //   , findByCost: function () {..}
});

//diff from mosh
rentalSchema.methods.return = function () {
  // Assuming date1 and date2 are your Date.now() strings
  const date1 = new Date(this.dateOut);
  const date2 = new Date();

  // Calculate the difference in milliseconds
  const diffInMs = date2.getTime() - date1.getTime();

  // Convert the difference to days
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  this.rentalFee = this.movie.dailyRentalRate * Math.ceil(diffInDays); //instead of Math.ceil calculate on schema before store
  this.dateReturned = date2;
  // return this.save();
};

//after methods and static
const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
  const schema = Joi.object({
    movieId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("must be an oid")
      .required(),
    customerId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("must be an oid")
      .required(),
  });

  return schema.validate(rental);
}

module.exports.validate = validateRental;
module.exports.Rental = Rental;

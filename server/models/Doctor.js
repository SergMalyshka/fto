const { Schema, model } = require("mongoose");
const bcrypt = require('bcrypt')

const doctorSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
},
{
    toJSON: {
      virtuals: true,
    },
  }
);

// has the password
doctorSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

doctorSchema.methods.isCorrectPassword = async function(password) {
  return bcrypt.compare(password, this.password);
}

const Doctor = model('Doctor', doctorSchema);

module.exports = Doctor

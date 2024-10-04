
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Visit = require('../models/Visit')
const Rooms = require('../models/Rooms')
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) =>{
      console.log(context.doctor)
      if (context.doctor) {
        return Doctor.findOne({ _id: context.doctor._id });
      }
      throw AuthenticationError
    },
  },

  Mutation: {
    login: async (parent, { username, password }) => {
      const doctor = await Doctor.findOne({ username });

      if (!doctor) {
        throw AuthenticationError;
      }

      const correctPw = await doctor.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(doctor);
      return { token, doctor };
    },


  },
}

module.exports = resolvers;

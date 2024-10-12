const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  citizenship: String,
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  pesel: String,
  sanitaryStatus: String,
  address: {
    street: String,
    houseNumber: String,
    apartmentNumber: String,
    postalCode: String,
    city: String,
    district: String,
  },
  nfzBranch: String,
  studentStatus: Boolean,
  employmentStatus: Boolean,
  pensionStatus: Boolean,
  rentStatus: Boolean,
  businessStatus: Boolean,
});

const Signup = mongoose.model('Signup', signupSchema);
module.exports = Signup;
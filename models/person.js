const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


//const url = process.env.MONGODB_URI
const url = "mongodb+srv://emmatesti:leevikissa@cluster0.inku0.mongodb.net/Puhelinluettelo?retryWrites=true&w=majority&appName=Cluster0"
console.log('connecting to', url)
mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3, 
    required: true
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{5,10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number format! Format should be "09-1234556" or "040-22334455".`
    }
  }
});


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)
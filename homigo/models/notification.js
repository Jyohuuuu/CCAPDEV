import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  booking: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking' 
  }, // Linked booking
  property: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property' 
  }, // Linked property
  message: { 
    type: String, 
    required: true 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  type: { 
    type: String, 
    enum: ['booking_created', 'booking_deleted', 'review_added'], 
    required: true 
  }, 
}, { timestamps: true });

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
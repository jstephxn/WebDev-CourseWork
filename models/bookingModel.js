
// models/bookingModel.js
import { bookingsDb } from './_db.js';


export const BookingModel = {
  async create(booking) {
    return bookingsDb.insert({ ...booking, createdAt: new Date().toISOString() });
  },
  async find(query){
    return bookingsDb.find(query)
  },

  async findById(id) {
    return bookingsDb.findOne({ _id: id });
  },

  async findByCourseId(courseId){
    return bookingsDb.find({courseId})
  },

  async findBySessionId(sessionId) {
    return bookingsDb.find({ 
      sessionIds: { $in: [sessionId] } 
    });
  },
  async listByUser(userId) {
    return bookingsDb.find({ userId }).sort({ createdAt: -1 });
  },
  async cancel(id) {
    await bookingsDb.update({ _id: id }, { $set: { status: 'CANCELLED' } });
    return this.findById(id);
  },
  async findByUserAndCourse(courseId, userId){
    return bookingsDb.findOne({
      userId : userId, 
      courseId: courseId, 
      type: "COURSE"
    });
  },
  async findByUserAndSession(userId, sessionId){
    return bookingsDb.findOne({
      userId,
      type: "SESSION",
      sessionIds: sessionId
    });
  }

};
``

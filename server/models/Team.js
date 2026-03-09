const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name:   { type: String, required: true, trim: true },
  rollNo: { type: String, required: true, trim: true, uppercase: true },
  email:  { type: String, trim: true },
  phone:  { type: String, trim: true },
  isLead: { type: Boolean, default: false },
});

const TeamSchema = new mongoose.Schema({
  registrationId:   { type: String, unique: true },
  teamName:         { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 50 },
  track:            {
    type: String,
    required: true,
    enum: ['Healthcare', 'Agriculture', 'Finance', 'Artificial Intelligence', 'Student Innovation'],
  },
  problemStatement: { type: String, required: true, trim: true, minlength: 100, maxlength: 500 },
  members:          { type: [MemberSchema], validate: { validator: v => v.length >= 1 && v.length <= 4, message: 'Team must have 1 to 4 members.' } },
  registeredAt:     { type: Date, default: Date.now },
});

// Prevent duplicate roll numbers across all teams (db-level)
TeamSchema.index({ 'members.rollNo': 1 }, { unique: true });

// Auto-generate registrationId before saving
TeamSchema.pre('save', async function (next) {
  if (!this.registrationId) {
    const count = await mongoose.model('Team').countDocuments();
    this.registrationId = `HB2026-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Team', TeamSchema);

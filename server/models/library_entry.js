var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LibraryEntrySchema = new Schema(
    {
        media_id: { type: Number, required: true, immutable: true },
        is_tv: { type: Boolean, required: true, default: false , immutable: true },

        personal_rating: { type: Number, default: 0 },
        watched: { type: Boolean, default: true },
        tags: [{ type: String }],
    }
);

module.exports = mongoose.model('LibraryEntry', LibraryEntrySchema);


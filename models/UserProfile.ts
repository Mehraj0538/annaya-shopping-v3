import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserProfile extends Document {
  userId:   string;
  email:    string;
  name:     string;
  picture?: string;
  wishlist: mongoose.Types.ObjectId[];
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId:  { type: String, required: true, unique: true, index: true },
    email:   { type: String, required: true },
    name:    { type: String, required: true },
    picture: { type: String },
    wishlist:[{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

const UserProfile: Model<IUserProfile> =
  (mongoose.models.UserProfile as Model<IUserProfile>) ||
  mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);

export default UserProfile;

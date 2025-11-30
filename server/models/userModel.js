import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: false,
      default : null ,
      minlength: 6,
    },

    providerId : {
        type : String ,
        required : false ,
        default : null ,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    history: [
      {
        toolName: String,
        input: mongoose.Schema.Types.Mixed,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);


export const User = mongoose.model("User", userSchema);



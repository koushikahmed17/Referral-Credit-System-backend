import mongoose, { Schema, Document } from "mongoose";

export interface IReferral extends Document {
  referrerId: string;
  referredUserId: string;
  referralCode: string;
  status: "pending" | "completed" | "cancelled";
  rewardAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema = new Schema<IReferral>(
  {
    referrerId: {
      type: String,
      required: [true, "Referrer ID is required"],
      ref: "User",
    },
    referredUserId: {
      type: String,
      required: [true, "Referred user ID is required"],
      ref: "User",
    },
    referralCode: {
      type: String,
      required: [true, "Referral code is required"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    rewardAmount: {
      type: Number,
      default: 0,
      min: [0, "Reward amount cannot be negative"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for better performance
referralSchema.index({ referrerId: 1 });
referralSchema.index({ referredUserId: 1 });
referralSchema.index({ referralCode: 1 });
referralSchema.index({ status: 1 });
referralSchema.index({ createdAt: -1 });

export const ReferralModel = mongoose.model<IReferral>(
  "Referral",
  referralSchema
);

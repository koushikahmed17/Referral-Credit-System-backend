import mongoose, { Schema, Document } from "mongoose";
import { ReferralStatus } from "../entities/Referral";

export interface IReferral extends Document {
  referrerId: mongoose.Types.ObjectId;
  referredUserId: mongoose.Types.ObjectId;
  status: ReferralStatus;
  creditsEarned: number;
  confirmedAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema = new Schema<IReferral>(
  {
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Referrer ID is required"],
      index: true,
    },
    referredUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Referred user ID is required"],
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ReferralStatus),
      default: ReferralStatus.PENDING,
      required: true,
    },
    creditsEarned: {
      type: Number,
      default: 0,
      min: [0, "Credits earned cannot be negative"],
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
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

// Compound indexes for better query performance
referralSchema.index({ referrerId: 1, referredUserId: 1 }, { unique: true });
referralSchema.index({ referrerId: 1, status: 1 });
referralSchema.index({ referredUserId: 1, status: 1 });
referralSchema.index({ status: 1, createdAt: -1 });

// Pre-save middleware to handle status changes
referralSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    const now = new Date();

    if (this.status === ReferralStatus.CONFIRMED && !this.confirmedAt) {
      this.confirmedAt = now;
    }

    if (this.status === ReferralStatus.CANCELLED && !this.cancelledAt) {
      this.cancelledAt = now;
    }
  }

  next();
});

// Static method to find referrals by referrer
referralSchema.statics.findByReferrer = function (referrerId: string) {
  return this.find({ referrerId }).populate(
    "referredUserId",
    "firstName lastName email"
  );
};

// Static method to find referrals by referred user
referralSchema.statics.findByReferredUser = function (referredUserId: string) {
  return this.find({ referredUserId }).populate(
    "referrerId",
    "firstName lastName email"
  );
};

export const ReferralModel = mongoose.model<IReferral>(
  "Referral",
  referralSchema
);

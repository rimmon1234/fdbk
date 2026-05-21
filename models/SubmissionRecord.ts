import { Model, Schema, Types, model, models } from "mongoose";

export interface ISubmissionRecord {
  userId: Types.ObjectId;
  surveyId: Types.ObjectId;
  submittedAt: Date;
}

const submissionRecordSchema = new Schema<ISubmissionRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    surveyId: { type: Schema.Types.ObjectId, ref: "Survey", required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

submissionRecordSchema.index({ userId: 1, surveyId: 1 }, { unique: true });

const SubmissionRecord: Model<ISubmissionRecord> =
  models.SubmissionRecord || model<ISubmissionRecord>("SubmissionRecord", submissionRecordSchema);

export default SubmissionRecord;

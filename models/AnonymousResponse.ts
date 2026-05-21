import { Model, Schema, Types, model, models } from "mongoose";

export interface IAnonymousAnswer {
  questionId: Types.ObjectId;
  questionType: string;
  value: unknown;
}

export interface IAnonymousResponse {
  surveyId: Types.ObjectId;
  submittedAt: Date;
  answers: string | IAnonymousAnswer[];
}

const anonymousAnswerSchema = new Schema<IAnonymousAnswer>(
  {
    questionId: { type: Schema.Types.ObjectId },
    questionType: { type: String },
    value: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const anonymousResponseSchema = new Schema<IAnonymousResponse>(
  {
    surveyId: { type: Schema.Types.ObjectId, ref: "Survey", required: true },
    submittedAt: { type: Date, default: Date.now },
    answers: {
      type: Schema.Types.Mixed,
      required: true,
      validate: {
        validator: (value: unknown) => typeof value === "string" || Array.isArray(value),
        message: "answers must be an encrypted string or answer array",
      },
    },
  },
  { timestamps: false }
);

anonymousResponseSchema.path("answersArray", [anonymousAnswerSchema]);

const AnonymousResponse: Model<IAnonymousResponse> =
  models.AnonymousResponse || model<IAnonymousResponse>("AnonymousResponse", anonymousResponseSchema);

export default AnonymousResponse;

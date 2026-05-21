import { Model, Schema, Types, model, models } from "mongoose";

export interface IAnonymousAnswer {
  questionId: Types.ObjectId;
  questionType: string;
  value: unknown;
}

export interface IAnonymousResponse {
  surveyId: Types.ObjectId;
  answers: string | IAnonymousAnswer[];
}

const anonymousResponseSchema = new Schema<IAnonymousResponse>(
  {
    surveyId: { type: Schema.Types.ObjectId, ref: "Survey", required: true },
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

const AnonymousResponse: Model<IAnonymousResponse> =
  models.AnonymousResponse || model<IAnonymousResponse>("AnonymousResponse", anonymousResponseSchema);

export default AnonymousResponse;

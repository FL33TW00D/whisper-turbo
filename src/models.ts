import { Result } from "true-myth";
import ModelDB from "./db/modelDB";
import { DBModel } from "./db/types";

export enum AvailableModels {
    WHISPER_TINY = "whisper-tiny",
    WHISPER_BASE = "whisper-base",
    WHISPER_SMALL = "whisper-small",
    WHISPER_MEDIUM = "whisper-medium",
    WHISPER_LARGE = "whisper-large",
}

export class Model {
    name: string;
    data: Uint8Array;
    tokenizer: Uint8Array;

    constructor(name: string, data: Uint8Array, tokenizer: Uint8Array) {
        this.name = name;
        this.data = data;
        this.tokenizer = tokenizer;
    }

    static async fromDBModel(
        dbModel: DBModel,
        db: ModelDB
    ): Promise<Result<Model, Error>> {
        const tokenizerResult = await db.getTokenizer(dbModel.ID);
        let tokenizerBytes: Uint8Array | undefined = undefined;
        if (tokenizerResult.isOk) {
            tokenizerBytes = tokenizerResult.value.bytes;
        }

        return Result.ok(
            new Model(dbModel.name, dbModel.bytes, tokenizerBytes!)
        );
    }
}

export interface EncoderDecoder {
    name: string;
    encoder: Model;
    decoder: Model;
    config: Uint8Array;
    tokenizer: Uint8Array;
}

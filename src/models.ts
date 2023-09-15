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

export const ModelSizes: Map<AvailableModels, number> = new Map([
    [AvailableModels.WHISPER_TINY, 150 * 1024 * 1024],
    [AvailableModels.WHISPER_BASE, 280 * 1024 * 1024],
    [AvailableModels.WHISPER_SMALL, 650 * 1024 * 1024],
    [AvailableModels.WHISPER_MEDIUM, 1.75 * 1024 * 1024 * 1024],
    [AvailableModels.WHISPER_LARGE, 3.3 * 1024 * 1024 * 1024],
]);

export class Model {
    name: string;
    data: Uint8Array[];
    tokenizer: Uint8Array;

    constructor(name: string, data: Uint8Array[], tokenizer: Uint8Array) {
        this.name = name;
        this.data = data;
        this.tokenizer = tokenizer;
    }

    static async fromDBModel(
        dbModel: DBModel,
        db: ModelDB
    ): Promise<Result<Model, Error>> {
        const tokenizerResult = await db.getTokenizer(dbModel.ID);
        if (tokenizerResult.isErr) {
            return Result.err(tokenizerResult.error);
        }
        const tokenizerBytes = tokenizerResult.value.bytes;
        const modelChunksResult = await db.getModelChunks(dbModel.ID);
        if (modelChunksResult.isErr) {
            return Result.err(modelChunksResult.error);
        }
        const modelChunks = modelChunksResult.value;
        modelChunks.sort((a, b) => a.chunkIndex - b.chunkIndex);
        const data = modelChunks.map((chunk) => chunk.chunk);

        return Result.ok(new Model(dbModel.name, data, tokenizerBytes));
    }
}

export interface EncoderDecoder {
    name: string;
    encoder: Model;
    decoder: Model;
    config: Uint8Array;
    tokenizer: Uint8Array;
}

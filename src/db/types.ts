///It may be a sub-component of a larger model
export interface DBModel {
    name: string;
    parentID: string; //Non unique, same for encoder and decoder
    bytes: Uint8Array;
    index: number; //Encoder 0, Decoder 1, etc
    tensorIDs: string[];
}

export interface ModelWithKey {
    id: string; //id of the model sub-component
    model: DBModel;
}

export interface DBTensor {
    name: string;
    bytes: Uint8Array;
}

export interface DBConfig {
    bytes: Uint8Array;
    parentID: string;
}

export interface DBTokenizer {
    bytes: Uint8Array;
    parentID: string;
}

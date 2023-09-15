export interface DBModel {
    name: string;
    ID: string;
}

//Firefox only supports 256MB chunks
//And saves memory
export interface DBModelChunk {
    chunk: Uint8Array;
    chunkIndex: number;
    modelID: string;
}
        

export interface DBTokenizer {
    bytes: Uint8Array;
    modelID: string;
}

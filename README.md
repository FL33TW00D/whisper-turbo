<div align="center">
<img width="550px" height="200px" src="https://github.com/FL33TW00D/whisper-turbo/raw/master/.github/whisper-turbo.png">
<p><a href="https://whisper-turbo.com">Demo Site</a> | <a href="">Docs</a> | <a href="https://github.com/users/FL33TW00D/projects/1"> Roadmap </a></p>
</div>

## What is Whisper Turbo?
Whisper Turbo is a fast, **cross-platform** Whisper implementation, designed to run entirely client-side in your browser/electron app.

With Whisper Turbo, you can add transcription to any app in minutes.

Check out [Getting Started]() for more.

## Supported Platforms

WebGPU is only officially supported on Chromium based browsers running on Windows & MacOS.
For Linux support, check [here](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status).

## Getting Started 

Install whisper-turbo:
```bash
npm install whisper-turbo
```

```typescript
const session = useRef<InferenceSession | null>(null);

const loadModel = async () => {
    //The session manager handles constructing the inference session.
    const manager = new SessionManager();
    const loadResult = await manager.loadModel(
        AvailableModels.WHISPER_TINY,
        () => { console.log("loaded!") },
        (progress: number) => { console.log("Loading: ", progress) }
    );
    if (loadResult.isErr) {
        console.log("Failed to load!");
    } else {
        session.current = loadResult.value;
    }
};

const runSession = async () => {
    await session.current.transcribe(
        your_uint8_array,
        true/false,
        (s) => {
            console.log("Segment!") 
        }
    );
};
```

## Docs

Coming soon

## Want to get involved?

- Are you a GPU wizard?
- Do you know what a HRTB is in Rust?
- Do you know what is going on [here](https://github.com/RuyiLi/cursed-typescript/blob/master/random/game-of-life.ts)?
- Reach out: chris@fleetwood.dev

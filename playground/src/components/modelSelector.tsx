import { useState } from "react";
import { AvailableModels, ModelSizes } from "whisper-turbo";
import { humanFileSize } from "../util";

interface ModelSelectorProps {
    selectedModel: AvailableModels | null;
    setSelectedModel: (model: AvailableModels) => void;
    loaded: boolean;
    progress: number;
}

const ModelSelector = (props: ModelSelectorProps) => {
    const { selectedModel, setSelectedModel, loaded, progress } = props;

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const displayModels = () => {
        const models = Object.values(AvailableModels).slice(0, -1);
        const sizes = Array.from(ModelSizes.values()).slice(0, -1);
        const zipped = models.map((model, i) => [model, sizes[i]]);
        return zipped.map((model, idx) => (
            <li key={model[0] as string}>
                <a
                    className={`bg-orange-500 hover:bg-pop-orange py-2 px-8 font-semibold text-xl block whitespace-no-wrap cursor-pointer ${
                        idx === zipped.length - 1 ? "rounded-b-md" : ""
                    }`}
                    onClick={() => {
                        setSelectedModel(model[0] as AvailableModels);
                        setDropdownOpen(false);
                    }}
                >
                    {fmtModel(model[0] as AvailableModels)}{" "}
                    {humanFileSize(model[1] as number)}
                </a>
            </li>
        ));
    };

    const fmtModel = (model: AvailableModels) => {
        let name = model as string;
        name = name.charAt(0).toUpperCase() + name.slice(1);
        return name;
    };

    return (
        <>
            <div className="flex flex-row justify-between">
                <label className="text-white text-xl font-semibold">
                    Select Model
                </label>
                {progress > 0 && !loaded && (
                    <label className="text-white text-xl font-semibold text-right">
                        {progress.toFixed(2)}%
                    </label>
                )}
            </div>
            <div className="group inline-block relative w-full">
                <button
                    className="bg-pop-orange text-white font-semibold text-xl py-2.5 px-8 w-full inline-flex items-center outline outline-white"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <span className="mr-1">
                        {selectedModel
                            ? fmtModel(selectedModel)
                            : "Select Model"}
                    </span>
                    <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </button>
                <ul
                    className="absolute text-white group-hover:block z-10 w-full"
                    style={{
                        display: dropdownOpen ? "block" : "none",
                    }}
                >
                    {displayModels()}
                </ul>
            </div>
        </>
    );
};

export default ModelSelector;

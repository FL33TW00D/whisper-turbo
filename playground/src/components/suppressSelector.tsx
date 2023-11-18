import React, { useState } from "react";
import { ConfigOptions } from "./configModal";

interface SuppressComponentProps {
    configOptions: ConfigOptions;
    setConfigOptions: React.Dispatch<React.SetStateAction<ConfigOptions>>;
}

const SuppressComponent = (props: SuppressComponentProps) => {
    const [checkedState, setCheckedState] = useState({
        suppress_non_speech: props.configOptions.suppress_non_speech
    });

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedState({
            ...checkedState,
            [event.target.name]: event.target.checked
        });

        props.setConfigOptions({
            ...props.configOptions,
            suppress_non_speech: event.target.checked
        });
    };

    return (
        <div className="flex flex-col">
            <label className="text-2xl mr-auto">Suppress Tokens</label>
            <div className="mt-2 flex flex-col">
                <div className="flex flex-row w-36 items-center mt-2">
                    <label className=" text-left text-2xl mr-auto w-full">
                        Non Speech 
                    </label>
                    <input
                        id="translate-checkbox"
                        type="checkbox"
                        name="suppress_non_speech"
                        checked={checkedState.suppress_non_speech}
                        onChange={handleOnChange}
                        className="form-checkbox ml-auto h-7 w-7 text-blue-600"
                    />
                </div>
            </div>
        </div>
    );
};

export default SuppressComponent;

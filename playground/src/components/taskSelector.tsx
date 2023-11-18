import React, { useState } from "react";
import { ConfigOptions } from "./configModal";
import { Task } from "whisper-turbo";

interface TaskComponentProps {
    configOptions: ConfigOptions;
    setConfigOptions: React.Dispatch<React.SetStateAction<ConfigOptions>>;
}

const TaskComponent = (props: TaskComponentProps) => {
    let state = {
        translate: props.configOptions.task === Task.Translate,
        transcribe: props.configOptions.task === Task.Transcribe,
    };

    const [checkedState, setCheckedState] = useState(state);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedState({
            ...checkedState,
            [event.target.name]: event.target.checked,
        });
        if (event.target.name === "translate")
            setCheckedState({
                translate: event.target.checked,
                transcribe: !event.target.checked,
            });
        if (event.target.name === "transcribe")
            setCheckedState({
                translate: !event.target.checked,
                transcribe: event.target.checked,
        });
        props.setConfigOptions((prev: ConfigOptions) => ({
            ...prev,
            task:
                event.target.name === "translate"
                    ? Task.Translate
                    : Task.Transcribe,
        }));
    };

    return (
        <div className="flex flex-col">
            <label className="text-2xl mr-auto">Task</label>
            <div className="mt-2 flex flex-col">
                <div className="flex flex-row w-36 items-center mt-2">
                    <label className=" text-left text-2xl mr-auto w-full">
                        Transcribe
                    </label>
                    <input
                        id="translate-checkbox"
                        type="checkbox"
                        name="transcribe"
                        checked={checkedState.transcribe}
                        onChange={handleOnChange}
                        className="form-checkbox ml-auto h-7 w-7 text-blue-600"
                    />
                </div>

                <div className="flex flex-row w-36 items-center mt-2">
                    <label className=" text-left text-2xl mr-auto w-full">
                        Translate
                    </label>
                    <input
                        id="translate-checkbox"
                        type="checkbox"
                        name="translate"
                        checked={checkedState.translate}
                        onChange={handleOnChange}
                        className="form-checkbox ml-auto h-7 w-7 text-blue-600"
                    />
                </div>
            </div>
        </div>
    );
};

export default TaskComponent;

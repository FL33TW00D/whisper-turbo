const ProgressBar = ({ progress, loaded }: any) => {
    return (
        <>
            {progress > 0 && progress < 100 && !loaded && (
                <div className="flex flex-col gap-2">
                    <div className="h-3 outline outline-white bg-gray-200">
                        <div
                            className="bg-emerald-500 h-3"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProgressBar;

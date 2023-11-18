import React, { useState } from "react";
import { ConfigOptions } from "./configModal";

const AvailableLanguages = {
    en: "English",
    zh: "Chinese",
    de: "German",
    es: "Spanish",
    ru: "Russian",
    ko: "Korean",
    fr: "French",
    ja: "Japanese",
    pt: "Portuguese",
    tr: "Turkish",
    pl: "Polish",
    ca: "Catalan",
    nl: "Dutch",
    ar: "Arabic",
    sv: "Swedish",
    it: "Italian",
    id: "Indonesian",
    hi: "Hindi",
    fi: "Finnish",
    vi: "Vietnamese",
    he: "Hebrew",
    uk: "Ukrainian",
    el: "Greek",
    ms: "Malay",
    cs: "Czech",
    ro: "Romanian",
    da: "Danish",
    hu: "Hungarian",
    ta: "Tamil",
    no: "Norwegian",
    th: "Thai",
    ur: "Urdu",
    hr: "Croatian",
    bg: "Bulgarian",
    lt: "Lithuanian",
    la: "Latin",
    mi: "Maori",
    ml: "Malayalam",
    cy: "Welsh",
    sk: "Slovak",
    te: "Telugu",
    fa: "Persian",
    lv: "Latvian",
    bn: "Bengali",
    sr: "Serbian",
    az: "Azerbaijani",
    sl: "Slovenian",
    kn: "Kannada",
    et: "Estonian",
    mk: "Macedonian",
    br: "Breton",
    eu: "Basque",
    is: "Icelandic",
    hy: "Armenian",
    ne: "Nepali",
    mn: "Mongolian",
    bs: "Bosnian",
    kk: "Kazakh",
    sq: "Albanian",
    sw: "Swahili",
    gl: "Galician",
    mr: "Marathi",
    pa: "Punjabi",
    si: "Sinhala",
    km: "Khmer",
    sn: "Shona",
    yo: "Yoruba",
    so: "Somali",
    af: "Afrikaans",
    oc: "Occitan",
    ka: "Georgian",
    be: "Belarusian",
    tg: "Tajik",
    sd: "Sindhi",
    gu: "Gujarati",
    am: "Amharic",
    yi: "Yiddish",
    lo: "Lao",
    uz: "Uzbek",
    fo: "Faroese",
    ht: "Haitian creole",
    ps: "Pashto",
    tk: "Turkmen",
    nn: "Nynorsk",
    mt: "Maltese",
    sa: "Sanskrit",
    lb: "Luxembourgish",
    my: "Myanmar",
    bo: "Tibetan",
    tl: "Tagalog",
    mg: "Malagasy",
    as: "Assamese",
    tt: "Tatar",
    haw: "Hawaiian",
    ln: "Lingala",
    ha: "Hausa",
    ba: "Bashkir",
    jw: "Javanese",
    su: "Sundanese",
    yue: "Cantonese",
};

interface LanguageDropdownProps {
    configOptions: ConfigOptions;
    setConfigOptions: React.Dispatch<React.SetStateAction<ConfigOptions>>;
}

const LanguageDropdown = (props: LanguageDropdownProps) => {
    const [open, setOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
        props.configOptions.language
    );

    const toggleOpen = () => setOpen((prev) => !prev);

    const selectLanguage = (lang: string) => {
        props.setConfigOptions((prev: ConfigOptions) => ({
            ...prev,
            language: lang,
        }));
        setSelectedLanguage(lang);
        setOpen(false);
    };

    return (
        <div className="relative">
            <div className="flex flex-col items-center justify-center">
                <label
                    id="options-menu"
                    className="text-2xl pb-1 font-medium text-white mr-auto "
                >
                    Source Language
                </label>
                <button
                    onClick={toggleOpen}
                    className="relative z-10 block px-4 py-1.5 bg-white text-left w-full rounded-md font-medium text-gray-700"
                >
                    {selectedLanguage || "Select a language"}
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </button>
            </div>

            {open && (
                <div className="absolute z-20 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        {Object.entries(AvailableLanguages).map(
                            ([lang, name]) => (
                                <a
                                    key={lang}
                                    href="#"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                    onClick={() => selectLanguage(lang)}
                                >
                                    {name}
                                </a>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageDropdown;

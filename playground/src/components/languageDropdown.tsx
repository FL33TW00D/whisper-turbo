import React, { useState } from "react";

const AvailableLanguages = {
    en: "english",
    zh: "chinese",
    de: "german",
    es: "spanish",
    ru: "russian",
    ko: "korean",
    fr: "french",
    ja: "japanese",
    pt: "portuguese",
    tr: "turkish",
    pl: "polish",
    ca: "catalan",
    nl: "dutch",
    ar: "arabic",
    sv: "swedish",
    it: "italian",
    id: "indonesian",
    hi: "hindi",
    fi: "finnish",
    vi: "vietnamese",
    he: "hebrew",
    uk: "ukrainian",
    el: "greek",
    ms: "malay",
    cs: "czech",
    ro: "romanian",
    da: "danish",
    hu: "hungarian",
    ta: "tamil",
    no: "norwegian",
    th: "thai",
    ur: "urdu",
    hr: "croatian",
    bg: "bulgarian",
    lt: "lithuanian",
    la: "latin",
    mi: "maori",
    ml: "malayalam",
    cy: "welsh",
    sk: "slovak",
    te: "telugu",
    fa: "persian",
    lv: "latvian",
    bn: "bengali",
    sr: "serbian",
    az: "azerbaijani",
    sl: "slovenian",
    kn: "kannada",
    et: "estonian",
    mk: "macedonian",
    br: "breton",
    eu: "basque",
    is: "icelandic",
    hy: "armenian",
    ne: "nepali",
    mn: "mongolian",
    bs: "bosnian",
    kk: "kazakh",
    sq: "albanian",
    sw: "swahili",
    gl: "galician",
    mr: "marathi",
    pa: "punjabi",
    si: "sinhala",
    km: "khmer",
    sn: "shona",
    yo: "yoruba",
    so: "somali",
    af: "afrikaans",
    oc: "occitan",
    ka: "georgian",
    be: "belarusian",
    tg: "tajik",
    sd: "sindhi",
    gu: "gujarati",
    am: "amharic",
    yi: "yiddish",
    lo: "lao",
    uz: "uzbek",
    fo: "faroese",
    ht: "haitian creole",
    ps: "pashto",
    tk: "turkmen",
    nn: "nynorsk",
    mt: "maltese",
    sa: "sanskrit",
    lb: "luxembourgish",
    my: "myanmar",
    bo: "tibetan",
    tl: "tagalog",
    mg: "malagasy",
    as: "assamese",
    tt: "tatar",
    haw: "hawaiian",
    ln: "lingala",
    ha: "hausa",
    ba: "bashkir",
    jw: "javanese",
    su: "sundanese",
    yue: "cantonese",
};

const LanguageDropdown = () => {
    const [open, setOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
        null
    );

    const toggleOpen = () => setOpen((prev) => !prev);
    const selectLanguage = (lang: string) => {
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
                    className="relative z-10 block px-4 py-1 bg-white text-left w-full rounded-md font-medium text-gray-700"
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
                                    onClick={() => selectLanguage(name)}
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

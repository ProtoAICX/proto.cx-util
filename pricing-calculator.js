// Start pricing calculator
const FREE_MESSAGES = 1000;
const PER_AGENT_PRICE = 1500;
const ADD_ON_PRICES = {
    "pro-gpt-core": 499,
    "pro-gpt-max": 4999,
    "pro-analytics": 1499,
    "pro-data": 1499,
    "pro-agents": 0,
}
const DEFAULT_ENABLED_ADDONS = [
    "pro-apps",
    "pro-active",
]

function debounce(cb, delay = 250) {
    let timeout

    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(...args)
        }, delay)
    }
}

function formatPrice(price) {
    return price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

function updateAddonTags(enabledAddOns) {
    const wrapperEle = document.getElementById("addon-tags-wrapper");

    const enabledAddOnsWithIdPrefix = [...DEFAULT_ENABLED_ADDONS, ...enabledAddOns].map((addOn) => `addon-tag-${addOn}`);

    Array.from(wrapperEle.children).forEach((child) => {
        if (enabledAddOnsWithIdPrefix.includes(child.id)) {
            child.classList.remove("tag-is-hidden");
        } else {
            child.classList.add("tag-is-hidden");
        }
    });
}

function calculatePrice(messagesPerMonth, enabledAddOns, agents) {
    const priceEle = document.getElementById("cost-title");
    const perMessageEle = document.getElementById("per-message-title");
    const perMessageDescriptionEle = document.getElementById("per-message-description");

    let pricePerMessage;

    if (messagesPerMonth <= FREE_MESSAGES) {
        pricePerMessage = 0;
    } else if (enabledAddOns.includes("pro-gpt-max")) {
        pricePerMessage = 0.04;
    } else {
        pricePerMessage = 0.02;
    }
    perMessageEle.innerText = pricePerMessage;
    perMessageDescriptionEle.innerText = pricePerMessage;


    let total;
    if (messagesPerMonth > FREE_MESSAGES) {
        total = (messagesPerMonth - FREE_MESSAGES) * pricePerMessage;
    } else {
        total = 0;
    }
    
    enabledAddOns.forEach((addOn) => {
        total += ADD_ON_PRICES[addOn];
    });

    if (agents && enabledAddOns.includes("pro-agents")) {
        total += agents * PER_AGENT_PRICE;
    }

    updateAddonTags(enabledAddOns);

    priceEle.innerText = formatPrice(total);
}

function searchParamsInterface() {
    const urlParams = new URLSearchParams(window.location.search);
    const debouncedUpdate = debounce(() => {
        window.history.replaceState({}, "", `?${urlParams.toString()}`);
    })

    return {
        get: (key) => urlParams.get(key),
        set: (key, value) => {
            urlParams.set(key, value);
            debouncedUpdate();
        },
        delete: (key) => {
            urlParams.delete(key);
            debouncedUpdate();
        },
        toString: () => urlParams.toString(),
    };
}

function registerEventHandlers() {
    const rangeSliderEle = document.getElementById("messages-range-input");
    const numberInputEle = document.getElementById("messages-number-input");
    const urlParams = searchParamsInterface();
    const selectedAddOns = []
    let messagesPerMonthCache = 0;
    
    const proAgentsInputEle = document.getElementById("agents-number-input");

    Inputmask("integer", {
        groupSeparator: ",",
        allowMinus: false,
        max: 999999,
        onKeyValidation: function (key, result) {
            const value = numberInputEle.value.replace(/,/g, '');
            rangeSliderEle.style.setProperty("--value", value); // For CSS
            messagesPerMonthCache = parseInt(value);
            rangeSliderEle.value = "" + messagesPerMonthCache;
            urlParams.set("messagesPerMonth", "" + messagesPerMonthCache);
            calculatePrice(messagesPerMonthCache, selectedAddOns, proAgentsInputEle.value);
        }
    }).mask(numberInputEle);

    rangeSliderEle.addEventListener("input", (e) => {
        rangeSliderEle.style.setProperty("--value", e.target.value); // For CSS
        messagesPerMonthCache = parseInt(e.target.value);
        numberInputEle.value = "" + messagesPerMonthCache;
        urlParams.set("messagesPerMonth", "" + messagesPerMonthCache);
        calculatePrice(messagesPerMonthCache, selectedAddOns, proAgentsInputEle.value);
    });

    // Add-on Checkboxes
    const proDataCheckboxEle = document.querySelector("input[name='pro-data']");
    const proAnalyticsCheckboxEle = document.querySelector("input[name='pro-analytics']");

    const addOnCheckboxes = [
        proDataCheckboxEle,
        proAnalyticsCheckboxEle,
    ];

    addOnCheckboxes.forEach((checkboxEle) => {
        checkboxEle.addEventListener("change", (e) => {
            const checked = e.target.checked;
            const name = e.target.name;

            if (checked) {
                selectedAddOns.push(name);
                urlParams.set("addOns", selectedAddOns.join(","));
            } else {
                const index = selectedAddOns.indexOf(name);
                if (index > -1) {
                    selectedAddOns.splice(index, 1);
                }
                if (selectedAddOns.length === 0) {
                    urlParams.delete("addOns");
                } else {
                    urlParams.set("addOns", selectedAddOns.join(","));
                }
            }

            calculatePrice(messagesPerMonthCache, selectedAddOns, proAgentsInputEle.value);
        });
    });

    // GPT Checkboxes
    const proGptCoreCheckboxEle = document.querySelector("input[name='pro-gpt-core']");
    const proGptMaxCheckboxEle = document.querySelector("input[name='pro-gpt-max']");

    const gptCheckboxes = [
        proGptCoreCheckboxEle,
        proGptMaxCheckboxEle,
    ];

    const proGptMaxPerMessageTag = document.getElementById("pro-gpt-max-per-message-tag");

    gptCheckboxes.forEach((checkboxEle) => {
        checkboxEle.addEventListener("change", (e) => {
            const checked = e.target.checked;
            const name = e.target.name;

            proGptMaxPerMessageTag.classList.add("hide");

            if (checked) {
                selectedAddOns.push(name);
                const otherCheckbox = gptCheckboxes.find((checkbox) => checkbox.name !== name);
                otherCheckbox.checked = false;
                const index = selectedAddOns.indexOf(otherCheckbox.name);
                if (index > -1) {
                    selectedAddOns.splice(index, 1);
                }

                urlParams.set("addOns", selectedAddOns.join(","));

                if (name === "pro-gpt-max") {
                    proGptMaxPerMessageTag.classList.remove("hide");
                }
            } else {
                const index = selectedAddOns.indexOf(name);
                if (index > -1) {
                    selectedAddOns.splice(index, 1);
                }
                if (selectedAddOns.length === 0) {
                    urlParams.delete("addOns");
                } else {
                    urlParams.set("addOns", selectedAddOns.join(","));
                }
            }

            calculatePrice(messagesPerMonthCache, selectedAddOns, proAgentsInputEle.value);
        });
    });

    // proAgents slider
    proAgentsInputEle.addEventListener("input", () => {
        urlParams.set("agents", proAgentsInputEle.value);
        calculatePrice(messagesPerMonthCache, selectedAddOns, proAgentsInputEle.value);
    });

    const proAgentsCheckboxEle = document.querySelector("input[name='pro-agents']");
    proAgentsCheckboxEle.addEventListener("change", (e) => {
        const checked = e.target.checked;
        const name = e.target.name;

        if (checked) {
            proAgentsInputEle.disabled = false;
            selectedAddOns.push(name);
            urlParams.set("addOns", selectedAddOns.join(","));
        } else {
            proAgentsInputEle.disabled = true;
            const index = selectedAddOns.indexOf(name);
            if (index > -1) {
                selectedAddOns.splice(index, 1);
            }
            if (selectedAddOns.length === 0) {
                urlParams.delete("addOns");
            } else {
                urlParams.set("addOns", selectedAddOns.join(","));
            }
        }

        calculatePrice(messagesPerMonthCache, selectedAddOns, proAgentsInputEle.value);
    });

    // First run based on query params
    const messagesPerMonth = urlParams.get("messagesPerMonth") || FREE_MESSAGES;
    rangeSliderEle.value = messagesPerMonth;
    numberInputEle.value = messagesPerMonth;
    messagesPerMonthCache = Number(messagesPerMonth);

    const addOns = urlParams.get("addOns");
    if (addOns) {
        const addOnsArr = addOns.split(",");
        addOnsArr.forEach((addOn) => {
            if (addOn === "pro-gpt-max") {
                proGptMaxPerMessageTag.classList.remove("hide");
            }
            if (addOn === "pro-agents") {
                proAgentsInputEle.disabled = false;
            }
            const checkboxEle = document.querySelector(`input[name='${addOn}']`);
            checkboxEle.checked = true;
            selectedAddOns.push(addOn);
        });
    }

    const agents = urlParams.get("agents");
    if (agents) {
        proAgentsInputEle.value = agents;
    }

    rangeSliderEle.style.setProperty("--value", rangeSliderEle.value); // For CSS
    rangeSliderEle.style.setProperty("--max", rangeSliderEle.max); // For CSS
    calculatePrice(messagesPerMonthCache, selectedAddOns, proAgentsInputEle.value);
}

if (document.readyState === "complete") {
    registerEventHandlers();
}

window.addEventListener("DOMContentLoaded", () => {
    registerEventHandlers();
});

// End pricing calculator

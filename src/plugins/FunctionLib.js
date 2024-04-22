import {Lang, useToast} from "fogito-core-ui";
import React from "react";

export const serialize = (obj, prefix) => {
    let str = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let keyName = prefix ? `${prefix}[${key}]` : key;
            let value = obj[key];
            str.push(
                typeof value === "object"
                    ? serialize(value, keyName)
                    : `${encodeURIComponent(keyName)}=${encodeURIComponent(value)}`
            );
        }
    }
    return str.join("&");
};

export const inArray = (id, array) => {
    return !!array.find((key) => key === id);
};

export function genUuid() {
    var chars = "0123456789abcdef".split("");

    var uuid = [],
        rnd = Math.random,
        r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4"; // version 4

    for (var i = 0; i < 36; i++) {
        if (!uuid[i]) {
            r = 0 | (rnd() * 16);

            uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r & 0xf];
        }
    }

    return uuid.join("");
}

export const getTimeBySeconds = () => Math.floor(new Date().getTime() / 1000);

export function getCurrencySymbol(currencyCode) {
    currencyCode = currencyCode.toLowerCase();
    let symbol = "";
    switch (currencyCode) {
        case "azn":
            symbol = "₼";
            break;
        case "dkk":
            symbol = "kr.";
            break;
        case "eur":
            symbol = "€";
            break;
        case "usd":
            symbol = "$";
            break;
    }

    return symbol;
}

export const is = (target, selector) => {
    return selector === target || target.contains(selector);
};

export const isEqual = (first_array = [], second_array = []) => {
    let result = true;
    if (first_array.length && second_array.length) {
        if (first_array.length === second_array.length) {
            first_array.map((item, key) => {
                if (item !== second_array[key]) {
                    result = false;
                }
            });
        } else {
            result = false;
        }
    } else {
        result = false;
    }
    return result;
};

export const copyToClipBoard = async (copyMe) => {
    const toast = useToast();

    try {
        await navigator.clipboard.writeText(copyMe);
        toast.fire({icon: "success", title: Lang.get("CopiedToClipboard")});
    } catch (err) {
        toast.fire({icon: "success", title: Lang.get("FailedToCopy")});
    }
};


export const printElement = (elem) => {
    let domClone = elem.cloneNode(true);
    let printSection = document.getElementById("printSection");
    if (!printSection) {
        printSection = document.createElement("div");
        printSection.id = "printSection";
        document.body.appendChild(printSection);
    }
    printSection.innerHTML = "";
    printSection.appendChild(domClone);
    window.print();
};


export const truncate = (text, length = 200) => {
    if (text.length > length) {
        return text.substring(0, length) + '...';
    }
    return text;
};


export const convertDateToAgo = (date) => {
    let seconds = Math.floor(((new Date().getTime() / 1000) - date)),
        interval = Math.floor(seconds / 31536000);

    if (interval > 1) return `${interval} ${Lang.get('yearAgo')}`;

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} ${Lang.get('monthAgo')}`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} ${Lang.get('dayAgo')}`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} ${Lang.get('hourAgo')}`;

    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} ${Lang.get('minuteAgo')}`;

    return `${Math.floor(seconds)} ${Lang.get('secondAgo')}`;
};

export const getTrackColor = (p) => {
    let percent = p;
    let color = '#f5365c';
    if (percent < 5) {
        color = '#8a5ed9';
    } else if (percent < 8) {
        color = '#fdd74d';
    }
    return color;
};


export const tableMultiLabels = (data,count = false, title = false) => {
    let dataLength = count ? count : data.length;

    if (!data || dataLength === 0) {
        return (
            <div className="d-flex align-items-center flex-wrap">
                {title && <div className="text-muted fs-13">{Lang.get(title)} :</div>}
                <span className="text-muted text-lowercase">{Lang.get("NoData")}</span>
            </div>
        )
    }

    return (
        <div className="d-flex align-items-center flex-wrap">
            {title && <div className="text-muted fs-13 mr-1">{Lang.get(title)} :</div>}
            {data.slice(0, 3).map((row, key) => (
                <span
                    style={{margin: 5, marginLeft: 0, padding: '2px 5px'}}
                    key={key}
                    className="badge fs-12 badge-success fw-400"
                >
                    {row.label}
                </span>
                )
            )}
            {dataLength > 3 && (
                <span
                    style={{margin: 5, marginLeft: 0, padding: '2px 5px'}}
                    className="badge fs-12 badge-success fw-400"
                >
                    +{dataLength - 3}
                </span>
            )}
        </div>
    )
}


export const tableStatusColumn = (status) => {

    return (
        <div className="d-flex align-items-center">
            <span
                style={{
                    width: 10,
                    height: 10,
                    backgroundColor: status ? "#2ECD89" : "#FDD74D",
                    borderRadius: "50%",
                    marginTop: 2,
                }}
            />
            <p
                className="text-lowercase mb-0 ml-2 fw-400 lh-20 fs-14"
                style={{whiteSpace: "nowrap"}}>
                {Lang.get(status ? "Active" : "inActive")}
            </p>
        </div>
    )
}

export const tableNoDataColumn = () => {

    return (<span className="text-muted text-lowercase">{Lang.get("NoData")}</span>)
}

export const filterNumberInput = (value,isFloat = false,isNegative = false) =>{

    if (!isFloat){
        value = parseInt(value);
    }

    if (value < 1 && !isNegative){
        value = 1;
    }

    return value;
}


export const jsonDesign = (json) => {
    if (typeof json != "string") {
        json = JSON.stringify(json, undefined, 4);
    }
    json = json
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
            var cls = "number";
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = "key";
                } else {
                    cls = "string";
                }
            } else if (/true|false/.test(match)) {
                cls = "boolean";
            } else if (/null/.test(match)) {
                cls = "null";
            }
            return '<span class="' + cls + '">' + match + "</span>";
        }
    );
}


export const createMarkup = (text) => {
    return { __html: text };
}

export function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

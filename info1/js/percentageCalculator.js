function getNumbersOnly(value) {
    let len = value.length;
    if (len == 0) {
      return '';
    }
    return value.replace(/[^0-9]/g, '');
  }

  function usNumberFormat(value) {
    let numbersOnly = getNumbersOnly(value);
    if (numbersOnly.length > 0) {
      return new Intl.NumberFormat('en-US').format(numbersOnly);
    } else {
      return '';
    }
  }

function getTxtNumberFormatted(value) {
    if (value.length == 0) {
      return "";
    }
    var valueArray = value.split(".");
    if (valueArray.length == 1) {
      return usNumberFormat(valueArray[0]);
    } else {
      //When user puts more than one comma, we need to use only the first one
      return usNumberFormat(valueArray[0]) + "." + getNumbersOnly(valueArray[1]);
    }
  }
  
  function validateInputs(pctId, vId) {
    var pct = get(pctId).value;
    var v = get(vId).value;
    return pct.length > 0 && v.length > 0;
  }

  function getFromUsDecimalToNumber(value) {
    if (value.length == 0) {
        return 0;
    }
    var arrayValue = value.split('.');
    if (arrayValue.length == 1) {
        return Number(getNumbersOnly(value));
    } else {
        return Number(getNumbersOnly(arrayValue[0]) + '.' + getNumbersOnly(arrayValue[1]));
    }
  }

  function getValueWithDigits(value, digits) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits,
    }).format(value);
  }

  
  function updateResult(id1, id2, id3, apply) {
    if (validateInputs(id1, id2)) {
      var v1 = getFromUsDecimalToNumber(get(id1).value);
      var v2 = getFromUsDecimalToNumber(get(id2).value);
      var result = apply(v1, v2);
      get(id3).value = getValueWithDigits(result, 6);
    } else {
      get(id3).value = "";
    }
  }
  
  get("#form-inputs").addEventListener("input", (e) => {
    var id = e.target.id;
    var classes = e.target.className;
  
    if (classes.indexOf("decimal-input") >= 0) {
      e.target.value = getTxtNumberFormatted(e.target.value);
    }
  
    if (id == "pct1" || id == "v1") {
      updateResult("#pct1", "#v1", "#r1", function (pct, v) {
        return (pct / 100) * v;
      });
    } else if (id == "v21" || id == "v22") {
      updateResult("#v21", "#v22", "#r2", function (v1, v2) {
        return (v1 / v2) * 100;
      });
    } else if (id == "v31" || id == "v32") {
      updateResult("#v31", "#v32", "#r3", function (v1, v2) {
        return (v2 / v1 - 1) * 100;
      });
    } else if (id == "v41" || id == "v42") {
      updateResult("#v41", "#v42", "#r4", function (v1, v2) {
        return (1 - v2 / v1) * 100;
      });
    } else if (id == "v51" || id == "v52") {
      updateResult("#v51", "#v52", "#r5", function (v, pct) {
        return (1 + pct / 100) * v;
      });
    } else if (id == "v61" || id == "v62") {
      updateResult("#v61", "#v62", "#r6", function (v, pct) {
        return (1 - pct / 100) * v;
      });
    } else if (id == "v71" || id == "v72") {
      updateResult("#v71", "#v72", "#r7", function (pct, v) {
        return v / (1 + pct / 100);
      });
    } else if (id == "v81" || id == "v82") {
      updateResult("#v81", "#v82", "#r8", function (pct, v) {
        return v / (1 - pct / 100);
      });
    }
  });
  
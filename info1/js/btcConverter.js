const http = new HTTP();
const url = `${window.location.origin}/btc-converter/exchange-rate`;
let exchangeRate;
let baseValue = 0;

const READ_ONLY = true;
const READ_WRITE = false;
const THOUSAND = 1000;
const MILLION = THOUSAND * THOUSAND;
const HUNDRED_MILLION = 100 * MILLION;

const dateOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric"
};

const usd = get("#usd");
const btc = get("#btc");
const mbtc = get("#mbtc");
const ubtc = get("#ubtc");
const satoshi = get("#satoshi");
const btcToUsd = get("#btcToUsd");
const lastUpdate = get("#lastUpdate");

const load = get("#load");
const loading = get("#loading");

const toggleFields = mode => {
  usd.readOnly = mode;
  btc.readOnly = mode;
  mbtc.readOnly = mode;
  ubtc.readOnly = mode;
  satoshi.readOnly = mode;
  load.disabled = mode;
  if (mode == READ_ONLY) {
    loading.style.display = "inline-block";
  } else {
    loading.style.display = "none";
  }
};

const loadExchangeRate = () => {
  toggleFields(READ_ONLY);
  http
    .get(url)
    .then(data => {
      exchangeRate = data;
      btcToUsd.value = `$ ${data.btcToUsd.toFixed(2)}`;
      lastUpdate.value = new Date().toLocaleDateString("en-US", dateOptions);
      toggleFields(READ_WRITE);
    })
    .catch(err => {
      showError(err);
      toggleFields(READ_WRITE);
    });
};

loadExchangeRate();

load.addEventListener("click", e => {
  e.preventDefault();
  loadExchangeRate();
});

get("#form-inputs").addEventListener("focusin", e => {
  if (e.target.value == 0) {
    usd.value = "";
    btc.value = "";
    mbtc.value = "";
    ubtc.value = "";
    satoshi.value = "";
  }
});

get("#form-inputs").addEventListener("input", e => {
  if (e.target.id == "usd") {
    baseValue = e.target.value / exchangeRate.btcToUsd;
  } else if (e.target.id == "btc") {
    baseValue = e.target.value;
  } else if (e.target.id == "mbtc") {
    baseValue = e.target.value / THOUSAND;
  } else if (e.target.id == "ubtc") {
    baseValue = e.target.value / MILLION;
  } else if (e.target.id == "satoshi") {
    baseValue = e.target.value / HUNDRED_MILLION;
  }
  
  if (e.target.id != "usd") {
    usd.value = (baseValue * exchangeRate.btcToUsd).toFixed(2);
  }
  if (e.target.id != "btc") {
    btc.value = baseValue;
  }
  if (e.target.id != "mbtc") {
    mbtc.value = baseValue * THOUSAND;
  }
  if (e.target.id != "ubtc") {
    ubtc.value = baseValue * MILLION;
  }
  if (e.target.id != "satoshi") {
    satoshi.value = baseValue * HUNDRED_MILLION;
  }
});

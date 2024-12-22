//API Elements
const API_KEY = 'D7953DF1-D233-4866-8B39-98E637535A1B';
const BASE_URL = 'https://rest.coinapi.io/v1';

// DOM Elements
const cryptoListEl = document.getElementById('cryptoList');
const searchInputEL = document.getElementById('searchInput');
const searchButtonEl = document.getElementById('search-button');
const loadMoreButtonEL = document.getElementById('load-more');
const paragraphEl = document.getElementById("update");


let cryptocurrencies = [];
let displayedCryptos = 10;

// Fetch cryptocurrency data
async function fetchCryptoData(){
    try {
        loadMoreButtonEL.disabled = true;

        const url = `${BASE_URL}/assets?apikey=${API_KEY}`;
        const response = await fetch(url);

        const data = await response.json();

        paragraphEl.innerText = "";
        loadMoreButtonEL.disabled = false;
    
        //Filter cryptocurrency and sort according to market cap
        cryptocurrencies = data.filter(asset => asset.type_is_crypto === 1).sort((a, b) => (b.volume_1day_usd || 0) - (a.volume_1day_usd || 0));
        displayCryptos();
    } catch (error) {
        paragraphEl.innerText = "An error has occured. Please try again later."
    }
}

// Display cryptocurrency data
function displayCryptos(filter = ""){
    const filteredCryptos = cryptocurrencies.filter(crypto => 
        crypto.name?.toLowerCase().includes(filter.toLowerCase()) ||
        crypto.asset_id?.toLowerCase().includes(filter.toLowerCase())
    );

    const tableBody = document.querySelector("#cryptoTable tbody");
    tableBody.innerHTML = "";

    for (let i = 0; i < Math.min(displayedCryptos, filteredCryptos.length); i++) {
        const crypto = filteredCryptos[i];
        const row = document.createElement("tr");
        
        
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${crypto.name || 'N/A'} (${crypto.asset_id})</td>
            <td>$${formatNumber(crypto.price_usd || 0)}</td>
            <td>$${formatMarketCap(crypto.volume_1day_usd || 0)}</td>
        `;
        tableBody.appendChild(row);
    }
}

// Formatting market cap
function formatMarketCap(marketCap){
    if (marketCap > 1e12){
        return (marketCap / 1e12).toFixed(2) + "T";
    } else if (marketCap >= 1e9){
        return (marketCap / 1e9).toFixed(2) + "B";
    } else if (marketCap >= 1e6){
        return (marketCap / 1e6).toFixed(2) + "M";
    } else if (marketCap >= 1e3){
        return (marketCap / 1e3).toFixed(2) + "K";
    } else {
        return marketCap.toFixed(2);
    }
}

//Formating all numbers
function formatNumber(number){
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}


//Event listeners
searchInputEL.addEventListener("input", (event) => {
    displayCryptos(event.target.value)
});

loadMoreButtonEL.addEventListener("click", () => {
    displayedCryptos += 10;
    displayCryptos(searchInputEL.value);
})


// Initial loading
fetchCryptoData();

//Refresh every 30s
setInterval(fetchCryptoData, 30 * 1000);
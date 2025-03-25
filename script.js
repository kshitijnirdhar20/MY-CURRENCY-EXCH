const apiKey = "YOUR_API_KEY_HERE";
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

        async function fetchExchangeRates() {
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                return data;
            } catch (error) {
                document.getElementById("error-message").textContent = "Failed to load exchange rates. Please try again later.";
            }
        }

        async function populateCurrencies() {
            const data = await fetchExchangeRates();
            if (!data) return;
            const currencies = Object.keys(data.conversion_rates);
            const currencyDropdowns = document.querySelectorAll("select");

            currencies.forEach(currency => {
                let option1 = document.createElement("option");
                let option2 = document.createElement("option");
                option1.value = option2.value = currency;
                option1.textContent = option2.textContent = currency;
                currencyDropdowns[0].appendChild(option1);
                currencyDropdowns[1].appendChild(option2);
            });

            currencyDropdowns[0].value = "USD";
            currencyDropdowns[1].value = "EUR";
        }

        async function convertCurrency() {
            const amount = document.getElementById("amount").value;
            const fromCurrency = document.getElementById("from-currency").value;
            const toCurrency = document.getElementById("to-currency").value;
            const errorMessage = document.getElementById("error-message");
            errorMessage.textContent = "";
            
            if (!amount || amount <= 0) {
                errorMessage.textContent = "Please enter a valid positive amount.";
                return;
            }

            const data = await fetchExchangeRates();
            if (!data) return;
            
            const baseRate = data.conversion_rates[fromCurrency];
            const targetRate = data.conversion_rates[toCurrency];
            
            if (!baseRate || !targetRate) {
                errorMessage.textContent = "Invalid currency selection.";
                return;
            }

            const rate = targetRate / baseRate;
            const convertedAmount = (amount * rate).toFixed(2);
            document.getElementById("result").textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
            document.getElementById("rate-details").textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency} | Last Updated: ${new Date().toLocaleString()}`;
        }

        populateCurrencies();
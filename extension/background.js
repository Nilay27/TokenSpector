
// Define your API keys for etherscan.io and polygonscan.io
const etherscanApiKey = "Your API Key";
const polygonScanApiKey = "Your API Key";

async function getTotalValue(transactions) {
    console.log("getTotalValue", transactions.length);
    let integerTotal = BigInt(0);
    let decimalTotal = BigInt(0);
    let decimals = 18; // default value
  
    for (let tx of transactions) {
      // Skip "0" and empty values
      if (tx.value === "" || tx.value === "0") {
        continue;
      }
  
      // Determine the number of decimal places for the current transaction
      decimals = tx.tokenDecimal || 18; // Use 18 as the default if not specified
  
      // Pad the value with zeros if necessary
      while (tx.value.length < decimals) {
        tx.value = "0" + tx.value;
      }
  
      // Split the value into an integer part and a decimal part
      const integerPart = tx.value.slice(0, -decimals);
      const decimalPart = tx.value.slice(-decimals);
  
      // Add the integer part and the decimal part to the total
      integerTotal += BigInt(integerPart);
      decimalTotal += BigInt(decimalPart);
    }
  
    if (integerTotal === BigInt(0) && decimalTotal === BigInt(0)) {
      console.log("All values are 0 or empty");
      return "0.0";
    }
  
    // Check if decimalTotalStr is more than 1, and if so, add to integerTotal and reduce decimalTotal
    let decimalTotalStr = decimalTotal.toString();
    if (decimalTotalStr.length > decimals) {
      const overflow = BigInt(decimalTotalStr.slice(0, -decimals));
      integerTotal += overflow;
      decimalTotalStr = decimalTotalStr.slice(-decimals);
    }
  
    // Pad with zeros if necessary
    while (decimalTotalStr.length < decimals) {
      decimalTotalStr = "0" + decimalTotalStr;
    }
  
    // Convert to a number and back to a string to remove trailing zeros
    const totalStr = Number(integerTotal) + Number("." + decimalTotalStr);
    const cleanedTotalStr = totalStr.toString();
  
    return cleanedTotalStr;
  }
  
  
  async function getAverageValue(transactions) {
    let integerTotal = BigInt(0);
    let decimalTotal = BigInt(0);
    let count = 0;
    let decimals = 18; // default value
  
    for (let tx of transactions) {
      // Skip "0" and empty values
      if (tx.value === "" || tx.value === "0") {
        continue;
      }
  
      // Determine the number of decimal places for the current transaction
      decimals = tx.tokenDecimal || 18; // Use 18 as the default if not specified
  
      // Pad the value with zeros if necessary
      while (tx.value.length < decimals) {
        tx.value = "0" + tx.value;
      }
  
      // Split the value into an integer part and a decimal part
      const integerPart = tx.value.slice(0, -decimals);
      const decimalPart = tx.value.slice(-decimals);
  
      // Add the integer part and the decimal part to the total
      integerTotal += BigInt(integerPart);
      decimalTotal += BigInt(decimalPart);
  
      // Increase the count of non-zero, non-empty transactions
      count++;
    }
  
    if (count === 0) {
      console.log("All values are 0 or empty");
      return "0.0";
    }
  
    // Check if decimalTotalStr is more than 1, and if so, add to integerTotal and reduce decimalTotal
    let decimalTotalStr = decimalTotal.toString();
    if (decimalTotalStr.length > decimals) {
      const overflow = BigInt(decimalTotalStr.slice(0, -decimals));
      integerTotal += overflow;
      decimalTotalStr = decimalTotalStr.slice(-decimals);
    }
  
    // Pad with zeros if necessary
    while (decimalTotalStr.length < decimals) {
      decimalTotalStr = "0" + decimalTotalStr;
    }
  
    // Calculate the average
    const averageStr = (Number(integerTotal) + Number("." + decimalTotalStr)) / count;
    const cleanedAverageStr = averageStr.toString();
  
    return cleanedAverageStr;
  }
  

async function getMaxValue(transactions){
    let max = "0";
    for (let tx of transactions) {
        // Skip "0" and empty values
        if (tx.value === "" || tx.value === "0") {
            continue;
        }
        if (tx.value > max) {
            max = tx.value;
            // Determine the number of decimal places for the current transaction
            decimals = tx.tokenDecimal || 18; // Use 18 as the default if not specified

            // Convert total to string
            let totalStr = max.toString();

            // If total is less than 1, pad with zeros
            while (totalStr.length < decimals) {
                totalStr = "0" + totalStr;
            }

            totalStr = totalStr.slice(0, -decimals) + "." + totalStr.slice(-decimals);
            max = Number(totalStr)
        }
    }
    if (max === "0") {
        console.log("All values are 0 or empty");
        return "0.0";
    }

    // Convert to a number and back to a string to remove trailing zeros
    max = Number(max).toString();
    return max;
}


async function getMinValue(transactions){
    let min = "1e+100"; // Initialize min to a very large number
    let decimals;

    for (let tx of transactions) {
        // Skip "0" and empty values
        if (tx.value === "" || tx.value === "0") {
            continue;
        }
        if (!min || tx.value < min) {
            min = tx.value;

            // Determine the number of decimal places for the current transaction
            decimals = tx.tokenDecimal || 18; // Use 18 as the default if not specified

            // Convert total to string
            let minStr = min.toString();

            // If total is less than 1, pad with zeros
            while (minStr.length < decimals) {
                minStr = "0" + minStr;
            }

            minStr = minStr.slice(0, -decimals) + "." + minStr.slice(-decimals);
            min = minStr;
        }
    }

    if (min === "1e+100") {
        console.log("All values are 0 or empty");
        return "0.0";
    }

    // Remove trailing zeros
    while (min[min.length - 1] === '0') {
        min = min.slice(0, -1);
    }

    // Remove decimal point if it's the last character
    if (min[min.length - 1] === '.') {
        min = min.slice(0, -1);
    }

    return min;
}

async function fetchFromBlockExplorer( address, network) {
    let normal_tx_apiUrl;
    let erc20_tx_api_url;
    api_key = network === "etherscan.io" ? etherscanApiKey : polygonScanApiKey;
    console.log("api_key", api_key);
    normal_tx_apiUrl = `https://api.${network}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${api_key}&page=1&offset=100`;
    erc20_tx_api_url = `https://api.${network}/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=desc&apikey=${api_key}&page=1&offset=100`;

    // Make your API call to etherscan.io and process the response
    // ...
    // Example code to log the response
    const normal_tx_response = await fetch(normal_tx_apiUrl);
    const normal_tx_data = (await normal_tx_response.json()).result;
    console.log("Etherscan API response for normal tx:", normal_tx_data);

    const erc20_tx_response = await fetch(erc20_tx_api_url);
    const erc20_tx_data = (await erc20_tx_response.json()).result;
    console.log("Etherscan API response for erc20 tx:", erc20_tx_data);
    const normal_tx_metrics = await calculateNormalTransactionMetrics(normal_tx_data, address);
    console.log("normal_tx_metrics", normal_tx_metrics);


    const erc20_tx_metrics = await calculateERC20TransactionMetrics(erc20_tx_data, address);
    console.log("erc20_tx_metrics", erc20_tx_metrics);

    return {normal: normal_tx_metrics, erc20: erc20_tx_metrics};
}

async function calculateNormalTransactionMetrics(normal_tx_data, address){
    list_of_sent_tx = [];
    list_of_rec_tx = [];
    num_contract_creation = 0;
    for (let i = 0; i < normal_tx_data.length; i++) {
        const tx = normal_tx_data[i];
        tx.from = tx.from.toLowerCase();
        address = address.toLowerCase();
        if (tx.from === address){
            list_of_sent_tx.push(tx);
        } else if (tx.to === address){
            list_of_rec_tx.push(tx);
        } else if (tx.to === null && tx.input !== "0x"){
            num_contract_creation += 1;
        }
    }

    tx_metrics = {
        address: address, 
        avg_time_bet_sent_tx: 0,
        avg_time_bet_rec_tx: 0,
        time_diff_bet_first_last_tx: 0,
        sent_transactions: 0,
        received_transactions: 0,
        number_of_created_contracts: 0,
        unique_rec_from_addresses: 0,
        unique_sent_to_addresses: 0,
        min_value_received: 0,
        max_value_received: 0,
        avg_value_received: 0,
        min_value_sent: 0,
        max_value_sent: 0,
        avg_value_sent: 0,
        total_ether_sent: 0,
        total_ether_received: 0,
        total_ether_balance: 0,
    }

    tx_metrics.sent_transactions = list_of_sent_tx.length;
    tx_metrics.received_transactions = list_of_rec_tx.length;
    tx_metrics.number_of_created_contracts = num_contract_creation;
   
    // Calculate average time between sent transactions
    const sent_timestamps = list_of_sent_tx.map(tx => Number(tx.timeStamp));
    const sent_time_diffs = [];
    for (let i = 0; i < sent_timestamps.length-1; i++) {
    sent_time_diffs.push(sent_timestamps[i] - sent_timestamps[i + 1]);
    }
    tx_metrics.avg_time_bet_sent_tx = (sent_time_diffs.length > 0 ? sent_time_diffs.reduce((acc, curr) => acc + curr, 0) / sent_time_diffs.length : 0)/60;

    // Calculate average time between received transactions
    const rec_timestamps = list_of_rec_tx.map(tx => Number(tx.timeStamp));
    const rec_time_diffs = [];
    for (let i = 0; i < rec_timestamps.length-1; i++) {
    rec_time_diffs.push(rec_timestamps[i] - rec_timestamps[i + 1]);
    }
    tx_metrics.avg_time_bet_rec_tx = (rec_time_diffs.length > 0 ? rec_time_diffs.reduce((acc, curr) => acc + curr, 0) / rec_time_diffs.length : 0)/60;

    // Calculate time difference between the first and last transactions
    tx_metrics.time_diff_bet_first_last_tx = (normal_tx_data.length > 0 ? Number(normal_tx_data[0].timeStamp) - Number(normal_tx_data[normal_tx_data.length - 1].timeStamp) : 0)/60;

    // Calculate the number of unique received from addresses
    tx_metrics.unique_rec_from_addresses = [...new Set(list_of_rec_tx.map(tx => tx.from))].length;

    // Calculate the number of unique sent to addresses
    tx_metrics.unique_sent_to_addresses = [...new Set(list_of_sent_tx.map(tx => tx.to))].length;

    // Calculate the minimum value received
    tx_metrics.min_value_received = await getMinValue(list_of_rec_tx);

    // Calculate the maximum value received
    tx_metrics.max_value_received = await getMaxValue(list_of_rec_tx);

    // Calculate the average value received
    tx_metrics.avg_value_received = await getAverageValue(list_of_rec_tx);

    // Calculate the minimum value sent
    tx_metrics.min_value_sent = await getMinValue(list_of_sent_tx);

    // Calculate the maximum value sent
    tx_metrics.max_value_sent = await getMaxValue(list_of_sent_tx);

    // Calculate the average value sent
    tx_metrics.avg_value_sent = await getAverageValue(list_of_sent_tx);

    // Calculate the total value sent
    tx_metrics.total_ether_sent = await getTotalValue(list_of_sent_tx);

    // Calculate the total value received
    tx_metrics.total_ether_received = await getTotalValue(list_of_rec_tx);

    // Calculate the total balance using bigInt
    tx_metrics.total_ether_balance = (Number(tx_metrics.total_ether_received) - Number(tx_metrics.total_ether_sent)).toString();

    return tx_metrics;
}

async function calculateERC20TransactionMetrics(erc20_tx_data, address){
    list_of_sent_tx = [];
    list_of_rec_tx = [];
    for (let i = 0; i < erc20_tx_data.length; i++) {
        const tx = erc20_tx_data[i];
        tx.from = tx.from.toLowerCase();
        address = address.toLowerCase();
        if (tx.from === address){
            list_of_sent_tx.push(tx);
        } else if (tx.to === address){
            list_of_rec_tx.push(tx);
        }
    }
    console.log("list_of_sent_tx", list_of_sent_tx);
    console.log("list_of_rec_tx", list_of_rec_tx);

    tx_metrics = {
            ERC_20_avg_time_bet_sent_tx: 0,
            ERC_20_avg_time_bet_rec_tx: 0,
            ERC_20_unique_rec_from_addresses: 0,
            ERC_20_unique_sent_to_addresses: 0,
            ERC_20_min_value_received: 0,
            ERC_20_max_value_received: 0,
            ERC_20_avg_value_received: 0,
            ERC_20_min_value_sent: 0,
            ERC_20_max_value_sent: 0,
            ERC_20_avg_value_sent: 0,
    }

    // Calculate average time between sent transactions
    const sent_timestamps = list_of_sent_tx.map(tx => Number(tx.timeStamp));
    const sent_time_diffs = [];
    for (let i = 0; i < sent_timestamps.length-1; i++) {
    sent_time_diffs.push(sent_timestamps[i] - sent_timestamps[i + 1]);
    }
    tx_metrics.ERC_20_avg_time_bet_sent_tx = (sent_time_diffs.length > 0 ? sent_time_diffs.reduce((acc, curr) => acc + curr, 0) / sent_time_diffs.length : 0)/60;

    // Calculate average time between received transactions
    const rec_timestamps = list_of_rec_tx.map(tx => Number(tx.timeStamp));
    const rec_time_diffs = [];
    for (let i = 0; i < rec_timestamps.length-1; i++) {
    rec_time_diffs.push(rec_timestamps[i] - rec_timestamps[i + 1]);
    }
    tx_metrics.ERC_20_avg_time_bet_rec_tx = (rec_time_diffs.length > 0 ? rec_time_diffs.reduce((acc, curr) => acc + curr, 0) / rec_time_diffs.length : 0)/60;

    // Calculate the number of unique received from addresses
    tx_metrics.ERC_20_unique_rec_from_addresses = [...new Set(list_of_rec_tx.map(tx => tx.from))].length;

    // Calculate the number of unique sent to addresses
    tx_metrics.ERC_20_unique_sent_to_addresses = [...new Set(list_of_sent_tx.map(tx => tx.to))].length;

    // Calculate the minimum value received
    tx_metrics.ERC_20_min_value_received = await getMinValue(list_of_rec_tx);

    // Calculate the maximum value received
    tx_metrics.ERC_20_max_value_received = await getMaxValue(list_of_rec_tx);

    // Calculate the average value received
    tx_metrics.ERC_20_avg_value_received = await getAverageValue(list_of_rec_tx);

    // Calculate the minimum value sent
    tx_metrics.ERC_20_min_value_sent = await getMinValue(list_of_sent_tx);

    // Calculate the maximum value sent
    tx_metrics.ERC_20_max_value_sent = await getMaxValue(list_of_sent_tx);

    // Calculate the average value sent
    tx_metrics.ERC_20_avg_value_sent = await getAverageValue(list_of_sent_tx);

    return tx_metrics;
}

async function createOpenAIPrompt(all_metrics){
    let prompt = "";
    order_of_normal_metrics = ["address", 
    "avg_time_bet_sent_tx",
    "avg_time_bet_rec_tx",
    "time_diff_bet_first_last_tx",
    "sent_transactions",
    "received_transactions",
    "number_of_created_contracts",
    "unique_rec_from_addresses",
    "unique_sent_to_addresses",
    "min_value_received",
    "max_value_received",
    "avg_value_received",
    "min_value_sent",
    "max_value_sent",
    "avg_value_sent",
    "total_ether_sent",
    "total_ether_received",
    "total_ether_balance"]

    order_of_erc_20_metrics = [
        "ERC_20_avg_time_bet_sent_tx",
        "ERC_20_avg_time_bet_rec_tx",
        "ERC_20_unique_rec_from_addresses",
        "ERC_20_unique_sent_to_addresses",
        "ERC_20_min_value_received",
        "ERC_20_max_value_received",
        "ERC_20_avg_value_received",
        "ERC_20_min_value_sent",
        "ERC_20_max_value_sent",
        "ERC_20_avg_value_sent",
    ]

    let normal_metrics = all_metrics.normal;
    let erc_20_metrics = all_metrics.erc20;

    // Append normal metrics to the prompt
    for (let metric of order_of_normal_metrics) {
        if (normal_metrics.hasOwnProperty(metric)) {
            prompt += normal_metrics[metric] + ", ";
        }
    }

    // Append erc20 metrics to the prompt
    for (let metric of order_of_erc_20_metrics) {
        if (erc_20_metrics.hasOwnProperty(metric)) {
            prompt += erc_20_metrics[metric] + ", ";
        }
    }

    // Remove the trailing comma and space
    if (prompt.endsWith(", ")) {
        prompt = prompt.slice(0, -2);
    }

    prompt += " -> "

    console.log("prompt", prompt);
    return prompt;
}

async function callOpenAIModel(prompt){
    const res = await fetch(
        `https://api.openai.com/v1/completions`,
        {
            body: JSON.stringify(
            {
                "model": "ada:ft-personal:unbalanced-ada-final-2023-05-14-05-52-58", 
                "prompt": prompt,
                "max_tokens": 1, 
            }),
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: "Your API Key",
            },
        }
    )
    const result = await res.json();
    const resultText = result.choices[0].text
    console.log("resultText", resultText);
    return resultText;
}

// Event listener for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    const updatedUrl = changeInfo.url;
    if (updatedUrl) {
        console.log("onUpdateInfo", tabId);
        
        // Check if the URL matches any of the specified patterns
        if (
            updatedUrl.match(/https:\/\/etherscan\.io\/(address|token)\/[^/]+(?!#)/) ||
            updatedUrl.match(/https:\/\/polygonscan\.com\/(address|token)\/[^/]+(?!#)/)
        ) {
            // Extract the address from the URL
            const address = updatedUrl.split("/").pop().split("#")[0];
            // Call the function to fetch data from etherscan.io or polygonscan.io API
            let all_metrics;
            if (updatedUrl.includes("https://etherscan.io/")) {
                all_metrics =  await fetchFromBlockExplorer( address, "etherscan.io");
            } else if (updatedUrl.includes("https://polygonscan.com/")) {
                all_metrics =  await fetchFromBlockExplorer( address, "polygonscan.com");
            }

            const openAiPrompt = await createOpenAIPrompt(all_metrics);
            const result = await callOpenAIModel(openAiPrompt);
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["content.js"],
            });
            chrome.tabs.sendMessage(tabId, {message: "append-message", result: result, url: updatedUrl});
        }
    }
});

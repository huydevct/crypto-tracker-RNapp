import axios from "axios";
import moment from "moment";


const formatSparkLine = (numbers) => {
    const sevenDayAgo = moment().subtract(7, 'days').unix();
    let formattedSparkLine = numbers.map((item, index) => {
        return {
            x: sevenDayAgo + (index + 1) * 3600,
            y: item,
        }
    });

    return formattedSparkLine;
}

const formatMarketData = (data) => {
    let formattedData = [];
    
    data.forEach(item => {
        const formattedSparkLine = formatSparkLine(item.sparkline_in_7d.price);

        const formattedItem = {
            ...item,
            sparkline_in_7d: {
                price: formattedSparkLine
            }
        }

        formattedData.push(formattedItem);
    });

    return formattedData;
}
export const getMarketsData = async () => {
    const apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=7d"

    try {
        // this is api call
        const response = await axios.get(apiUrl);
        const data = response.data;
        const formattedResponse = formatMarketData(data);
        return formattedResponse;
    } catch (error) {
        console.log(error.message);
    }
}
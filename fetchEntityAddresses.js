// Import environment variables from .env file
require('dotenv').config();

const fetchEntityData = async (entityId, chain) => {
  const API_URL = `https://deep-index.moralis.io/api/v2.2/entities/${entityId}`;

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'X-API-Key': process.env.MORALIS_API_KEY // Use the API key from .env
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Filter addresses by the given chain
    const filteredAddresses = data.addresses.filter(address => address.chain === chain);

    // Extract just the address field into a new list
    const addressList = filteredAddresses.map(addr => addr.address);

    console.log('Filtered Addresses:', addressList);
    return addressList;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

module.exports = { fetchEntityData };

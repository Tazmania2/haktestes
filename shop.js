// shop.js

import { listItems, purchaseItem, getPlayerStatus } from './funifierApi.js';

const shopItemsContainer = document.getElementById('shop-items');
const searchBar = document.getElementById('search-bar');

let items = [];
let playerId = '';

async function loadShop() {
  try {
    const [allItems, playerStatus] = await Promise.all([
      listItems(),
      getPlayerStatus()
    ]);

    items = allItems;
    playerId = playerStatus._id;

    displayItems();
  } catch (error) {
    console.error('Error loading shop items:', error);
    // Display error message to user
    shopItemsContainer.innerHTML = '<p class="error-message">Error loading shop items. Please try again later.</p>';
  }
}

function displayItems() {
  const searchText = searchBar.value.toLowerCase();

  shopItemsContainer.innerHTML = '';

  items
    .filter(item => item.name.toLowerCase().includes(searchText))
    .forEach(item => {
      const card = document.createElement('div');
      card.className = 'shop-card';

      // Get the icon URL from the item data
      const iconUrl = item.image?.small?.url || 'item_placeholder.png';
      
      card.innerHTML = `
        <div class="item-icon">
          <img src="${iconUrl}" alt="${item.name} icon">
        </div>
        <div class="item-content">
          <h2>${item.name}</h2>
          <p>${item.description || ''}</p>
          <div class="item-meta">
            <span class="item-price">${item.price || 0} points</span>
            <button data-id="${item._id}" class="buy-button">Buy</button>
          </div>
        </div>
      `;

      shopItemsContainer.appendChild(card);
    });

  // Attach event listeners to buy buttons
  document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', handlePurchase);
  });
}

async function handlePurchase(event) {
  const itemId = event.target.getAttribute('data-id');

  if (!itemId || !playerId) return;

  try {
    const res = await purchaseItem({ playerId, itemId, quantity: 1 });

    if (res.status === 'OK') {
      alert('Purchase successful!');
    } else {
      alert('Purchase failed: ' + (res.restrictions?.join(', ') || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error purchasing item:', error);
    alert('Purchase error!');
  }
}

searchBar.addEventListener('input', displayItems);

// Initialize shop on page load
document.addEventListener('DOMContentLoaded', loadShop);

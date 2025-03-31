const extensionCards = document.querySelector('#extension-cards');
const modeSwitcher = document.querySelector('#mode-switcher');
const active = document.querySelector('#active');
const inactive = document.querySelector('#inactive');
const all = document.querySelector('#all');

let storedData = JSON.parse(localStorage.getItem('storedData')) || [];

if (storedData.length === 0) {
  fetch('./data.json')
    .then((response) => response.json())
    .then((data) => {
      storedData = data;
      localStorage.setItem('storedData', JSON.stringify(storedData));
      renderCards(storedData); 
    });
} else {
  renderCards(storedData); 
}

function renderCards(newStoredData) {
  extensionCards.innerHTML = ''; 
  newStoredData.forEach((extension) => {
    const newCard = document.createElement('div');
    const isActiveClass = extension.isActive ? '' : 'inactive';

    newCard.innerHTML = `
      <div class="all-cards p-6 rounded-3xl max-w-[500px] h-[350px]">
        <div id="card-details" class="flex items-start justify-between gap-5">
          <img src="${extension.logo}" alt="" />
          <div id="extension-details">
            <h2 class="extension-name font-bold text-[16px] md:text-xl mb-4">${extension.name}</h2>
            <p class="text-[12px] sm:text-xl h-60">${extension.description}</p>
          </div>
        </div>
        <div id="action" class="flex justify-between items-center p-1 sm:p-2 -mt-5">
          <span class="p-1 md:p-2 border-2 border-red-500 rounded-3xl cursor-pointer hover:border-green-400 hover:scale-[110%]">Remove</span>
          <div class="flex justify-end bg-amber-600 w-12 sm:w-14 h-6 sm:h-8 rounded-full p-0.5 box-content toggled cursor-pointer ${isActiveClass}">
            <div id="circle" class="w-6 h-5 sm:w-7 sm:h-7 bg-white rounded-full my-auto"></div>
          </div>
        </div>
      </div>`;

    extensionCards.append(newCard);
  });

  toggleStatusUpdate();
}

function toggleStatusUpdate() {
  const toggleStatus = document.querySelectorAll('.toggled');
  
  toggleStatus.forEach((element) => {
    element.addEventListener('click', () => {
      const cardElement = element.closest('.all-cards');
      const extensionNameElement = cardElement.querySelector('.extension-name').innerText;
      const extension = storedData.find((ext) => ext.name === extensionNameElement);

      extension.isActive = !extension.isActive;
      element.classList.toggle('inactive', !extension.isActive);

      localStorage.setItem('storedData', JSON.stringify(storedData));
      // location.reload()
    });
  });
}


let isDark = JSON.parse(localStorage.getItem('isDark')) || false;
if (isDark) {
  document.body.classList.add('dark');
  modeSwitcher.src = '/assets/images/icon-sun.svg';
} else {
  modeSwitcher.src = '/assets/images/icon-moon.svg';
}

modeSwitcher.addEventListener('click', () => {
  isDark = !isDark;
  localStorage.setItem('isDark', JSON.stringify(isDark));
  location.reload();
});


const activeExtensions = storedData.filter((data) => data.isActive); 
const inactiveExtensions = storedData.filter((data) => !data.isActive); 

active.addEventListener('click', () => {
  localStorage.setItem('displayActive', true);
  localStorage.removeItem('displayInactive');
  renderCards(activeExtensions);
  location.reload()
});

inactive.addEventListener('click', () => {
  localStorage.setItem('displayInactive', true);
  localStorage.removeItem('displayActive');
  renderCards(inactiveExtensions); 
  location.reload()
});

all.addEventListener('click', () => {
  localStorage.removeItem('displayActive');
  localStorage.removeItem('displayInactive');
  renderCards(storedData); 
  location.reload()
});

let displayActive = JSON.parse(localStorage.getItem('displayActive'));
let displayInactive = JSON.parse(localStorage.getItem('displayInactive'));

if (displayActive) {
  active.style.border = '2px solid #4CAF50'; 
  active.style.boxShadow = '0 4px 8px rgba(0, 128, 0, 0.4), 0 6px 20px rgba(0, 128, 0, 0.2)';
  active.style.color = 'red'
  renderCards(activeExtensions); 
} else if (displayInactive) {
  renderCards(inactiveExtensions); 
  inactive.style.border = '2px solid #4CAF50'; 
  inactive.style.boxShadow = '0 4px 8px rgba(0, 128, 0, 0.4), 0 6px 20px rgba(0, 128, 0, 0.2)';
  inactive.style.color = 'red'
} else {
  renderCards(storedData); 

  all.style.border = '2px solid #4CAF50'; 
  all.style.boxShadow = '0 4px 8px rgba(0, 128, 0, 0.4), 0 6px 20px rgba(0, 128, 0, 0.2)';
  all.style.color = 'red'
  
}

const accessKey = 'BeKyLKZegePG4lTyzUxjBogG_iNDMihqIb89bmDpXlg';
const searchInput = document.getElementById('searchInput');
const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalInfo = document.getElementById('modalInfo');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const closeModal = document.getElementById('closeModal');

let currentImages = [];
let currentIndex = 0;
let page = 1;
let currentQuery = '';

async function fetchImages(isNewSearch = true) {
    loader.classList.remove('hidden');
    let url = currentQuery 
        ? `https://api.unsplash.com/search/photos?client_id=${accessKey}&query=${currentQuery}&per_page=12&page=${page}`
        : `https://api.unsplash.com/photos?client_id=${accessKey}&per_page=12&page=${page}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const photos = data.results || data;

        if (isNewSearch) {
            gallery.innerHTML = '';
            currentImages = photos;
        } else {
            currentImages = currentImages.concat(photos);
        }

        displayImages(photos);
        loader.classList.add('hidden');
    } catch (error) {
        console.error("Error:", error);
        loader.classList.add('hidden');
    }
}

function displayImages(photos) {
    photos.forEach((photo) => {
        const index = currentImages.indexOf(photo);
        const card = `
            <div class="rounded-xl overflow-hidden shadow-md bg-white border border-slate-100">
                <img src="${photo.urls.small}" onclick="openModal(${index})" 
                     class="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition duration-300">
                <div class="p-3 flex justify-between items-center">
                    <p class="text-sm font-bold text-slate-700">${photo.user.name}</p>
                    <a href="${photo.links.download}" target="_blank" class="text-blue-500 hover:text-blue-700">
                        <i class="fa-solid fa-download"></i>
                    </a>
                </div>
            </div>`;
        gallery.insertAdjacentHTML('beforeend', card);
    });
    loadMoreBtn.classList.toggle('hidden', currentImages.length === 0);
}

searchInput.addEventListener('input', () => {
    currentQuery = searchInput.value.trim();
    page = 1;
    fetchImages(true); 
});

function openModal(index) {
    currentIndex = index;
    const photo = currentImages[currentIndex];
    if (photo) {
        modalImg.src = photo.urls.small;
        modalInfo.innerText = "Photo by " + photo.user.name;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeMyModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

document.getElementById('nextBtn').onclick = (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % currentImages.length;
    openModal(currentIndex);
};

document.getElementById('prevBtn').onclick = (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    openModal(currentIndex);
};

closeModal.onclick = closeMyModal;
modal.onclick = (e) => { if (e.target === modal) closeMyModal(); };

loadMoreBtn.onclick = () => {
    page++;
    fetchImages(false);
};

function quickSearch(word) {
    searchInput.value = (word === 'All') ? '' : word;
    currentQuery = searchInput.value;
    page = 1;
    fetchImages(true);
}

fetchImages();
const accessKey = 'BeKyLKZegePG4lTyzUxjBogG_iNDMihqIb89bmDpXlg';
const searchInput = document.getElementById('searchInput');
const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalInfo = document.getElementById('modalInfo');
const loadMoreBtn = document.getElementById('loadMoreBtn');

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
        const likes = photo.likes || 0;
        const location = photo.user.location || 'Global';

        const card = `
            <div class="relative overflow-hidden rounded-3xl bg-white shadow-sm group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100">
                <div class="relative overflow-hidden aspect-[4/5]">
                    <img src="${photo.urls.small}" onclick="openModal(${index})" 
                         class="w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-110">
                    
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end p-6">
                        <div class="flex items-center gap-2 text-white mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                             <i class="fa-solid fa-heart text-red-500"></i>
                             <span class="font-bold">${likes}</span>
                        </div>
                        <p class="text-white/80 text-xs translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                             <i class="fa-solid fa-location-dot"></i> ${location}
                        </p>
                    </div>
                </div>

                <div class="p-4 flex justify-between items-center bg-white">
                    <div class="flex items-center gap-3">
                        <img src="${photo.user.profile_image.small}" class="w-8 h-8 rounded-full ring-2 ring-slate-100">
                        <span class="text-sm font-bold text-slate-700 truncate w-24">${photo.user.name}</span>
                    </div>
                    <a href="${photo.links.download}" target="_blank" class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                        <i class="fa-solid fa-download"></i>
                    </a>
                </div>
            </div>`;
        gallery.insertAdjacentHTML('beforeend', card);
    });
    loadMoreBtn.classList.toggle('hidden', currentImages.length === 0);
}

function quickSearch(category) {
    searchInput.value = (category === 'All') ? '' : category;
    currentQuery = searchInput.value;
    page = 1;
    fetchImages(true); 
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
        modalImg.src = photo.urls.regular;
        modalInfo.innerHTML = `
            <div class="flex flex-col items-center gap-1">
                <span class="text-white font-bold text-xl">${photo.user.name}</span>
                <div class="flex gap-4 text-white/50 text-xs uppercase tracking-widest">
                    <span>${photo.likes} Likes</span>
                    <span>${photo.user.location || 'Earth'}</span>
                </div>
            </div>
        `;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

document.getElementById('closeModal').onclick = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
};

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

loadMoreBtn.onclick = () => { page++; fetchImages(false); };

fetchImages();
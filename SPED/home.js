// Mock data for comics
const mockComics = [
    {
        title: "The Wolf That Picked Something Up",
        author: "Ma Wei",
        chapter: "Chapter 148.5",
        lastUpdated: "Sep-20-2025 14:25",
        views: 323159,
        rating: 4.8,
        summary: "A wolf with extraordinary abilities embarks on a journey to uncover the secrets of his past.",
        image: "https://via.placeholder.com/150x200"
    },
    {
        title: "On My Way Home from Work, My Beautiful S…",
        author: "Unknown",
        chapter: "Chapter 9",
        lastUpdated: "Sep-19-2025 16:42",
        views: 284561,
        rating: 4.5,
        summary: "A salaryman's life changes when he meets a mysterious woman on his way home from work.",
        image: "https://via.placeholder.com/150x200"
    },
    {
        title: "Something Weird with my Training Skills",
        author: "John Doe",
        chapter: "Chapter 11",
        lastUpdated: "Sep-18-2025 10:30",
        views: 198742,
        rating: 4.2,
        summary: "A gamer discovers that his training skills in a virtual world have real-world applications.",
        image: "https://via.placeholder.com/150x200"
    },
    {
        title: "The Last Adventure",
        author: "Jane Smith",
        chapter: "Chapter 24",
        lastUpdated: "Sep-17-2025 20:15",
        views: 156789,
        rating: 4.7,
        summary: "In a world where adventures are regulated, one man sets out on the last great adventure.",
        image: "https://via.placeholder.com/150x200"
    },
    {
        title: "Mystery of the Lost Kingdom",
        author: "Alex Johnson",
        chapter: "Chapter 7",
        lastUpdated: "Sep-16-2025 14:45",
        views: 134567,
        rating: 4.0,
        summary: "An ancient kingdom holds secrets that could change the world, and only one archaeologist can uncover them.",
        image: "https://via.placeholder.com/150x200"
    },
    {
        title: "Beyond the Horizon",
        author: "Sam Wilson",
        chapter: "Chapter 15",
        lastUpdated: "Sep-15-2025 18:20",
        views: 112345,
        rating: 4.3,
        summary: "A group of explorers venture beyond the known horizon and discover a world beyond imagination.",
        image: "https://via.placeholder.com/150x200"
    },
    {
        title: "Shadows of the Past",
        author: "Emily Chen",
        chapter: "Chapter 32",
        lastUpdated: "Sep-14-2025 12:10",
        views: 98765,
        rating: 4.6,
        summary: "A detective must confront her own past to solve a series of mysterious crimes.",
        image: "https://via.placeholder.com/150x200"
    },
    {
        title: "The Forgotten Hero",
        author: "Michael Brown",
        chapter: "Chapter 19",
        lastUpdated: "Sep-13-2025 16:55",
        views: 87654,
        rating: 4.1,
        summary: "Once a legendary hero, now forgotten, he must rise again to save the world.",
        image: "https://via.placeholder.com/150x200"
    },
    {
        title: "Chronicles of the Unknown",
        author: "David Lee",
        chapter: "Chapter 5",
        lastUpdated: "Sep-12-2025 11:30",
        views: 76543,
        rating: 3.9,
        summary: "A historian discovers a chronicle that reveals a hidden history of the world.",
        image: "https://via.placeholder.com/150x200"
    },
    {
        title: "Eternal Dreams",
        author: "Sarah Taylor",
        chapter: "Chapter 27",
        lastUpdated: "Sep-11-2025 19:40",
        views: 65432,
        rating: 4.4,
        summary: "In a world where dreams can be recorded, one woman's dreams hold the key to the future.",
        image: "https://via.placeholder.com/150x200"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const messageText = document.getElementById('messageText');
    const messageBox = document.getElementById('messageBox');
    const backBtn = document.getElementById('backBtn');
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const comicList = document.getElementById('comic-list');
    const searchResultsTitle = document.getElementById('searchResultsTitle');

    // Get search term from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search') || '';

    // Set search input value to the search term
    searchInput.value = searchTerm;

    // Display comics based on search term
    displayComics(searchTerm);

    // Back button to Index
    backBtn.addEventListener('click', function() {
        window.location.href = "index.html";
    });

    // Search function
    searchBtn.addEventListener('click', function() {
        const newSearchTerm = searchInput.value.trim();
        if (newSearchTerm) {
            // Update the URL without reloading the page
            const newUrl = `home.html?search=${encodeURIComponent(newSearchTerm)}`;
            window.history.pushState({}, '', newUrl);
            
            // Display comics based on new search term
            displayComics(newSearchTerm);
        } else {
            messageText.textContent = "Please enter the title of the comic";
            messageBox.style.background = "rgba(255, 99, 71, 0.4)";
            messageBox.style.display = "block";

            setTimeout(() => {
                messageBox.style.display = "none";
            }, 2000);
        }
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    function displayComics(term) {
        // Clear previous results
        comicList.innerHTML = '';
        
        // Filter comics based on search term
        const filteredComics = term 
            ? mockComics.filter(comic => 
                comic.title.toLowerCase().includes(term.toLowerCase()) ||
                comic.author.toLowerCase().includes(term.toLowerCase())
              )
            : mockComics;
        
        // Update title
        if (term) {
            searchResultsTitle.textContent = `Search Results for "${term}" (${filteredComics.length} found)`;
        } else {
            searchResultsTitle.textContent = `All Comics (${filteredComics.length})`;
        }
        
        // Display each comic
        filteredComics.forEach(comic => {
            const comicItem = document.createElement('div');
            comicItem.className = 'comic-item';
            comicItem.innerHTML = `
                <div class="comic-image">
                    <img src="${comic.image}" alt="${comic.title}">
                </div>
                <div class="comic-details">
                    <h3 class="comic-title">${comic.title}</h3>
                    <p class="comic-author">by ${comic.author}</p>
                    <div class="comic-meta">
                        <span class="comic-chapter">${comic.chapter}</span>
                        <span class="comic-updated">Updated: ${comic.lastUpdated}</span>
                    </div>
                    <div class="comic-rating">
                        ${generateStarRating(comic.rating)}
                        <span class="rating-value">${comic.rating}</span>
                    </div>
                    <p class="comic-summary">${comic.summary}</p>
                    <div class="comic-stats">
                        <span class="comic-views">Views: ${comic.views.toLocaleString()}</span>
                    </div>
                </div>
            `;
            
            comicList.appendChild(comicItem);
        });
        
        // If no results found
        if (filteredComics.length === 0) {
            comicList.innerHTML = '<p class="no-results">No comics found matching your search.</p>';
        }
    }

    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<span class="star full">★</span>';
        }
        
        if (hasHalfStar) {
            stars += '<span class="star half">★</span>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<span class="star empty">☆</span>';
        }
        
        return stars;
    }
});
// JavaScript functionality
console.log("SpED Projekts is up and running, let's start pirating");

// Mock data for search results
const mockSearchResults = [
    { title: "The Wolf That Picked Something Up", author: "Ma Wei", chapter: "Chapter 148.5" },
    { title: "On My Way Home from Work, My Beautiful S…", author: "Unknown", chapter: "Chapter 9" },
    { title: "Something Weird with my Training Skills", author: "John Doe", chapter: "Chapter 11" },
    { title: "The Last Adventure", author: "Jane Smith", chapter: "Chapter 24" },
    { title: "Mystery of the Lost Kingdom", author: "Alex Johnson", chapter: "Chapter 7" },
    { title: "Beyond the Horizon", author: "Sam Wilson", chapter: "Chapter 15" },
    { title: "Shadows of the Past", author: "Emily Chen", chapter: "Chapter 32" },
    { title: "The Forgotten Hero", author: "Michael Brown", chapter: "Chapter 19" },
    { title: "Chronicles of the Unknown", author: "David Lee", chapter: "Chapter 5" },
    { title: "Eternal Dreams", author: "Sarah Taylor", chapter: "Chapter 27" },
    { title: "The Dragon's Legacy", author: "Robert Garcia", chapter: "Chapter 13" },
    { title: "Whispers in the Dark", author: "Lisa Anderson", chapter: "Chapter 21" },
    { title: "The Final Stand", author: "James Wilson", chapter: "Chapter 8" },
    { title: "Journey to the Unknown", author: "Patricia Moore", chapter: "Chapter 16" },
    { title: "Secrets of the Ancient World", author: "Christopher Davis", chapter: "Chapter 30" },
    { title: "The Lost Prince", author: "Jennifer Martinez", chapter: "Chapter 4" },
    { title: "Beyond Imagination", author: "William Rodriguez", chapter: "Chapter 12" },
    { title: "The Cursed Treasure", author: "Linda Thompson", chapter: "Chapter 26" },
    { title: "Legends of Old", author: "Richard Jackson", chapter: "Chapter 3" },
    { title: "The Hidden Path", author: "Barbara White", chapter: "Chapter 18" },
    { title: "Echoes of Eternity", author: "Joseph Harris", chapter: "Chapter 22" },
    { title: "The Forgotten Realms", author: "Susan Clark", chapter: "Chapter 6" },
    { title: "Mysteries of the Deep", author: "Thomas Lewis", chapter: "Chapter 14" },
    { title: "The Last Guardian", author: "Jessica Robinson", chapter: "Chapter 28" },
    { title: "Beyond the Stars", author: "Daniel Walker", chapter: "Chapter 2" }
];

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    const messageText = document.getElementById('messageText');
    const messageBox = document.getElementById('messageBox');
    const btn1 = document.getElementById('btn1');
    const navBtn = document.getElementById('navBtn');
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const searchDropdown = document.getElementById('searchDropdown');
    const resultsList = document.getElementById('resultsList');
    const resultsInfo = document.getElementById('resultsInfo');
    const viewAllBtn = document.getElementById('viewAllBtn');

    // Button 1 - Hover Effect
    btn1.addEventListener('mouseenter', function() {
        messageText.textContent = "Hovering test only";
        messageBox.style.background = "rgba(79, 172, 254, 0.2)";
        messageBox.style.display = "block";
    });

    btn1.addEventListener('mouseleave', function() {
        messageBox.style.display = "none";
    });

    // Navigation Button
    navBtn.addEventListener('click', function() {
        // Navigate back to the home.html
        window.location.href = "home.html";
    });

    // Search Function
    searchBtn.addEventListener('click', performSearch);
    
    // Allow search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Auto-search after 2 characters with debounce
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm.length >= 2) {
            // Set a timeout to perform search after user stops typing for 300ms
            searchTimeout = setTimeout(function() {
                performSearch();
            }, 300);
        } else if (searchTerm.length === 0) {
            // Hide dropdown if search is empty
            searchDropdown.style.display = 'none';
        }
    });

    // View All Results Button - Redirect to home.html
    viewAllBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            // Redirect to home.html with search term as parameter
            window.location.href = `home.html?search=${encodeURIComponent(searchTerm)}`;
        }
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-wrapper')) {
            searchDropdown.style.display = 'none';
        }
    });

    function performSearch() {
        const searchTerm = searchInput.value.trim();
        
        if (!searchTerm) {
            messageText.textContent = "Please enter a search term";
            messageBox.style.background = "rgba(255, 99, 71, 0.4)";
            messageBox.style.display = "block";
            
            setTimeout(() => {
                messageBox.style.display = "none";
            }, 2000);
            return;
        }

        // Show loading spinner
        loadingSpinner.style.display = "block";
        searchDropdown.style.display = "none";
        
        // Simulate API call delay
        setTimeout(() => {
            // Hide loading spinner
            loadingSpinner.style.display = "none";
            
            // Display search results
            displaySearchResults(searchTerm);
        }, 500); // Reduced delay for better UX
    }

    function displaySearchResults(searchTerm) {
        // Filter results based on search term (mock implementation)
        const filteredResults = mockSearchResults.filter(result => 
            result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Display first 5 results in dropdown
        const first5Results = filteredResults.slice(0, 5);
        
        // Clear previous results
        resultsList.innerHTML = '';
        
        // Add each result to the list
        first5Results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <div class="result-title">${result.title}</div>
                <div class="result-author">${result.author}</div>
                <div class="result-chapter">${result.chapter}</div>
            `;
            
            // Add click event to result item
            resultItem.addEventListener('click', function() {
                messageText.textContent = `Opening: ${result.title}`;
                messageBox.style.background = "rgba(74, 105, 189, 0.4)";
                messageBox.style.display = "block";
                
                // Hide dropdown
                searchDropdown.style.display = "none";
                
                setTimeout(() => {
                    messageBox.style.display = "none";
                }, 2000);
            });
            
            resultsList.appendChild(resultItem);
        });
        
        // Update results info
        if (filteredResults.length > 5) {
            resultsInfo.textContent = `Showing 5 of ${filteredResults.length} results`;
            viewAllBtn.style.display = "block";
        } else {
            resultsInfo.textContent = `${filteredResults.length} results found`;
            viewAllBtn.style.display = "none";
        }
        
        // Show search dropdown
        searchDropdown.style.display = "block";
    }

    function displayAllResults() {
        const searchTerm = searchInput.value.trim();
        const filteredResults = mockSearchResults.filter(result => 
            result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Clear previous results
        resultsList.innerHTML = '';
        
        // Add all results to the list
        filteredResults.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <div class="result-title">${result.title}</div>
                <div class="result-author">${result.author}</div>
                <div class="result-chapter">${result.chapter}</div>
            `;
            
            // Add click event to result item
            resultItem.addEventListener('click', function() {
                messageText.textContent = `Opening: ${result.title}`;
                messageBox.style.background = "rgba(74, 105, 189, 0.4)";
                messageBox.style.display = "block";
                
                // Hide dropdown
                searchDropdown.style.display = "none";
                
                setTimeout(() => {
                    messageBox.style.display = "none";
                }, 2000);
            });
            
            resultsList.appendChild(resultItem);
        });
        
        // Update results info
        resultsInfo.textContent = `All ${filteredResults.length} results`;
        
        // Hide "View All" button since we're now showing all results
        viewAllBtn.style.display = "none";
    }
});
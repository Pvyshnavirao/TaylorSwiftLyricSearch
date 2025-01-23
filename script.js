console.log("no")
const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");

const apiUrl = "https://taylor-swift-api.sarbo.workers.dev/albums";

form.addEventListener("submit", e => {
e.preventDefault();
searchValue = search.value.trim();
if(!searchValue){
    alert("No Search Value");
}
else{
    searchAlbumByTitle(searchValue);
}
})


// Fetch all albums and search by title
async function searchAlbumByTitle(title) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const albums = await response.json();
        const filteredAlbums = albums.filter(album =>
            album.title.toLowerCase().includes(title.toLowerCase())
        );
        displayAlbums(filteredAlbums, title);
    } catch (error) {
        console.error("Error fetching albums:", error.message);
        result.innerHTML = `<p class="error">Error fetching albums: ${error.message}</p>`;
    }
}

// Display the filtered albums
function displayAlbums(albums, searchTitle) {
    if (albums.length === 0) {
        result.innerHTML = `<p>No albums found with the title: "${searchTitle}"</p>`;
        return;
    }
    const albumsHTML = albums
        .map(
            (album) =>
                `
            <button class = "btn-styling" onclick = "fetchSongs(${album.album_id})" ><strong>${album.title}</strong> (Album ID: ${album.album_id}, Release Date: ${album.release_date} )
            </button> `
        )
        .join(" ");
    result.innerHTML = `
        <h2>Requested Albums "${searchTitle}":</h2>
        <ul>${albumsHTML}</ul>
    `;
}
async function fetchSongs(album_id) {
    try {
        const response = await fetch(`${apiUrl}/${album_id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const songs = await response.json(); // Parse JSON response
        displaySongs(songs, album_id); // Pass songs to display function
    } catch (error) {
        console.error("Error fetching songs from the album:", error.message);
        result.innerHTML = `<p class="error">Error fetching songs from the album: ${error.message}</p>`;
    }
}

function displaySongs(songs, album_id) {
    if (songs.length === 0) {
        result.innerHTML = `<p>No songs found for Album ID: ${album_id}</p>`;
        return;
    }
    const songsHTML = songs
    .map(
        (song) => `
        <div class="song-item">
            <span class="song-title">${song.title}</span>
            <button class="lyrics-button" onclick="fetchLyrics(${song.song_id})">View Lyrics</button>
        </div>
    `
    )
    .join("");

result.innerHTML = `
    <h2>Songs in Album ID: ${album_id}:</h2>
    <div class="songs-list">
        ${songsHTML}
    </div>
`;
}
async function fetchLyrics(song) {
    const lyricsUrl = `https://taylor-swift-api.sarbo.workers.dev/lyrics/${song}`;
    try {
        const response = await fetch(lyricsUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const songData = await response.json();
        displayLyrics(songData); // Pass the lyrics data to a new function
    } catch (error) {
        console.error("Error fetching lyrics:", error.message);
        lyrics.innerHTML = `<p class="error">Error fetching lyrics: ${error.message}</p>`;
    }
}
function displayLyrics(songData) {
    result.innerHTML = `
        <h2 >${songData.song_title} </h2>
        <pre  >${songData.lyrics}</pre>
    `;
}

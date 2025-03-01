async function getRandomScienceArticle() {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const storedDate = localStorage.getItem('lastUpdateDate');
    const storedArticle = localStorage.getItem('articleData');

    if (storedDate === today && storedArticle) {
        // Jika artikel hari ini sudah tersimpan, gunakan yang tersimpan
        const articleData = JSON.parse(storedArticle);
        updateArticleUI(articleData);
        return;
    }

    try {
        // Pilih kategori ilmu pengetahuan secara acak
        const categories = [
            "Science", 
            "Physics", 
            "Chemistry", 
            "Biology", 
            "Technology", 
            "Mathematics", 
            "Astronomy", 
            "Geology", 
            "Computer_science"
        ];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];

        // Ambil daftar artikel dari kategori tertentu
        let categoryResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:${randomCategory}&cmlimit=50&origin=*`);
        let categoryData = await categoryResponse.json();

        // Pilih satu artikel secara acak
        const pages = categoryData.query.categorymembers;
        const randomPage = pages[Math.floor(Math.random() * pages.length)];

        // Ambil ringkasan artikel
        let articleResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(randomPage.title)}`);
        let articleData = await articleResponse.json();

        // Simpan data ke localStorage
        localStorage.setItem('lastUpdateDate', today);
        localStorage.setItem('articleData', JSON.stringify(articleData));

        // Tampilkan di UI
        updateArticleUI(articleData);
    } catch (error) {
        console.error("Failed to fetch science article from Wikipedia", error);
    }
}

// Fungsi untuk menampilkan artikel di UI
function updateArticleUI(articleData) {
    let titleElement = document.getElementById("wikiTitle");
    let imageElement = document.getElementById("wikiImage");
    let linkElement = document.getElementById("wikiLink");

    // Set judul dan link ke artikel
    titleElement.textContent = articleData.title;
    linkElement.href = articleData.content_urls.desktop.page;

    // Cek apakah ada gambar
    if (articleData.thumbnail) {
        imageElement.src = articleData.thumbnail.source;
        imageElement.style.display = "block";
    } else {
        imageElement.style.display = "none"; // Sembunyikan jika tidak ada gambar
    }
}

// Panggil fungsi saat halaman dimuat
window.onload = getRandomScienceArticle;

document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById("bookForm");
    const bookGrid = document.getElementById("bookGrid");
    const searchBar = document.getElementById("searchBar");
    const favoriteBooksGrid = document.getElementById("favoriteBooks");
    const unreadBooksGrid = document.getElementById("unreadBooks");
    const readBooksGrid = document.getElementById("readBooks");

    let books = JSON.parse(localStorage.getItem("books")) || [];

    // Save books to local storage and refresh the UI
    function saveBooks() {
        localStorage.setItem("books", JSON.stringify(books));
        renderBooks();
    }

    // Render books based on search filter and status
    function renderBooks(filter = "", status = "") {
        bookGrid.innerHTML = "";
        favoriteBooksGrid.innerHTML = "";
        unreadBooksGrid.innerHTML = "";
        readBooksGrid.innerHTML = "";

        books.filter(book => 
            book.title.toLowerCase().includes(filter) ||
            book.author.toLowerCase().includes(filter) ||
            book.genre.toLowerCase().includes(filter)
        ).forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.classList.add("card", "col-md-3", "m-2");
            bookCard.innerHTML = `
                <img src="${book.image}" class="card-img-top" alt="Book Cover">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">by ${book.author}</p>
                    <p class="card-text"><strong>Genre:</strong> ${book.genre}</p>
                    <p class="card-text"><strong>Status:</strong> ${book.status}</p>
                    <button class="btn btn-warning" onclick="editBook('${book.id}')">✏ Edit</button>
                    <button class="btn btn-danger" onclick="deleteBook('${book.id}')">🗑 Delete</button>
                    <button class="btn btn-success" onclick="toggleFavorite('${book.id}')">
                        ${book.favorite ? '⭐ Unfavorite' : '💖 Favorite'}
                    </button>
                </div>
            `;
            if (status === "" || status === book.status) {
                if (book.favorite) {
                    favoriteBooksGrid.appendChild(bookCard);
                } else if (book.status === "Unread") {
                    unreadBooksGrid.appendChild(bookCard);
                } else if (book.status === "Read") {
                    readBooksGrid.appendChild(bookCard);
                } else {
                    bookGrid.appendChild(bookCard); //always show in all books
                }
            }
        });
    }

    // Handle book form submission (Add or Edit)
    bookForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("title").value.trim();
        const author = document.getElementById("author").value.trim();
        const genre = document.getElementById("genre").value.trim();
        const status = document.getElementById("status").value;
        const imageFile = document.getElementById("image").files[0];
        const bookId = document.getElementById("bookId").value;

        if (title && author && genre && imageFile) {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = function() {
                const newBook = {
                    id: bookId || Date.now().toString(),
                    title,
                    author,
                    genre,
                    status,
                    favorite: false,
                    image: reader.result
                };

                if (bookId) {
                    books = books.map(book => (book.id === bookId ? newBook : book));
                } else {
                    books.push(newBook);
                }

                saveBooks();
                bookForm.reset();
                bootstrap.Modal.getInstance(document.getElementById("bookModal")).hide();
            };
        }
    });

    // Edit a book
    window.editBook = (id) => {
        const book = books.find(book => book.id === id);
        if (book) {
            document.getElementById("bookId").value = book.id;
            document.getElementById("title").value = book.title;
            document.getElementById("author").value = book.author;
            document.getElementById("genre").value = book.genre;
            document.getElementById("status").value = book.status;
        }
    };

    // Delete a book from the list
    window.deleteBook = (id) => {
        books = books.filter(book => book.id !== id);
        saveBooks();
    };

    // Toggle the favorite status of a book
    window.toggleFavorite = (id) => {
        books = books.map(book => {
            if (book.id === id) {
                book.favorite = !book.favorite;
            }
            return book;
        });
        saveBooks();
    };

    // Live search filter
    searchBar.addEventListener("input", (e) => {
        renderBooks(e.target.value.toLowerCase());
    });

    // Initial render
    renderBooks();
});


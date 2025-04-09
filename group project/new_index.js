document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById("bookForm");
    const searchBar = document.getElementById("searchBar");
    const bookGrid = document.getElementById("bookGrid");
    const favoriteBooksGrid = document.getElementById("favoriteBooks");
    const unreadBooksGrid = document.getElementById("unreadBooks");
    const readBooksGrid = document.getElementById("readBooks");

    let books = JSON.parse(localStorage.getItem("books")) || [];

    function saveBooks() {
        localStorage.setItem("books", JSON.stringify(books));
        renderBooks();
    }

    function renderBooks(filter = "") {
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

            if (book.favorite) {
                favoriteBooksGrid.appendChild(bookCard);
            }
            if (book.status === "Unread") {
                unreadBooksGrid.appendChild(bookCard);
            }
            if (book.status === "Read") {
                readBooksGrid.appendChild(bookCard);
            }
            bookGrid.appendChild(bookCard); // Always show in "All Books"
        });
    }

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

    window.deleteBook = (id) => {
        books = books.filter(book => book.id !== id);
        saveBooks();
    };

    window.toggleFavorite = (id) => {
        books = books.map(book => {
            if (book.id === id) {
                book.favorite = !book.favorite;
            }
            return book;
        });
        saveBooks();
    };

    searchBar.addEventListener("input", (e) => {
        renderBooks(e.target.value.toLowerCase());
    });

    renderBooks();
});

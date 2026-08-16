let stories = JSON.parse(localStorage.getItem("myStories")) || [];


/* =========================
   ELEMENTS
========================= */

const uploadModal = document.getElementById("uploadModal");
const storyForm = document.getElementById("storyForm");
const storyImage = document.getElementById("storyImage");
const storyTitle = document.getElementById("storyTitle");
const storyText = document.getElementById("storyText");
const imagePreview = document.getElementById("imagePreview");

const storiesContainer = document.getElementById("storiesContainer");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");

const readModal = document.getElementById("readModal");
const readTitle = document.getElementById("readTitle");
const readImage = document.getElementById("readImage");
const readText = document.getElementById("readText");


/* =========================
   OPEN UPLOAD
========================= */

function openUpload() {

    uploadModal.classList.add("show");

    storyForm.reset();

    imagePreview.innerHTML = "";

    imagePreview.style.display = "none";
}


/* =========================
   CLOSE UPLOAD
========================= */

function closeUpload() {

    uploadModal.classList.remove("show");

}


/* =========================
   IMAGE PREVIEW
========================= */

storyImage.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }


    if (!file.type.startsWith("image/")) {

        alert("Please select an image.");

        this.value = "";

        return;
    }


    const reader = new FileReader();


    reader.onload = function (event) {

        imagePreview.innerHTML = `
            <img
                src="${event.target.result}"
                alt="Preview"
            >
        `;

        imagePreview.style.display = "block";

    };


    reader.readAsDataURL(file);

});


/* =========================
   COMPRESS IMAGE
========================= */

function compressImage(file) {

    return new Promise(function (resolve, reject) {

        const reader = new FileReader();


        reader.onload = function (event) {

            const img = new Image();


            img.onload = function () {

                const canvas = document.createElement("canvas");

                const maxWidth = 1000;
                const maxHeight = 1000;


                let width = img.width;
                let height = img.height;


                /* Resize */

                if (width > maxWidth) {

                    height =
                        height *
                        (maxWidth / width);

                    width = maxWidth;

                }


                if (height > maxHeight) {

                    width =
                        width *
                        (maxHeight / height);

                    height = maxHeight;

                }


                canvas.width = width;
                canvas.height = height;


                const ctx = canvas.getContext("2d");


                ctx.drawImage(
                    img,
                    0,
                    0,
                    width,
                    height
                );


                /* JPEG compression */

                const compressedImage =
                    canvas.toDataURL(
                        "image/jpeg",
                        0.75
                    );


                resolve(compressedImage);

            };


            img.onerror = function () {

                reject(
                    new Error("Image could not be loaded.")
                );

            };


            img.src = event.target.result;

        };


        reader.onerror = function () {

            reject(
                new Error("File could not be read.")
            );

        };


        reader.readAsDataURL(file);

    });

}


/* =========================
   ADD STORY
========================= */

storyForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const file = storyImage.files[0];

    const title = storyTitle.value.trim();

    const text = storyText.value.trim();


    /* Check picture */

    if (!file) {

        alert("Please select a picture.");

        return;

    }


    /* Check title */

    if (!title) {

        alert("Please enter story title.");

        return;

    }


    /* Check text */

    if (!text) {

        alert("Please enter story text.");

        return;

    }


    try {

        /* Compress image */

        const compressedImage =
            await compressImage(file);


        const newStory = {

            id: Date.now(),

            image: compressedImage,

            title: title,

            text: text

        };


        stories.unshift(newStory);


        /* Save */

        try {

            localStorage.setItem(
                "myStories",
                JSON.stringify(stories)
            );

        } catch (error) {

            /* Remove the story if storage fails */

            stories.shift();


            alert(
                "Storage full hai. Purani stories delete karein aur dobara try karein."
            );

            console.error(error);

            return;

        }


        /* Display */

        renderStories();


        /* Close */

        closeUpload();


        /* Reset */

        storyForm.reset();

        imagePreview.innerHTML = "";

        imagePreview.style.display = "none";


        alert("Story uploaded successfully!");


    } catch (error) {

        console.error(error);

        alert(
            "Picture upload nahi ho saki. Please doosri picture try karein."
        );

    }

});


/* =========================
   DISPLAY STORIES
========================= */

function renderStories(list = stories) {

    storiesContainer.innerHTML = "";


    if (list.length === 0) {

        emptyMessage.style.display = "block";

        return;

    }


    emptyMessage.style.display = "none";


    list.forEach(function (story) {

        const card =
            document.createElement("article");


        card.className = "story-card";


        card.innerHTML = `

            <div class="story-image-box">

                <img
                    src="${story.image}"
                    class="story-image"
                    alt="Story Image"
                >

            </div>


            <div class="story-content">

                <h2 class="story-title">
                    ${escapeHTML(story.title)}
                </h2>


                <div class="story-text">
                    ${escapeHTML(story.text)}
                </div>


                <button
                    type="button"
                    class="read-btn"
                    onclick="readStory(${story.id})"
                >
                    Read Story
                </button>


                <button
                    type="button"
                    class="delete-btn"
                    onclick="deleteStory(${story.id})"
                >
                    Delete
                </button>

            </div>

        `;


        storiesContainer.appendChild(card);

const titleElement =
    card.querySelector(".story-title");

const textElement =
    card.querySelector(".story-text");


setStoryDirection(
    titleElement,
    story.title
);


setStoryDirection(
    textElement,
    story.text
);

    });

}


/* =========================
   READ STORY
========================= */

function readStory(id) {

    const story =
        stories.find(function (item) {

            return item.id === id;

        });


    if (!story) {
        return;
    }


    readTitle.textContent = story.title;

    readImage.src = story.image;

    readText.textContent = story.text;

setStoryDirection(
    readTitle,
    story.title
);

setStoryDirection(
    readText,
    story.text
);


    readModal.classList.add("show");


    document.body.style.overflow = "hidden";

}


/* =========================
   CLOSE READ STORY
========================= */

function closeReadStory() {

    readModal.classList.remove("show");

    document.body.style.overflow = "";

}


/* =========================
   DELETE STORY
========================= */

function deleteStory(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this story?"
        );


    if (!confirmDelete) {
        return;
    }


    stories =
        stories.filter(function (story) {

            return story.id !== id;

        });


    localStorage.setItem(
        "myStories",
        JSON.stringify(stories)
    );


    renderStories();

}


/* =========================
   SEARCH
========================= */

function searchStories() {

    const keyword =
        searchInput.value
            .toLowerCase()
            .trim();


    if (!keyword) {

        renderStories();

        return;

    }


    const filteredStories =
        stories.filter(function (story) {

            return (

                story.title
                    .toLowerCase()
                    .includes(keyword)

                ||

                story.text
                    .toLowerCase()
                    .includes(keyword)

            );

        });


    renderStories(filteredStories);

}


/* =========================
   UPLOAD MODAL OUTSIDE CLICK
========================= */

uploadModal.addEventListener(
    "click",
    function (event) {

        if (event.target === uploadModal) {

            closeUpload();

        }

    }
);


/* =========================
   READ MODAL OUTSIDE CLICK
========================= */

readModal.addEventListener(
    "click",
    function (event) {

        if (event.target === readModal) {

            closeReadStory();

        }

    }
);


/* =========================
   ESC KEY
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeUpload();

            closeReadStory();

        }

    }
);


/* =========================
   SECURITY
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================
   LOAD STORIES
========================= */

renderStories();


/* =========================
   AUTOMATIC URDU / ENGLISH
========================= */

function getTextDirection(text) {

    const urduPattern =
        /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

    if (urduPattern.test(text)) {
        return "rtl";
    }

    return "ltr";
}


/* =========================
   SET STORY DIRECTION
========================= */

function setStoryDirection(element, text) {

    const direction = getTextDirection(text);

    element.setAttribute("dir", direction);

    element.style.direction = direction;

    element.style.textAlign =
        direction === "rtl"
            ? "right"
            : "left";
}


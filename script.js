/* =====================================================
   MY STORIES - COMPLETE JAVASCRIPT
===================================================== */


/* =====================================================
   LOAD STORIES
===================================================== */

let stories = [];

try {

    stories =
        JSON.parse(
            localStorage.getItem("myStories")
        ) || [];

} catch (error) {

    console.error(error);

    stories = [];

}


/* =====================================================
   GET HTML ELEMENTS
===================================================== */

const uploadModal =
    document.getElementById("uploadModal");

const storyForm =
    document.getElementById("storyForm");

const storyImage =
    document.getElementById("storyImage");

const storyTitle =
    document.getElementById("storyTitle");

const storyText =
    document.getElementById("storyText");

const imagePreview =
    document.getElementById("imagePreview");

const storiesContainer =
    document.getElementById("storiesContainer");

const emptyMessage =
    document.getElementById("emptyMessage");

const searchInput =
    document.getElementById("searchInput");

const readModal =
    document.getElementById("readModal");

const readTitle =
    document.getElementById("readTitle");

const readImage =
    document.getElementById("readImage");

const readText =
    document.getElementById("readText");


/* =====================================================
   CHECK ELEMENTS
===================================================== */

if (!uploadModal) {
    console.error("uploadModal not found");
}

if (!storyForm) {
    console.error("storyForm not found");
}

if (!storiesContainer) {
    console.error("storiesContainer not found");
}


/* =====================================================
   OPEN ADD STORY
===================================================== */

function openUpload() {

    if (!uploadModal) {
        return;
    }

    uploadModal.classList.add("show");

    if (storyForm) {
        storyForm.reset();
    }

    if (imagePreview) {

        imagePreview.innerHTML = "";

        imagePreview.style.display = "none";

    }

}


/* =====================================================
   CLOSE ADD STORY
===================================================== */

function closeUpload() {

    if (!uploadModal) {
        return;
    }

    uploadModal.classList.remove("show");

}


/* =====================================================
   IMAGE PREVIEW
===================================================== */

if (storyImage) {

    storyImage.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) {
                return;
            }


            /* Check image */

            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select an image."
                );

                this.value = "";

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    if (!imagePreview) {
                        return;
                    }


                    imagePreview.innerHTML = `

                        <img
                            src="${event.target.result}"
                            alt="Image Preview"
                        >

                    `;


                    imagePreview.style.display =
                        "block";

                };


            reader.onerror =
                function () {

                    alert(
                        "Image preview could not be loaded."
                    );

                };


            reader.readAsDataURL(file);

        }
    );

}


/* =====================================================
   COMPRESS IMAGE
===================================================== */

function compressImage(file) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const img =
                        new Image();


                    img.onload =
                        function () {

                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            const maxWidth =
                                1000;

                            const maxHeight =
                                1000;


                            let width =
                                img.width;

                            let height =
                                img.height;


                            /* Resize width */

                            if (
                                width >
                                maxWidth
                            ) {

                                height =
                                    height *
                                    (
                                        maxWidth /
                                        width
                                    );

                                width =
                                    maxWidth;

                            }


                            /* Resize height */

                            if (
                                height >
                                maxHeight
                            ) {

                                width =
                                    width *
                                    (
                                        maxHeight /
                                        height
                                    );

                                height =
                                    maxHeight;

                            }


                            canvas.width =
                                Math.round(width);

                            canvas.height =
                                Math.round(height);


                            const ctx =
                                canvas.getContext(
                                    "2d"
                                );


                            if (!ctx) {

                                reject(
                                    new Error(
                                        "Canvas not supported."
                                    )
                                );

                                return;

                            }


                            ctx.drawImage(
                                img,
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            );


                            /* JPEG compression */

                            const compressed =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.75
                                );


                            resolve(
                                compressed
                            );

                        };


                    img.onerror =
                        function () {

                            reject(
                                new Error(
                                    "Image could not be loaded."
                                )
                            );

                        };


                    img.src =
                        event.target.result;

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "File could not be read."
                        )
                    );

                };


            reader.readAsDataURL(file);

        }
    );

}


/* =====================================================
   SAVE STORIES
===================================================== */

function saveStories() {

    try {

        localStorage.setItem(
            "myStories",
            JSON.stringify(stories)
        );

        return true;

    } catch (error) {

        console.error(
            "Storage error:",
            error
        );

        return false;

    }

}


/* =====================================================
   ADD STORY / UPLOAD
===================================================== */

if (storyForm) {

    storyForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const file =
                storyImage
                    ? storyImage.files[0]
                    : null;


            const title =
                storyTitle
                    ? storyTitle.value.trim()
                    : "";


            const text =
                storyText
                    ? storyText.value.trim()
                    : "";


            /* Check picture */

            if (!file) {

                alert(
                    "Please select a picture."
                );

                return;

            }


            /* Check title */

            if (!title) {

                alert(
                    "Please enter story title."
                );

                return;

            }


            /* Check text */

            if (!text) {

                alert(
                    "Please enter story text."
                );

                return;

            }


            /* Disable upload button */

            const uploadButton =
                storyForm.querySelector(
                    ".upload-btn"
                );


            if (uploadButton) {

                uploadButton.disabled =
                    true;

                uploadButton.textContent =
                    "Uploading...";

            }


            try {

                /* Compress image */

                const image =
                    await compressImage(
                        file
                    );


                /* Create story */

                const newStory = {

                    id:
                        Date.now(),

                    image:
                        image,

                    title:
                        title,

                    text:
                        text,

                    date:
                        new Date().toISOString()

                };


                /* Add at beginning */

                stories.unshift(
                    newStory
                );


                /* Save */

                const saved =
                    saveStories();


                if (!saved) {

                    stories.shift();


                    alert(
                        "Storage full hai. Purani stories delete karke dobara try karein."
                    );

                    return;

                }


                /* Update home */

                renderStories();


                /* Close popup */

                closeUpload();


                /* Reset */

                storyForm.reset();


                if (imagePreview) {

                    imagePreview.innerHTML =
                        "";

                    imagePreview.style.display =
                        "none";

                }


                alert(
                    "Story uploaded successfully!"
                );


            } catch (error) {

                console.error(
                    "Upload error:",
                    error
                );


                alert(
                    "Story upload nahi ho saki. Please doosri picture try karein."
                );

            } finally {

                /* Enable button */

                if (uploadButton) {

                    uploadButton.disabled =
                        false;

                    uploadButton.textContent =
                        "Upload Story";

                }

            }

        }
    );

}


/* =====================================================
   URDU / ENGLISH DETECTION
===================================================== */

function getTextDirection(text) {

    if (!text) {

        return "ltr";

    }


    const urduPattern =
        /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;


    if (
        urduPattern.test(text)
    ) {

        return "rtl";

    }


    return "ltr";

}


/* =====================================================
   SET TEXT DIRECTION
===================================================== */

function setStoryDirection(
    element,
    text
) {

    if (!element) {
        return;
    }


    const direction =
        getTextDirection(text);


    element.setAttribute(
        "dir",
        direction
    );


    element.style.direction =
        direction;


    if (direction === "rtl") {

        element.style.textAlign =
            "right";

    } else {

        element.style.textAlign =
            "left";

    }

}


/* =====================================================
   DISPLAY STORIES
   HOME PAGE = PICTURE + TITLE ONLY
===================================================== */

function renderStories(
    list = stories
) {

    if (!storiesContainer) {
        return;
    }


    storiesContainer.innerHTML =
        "";


    /* No stories */

    if (
        !list ||
        list.length === 0
    ) {

        if (emptyMessage) {

            emptyMessage.style.display =
                "block";

        }

        return;

    }


    if (emptyMessage) {

        emptyMessage.style.display =
            "none";

    }


    list.forEach(
        function (story) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "story-card";


            /*
                IMPORTANT:

                Home page only shows:

                1. Picture
                2. Title
                3. Read Story
                4. Delete

                Story text is NOT added here.
            */


            card.innerHTML = `

                <div
                    class="story-image-box"
                >

                    <img
                        src="${story.image}"
                        class="story-image"
                        alt="${escapeHTML(story.title)}"
                    >

                </div>


                <div
                    class="story-content"
                >

                    <h2
                        class="story-title"
                    >
                        ${escapeHTML(story.title)}
                    </h2>


<div class="story-actions">

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

                </div>

            `;


            storiesContainer.appendChild(
                card
            );


            /* Urdu / English title */

            const titleElement =
                card.querySelector(
                    ".story-title"
                );


            setStoryDirection(
                titleElement,
                story.title
            );

        }
    );

}


/* =====================================================
   READ STORY
   FULL STORY OPENS HERE
===================================================== */

function readStory(id) {

    const story =
        stories.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!story) {

        alert(
            "Story not found."
        );

        return;

    }


    if (readTitle) {

        readTitle.textContent =
            story.title;

    }


    if (readImage) {

        readImage.src =
            story.image;

        readImage.alt =
            story.title;

    }


    if (readText) {

        readText.textContent =
            story.text;

    }


    /* Urdu / English */

    setStoryDirection(
        readTitle,
        story.title
    );


    setStoryDirection(
        readText,
        story.text
    );


    /* Open reader */

    if (readModal) {

        readModal.classList.add(
            "show"
        );

    }


    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   CLOSE READ STORY
===================================================== */

function closeReadStory() {

    if (readModal) {

        readModal.classList.remove(
            "show"
        );

    }


    document.body.style.overflow =
        "";

}


/* =====================================================
   DELETE STORY
===================================================== */

function deleteStory(id) {

    const story =
        stories.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!story) {

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this story?"
        );


    if (!confirmed) {

        return;

    }


    stories =
        stories.filter(
            function (item) {

                return item.id !== id;

            }
        );


    saveStories();


    renderStories();

}


/* =====================================================
   SEARCH STORIES
===================================================== */

function searchStories() {

    if (!searchInput) {

        return;

    }


    const keyword =
        searchInput.value
            .toLowerCase()
            .trim();


    /* Empty search */

    if (!keyword) {

        renderStories();

        return;

    }


    const filteredStories =
        stories.filter(
            function (story) {

                const title =
                    (
                        story.title ||
                        ""
                    )
                        .toLowerCase();


                const text =
                    (
                        story.text ||
                        ""
                    )
                        .toLowerCase();


                return (

                    title.includes(
                        keyword
                    )

                    ||

                    text.includes(
                        keyword
                    )

                );

            }
        );


    renderStories(
        filteredStories
    );

}


/* =====================================================
   CLOSE UPLOAD BY CLICKING OUTSIDE
===================================================== */

if (uploadModal) {

    uploadModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                uploadModal
            ) {

                closeUpload();

            }

        }
    );

}


/* =====================================================
   CLOSE READ MODAL BY CLICKING OUTSIDE
===================================================== */

if (readModal) {

    readModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                readModal
            ) {

                closeReadStory();

            }

        }
    );

}


/* =====================================================
   ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeUpload();

            closeReadStory();

        }

    }
);


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text || "";


    return div.innerHTML;

}


/* =====================================================
   LOAD STORIES ON PAGE LOAD
===================================================== */

renderStories();
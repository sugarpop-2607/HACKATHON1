/* =========================================================
   PROCUREMENT AI QUOTE ANALYSIS
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const API_BASE_URL = "http://127.0.0.1:8000";


/* =========================================================
   ELEMENTS
========================================================= */

const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const fileList = document.getElementById("fileList");
const fileCounter = document.getElementById("fileCounter");

const analyzeButton =
    document.getElementById("analyzeButton");

const processingPanel =
    document.getElementById("processingPanel");

const processingText =
    document.getElementById("processingText");

const progressBar =
    document.getElementById("progressBar");

const resultsSection =
    document.getElementById("resultsSection");

const errorPanel =
    document.getElementById("errorPanel");

const errorMessage =
    document.getElementById("errorMessage");

const retryButton =
    document.getElementById("retryButton");

const newAnalysisButton =
    document.getElementById("newAnalysisButton");

const bestVendor =
    document.getElementById("bestVendor");

const bestScore =
    document.getElementById("bestScore");

const reasoningText =
    document.getElementById("reasoningText");

const comparisonBody =
    document.getElementById("comparisonBody");

const mobileMenu =
    document.getElementById("mobileMenu");

const sidebar =
    document.querySelector(".sidebar");


/* =========================================================
   STATE
========================================================= */

let selectedFiles = [];


/* =========================================================
   FILE INPUT
========================================================= */

dropZone.addEventListener("click", () => {
    fileInput.click();
});


fileInput.addEventListener("change", () => {

    const files = Array.from(fileInput.files);

    addFiles(files);

    fileInput.value = "";

});


/* =========================================================
   DRAG & DROP
========================================================= */

dropZone.addEventListener("dragover", (event) => {

    event.preventDefault();

    dropZone.classList.add("dragging");

});


dropZone.addEventListener("dragleave", () => {

    dropZone.classList.remove("dragging");

});


dropZone.addEventListener("drop", (event) => {

    event.preventDefault();

    dropZone.classList.remove("dragging");

    const files =
        Array.from(event.dataTransfer.files);

    addFiles(files);

});


/* =========================================================
   ADD FILES
========================================================= */

function addFiles(files) {

    for (const file of files) {

        if (!isPDF(file)) {

            showError(
                `${file.name} is not a PDF file.`
            );

            continue;
        }


        if (selectedFiles.length >= 3) {

            showError(
                "Only 3 quotation files are required."
            );

            break;
        }


        const alreadyExists =
            selectedFiles.some(
                existing =>
                    existing.name === file.name &&
                    existing.size === file.size
            );


        if (alreadyExists) {
            continue;
        }


        selectedFiles.push(file);
    }


    renderFiles();

}


/* =========================================================
   PDF VALIDATION
========================================================= */

function isPDF(file) {

    return (
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
    );

}


/* =========================================================
   RENDER FILES
========================================================= */

function renderFiles() {

    fileList.innerHTML = "";


    selectedFiles.forEach((file, index) => {

        const card =
            document.createElement("div");

        card.className = "file-card";


        card.innerHTML = `

            <div class="pdf-icon">
                PDF
            </div>

            <div class="file-details">

                <strong title="${escapeHTML(file.name)}">
                    ${escapeHTML(file.name)}
                </strong>

                <span>
                    ${formatFileSize(file.size)}
                </span>

            </div>

            <button
                class="remove-file"
                data-index="${index}"
                title="Remove file"
            >
                ×
            </button>

        `;


        fileList.appendChild(card);

    });


    updateCounter();

}


/* =========================================================
   REMOVE FILE
========================================================= */

fileList.addEventListener("click", (event) => {

    const button =
        event.target.closest(".remove-file");

    if (!button) {
        return;
    }


    const index =
        Number(button.dataset.index);


    selectedFiles.splice(index, 1);

    renderFiles();

});


/* =========================================================
   COUNTER
========================================================= */

function updateCounter() {

    const count = selectedFiles.length;

    fileCounter.textContent =
        `${count} / 3 quotations selected`;


    analyzeButton.disabled =
        count !== 3;

}


/* =========================================================
   ANALYZE
========================================================= */

analyzeButton.addEventListener(
    "click",
    analyzeQuotations
);


async function analyzeQuotations() {

    if (selectedFiles.length !== 3) {

        showError(
            "Please select exactly 3 PDF quotations."
        );

        return;
    }


    hideError();

    resultsSection.classList.add("hidden");

    processingPanel.classList.remove("hidden");

    analyzeButton.disabled = true;


    try {

        updateProgress(
            20,
            "Uploading quotation documents..."
        );


        const formData = new FormData();

        formData.append(
            "file1",
            selectedFiles[0]
        );

        formData.append(
            "file2",
            selectedFiles[1]
        );

        formData.append(
            "file3",
            selectedFiles[2]
        );


        updateStep("step2", true);

        updateProgress(
            40,
            "AI is extracting quotation information..."
        );


        const response =
            await fetch(
                `${API_BASE_URL}/compare_quotations`,
                {
                    method: "POST",
                    body: formData
                }
            );


        if (!response.ok) {

            let message =
                `Server returned ${response.status}`;

            try {

                const errorData =
                    await response.json();

                if (errorData.detail) {
                    message = errorData.detail;
                }

            } catch (_) {}

            throw new Error(message);
        }


        updateStep("step3", true);

        updateProgress(
            70,
            "Comparing prices, delivery and warranty..."
        );


        const result =
            await response.json();


        updateStep("step4", true);

        updateProgress(
            90,
            "Preparing AI recommendation..."
        );


        await sleep(500);


        displayResults(result);


        updateProgress(
            100,
            "Analysis complete."
        );


        await sleep(400);


        processingPanel.classList.add("hidden");

        resultsSection.classList.remove("hidden");


        resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


    } catch (error) {

        console.error(error);

        processingPanel.classList.add("hidden");

        showError(
            error.message ||
            "Unable to analyze the quotations."
        );

    } finally {

        analyzeButton.disabled =
            selectedFiles.length !== 3;

    }

}


/* =========================================================
   DISPLAY RESULTS
========================================================= */

function displayResults(result) {

    console.log("AI RESULT:", result);


    /*
        Expected backend response:

        {
            "best_vendor": "...",
            "score": 92,
            "reasoning": "...",
            "comparison": [
                {
                    "vendor": "...",
                    "price": "...",
                    "delivery": "...",
                    "warranty": "..."
                }
            ]
        }
    */


    bestVendor.textContent =
        result.best_vendor || "Unknown Vendor";


    const score =
        Number(result.score);


    bestScore.textContent =
        Number.isFinite(score)
            ? formatScore(score)
            : "—";


    reasoningText.textContent =
        result.reasoning ||
        "No reasoning was returned by the AI.";


    renderComparison(
        result.comparison || []
    );

}


/* =========================================================
   COMPARISON TABLE
========================================================= */

function renderComparison(comparison) {

    comparisonBody.innerHTML = "";


    if (!comparison.length) {

        comparisonBody.innerHTML = `

            <tr>

                <td colspan="4">
                    No comparison data returned.
                </td>

            </tr>

        `;

        return;
    }


    comparison.forEach(vendor => {

        const row =
            document.createElement("tr");


        const isWinner =
            normalize(
                vendor.vendor
            ) === normalize(
                bestVendor.textContent
            );


        if (isWinner) {
            row.classList.add("winner-row");
        }


        row.innerHTML = `

            <td>
                ${escapeHTML(
                    vendor.vendor || "—"
                )}
            </td>

            <td>
                ${escapeHTML(
                    vendor.price || "—"
                )}
            </td>

            <td>
                ${escapeHTML(
                    vendor.delivery || "—"
                )}
            </td>

            <td>
                ${escapeHTML(
                    vendor.warranty || "—"
                )}
            </td>

        `;


        comparisonBody.appendChild(row);

    });

}


/* =========================================================
   PROGRESS
========================================================= */

function updateProgress(
    percent,
    message
) {

    progressBar.style.width =
        `${percent}%`;

    processingText.textContent =
        message;

}


/* =========================================================
   PROCESSING STEPS
========================================================= */

function updateStep(
    stepId,
    active
) {

    const step =
        document.getElementById(stepId);

    if (!step) {
        return;
    }

    if (active) {

        step.classList.add("active");

        const span =
            step.querySelector("span");

        if (span) {
            span.textContent = "✓";
        }

    }

}


/* =========================================================
   ERROR
========================================================= */

function showError(message) {

    errorMessage.textContent =
        message;

    errorPanel.classList.remove(
        "hidden"
    );

}


function hideError() {

    errorPanel.classList.add(
        "hidden"
    );

}


/* =========================================================
   RETRY
========================================================= */

retryButton.addEventListener(
    "click",
    () => {

        hideError();

        if (selectedFiles.length === 3) {

            analyzeQuotations();

        } else {

            dropZone.scrollIntoView({
                behavior: "smooth"
            });

        }

    }
);


/* =========================================================
   NEW ANALYSIS
========================================================= */

newAnalysisButton.addEventListener(
    "click",
    resetAnalysis
);


function resetAnalysis() {

    selectedFiles = [];

    renderFiles();

    comparisonBody.innerHTML = "";

    bestVendor.textContent = "—";

    bestScore.textContent = "—";

    reasoningText.textContent = "—";

    processingPanel.classList.add(
        "hidden"
    );

    resultsSection.classList.add(
        "hidden"
    );

    hideError();

    progressBar.style.width = "10%";

    processingText.textContent =
        "Reading vendor documents...";

    document
        .querySelectorAll(".processing-step")
        .forEach((step, index) => {

            if (index === 0) {

                step.classList.add("active");

            } else {

                step.classList.remove("active");

                const span =
                    step.querySelector("span");

                if (span) {
                    span.textContent =
                        index + 1;
                }

            }

        });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

mobileMenu.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle(
            "mobile-open"
        );

    }
);


/* =========================================================
   HELPERS
========================================================= */

function formatFileSize(bytes) {

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(
        bytes /
        (1024 * 1024)
    ).toFixed(1)} MB`;

}


function formatScore(score) {

    /*
        Handles both:

        92
        0.92
    */

    if (score <= 1) {
        return Math.round(score * 100);
    }

    return Math.round(score);

}


function normalize(value) {

    return String(value || "")
        .trim()
        .toLowerCase();

}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function sleep(ms) {

    return new Promise(
        resolve => setTimeout(resolve, ms)
    );

}
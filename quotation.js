/* =========================================================
   AI QUOTATION ANALYSIS
   Frontend JavaScript for FastAPI Backend
========================================================= */



    /* =====================================================
       CONFIGURATION
    ===================================================== */

    // Change this if your FastAPI server runs somewhere else.
    const API_BASE_URL = "http://127.0.0.1:8000";

    const COMPARE_ENDPOINT =
        `${API_BASE_URL}/compare_quotations`;


    /* =====================================================
       DOM ELEMENTS
    ===================================================== */
    document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
   DOM ELEMENTS
===================================================== */

const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const browseButton = document.getElementById("browseButton");

const fileList = document.getElementById("fileList");
const fileCounter = document.getElementById("fileCounter");
const analyzeButton = document.getElementById("analyzeButton");

const processingPanel = document.getElementById("processingPanel");
const processingText = document.getElementById("processingText");
const progressBar = document.getElementById("progressBar");

const resultsSection = document.getElementById("resultsSection");

const errorPanel = document.getElementById("errorPanel");
const errorMessage = document.getElementById("errorMessage");

const retryButton = document.getElementById("retryButton");
const newAnalysisButton = document.getElementById("newAnalysisButton");

const bestVendor = document.getElementById("bestVendor");
const bestScore = document.getElementById("bestScore");

const reasoningText = document.getElementById("reasoningText");

const comparisonBody = document.getElementById("comparisonBody");

const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.querySelector(".sidebar");


    /* =====================================================
       STATE
    ===================================================== */

    let selectedFiles = [];


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    updateFileUI();


    /* =====================================================
       FILE INPUT
    ===================================================== */

    fileInput.addEventListener("change", (event) => {

        const files = Array.from(event.target.files);

        addFiles(files);

        // Allows selecting the same file again later.
        fileInput.value = "";

    });


    /* =====================================================
       DROP ZONE CLICK
    ===================================================== */

    browseButton.addEventListener("click", (event) => {

    event.stopPropagation();

    if (selectedFiles.length >= 3) {
        showError("You can upload only 3 quotation PDFs.");
        return;
    }

    fileInput.click();

});

    /* =====================================================
       DRAG & DROP
    ===================================================== */

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

        const files = Array.from(event.dataTransfer.files);

        addFiles(files);

    });


    /* =====================================================
       ADD FILES
    ===================================================== */

    function addFiles(files) {

        if (!files || files.length === 0) {
            return;
        }

        const pdfFiles = files.filter((file) => {

            return (
                file.type === "application/pdf" ||
                file.name.toLowerCase().endsWith(".pdf")
            );

        });


        if (pdfFiles.length !== files.length) {

            showError(
                "Only PDF quotation files are allowed."
            );

        }


        for (const file of pdfFiles) {

            if (selectedFiles.length >= 3) {

                showError(
                    "You can upload exactly 3 quotation PDFs."
                );

                break;
            }


            const duplicate = selectedFiles.some(
                (existingFile) =>
                    existingFile.name === file.name &&
                    existingFile.size === file.size
            );


            if (duplicate) {
                continue;
            }


            selectedFiles.push(file);

        }


        updateFileUI();

    }


    /* =====================================================
       UPDATE FILE UI
    ===================================================== */

    function updateFileUI() {

        fileList.innerHTML = "";


        selectedFiles.forEach((file, index) => {

            const fileItem =
                document.createElement("div");

            fileItem.className = "file-item";


            const size =
                formatFileSize(file.size);


            fileItem.innerHTML = `

                <div class="file-icon">
                    PDF
                </div>

                <div class="file-info">

                    <strong title="${escapeHTML(file.name)}">
                        ${escapeHTML(file.name)}
                    </strong>

                    <span>
                        ${size}
                    </span>

                </div>

                <button
                    type="button"
                    class="remove-file"
                    data-index="${index}"
                    aria-label="Remove ${escapeHTML(file.name)}"
                >
                    ×
                </button>

            `;


            fileList.appendChild(fileItem);

        });


        // Remove buttons
        document
            .querySelectorAll(".remove-file")
            .forEach((button) => {

                button.addEventListener("click", (event) => {

                    event.stopPropagation();

                    const index =
                        Number(button.dataset.index);

                    removeFile(index);

                });

            });


        // Counter
        fileCounter.textContent =
            `${selectedFiles.length} / 3 quotations selected`;


        // Analyze button
        analyzeButton.disabled =
            selectedFiles.length !== 3;


        // Change drop zone appearance
        if (selectedFiles.length === 3) {

            dropZone.classList.add("complete");

        } else {

            dropZone.classList.remove("complete");

        }

    }


    /* =====================================================
       REMOVE FILE
    ===================================================== */

    function removeFile(index) {

        if (
            index < 0 ||
            index >= selectedFiles.length
        ) {
            return;
        }

        selectedFiles.splice(index, 1);

        updateFileUI();

        hideError();

    }


    /* =====================================================
       ANALYZE BUTTON
    ===================================================== */

    analyzeButton.addEventListener("click", async () => {

        if (selectedFiles.length !== 3) {

            showError(
                "Please select exactly 3 quotation PDFs."
            );

            return;
        }


        await analyzeQuotations();

    });


    /* =====================================================
       ANALYZE QUOTATIONS
    ===================================================== */

    async function analyzeQuotations() {

        hideError();

        hideResults();

        showProcessing();

        setProcessingStep(1);

        updateProgress(
            10,
            "Uploading quotation documents..."
        );


        const formData = new FormData();

        /*
         * IMPORTANT:
         *
         * Your FastAPI endpoint expects:
         *
         * file1
         * file2
         * file3
         *
         * So we MUST use these exact names.
         */

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


        try {

            // Simulated visual progress while backend works
            const progressTimer =
                startProcessingAnimation();

            
            const COMPARE_ENDPOINT ="http://127.0.0.1:8000/compare_quotations";


            const response =
                await fetch(
                    COMPARE_ENDPOINT,
                    {
                        method: "POST",
                        body: formData
                    }
                );


            clearInterval(progressTimer);


            setProcessingStep(2);

            updateProgress(
                55,
                "Extracting quotation data..."
            );


            if (!response.ok) {

                let backendMessage =
                    `Server returned ${response.status}`;

                try {

                    const errorData =
                        await response.json();

                    if (errorData.detail) {
                        backendMessage =
                            errorData.detail;
                    }

                } catch (jsonError) {

                    // Ignore JSON parsing error.

                }

                throw new Error(backendMessage);

            }


            setProcessingStep(3);

            updateProgress(
                75,
                "Comparing vendors..."
            );


            const result =
                await response.json();


            setProcessingStep(4);

            updateProgress(
                95,
                "Selecting best procurement option..."
            );


            // Small delay so the final processing state
            // is visible to the user.
            await sleep(500);


            updateProgress(
                100,
                "Analysis complete."
            );


            await sleep(300);


            displayResults(result);


        } catch (error) {

            console.error(
                "Quotation analysis error:",
                error
            );

            hideProcessing();


            showError(
                getFriendlyErrorMessage(error)
            );

        }

    }


    /* =====================================================
       PROCESSING ANIMATION
    ===================================================== */

    function startProcessingAnimation() {

        let progress = 15;

        let step = 1;


        return setInterval(() => {

            if (progress < 90) {

                progress += Math.random() * 5;

            }


            if (progress >= 35 && step === 1) {

                step = 2;

                setProcessingStep(2);

                processingText.textContent =
                    "Extracting quotation information...";

            }


            if (progress >= 65 && step === 2) {

                step = 3;

                setProcessingStep(3);

                processingText.textContent =
                    "Comparing vendor offers...";

            }


            if (progress >= 82 && step === 3) {

                step = 4;

                setProcessingStep(4);

                processingText.textContent =
                    "Evaluating overall procurement value...";

            }


            progressBar.style.width =
                `${Math.min(progress, 90)}%`;


        }, 700);

    }


    /* =====================================================
       SHOW PROCESSING
    ===================================================== */

    function showProcessing() {

        processingPanel.classList.remove("hidden");

        resultsSection.classList.add("hidden");

        analyzeButton.disabled = true;

        fileInput.disabled = true;

        progressBar.style.width = "5%";

    }


    /* =====================================================
       HIDE PROCESSING
    ===================================================== */

    function hideProcessing() {

        processingPanel.classList.add("hidden");

        fileInput.disabled = false;

        analyzeButton.disabled =
            selectedFiles.length !== 3;

    }


    /* =====================================================
       PROCESSING STEPS
    ===================================================== */

    function setProcessingStep(stepNumber) {

        const steps =
            document.querySelectorAll(
                ".processing-step"
            );


        steps.forEach((step, index) => {

            const number =
                index + 1;


            step.classList.remove(
                "active",
                "completed"
            );


            if (number < stepNumber) {

                step.classList.add(
                    "completed"
                );

            }


            if (number === stepNumber) {

                step.classList.add(
                    "active"
                );

            }

        });

    }


    /* =====================================================
       UPDATE PROGRESS
    ===================================================== */

    function updateProgress(
        percentage,
        message
    ) {

        progressBar.style.width =
            `${percentage}%`;


        processingText.textContent =
            message;

    }


    /* =====================================================
       DISPLAY RESULTS
    ===================================================== */

    function displayResults(result) {

        hideProcessing();

        hideError();


        console.log(
            "AI Analysis Result:",
            result
        );


        /*
         * Expected backend response:
         *
         * {
         *   best_vendor: "...",
         *   score: 92,
         *   reasoning: "...",
         *   comparison: [
         *      {
         *          vendor: "...",
         *          price: "...",
         *          delivery: "...",
         *          warranty: "..."
         *      }
         *   ]
         * }
         */


        const vendor =
            result.best_vendor ?? "Unknown Vendor";


        const score =
            result.score ?? "—";


        const reasoning =
            result.reasoning ??
            "No reasoning was returned by the AI.";


        bestVendor.textContent =
            vendor;


        bestScore.textContent =
            formatScore(score);


        reasoningText.textContent =
            reasoning;


        renderComparison(
            result.comparison
        );


        resultsSection.classList.remove(
            "hidden"
        );


        // Smoothly move user to results
        setTimeout(() => {

            resultsSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);

    }


    /* =====================================================
       RENDER COMPARISON TABLE
    ===================================================== */

    function renderComparison(comparison) {

        comparisonBody.innerHTML = "";


        if (
            !Array.isArray(comparison) ||
            comparison.length === 0
        ) {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td colspan="4">
                    No comparison data returned.
                </td>
            `;


            comparisonBody.appendChild(row);

            return;
        }


        comparison.forEach((vendor) => {

            const row =
                document.createElement("tr");


            const vendorName =
                vendor.vendor ?? "Unknown";


            const price =
                vendor.price ?? "—";


            const delivery =
                vendor.delivery ?? "—";


            const warranty =
                vendor.warranty ?? "—";


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(
                            String(vendorName)
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        String(price)
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        String(delivery)
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        String(warranty)
                    )}
                </td>

            `;


            comparisonBody.appendChild(row);

        });

    }


    /* =====================================================
       NEW ANALYSIS
    ===================================================== */

    newAnalysisButton.addEventListener(
        "click",
        resetAnalysis
    );


    retryButton.addEventListener(
        "click",
        () => {

            hideError();

            if (selectedFiles.length === 3) {

                analyzeQuotations();

            }

        }
    );


    function resetAnalysis() {

        selectedFiles = [];

        fileInput.value = "";

        comparisonBody.innerHTML = "";

        bestVendor.textContent = "—";

        bestScore.textContent = "—";

        reasoningText.textContent = "—";

        resultsSection.classList.add(
            "hidden"
        );

        processingPanel.classList.add(
            "hidden"
        );

        hideError();

        updateFileUI();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* =====================================================
       ERROR HANDLING
    ===================================================== */

    function showError(message) {

        errorMessage.textContent =
            message;

        errorPanel.classList.remove(
            "hidden"
        );


        // Scroll error into view
        setTimeout(() => {

            errorPanel.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 50);

    }


    function hideError() {

        errorPanel.classList.add(
            "hidden"
        );

    }


    function getFriendlyErrorMessage(error) {

        if (!error) {

            return "Something went wrong.";

        }


        if (
            error.message.includes(
                "Failed to fetch"
            )
        ) {

            return `
                Cannot connect to the FastAPI server.
                Make sure your backend is running at
                ${API_BASE_URL}.
            `;

        }


        return error.message ||
            "Quotation analysis failed.";

    }


    /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

    if (mobileMenu && sidebar) {

        mobileMenu.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "mobile-open"
                );

            }
        );


        // Close sidebar after clicking a link
        sidebar
            .querySelectorAll(".nav-item")
            .forEach((item) => {

                item.addEventListener(
                    "click",
                    () => {

                        sidebar.classList.remove(
                            "mobile-open"
                        );

                    }
                );

            });

    }


    /* =====================================================
       HELPER FUNCTIONS
    ===================================================== */

    function formatFileSize(bytes) {

        if (bytes === 0) {
            return "0 Bytes";
        }


        const units = [
            "Bytes",
            "KB",
            "MB",
            "GB"
        ];


        const i =
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            );


        return (
            parseFloat(
                (
                    bytes /
                    Math.pow(1024, i)
                ).toFixed(1)
            ) +
            " " +
            units[i]
        );

    }


    function formatScore(score) {

        if (
            score === null ||
            score === undefined ||
            score === ""
        ) {

            return "—";

        }


        const number =
            Number(score);


        if (Number.isNaN(number)) {

            return String(score);

        }


        return (
            Math.round(number * 10) / 10
        );

    }


    function sleep(milliseconds) {

        return new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    milliseconds
                )
        );

    }


    /*
     * Prevent HTML injection when displaying
     * filenames or AI-generated table values.
     */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }

});
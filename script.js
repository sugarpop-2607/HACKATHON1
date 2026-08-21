/* =========================================================
   AI PROCUREMENT COPILOT
   FRONTEND JAVASCRIPT
========================================================= */


/* =========================================================
   STATE
========================================================= */

let selectedFiles = [];

let currentPage = "copilot";


/* =========================================================
   DOM
========================================================= */

const copilotInput =
    document.getElementById("copilotInput");

const analyzeButton =
    document.getElementById("analyzeButton");

const uploadTrigger =
    document.getElementById("uploadTrigger");

const fileInput =
    document.getElementById("fileInput");

const uploadModal =
    document.getElementById("uploadModal");

const closeModal =
    document.getElementById("closeModal");

const cancelUpload =
    document.getElementById("cancelUpload");

const uploadButton =
    document.getElementById("uploadButton");

const dropZone =
    document.getElementById("dropZone");

const selectedFilesBox =
    document.getElementById("selectedFiles");

const fileList =
    document.getElementById("fileList");

const fileCount =
    document.getElementById("fileCount");

const fileCountDisplay =
    document.getElementById("fileCountDisplay");

const copilotResponse =
    document.getElementById("copilotResponse");


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupNavigation();

        setupUpload();

        setupCopilot();

        setupPromptChips();

        setupGlobalSearch();

        setupMobileMenu();

    }
);


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item[data-page]"
        );


    navItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                navigateToPage(
                    item.dataset.page
                );

            }
        );

    });


    const pageLinks =
        document.querySelectorAll(
            "[data-page-link]"
        );


    pageLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navigateToPage(
                    link.dataset.pageLink
                );

            }
        );

    });

}


function navigateToPage(pageName) {

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(page => {

        page.classList.remove("active");

    });


    const target =
        document.getElementById(pageName);


    if (!target) return;


    target.classList.add("active");


    const navItems =
        document.querySelectorAll(
            ".nav-item[data-page]"
        );


    navItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.page === pageName
        );

    });


    currentPage = pageName;


    closeMobileSidebar();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   COPILOT
========================================================= */

function setupCopilot() {

    if (!analyzeButton) return;


    analyzeButton.addEventListener(
        "click",
        analyzeRequest
    );


    if (copilotInput) {

        copilotInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    (event.ctrlKey || event.metaKey)
                ) {

                    event.preventDefault();

                    analyzeRequest();

                }

            }
        );


        copilotInput.addEventListener(
            "input",
            () => {

                copilotInput.style.height =
                    "auto";

                copilotInput.style.height =
                    Math.min(
                        copilotInput.scrollHeight,
                        180
                    ) + "px";

            }
        );

    }

}


/* =========================================================
   ANALYZE
========================================================= */

function analyzeRequest() {

    const query =
        copilotInput
            ? copilotInput.value.trim()
            : "";


    if (
        !query &&
        selectedFiles.length === 0
    ) {

        showInputError();

        return;

    }


    analyzeButton.disabled = true;

    analyzeButton.innerHTML =
        "<span>◌</span> Analyzing...";


    setTimeout(
        () => {

            renderAnalysis(query);

            analyzeButton.disabled = false;

            analyzeButton.innerHTML =
                "<span>✦</span> Analyze";

        },
        900
    );

}


/* =========================================================
   INPUT ERROR
========================================================= */

function showInputError() {

    const box =
        document.querySelector(
            ".copilot-box"
        );


    if (!box) return;


    box.style.borderColor =
        "#a96551";


    box.style.boxShadow =
        "0 0 0 4px rgba(169,101,81,.08)";


    if (copilotInput) {

        copilotInput.focus();

    }


    setTimeout(
        () => {

            box.style.borderColor = "";

            box.style.boxShadow = "";

        },
        1000
    );

}


/* =========================================================
   MOCK AI ANALYSIS
========================================================= */

function renderAnalysis(query) {

    const documents =
        selectedFiles.length;


    const value =
        documents >= 3
            ? "₹7.36L"
            : "₹4.82L";


    const savings =
        documents >= 3
            ? "₹94,200"
            : "₹68,400";


    const score =
        documents >= 3
            ? 94
            : 93;


    copilotResponse.innerHTML = `

        <div class="response-header">

            <div class="response-title">

                <div class="response-icon">
                    ✦
                </div>

                <div>

                    <span>
                        AI PROCUREMENT ANALYSIS
                    </span>

                    <h2>
                        Analysis Complete
                    </h2>

                </div>

            </div>


            <button
                type="button"
                class="response-action"
                id="newAnalysis"
            >
                New analysis
            </button>

        </div>


        <div class="ai-summary">

            <div class="summary-icon">
                ✓
            </div>

            <div>

                <strong>
                    AI recommendation ready
                </strong>

                <p>
                    ${
                        documents > 0
                        ? `Analyzed ${documents}
                           document${documents > 1 ? "s" : ""}
                           and evaluated the procurement information.`
                        : `Analyzed your procurement request
                           and generated a recommended purchasing strategy.`
                    }
                </p>

            </div>


            <div class="recommendation-score">

                <strong>
                    ${score}
                </strong>

                <span>
                    /100
                </span>

            </div>

        </div>


        <div class="analysis-grid">


            <div class="analysis-card">

                <div class="analysis-card-icon">
                    ₹
                </div>

                <div>

                    <small>
                        ESTIMATED VALUE
                    </small>

                    <strong>
                        ${value}
                    </strong>

                    <p>
                        Across analyzed quotes
                    </p>

                </div>

            </div>


            <div class="analysis-card">

                <div class="analysis-card-icon">
                    ↓
                </div>

                <div>

                    <small>
                        POTENTIAL SAVINGS
                    </small>

                    <strong>
                        ${savings}
                    </strong>

                    <p>
                        Compared with alternatives
                    </p>

                </div>

            </div>


            <div class="analysis-card">

                <div class="analysis-card-icon">
                    ◈
                </div>

                <div>

                    <small>
                        VENDORS ANALYZED
                    </small>

                    <strong>
                        ${Math.max(documents + 2, 3)}
                    </strong>

                    <p>
                        Supplier options
                    </p>

                </div>

            </div>


            <div class="analysis-card">

                <div class="analysis-card-icon">
                    ◷
                </div>

                <div>

                    <small>
                        DELIVERY
                    </small>

                    <strong>
                        12 days
                    </strong>

                    <p>
                        Recommended timeline
                    </p>

                </div>

            </div>

        </div>


        <div class="recommendation-section">

            <div class="section-heading">

                <span>
                    AI RECOMMENDATION
                </span>

                <h3>
                    Nova Industrial Systems
                </h3>

            </div>


            <div class="reason-list">


                <div class="reason-item">

                    <div class="reason-check">
                        ✓
                    </div>

                    <div>

                        <strong>
                            Best total value
                        </strong>

                        <p>
                            Competitive pricing with
                            strong overall value.
                        </p>

                    </div>

                </div>


                <div class="reason-item">

                    <div class="reason-check">
                        ✓
                    </div>

                    <div>

                        <strong>
                            Reliable delivery
                        </strong>

                        <p>
                            Delivery timeline meets
                            procurement requirements.
                        </p>

                    </div>

                </div>


                <div class="reason-item">

                    <div class="reason-check">
                        ✓
                    </div>

                    <div>

                        <strong>
                            Strong warranty
                        </strong>

                        <p>
                            Includes extended supplier
                            support coverage.
                        </p>

                    </div>

                </div>


            </div>

        </div>


        <div class="response-actions">

            <button
                type="button"
                class="secondary-button"
                id="exportAnalysis"
            >
                Export Analysis
            </button>


            <button
                type="button"
                class="primary-button"
                id="reviewVendor"
            >
                Review Vendor →
            </button>

        </div>

    `;


    copilotResponse.classList.remove(
        "hidden"
    );


    window.setTimeout(
        () => {

            copilotResponse.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        },
        100
    );


    setupResponseButtons();

}


/* =========================================================
   RESPONSE BUTTONS
========================================================= */

function setupResponseButtons() {

    const newAnalysis =
        document.getElementById(
            "newAnalysis"
        );


    const exportAnalysis =
        document.getElementById(
            "exportAnalysis"
        );


    const reviewVendor =
        document.getElementById(
            "reviewVendor"
        );


    if (newAnalysis) {

        newAnalysis.addEventListener(
            "click",
            () => {

                copilotResponse.classList.add(
                    "hidden"
                );

                copilotInput.focus();

            }
        );

    }


    if (exportAnalysis) {

        exportAnalysis.addEventListener(
            "click",
            exportResult
        );

    }


    if (reviewVendor) {

        reviewVendor.addEventListener(
            "click",
            () => {

                navigateToPage(
                    "quotes"
                );

            }
        );

    }

}


/* =========================================================
   EXPORT
========================================================= */

function exportResult() {

    const report = `

AI PROCUREMENT ANALYSIS
=======================

Recommended Vendor:
Nova Industrial Systems

AI Score:
93/100

Estimated Procurement Value:
₹4.82L

Potential Savings:
₹68,400

Expected Delivery:
12 days

Reasons:
- Best total value
- Reliable delivery
- Strong warranty

Generated by AI Procurement Copilot.

`;


    const blob =
        new Blob(
            [report],
            {
                type: "text/plain"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "AI-procurement-analysis.txt";


    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

}


/* =========================================================
   UPLOAD SYSTEM
========================================================= */

function setupUpload() {

    /*
        OPEN MODAL
    */

    uploadTrigger.addEventListener(
        "click",
        openUploadModal
    );


    /*
        FILE BROWSER
    */

    fileInput.addEventListener(
        "change",
        event => {

            addFiles(
                event.target.files
            );

            /*
                Allows the same file to be
                selected again.
            */

            fileInput.value = "";

        }
    );


    /*
        BROWSE BUTTON
    */

    const browseButton =
        document.querySelector(
            ".browse-button"
        );


    browseButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            fileInput.click();

        }
    );


    /*
        DROP ZONE
    */

    dropZone.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            dropZone.classList.add(
                "dragover"
            );

        }
    );


    dropZone.addEventListener(
        "dragleave",
        () => {

            dropZone.classList.remove(
                "dragover"
            );

        }
    );


    dropZone.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            dropZone.classList.remove(
                "dragover"
            );


            addFiles(
                event.dataTransfer.files
            );

        }
    );


    /*
        Clicking the drop zone itself
        opens browser.
    */

    dropZone.addEventListener(
        "click",
        event => {

            if (
                event.target.closest(
                    ".browse-button"
                )
            ) {

                return;

            }

            fileInput.click();

        }
    );


    /*
        MODAL CLOSE
    */

    closeModal.addEventListener(
        "click",
        closeUploadModal
    );


    cancelUpload.addEventListener(
        "click",
        closeUploadModal
    );


    /*
        ATTACH
    */

    uploadButton.addEventListener(
        "click",
        confirmUpload
    );


    /*
        CLICK OUTSIDE
    */

    uploadModal.addEventListener(
        "click",
        event => {

            if (
                event.target === uploadModal
            ) {

                closeUploadModal();

            }

        }
    );


    /*
        ESCAPE
    */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                uploadModal.classList.contains(
                    "active"
                )
            ) {

                closeUploadModal();

            }

        }
    );

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openUploadModal() {

    uploadModal.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeUploadModal() {

    uploadModal.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";

}


/* =========================================================
   ADD FILES
========================================================= */

function addFiles(files) {

    if (!files || files.length === 0) {
        return;
    }


    Array.from(files).forEach(
        file => {


            /*
                25 MB limit
            */

            if (
                file.size >
                25 * 1024 * 1024
            ) {

                alert(
                    `${file.name} is larger than 25 MB.`
                );

                return;

            }


            /*
                Prevent duplicates
            */

            const duplicate =
                selectedFiles.some(
                    existing =>
                        existing.name === file.name &&
                        existing.size === file.size
                );


            if (duplicate) {
                return;
            }


            selectedFiles.push(file);

        }
    );


    renderFiles();

}


/* =========================================================
   RENDER FILES
========================================================= */

function renderFiles() {

    fileList.innerHTML = "";


    if (
        selectedFiles.length === 0
    ) {

        selectedFilesBox.classList.add(
            "hidden"
        );

        updateFileCounts();

        uploadButton.disabled = true;

        return;

    }


    selectedFilesBox.classList.remove(
        "hidden"
    );


    selectedFiles.forEach(
        (file, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "file-item";


            item.innerHTML = `

                <div class="file-icon">
                    ${getFileType(file)}
                </div>

                <div class="file-info">

                    <strong
                        title="${escapeHTML(file.name)}"
                    >
                        ${escapeHTML(file.name)}
                    </strong>

                    <small>
                        ${formatSize(file.size)}
                    </small>

                </div>

                <button
                    type="button"
                    class="remove-file"
                    aria-label="Remove file"
                >
                    ×
                </button>

            `;


            item
                .querySelector(
                    ".remove-file"
                )
                .addEventListener(
                    "click",
                    () => {

                        selectedFiles.splice(
                            index,
                            1
                        );

                        renderFiles();

                    }
                );


            fileList.appendChild(item);

        }
    );


    updateFileCounts();

    uploadButton.disabled = false;

}


/* =========================================================
   FILE COUNTS
========================================================= */

function updateFileCounts() {

    const count =
        selectedFiles.length;


    fileCount.textContent =
        count === 0
            ? "No files selected"
            : `${count} file${count === 1 ? "" : "s"} selected`;


    if (
        fileCountDisplay
    ) {

        fileCountDisplay.textContent =
            count === 0
                ? ""
                : `${count} document${count === 1 ? "" : "s"} attached`;

    }

}


/* =========================================================
   CONFIRM UPLOAD
========================================================= */

function confirmUpload() {

    if (
        selectedFiles.length === 0
    ) {

        return;

    }


    closeUploadModal();

    updateFileCounts();


    const oldText =
        fileCountDisplay.textContent;


    fileCountDisplay.textContent =
        "✓ Documents attached";


    setTimeout(
        () => {

            fileCountDisplay.textContent =
                oldText;

        },
        1800
    );

}


/* =========================================================
   FILE TYPE
========================================================= */

function getFileType(file) {

    const extension =
        file.name
            .split(".")
            .pop()
            .toUpperCase();


    const supported = [
        "PDF",
        "DOC",
        "DOCX",
        "XLS",
        "XLSX",
        "CSV",
        "PPT",
        "PPTX",
        "TXT"
    ];


    return supported.includes(
        extension
    )
        ? extension
        : "FILE";

}


/* =========================================================
   FILE SIZE
========================================================= */

function formatSize(bytes) {

    if (bytes === 0) {
        return "0 Bytes";
    }


    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (
        (
            bytes /
            Math.pow(
                1024,
                index
            )
        ).toFixed(1)
        + " "
        + units[index]
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   PROMPT CHIPS
========================================================= */

function setupPromptChips() {

    const chips =
        document.querySelectorAll(
            ".prompt-chip"
        );


    chips.forEach(
        chip => {

            chip.addEventListener(
                "click",
                () => {

                    copilotInput.value =
                        chip.textContent.trim();


                    copilotInput.focus();


                    copilotInput.style.height =
                        "auto";


                    copilotInput.style.height =
                        Math.min(
                            copilotInput.scrollHeight,
                            180
                        ) + "px";

                }
            );

        }
    );

}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

function setupGlobalSearch() {

    const search =
        document.getElementById(
            "globalSearch"
        );


    if (!search) return;


    search.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter"
            ) {

                return;

            }


            const query =
                search.value.trim();


            if (!query) return;


            navigateToPage(
                "copilot"
            );


            copilotInput.value =
                query;


            copilotInput.focus();


            search.value = "";

        }
    );


    /*
        Ctrl + K
    */

    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.ctrlKey ||
                 event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                search.focus();

            }

        }
    );

}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    const menu =
        document.getElementById(
            "mobileMenu"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (!menu || !sidebar) return;


    menu.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "mobile-open"
            );


            updateSidebarOverlay();

        }
    );

}


function updateSidebarOverlay() {

    let overlay =
        document.querySelector(
            ".sidebar-overlay"
        );


    if (!overlay) {

        overlay =
            document.createElement(
                "div"
            );


        overlay.className =
            "sidebar-overlay";


        document.body.appendChild(
            overlay
        );


        overlay.addEventListener(
            "click",
            closeMobileSidebar
        );

    }


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (
        sidebar.classList.contains(
            "mobile-open"
        )
    ) {

        overlay.classList.add(
            "active"
        );

    }

    else {

        overlay.classList.remove(
            "active"
        );

    }

}


function closeMobileSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const overlay =
        document.querySelector(
            ".sidebar-overlay"
        );


    if (sidebar) {

        sidebar.classList.remove(
            "mobile-open"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }

}
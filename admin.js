/**
 * Daily Dev Habit Admin JS
 *
 * This file handles the interactive questionnaire logic and GitHub saving.
 * Version: 0.2.0
 */
document.addEventListener('DOMContentLoaded', () => {

    const appContainer = document.getElementById('appContainer');
    if (!appContainer) {
        console.error('Daily Dev Habit: appContainer element not found.');
        return; // Exit if the container element isn't found
    }

    // Check if localized data is available
    if (typeof devhabit_ajax === 'undefined') {
        console.error('Daily Dev Habit: Localized AJAX data not found. Make sure wp_localize_script is working correctly.');
        // Optionally display an error message in the UI
        appContainer.innerHTML = '<div class="notice notice-error"><p>Error: Plugin configuration data is missing. Cannot save to GitHub.</p></div>';
        return;
    }

    // --- Configuration ---
    const questions = [
        { prompt: "What was the main theme or project you focused on today?", placeholder: "e.g., Worked on the user authentication feature for Project X." },
        { prompt: "What was the single biggest task you completed?", placeholder: "e.g., I successfully implemented the password reset functionality." },
        { prompt: "Describe a significant challenge or problem you encountered.", placeholder: "e.g., The database connection was timing out unexpectedly." },
        { prompt: "How did you approach solving it? What was your thought process?", placeholder: "e.g., I checked the logs, verified the credentials, and then discovered a firewall rule was blocking the port." },
        { prompt: "What's something new you learned today? (A tool, a technique, a concept)", placeholder: "e.g., I learned how to use the CSS Grid `minmax()` function." },
        { prompt: "What's one thing you're proud of from today's work?", placeholder: "e.g., I refactored a complex piece of code and made it much more readable." },
        { prompt: "Based on today, what is the most important priority for tomorrow?", placeholder: "e.g., To start working on the user profile page." }
    ];

    // --- State Management ---
    let currentQuestionIndex = 0;
    let answers = new Array(questions.length).fill('');
    let isSaving = false; // Prevent multiple save attempts

    // --- App Structure ---
    function renderApp() {
        const today = new Date();
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = today.toLocaleDateString(undefined, dateOptions); // Uses browser's default locale

        appContainer.innerHTML = `
            <div class="card">
                <p class="subtitle header">Follow the prompts to create a log for <strong style="color: #1e293b;">${formattedDate}</strong>.</p>

                <div id="questionContainer" class="fade-in">
                    <div class="question-wrapper">
                        <label id="questionLabel" for="answerInput"></label>
                        <textarea id="answerInput" rows="5"></textarea>
                    </div>
                    <div class="navigation">
                        <button id="prevBtn" class="btn btn-secondary">Previous</button>
                        <div id="progressIndicator"></div>
                        <button id="nextBtn" class="btn btn-primary">Next</button>
                    </div>
                </div>

                <div id="resultContainerWrapper" class="hidden fade-in">
                    <h2 class="result-title">Your Daily Log</h2>
                    <div id="resultContainer" class="result-box"></div>
                    <div class="result-actions">
                        <button id="copyBtn" class="btn btn-secondary">Copy to Clipboard</button>
                        <button id="saveGithubBtn" class="btn btn-primary">Save to GitHub</button>
                        <button id="restartBtn" class="btn btn-secondary">Start Over</button>
                    </div>
                    <div id="copySuccessMessage" class="copy-success hidden">Copied successfully!</div>
                    <div id="githubStatusMessage" class="github-status hidden"></div>
                </div>
            </div>
        `;
        addEventListeners();
        showQuestion();
    }

    // --- DOM Element References & Event Listeners ---
    let questionContainer, questionLabel, answerInput, prevBtn, nextBtn, progressIndicator,
        resultContainerWrapper, resultContainer, copyBtn, restartBtn, copySuccessMessage,
        saveGithubBtn, githubStatusMessage;

    function addEventListeners() {
        questionContainer = document.getElementById('questionContainer');
        questionLabel = document.getElementById('questionLabel');
        answerInput = document.getElementById('answerInput');
        prevBtn = document.getElementById('prevBtn');
        nextBtn = document.getElementById('nextBtn');
        progressIndicator = document.getElementById('progressIndicator');
        resultContainerWrapper = document.getElementById('resultContainerWrapper');
        resultContainer = document.getElementById('resultContainer');
        copyBtn = document.getElementById('copyBtn');
        restartBtn = document.getElementById('restartBtn');
        copySuccessMessage = document.getElementById('copySuccessMessage');
        
        saveGithubBtn = document.getElementById('saveGithubBtn');
        githubStatusMessage = document.getElementById('githubStatusMessage');

        nextBtn.addEventListener('click', handleNext);
        prevBtn.addEventListener('click', handlePrev);
        copyBtn.addEventListener('click', copyToClipboard);
        restartBtn.addEventListener('click', handleRestart);
        saveGithubBtn.addEventListener('click', saveToGitHub);
        answerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleNext();
            }
        });
    }
    
    function showQuestion() {
        if (!questionContainer) return; // Add checks for element existence
        questionContainer.classList.remove('fade-in');
        void questionContainer.offsetWidth;
        questionContainer.classList.add('fade-in');

        const currentQuestion = questions[currentQuestionIndex];
        if (questionLabel) questionLabel.textContent = currentQuestion.prompt;
        if (answerInput) {
            answerInput.placeholder = currentQuestion.placeholder;
            answerInput.value = answers[currentQuestionIndex];
            answerInput.focus();
        }
        updateProgress();
        updateButtonStates();
    }

    function updateProgress() {
        if (progressIndicator) {
             progressIndicator.textContent = `Step ${currentQuestionIndex + 1} of ${questions.length}`;
        }
    }

    function updateButtonStates() {
        if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
        if (nextBtn) {
            nextBtn.textContent = (currentQuestionIndex === questions.length - 1) ? 'Finish' : 'Next';
        }
    }

    function handleNext() {
        saveAnswer();
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            showResult();
        }
    }

    function handlePrev() {
        saveAnswer();
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion();
        }
    }

    function saveAnswer() {
        if (answerInput) {
             answers[currentQuestionIndex] = answerInput.value.trim();
        }
    }

    function showResult() {
        if (questionContainer) questionContainer.classList.add('hidden');
        if (resultContainerWrapper) resultContainerWrapper.classList.remove('hidden');

        let markdownOutput = `## Daily Log: ${new Date().toLocaleDateString()}\n\n`;
        questions.forEach((q, index) => {
            if (answers[index]) {
                markdownOutput += `### ${q.prompt}\n`;
                markdownOutput += `${answers[index]}\n\n`;
            }
        });
        if (resultContainer) resultContainer.textContent = markdownOutput.trim(); // Trim trailing newlines
        
        hideGithubStatus();
    }

    function copyToClipboard() {
        if (!resultContainer || !resultContainer.textContent) return;
        // Using modern clipboard API with fallback
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(resultContainer.textContent).then(() => {
                showCopySuccess();
            }).catch(err => {
                console.error('Async: Could not copy text: ', err);
                fallbackCopyTextToClipboard(resultContainer.textContent); // Try fallback on error
            });
        } else {
            fallbackCopyTextToClipboard(resultContainer.textContent); // Use fallback directly
        }
    }

    // Fallback for older browsers or insecure contexts
    function fallbackCopyTextToClipboard(text) {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = text;
        tempTextArea.style.position = 'fixed'; // Prevent scrolling to bottom
        document.body.appendChild(tempTextArea);
        tempTextArea.focus();
        tempTextArea.select();
        try {
            document.execCommand('copy');
            showCopySuccess();
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            // Optionally show an error message to the user here
        }
        document.body.removeChild(tempTextArea);
    }


    function showCopySuccess() {
        if (copySuccessMessage) {
            copySuccessMessage.classList.remove('hidden');
            setTimeout(() => copySuccessMessage.classList.add('hidden'), 2000);
        }
        hideGithubStatus();
    }

    function handleRestart() {
        currentQuestionIndex = 0;
        answers.fill('');
        if (resultContainerWrapper) resultContainerWrapper.classList.add('hidden');
        if (questionContainer) questionContainer.classList.remove('hidden');
        hideGithubStatus();
        showQuestion();
    }
    
    function saveToGitHub() {
        if (isSaving || !resultContainer || !resultContainer.textContent) {
            return; // Prevent multiple clicks or saving empty content
        }
        isSaving = true;
        showGithubStatus('Saving to GitHub...', 'loading');
        disableResultButtons(true);

        const logContent = resultContainer.textContent;

        // Prepare data for AJAX request
        const formData = new FormData();
        formData.append('action', 'devhabit_save_log_to_github'); // Matches PHP add_action hook
        formData.append('nonce', devhabit_ajax.nonce);            // Security nonce
        formData.append('log_content', logContent);               // The actual log content

        fetch(devhabit_ajax.ajax_url, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                 // Try to get error message from JSON response if available
                return response.json().then(errorData => {
                    throw new Error(errorData.data || `HTTP error! Status: ${response.status}`);
                }).catch(() => {
                     // Fallback if response is not JSON or parsing fails
                    throw new Error(`HTTP error! Status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                let successMsg = data.data.message || 'Log saved successfully!';
                // If the PHP returns a URL, make it a link
                if (data.data.url && data.data.url !== '#') {
                     successMsg += ` <a href="${data.data.url}" target="_blank" rel="noopener noreferrer">View on GitHub</a>`;
                }
                showGithubStatus(successMsg, 'success');
            } else {
                // Error message sent back from PHP wp_send_json_error
                showGithubStatus(`Error: ${data.data || 'Unknown error.'}`, 'error');
            }
        })
        .catch(error => {
            console.error('Error saving to GitHub:', error);
            showGithubStatus(`Error: ${error.message || 'Failed to send request.'}`, 'error');
        })
        .finally(() => {
            isSaving = false;
            disableResultButtons(false);
        });
    }

    function showGithubStatus(message, type = 'loading') { // type can be 'loading', 'success', 'error'
        if (githubStatusMessage) {
            githubStatusMessage.innerHTML = message; // Use innerHTML to allow the link
            githubStatusMessage.className = 'github-status'; // Reset classes
            githubStatusMessage.classList.add(`status-${type}`);
            githubStatusMessage.classList.remove('hidden');
        }
         // Hide copy success message if showing GitHub status
        if(copySuccessMessage) copySuccessMessage.classList.add('hidden');
    }

    function hideGithubStatus() {
        if (githubStatusMessage) {
            githubStatusMessage.classList.add('hidden');
            githubStatusMessage.textContent = '';
            githubStatusMessage.className = 'github-status hidden'; // Reset classes fully
        }
    }

    function disableResultButtons(disabled) {
         if (copyBtn) copyBtn.disabled = disabled;
         if (saveGithubBtn) saveGithubBtn.disabled = disabled;
         if (restartBtn) restartBtn.disabled = disabled;
    }

    // --- Initial Load ---
    renderApp();
});

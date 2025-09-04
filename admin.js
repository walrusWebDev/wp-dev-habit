/**
 * WP Dev Habit Admin JS
 *
 * This file handles the interactive questionnaire logic on the admin page.
 */
document.addEventListener('DOMContentLoaded', () => {

    const appContainer = document.getElementById('appContainer');
    if (!appContainer) {
        return; // Exit if the container element isn't found
    }
    
    // --- Configuration ---
    const questions = [
        {
            prompt: "What was the main theme or project you focused on today?",
            placeholder: "e.g., Worked on the user authentication feature for Project X."
        },
        {
            prompt: "What was the single biggest task you completed?",
            placeholder: "e.g., I successfully implemented the password reset functionality."
        },
        {
            prompt: "Describe a significant challenge or problem you encountered.",
            placeholder: "e.g., The database connection was timing out unexpectedly."
        },
        {
            prompt: "How did you approach solving it? What was your thought process?",
            placeholder: "e.g., I checked the logs, verified the credentials, and then discovered a firewall rule was blocking the port. I adjusted the rule to solve it."
        },
        {
            prompt: "What's something new you learned today? (A tool, a technique, a concept)",
            placeholder: "e.g., I learned how to use the CSS Grid `minmax()` function for responsive layouts."
        },
        {
            prompt: "What's one thing you're proud of from today's work?",
            placeholder: "e.g., I refactored a complex piece of code and made it much more readable."
        },
        {
            prompt: "Based on today, what is the most important priority for tomorrow?",
            placeholder: "e.g., To start working on the user profile page and integrate the new authentication."
        }
    ];

    // --- State Management ---
    let currentQuestionIndex = 0;
    let answers = new Array(questions.length).fill('');

    // --- App Structure ---
    function renderApp() {
        appContainer.innerHTML = `
            <div class="card">
                <div class="header">
                    <h1 class="title">WP Dev Habit</h1>
                    <p class="subtitle">Your daily guided journaling tool.</p>
                </div>

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
                        <button id="copyBtn" class="btn btn-primary">Copy to Clipboard</button>
                        <button id="restartBtn" class="btn btn-secondary">Start Over</button>
                    </div>
                    <div id="copySuccessMessage" class="copy-success hidden">Copied successfully!</div>
                </div>
            </div>
        `;
        addEventListeners();
        showQuestion();
    }

    // --- DOM Element References & Event Listeners (scoped within the app) ---
    let questionContainer, questionLabel, answerInput, prevBtn, nextBtn, progressIndicator,
        resultContainerWrapper, resultContainer, copyBtn, restartBtn, copySuccessMessage;

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
        
        nextBtn.addEventListener('click', handleNext);
        prevBtn.addEventListener('click', handlePrev);
        copyBtn.addEventListener('click', copyToClipboard);
        restartBtn.addEventListener('click', handleRestart);
        answerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleNext();
            }
        });
    }


    // --- Functions ---
    function showQuestion() {
        questionContainer.classList.remove('fade-in');
        void questionContainer.offsetWidth; 
        questionContainer.classList.add('fade-in');

        const currentQuestion = questions[currentQuestionIndex];
        questionLabel.textContent = currentQuestion.prompt;
        answerInput.placeholder = currentQuestion.placeholder;
        answerInput.value = answers[currentQuestionIndex];
        updateProgress();
        updateButtonStates();
        answerInput.focus();
    }

    function updateProgress() {
        progressIndicator.textContent = `Step ${currentQuestionIndex + 1} of ${questions.length}`;
    }

    function updateButtonStates() {
        prevBtn.disabled = currentQuestionIndex === 0;
        
        if (currentQuestionIndex === questions.length - 1) {
            nextBtn.textContent = 'Finish';
        } else {
            nextBtn.textContent = 'Next';
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
        answers[currentQuestionIndex] = answerInput.value.trim();
    }

    function showResult() {
        questionContainer.classList.add('hidden');
        resultContainerWrapper.classList.remove('hidden');

        let markdownOutput = `## Daily Log: ${new Date().toLocaleDateString()}\n\n`;
        questions.forEach((q, index) => {
            if (answers[index]) {
                markdownOutput += `### ${q.prompt}\n`;
                markdownOutput += `${answers[index]}\n\n`;
            }
        });
        resultContainer.textContent = markdownOutput;
    }
    
    function copyToClipboard() {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = resultContainer.textContent;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        try {
            document.execCommand('copy');
            copySuccessMessage.classList.remove('hidden');
            setTimeout(() => copySuccessMessage.classList.add('hidden'), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(tempTextArea);
    }

    function handleRestart() {
        currentQuestionIndex = 0;
        answers.fill('');
        resultContainerWrapper.classList.add('hidden');
        questionContainer.classList.remove('hidden');
        showQuestion();
    }

    // --- Initial Load ---
    renderApp();
});

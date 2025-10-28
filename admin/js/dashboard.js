document.addEventListener('DOMContentLoaded', async () => {
    // -----------------------------
    // DOM Elements
    // -----------------------------
    const DOM = {
        customersCount: document.getElementById('customers-count'),
        templatesCount: document.getElementById('templates-count'),
        generateUserBtn: document.getElementById('generate-user-btn'),
        popup: document.getElementById('popup'),
        cancelBtn: document.getElementById('cancel-btn'),
        confirmBtn: document.getElementById('confirm-btn'),
        templateSelect: document.getElementById('template-select'),
        generatedJson: document.getElementById('generated-json'),
        jsonOutput: document.getElementById('json-output'),
        copyJsonBtn: document.getElementById('copy-json-btn'),
        closePopupBtn: document.getElementById('close-popup-btn'),
        viewSelect: document.getElementById('view-select'),
        scrollToTopBtn: document.querySelector('.scroll-to-top'),
        dashboardContent: document.getElementById('dashboard-content'),
        sidebar: document.getElementById('sidebar'),
        sidebarToggle: document.getElementById('sidebar-toggle'),
    };

    // -----------------------------
    // Data
    // -----------------------------
    let users = [];
    let templates = [];
    let areaChart = null;

    const userFiles = [
        '26750247-61e6-4871-8f35-8c7553236f9f.json',
        '299fb50d-bf17-406c-9918-1fefb9456097.json',
        '89bfea59-1e17-4e1e-9724-f441b2c3f2e5.json',
        'bd1a2959-a30c-4afb-a57f-3819c9062b9e.json',
        'f25a5215-40f8-4e84-8c11-7d32c66ea7d9.json',
        '275c4965-39bc-4166-9832-d72709a3eece.json'
    ];

    const templateFiles = [
        'template-1-colors.html',
        'template-1.html',
        'template-2-no-bg.html',
        'template-2.html',
        'template-3.html',
        'template-4.html',
        'template-4-dark.html',
        'template-5.html',
        'template-5-dark.html'
    ];
    
    // -----------------------------
    // Initialization
    // -----------------------------
    async function init() {
        await startDashboard();
        DOM.dashboardContent.classList.remove('hidden');
    }

    async function startDashboard() {
        await loadData();
        populateTemplateSelect();
        updateChart(DOM.viewSelect.value);
        setupEventListeners();
    }

    // -----------------------------
    // Fetch with native browser auth
    // -----------------------------
    async function fetchWithAuth(url, options = {}) {
        // credentials: 'include' tells the browser to use Basic Auth if needed
        const response = await fetch(url, { ...options, credentials: 'include' });

        if (response.status === 401) {
            // Browser will automatically prompt for username/password
            throw new Error('Unauthorized');
        }

        return response;
    }

    async function fetchJsonFile(file) {
        const response = await fetchWithAuth(`../data/users/${file}`);
        return await response.json();
    }

    // -----------------------------
    // Load users and templates
    // -----------------------------
    async function loadData() {
        try {
            users = await Promise.all(userFiles.map(fetchJsonFile));
            DOM.customersCount.textContent = users.length;

            templates = templateFiles;
            DOM.templatesCount.textContent = templates.length;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    // -----------------------------
    // Populate template select dropdown
    // -----------------------------
    function populateTemplateSelect() {
        templates.forEach((template, index) => {
            const option = document.createElement('option');
            option.value = template;
            option.textContent = `${template.replace('.html', '')} (${index + 1})`;
            DOM.templateSelect.appendChild(option);
        });
    }

    // -----------------------------
    // Chart and popup logic
    // -----------------------------
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function updateChart(period) {
        const counts = getUserCreationCounts(period);
        const sortedLabels = sortLabels(Object.keys(counts), period);
        renderChart(sortedLabels, counts);
    }

    function getUserCreationCounts(period) {
        const counts = {};
        users.forEach(user => {
            const date = new Date(user.createdAt || "2025-10-20T00:00:00.000Z");
            let key;
            if (period === 'day') key = formatDate(date);
            else if (period === 'month') key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            else key = date.getFullYear().toString();
            counts[key] = (counts[key] || 0) + 1;
        });
        return counts;
    }

    function sortLabels(labels, period) {
        return labels.sort((a, b) => {
            if (period === 'day') {
                const [dayA, monthA, yearA] = a.split('/');
                const [dayB, monthB, yearB] = b.split('/');
                return new Date(`${yearA}-${monthA}-${dayA}`) - new Date(`${yearB}-${monthB}-${dayB}`);
            } else if (period === 'month') {
                return new Date(a) - new Date(b);
            } else {
                return a - b;
            }
        });
    }

    function renderChart(labels, counts) {
        const chartData = {
            labels,
            datasets: [{
                label: 'Users Created',
                data: labels.map(label => counts[label]),
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: '#3b82f6',
                fill: true,
            }]
        };
        const chartOptions = { scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } };

        if (areaChart) {
            areaChart.data = chartData;
            areaChart.options = chartOptions;
            areaChart.update();
        } else {
            const ctx = document.getElementById('myAreaChart').getContext('2d');
            areaChart = new Chart(ctx, { type: 'line', data: chartData, options: chartOptions });
        }
    }

    // -----------------------------
    // Popup & JSON generation
    // -----------------------------
    function setupEventListeners() {
        DOM.viewSelect.addEventListener('change', e => updateChart(e.target.value));

        DOM.generateUserBtn.addEventListener('click', () => DOM.popup.classList.remove('hidden'));
        DOM.cancelBtn.addEventListener('click', closePopup);
        DOM.closePopupBtn.addEventListener('click', closePopup);

        DOM.copyJsonBtn.addEventListener('click', copyJsonToClipboard);

        DOM.confirmBtn.addEventListener('click', generateUser);

        // Scroll to Top Button
        window.addEventListener('scroll', toggleScrollToTopButton);
        DOM.scrollToTopBtn.addEventListener('click', scrollToTop);

        // Sidebar Toggle
        DOM.sidebarToggle.addEventListener('click', toggleSidebar);
    }

    function closePopup() {
        DOM.popup.classList.add('hidden');
        DOM.generatedJson.classList.add('hidden');
    }

    function copyJsonToClipboard() {
        navigator.clipboard.writeText(DOM.jsonOutput.textContent)
            .then(() => {
                DOM.copyJsonBtn.textContent = 'Copied!';
                setTimeout(() => DOM.copyJsonBtn.textContent = 'Copy JSON', 2000);
            });
    }

    async function generateUser() {
        const selectedTemplateIndex = DOM.templateSelect.selectedIndex;
        const newUserId = uuid.v4();
        const creationTime = new Date().toISOString();

        try {
            const portfolioUrl = `https://technest3000.github.io/?user-id=${newUserId}`;
            showGeneratedJson({
                url: portfolioUrl,
                templateId: selectedTemplateIndex + 1,
                createdAt: creationTime
            });

        } catch (error) {
            console.error('Error generating user:', error);
            alert('Authentication failed or server denied access. Please login via browser prompt.');
        }
    }

    function showGeneratedJson(data) {
        DOM.jsonOutput.textContent = JSON.stringify(data, null, 2);
        DOM.generatedJson.classList.remove('hidden');
    }

    function toggleScrollToTopButton() {
        DOM.scrollToTopBtn.classList.toggle('hidden', window.scrollY <= 100);
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function toggleSidebar() {
        DOM.sidebar.classList.toggle('hidden');
    }

    // -----------------------------
    // Start
    // -----------------------------
    init();
});
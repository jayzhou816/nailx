// Nailix Nail & Spa Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize session timer
    initSessionTimer();
    
    // Initialize tab navigation
    initTabNavigation();
    
    // Initialize TinyMCE editor
    initTinyMCE();
    
    // Initialize image uploader
    initImageUploader();
    
    // Initialize product management
    initProductManagement();
    
    // Initialize operation logging
    initOperationLogging();
    
    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to logout?')) {
            // Log the operation
            logOperation('User logged out');
            
            // Clear session data
            localStorage.removeItem('adminSessionStart');
            
            // Redirect to login page
            window.location.href = '/admin-login';
        }
    });
});

// Session Timer Functions
function initSessionTimer() {
    const sessionTimerElement = document.getElementById('sessionTime');
    const sessionStart = parseInt(localStorage.getItem('adminSessionStart') || '0');
    const sessionDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    
    // Check if session is valid
    if (!sessionStart) {
        // No valid session, redirect to login
        window.location.href = '/admin-login';
        return;
    }
    
    // Calculate remaining time
    const updateTimer = () => {
        const now = new Date().getTime();
        const elapsed = now - sessionStart;
        const remaining = sessionDuration - elapsed;
        
        if (remaining <= 0) {
            // Session expired
            clearInterval(timerInterval);
            alert('Your session has expired. Please login again.');
            localStorage.removeItem('adminSessionStart');
            window.location.href = '/admin-login';
            return;
        }
        
        // Format remaining time as HH:MM:SS
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        
        sessionTimerElement.textContent = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    
    // Update timer immediately and then every second
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    
    // Extend session when user is active
    const extendSession = () => {
        localStorage.setItem('adminSessionStart', new Date().getTime().toString());
    };
    
    // Extend session on user interaction
    ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
        document.addEventListener(event, extendSession, { passive: true });
    });
}

// Tab Navigation Functions
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding tab content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Log the operation
            logOperation(`Navigated to ${tabId} tab`);
        });
    });
}

// TinyMCE Editor Functions
function initTinyMCE() {
    // Initialize TinyMCE editor
    tinymce.init({
        selector: '#articleContent',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        height: 500,
        setup: function(editor) {
            // Auto-save content to localStorage every 30 seconds
            let autoSaveInterval;
            
            editor.on('init', function() {
                // Load draft from localStorage if exists
                const savedContent = localStorage.getItem('articleDraft');
                const savedTitle = localStorage.getItem('articleTitle');
                const savedCategory = localStorage.getItem('articleCategory');
                
                if (savedContent) {
                    editor.setContent(savedContent);
                }
                
                if (savedTitle) {
                    document.getElementById('articleTitle').value = savedTitle;
                }
                
                if (savedCategory) {
                    document.getElementById('articleCategory').value = savedCategory;
                }
                
                // Start auto-save interval
                autoSaveInterval = setInterval(function() {
                    const content = editor.getContent();
                    const title = document.getElementById('articleTitle').value;
                    const category = document.getElementById('articleCategory').value;
                    
                    if (content || title) {
                        localStorage.setItem('articleDraft', content);
                        localStorage.setItem('articleTitle', title);
                        localStorage.setItem('articleCategory', category);
                        console.log('Draft auto-saved');
                    }
                }, 30000);
            });
            
            editor.on('remove', function() {
                clearInterval(autoSaveInterval);
            });
        }
    });
    
    // Handle save draft button
    document.getElementById('saveArticleBtn').addEventListener('click', function() {
        const editor = tinymce.get('articleContent');
        const content = editor.getContent();
        const title = document.getElementById('articleTitle').value;
        const category = document.getElementById('articleCategory').value;
        
        if (!title) {
            alert('Please enter a title for your article');
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('articleDraft', content);
        localStorage.setItem('articleTitle', title);
        localStorage.setItem('articleCategory', category);
        
        // Show confirmation
        alert('Draft saved successfully');
        
        // Log the operation
        logOperation(`Saved draft article: ${title}`);
    });
    
    // Handle publish button
    document.getElementById('publishArticleBtn').addEventListener('click', function() {
        const editor = tinymce.get('articleContent');
        const content = editor.getContent();
        const title = document.getElementById('articleTitle').value;
        const category = document.getElementById('articleCategory').value;
        
        if (!title) {
            alert('Please enter a title for your article');
            return;
        }
        
        if (!content) {
            alert('Please enter content for your article');
            return;
        }
        
        // Show confirmation dialog
        if (confirm('Are you sure you want to publish this article?')) {
            // In a real implementation, this would send the data to the server
            // For this demo, we'll just simulate success
            
            // Convert HTML to Markdown (simplified)
            const markdown = convertToMarkdown(content);
            
            // Create article object
            const article = {
                id: Date.now(),
                title: title,
                category: category,
                content: content,
                markdown: markdown,
                date: new Date().toISOString(),
                status: 'published'
            };
            
            // In a real implementation, save to server
            console.log('Publishing article:', article);
            
            // Clear draft
            localStorage.removeItem('articleDraft');
            localStorage.removeItem('articleTitle');
            localStorage.removeItem('articleCategory');
            
            // Reset form
            editor.setContent('');
            document.getElementById('articleTitle').value = '';
            
            // Show success message
            alert('Article published successfully');
            
            // Log the operation
            logOperation(`Published article: ${title}`);
            
            // Refresh article list (in a real implementation)
            // refreshArticleList();
        }
    });
    
    // Handle new article button
    document.getElementById('newArticleBtn').addEventListener('click', function() {
        if (confirm('Start a new article? Any unsaved changes will be lost.')) {
            const editor = tinymce.get('articleContent');
            editor.setContent('');
            document.getElementById('articleTitle').value = '';
            document.getElementById('articleCategory').value = 'nail-care';
            document.getElementById('featuredImagePreview').innerHTML = '<i class="fas fa-image text-3xl text-gray-400"></i>';
            
            // Clear draft
            localStorage.removeItem('articleDraft');
            localStorage.removeItem('articleTitle');
            localStorage.removeItem('articleCategory');
            
            // Log the operation
            logOperation('Started new article');
        }
    });
}

// Simple HTML to Markdown converter (very simplified)
function convertToMarkdown(html) {
    let markdown = html;
    
    // Replace headings
    markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1');
    markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1');
    markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1');
    
    // Replace paragraphs
    markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n\n');
    
    // Replace bold
    markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
    
    // Replace italic
    markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');
    
    // Replace links
    markdown = markdown.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)');
    
    // Replace images
    markdown = markdown.replace(/<img src="(.*?)" alt="(.*?)".*?>/g, '![$2]($1)');
    
    // Replace lists
    markdown = markdown.replace(/<ul>(.*?)<\/ul>/gs, function(match, p1) {
        return p1.replace(/<li>(.*?)<\/li>/g, '- $1\n');
    });
    
    markdown = markdown.replace(/<ol>(.*?)<\/ol>/gs, function(match, p1) {
        let i = 1;
        return p1.replace(/<li>(.*?)<\/li>/g, function(match, p1) {
            return `${i++}. ${p1}\n`;
        });
    });
    
    return markdown;
}

// Image Uploader Functions
function initImageUploader() {
    const dragArea = document.getElementById('dragArea');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const uploadProgress = document.getElementById('uploadProgress');
    
    // Click on drag area to open file dialog
    dragArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Handle drag events
    ['dragover', 'dragenter'].forEach(eventName => {
        dragArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            dragArea.classList.add('active');
        });
    });
    
    ['dragleave', 'dragend'].forEach(eventName => {
        dragArea.addEventListener(eventName, () => {
            dragArea.classList.remove('active');
        });
    });
    
    // Handle drop event
    dragArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dragArea.classList.remove('active');
        
        const files = e.dataTransfer.files;
        if (files.length) {
            fileInput.files = files;
            showUploadPreview(files);
        }
    });
    
    // Handle file selection
    fileInput.addEventListener('change', () => {
        const files = fileInput.files;
        if (files.length) {
            showUploadPreview(files);
        }
    });
    
    // Show upload preview
    function showUploadPreview(files) {
        dragArea.innerHTML = '';
        
        if (files.length > 5) {
            alert('You can only upload up to 5 images at once');
            resetUploadArea();
            return;
        }
        
        // Check if all files are images
        for (let i = 0; i < files.length; i++) {
            if (!files[i].type.startsWith('image/')) {
                alert('Please select only image files');
                resetUploadArea();
                return;
            }
        }
        
        // Create preview grid
        const previewGrid = document.createElement('div');
        previewGrid.className = 'grid grid-cols-2 gap-2 w-full';
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'relative h-20';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'w-full h-full object-cover rounded-md';
                
                previewItem.appendChild(img);
                previewGrid.appendChild(previewItem);
                
                // If all previews are loaded
                if (previewGrid.children.length === files.length) {
                    dragArea.appendChild(previewGrid);
                    
                    // Add text showing number of files
                    const fileCount = document.createElement('p');
                    fileCount.className = 'text-sm text-gray-600 mt-2';
                    fileCount.textContent = `${files.length} file${files.length > 1 ? 's' : ''} selected`;
                    dragArea.appendChild(fileCount);
                }
            };
            
            reader.readAsDataURL(file);
        }
    }
    
    // Reset upload area
    function resetUploadArea() {
        fileInput.value = '';
        dragArea.innerHTML = `
            <i class="fas fa-cloud-upload-alt text-4xl text-primary mb-2"></i>
            <p class="text-gray-600 text-center">Drag & Drop images here or click to browse</p>
        `;
    }
    
    // Handle upload button click
    uploadBtn.addEventListener('click', () => {
        const files = fileInput.files;
        
        if (!files.length) {
            alert('Please select files to upload');
            return;
        }
        
        // Show upload progress
        uploadProgress.classList.remove('hidden');
        
        // Get upload options
        const addWatermark = document.getElementById('addWatermark').checked;
        const compressImages = document.getElementById('compressImages').checked;
        
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `Uploading... ${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                progressText.textContent = 'Upload complete!';
                
                // In a real implementation, this would send the files to the server
                // For this demo, we'll just simulate success after a delay
                setTimeout(() => {
                    // Reset upload area
                    resetUploadArea();
                    
                    // Hide progress bar
                    uploadProgress.classList.add('hidden');
                    
                    // Show success message
                    alert('Files uploaded successfully');
                    
                    // Log the operation
                    logOperation(`Uploaded ${files.length} image${files.length > 1 ? 's' : ''}`);
                    
                    // Refresh image gallery (in a real implementation)
                    // refreshImageGallery();
                }, 500);
            }
        }, 100);
    });
    
    // Initialize image selection in gallery
    const imageGallery = document.getElementById('imageGallery');
    const downloadSelectedBtn = document.getElementById('downloadSelectedBtn');
    
    // Handle image selection
    imageGallery.addEventListener('change', (e) => {
        if (e.target.classList.contains('image-select')) {
            const selectedCount = document.querySelectorAll('.image-select:checked').length;
            downloadSelectedBtn.disabled = selectedCount === 0;
        }
    });
    
    // Handle download selected button
    downloadSelectedBtn.addEventListener('click', () => {
        const selectedImages = document.querySelectorAll('.image-select:checked');
        
        if (selectedImages.length === 0) {
            alert('Please select at least one image to download');
            return;
        }
        
        // In a real implementation, this would create a ZIP file with the selected images
        // For this demo, we'll just show a message
        alert(`Downloading ${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''} as ZIP`);
        
        // Log the operation
        logOperation(`Downloaded ${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''} as ZIP`);
    });
}

// Copy image link to clipboard
function copyImageLink(button) {
    const linkText = button.closest('.image-card').querySelector('p').textContent;
    
    // Create a temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = linkText;
    document.body.appendChild(tempInput);
    
    // Select and copy the text
    tempInput.select();
    document.execCommand('copy');
    
    // Remove the temporary element
    document.body.removeChild(tempInput);
    
    // Show feedback
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
    
    setTimeout(() => {
        button.innerHTML = originalText;
    }, 2000);
    
    // Log the operation
    logOperation(`Copied image link: ${linkText}`);
}

// Product Management Functions
function initProductManagement() {
    const productForm = document.getElementById('productForm');
    const resetProductFormBtn = document.getElementById('resetProductFormBtn');
    const addProductImageBtn = document.getElementById('addProductImageBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    
    // Handle product form submission
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const productId = document.getElementById('productId').value;
        const productName = document.getElementById('productName').value;
        const productPrice = document.getElementById('productPrice').value;
        const productDescription = document.getElementById('productDescription').value;
        const productStatus = document.getElementById('productStatus').value;
        
        // Create product object
        const product = {
            id: productId || `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: productName,
            price: `$${parseFloat(productPrice).toFixed(2)}`,
            description: productDescription,
            status: productStatus,
            gallery: [] // In a real implementation, this would contain image URLs
        };
        
        // Show confirmation dialog
        if (confirm(`Are you sure you want to ${productId ? 'update' : 'add'} this product?`)) {
            // In a real implementation, this would send the data to the server
            // For this demo, we'll just simulate success
            console.log('Saving product:', product);
            
            // Show success message
            alert(`Product ${productId ? 'updated' : 'added'} successfully`);
            
            // Log the operation
            logOperation(`${productId ? 'Updated' : 'Added'} product: ${productName}`);
            
            // Reset form
            resetProductForm();
            
            // Refresh product list (in a real implementation)
            // refreshProductList();
        }
    });
    
    // Handle reset button
    resetProductFormBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset the form? All unsaved changes will be lost.')) {
            resetProductForm();
            
            // Log the operation
            logOperation('Reset product form');
        }
    });
    
    // Reset product form
    function resetProductForm() {
        document.getElementById('productId').value = '';
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productDescription').value = '';
        document.getElementById('productStatus').value = 'active';
        
        // Reset image previews
        const productImagePreviews = document.getElementById('productImagePreviews');
        productImagePreviews.innerHTML = `
            <div class="w-full h-20 bg-gray-200 rounded-md flex items-center justify-center cursor-pointer" id="addProductImageBtn">
                <i class="fas fa-plus text-gray-400"></i>
            </div>
        `;
        
        // Re-initialize add image button
        document.getElementById('addProductImageBtn').addEventListener('click', showImageSelectionModal);
    }
    
    // Handle add product image button
    addProductImageBtn.addEventListener('click', showImageSelectionModal);
    
    // Show image selection modal
    function showImageSelectionModal() {
        // In a real implementation, this would open a modal to select images from the library
        // For this demo, we'll just simulate adding a random image
        
        const productImagePreviews = document.getElementById('productImagePreviews');
        const currentImages = productImagePreviews.querySelectorAll('img').length;
        
        if (currentImages >= 5) {
            alert('You can only add up to 5 images per product');
            return;
        }
        
        // Create a new image preview
        const imagePreview = document.createElement('div');
        imagePreview.className = 'relative w-full h-20';
        
        // Random nail polish image
        const randomId = Math.floor(Math.random() * 1000);
        imagePreview.innerHTML = `
            <img src="https://source.unsplash.com/300x200/?nail,polish,${randomId}" class="w-full h-full object-cover rounded-md">
            <button type="button" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center" onclick="this.parentElement.remove()">
                <i class="fas fa-times text-xs"></i>
            </button>
        `;
        
        // Insert before the add button
        productImagePreviews.insertBefore(imagePreview, addProductImageBtn);
        
        // Log the operation
        logOperation('Added product image');
    }
    
    // Handle export CSV button
    exportCsvBtn.addEventListener('click', () => {
        // In a real implementation, this would generate a CSV file with all products
        // For this demo, we'll just show a message
        alert('Exporting products to CSV');
        
        // Log the operation
        logOperation('Exported products to CSV');
    });
    
    // Initialize product selection
    const productList = document.getElementById('productList');
    
    // Handle product selection
    productList.addEventListener('change', (e) => {
        if (e.target.classList.contains('product-select')) {
            const selectedCount = document.querySelectorAll('.product-select:checked').length;
            bulkDeleteBtn.disabled = selectedCount === 0;
        }
    });
    
    // Handle bulk delete button
    bulkDeleteBtn.addEventListener('click', () => {
        const selectedProducts = document.querySelectorAll('.product-select:checked');
        
        if (selectedProducts.length === 0) {
            alert('Please select at least one product to delete');
            return;
        }
        
        // Show confirmation dialog
        if (confirm(`Are you sure you want to delete ${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''}?`)) {
            // In a real implementation, this would send a request to delete the selected products
            // For this demo, we'll just show a message
            alert(`${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''} deleted successfully`);
            
            // Log the operation
            logOperation(`Deleted ${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''}`);
            
            // Refresh product list (in a real implementation)
            // refreshProductList();
        }
    });
    
    // Add keyboard shortcut for bulk delete (Ctrl+D)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'd' && !bulkDeleteBtn.disabled) {
            e.preventDefault();
            bulkDeleteBtn.click();
        }
    });
}

// Operation Logging Functions
function initOperationLogging() {
    // In a real implementation, this would initialize the logs tab
    // For this demo, we'll just set up a function to log operations
}

// Log an operation
function logOperation(action) {
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Create log entry
    const logEntry = {
        timestamp: timestamp,
        user: 'admin@nailix.com',
        action: action
    };
    
    // In a real implementation, this would send the log entry to the server
    console.log('Operation logged:', logEntry);
    
    // For this demo, we'll store logs in localStorage
    const logs = JSON.parse(localStorage.getItem('operationLogs') || '[]');
    logs.unshift(logEntry);
    
    // Keep only the last 100 logs
    if (logs.length > 100) {
        logs.length = 100;
    }
    
    localStorage.setItem('operationLogs', JSON.stringify(logs));
    
    // If logs tab exists, update it
    const logsTab = document.getElementById('logs-tab');
    if (logsTab) {
        // Add the new log entry to the top of the list
        const logsList = logsTab.querySelector('.logs-list');
        if (logsList) {
            const logEntryElement = document.createElement('div');
            logEntryElement.className = 'log-entry p-4 mb-2 bg-white rounded-md shadow-sm';
            
            const formattedTime = new Date(timestamp).toLocaleString();
            
            logEntryElement.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-gray-800">${action}</p>
                        <p class="text-sm text-gray-500">By admin@nailix.com</p>
                    </div>
                    <span class="text-xs text-gray-400">${formattedTime}</span>
                </div>
            `;
            
            logsList.insertBefore(logEntryElement, logsList.firstChild);
        }
    }
}

// Show confirmation dialog for important actions
function confirmAction(message, callback) {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg w-96 p-6">
            <h3 class="text-lg font-semibold mb-4">Confirmation Required</h3>
            <p class="mb-6">${message}</p>
            <div class="flex justify-end space-x-2">
                <button id="cancelBtn" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md">Cancel</button>
                <button id="confirmBtn" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md">Confirm</button>
            </div>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(modal);
    
    // Handle button clicks
    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.getElementById('confirmBtn').addEventListener('click', () => {
        document.body.removeChild(modal);
        callback();
    });
}

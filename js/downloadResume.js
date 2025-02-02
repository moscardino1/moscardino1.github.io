async function generatePDF() {
    try {
        // Open print.html in a new window
        const printWindow = window.open('print.html', '_blank');
        
        // Wait for the window to load
        printWindow.onload = function() {
            // Add print-specific styles
            const style = printWindow.document.createElement('style');

            printWindow.document.head.appendChild(style);
            
            // Trigger print dialog after a short delay to ensure styles are applied
            setTimeout(() => {
                printWindow.print();
                // Close the window after printing is done
                printWindow.onafterprint = function() {
                    printWindow.close();
                };
            }, 1000);
        };
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to open print dialog. Please try again.');
    }
}

// Add event listener when layout is loaded
document.addEventListener('layoutLoaded', () => {
    const downloadButton = document.getElementById('download-resume');
    if (downloadButton) {
        downloadButton.addEventListener('click', generatePDF);
    }
});

// Also add event listener for DOMContentLoaded as backup
document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('download-resume');
    if (downloadButton) {
        downloadButton.addEventListener('click', generatePDF);
    }
});
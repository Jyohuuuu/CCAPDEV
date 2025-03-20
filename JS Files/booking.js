document.addEventListener('DOMContentLoaded', function() {
    // ------------- Payment Method Selection -------------
    const creditCardRadio = document.getElementById('credit-card');
    const cashRadio = document.getElementById('Cash');
    const cardDetailsSection = document.getElementById('card-details-section');
    const cashDisclaimer = document.getElementById('cash-disclaimer');
    
    // Show/hide appropriate sections based on payment method selection
    function updatePaymentSections() {
        if(creditCardRadio.checked) {
            cardDetailsSection.classList.add('active');
            cashDisclaimer.classList.remove('active');
        } else if(cashRadio.checked) {
            cardDetailsSection.classList.remove('active');
            cashDisclaimer.classList.add('active');
        }
    }
    
    // Add event listeners to radio buttons
    creditCardRadio.addEventListener('change', updatePaymentSections);
    cashRadio.addEventListener('change', updatePaymentSections);
    
    // Set credit card as default option
    creditCardRadio.checked = true;
    updatePaymentSections();
    
    // ------------- Credit Card Input Formatting -------------
    const cardNumberInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');
    
    // Format card number with spaces (1234 5678 9012 3456)
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = '';
        
        for(let i = 0; i < value.length; i++) {
            if(i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
    });
    
    // Format expiry date (MM/YY)
    expiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/gi, '');
        
        if(value.length > 2) {
            e.target.value = value.substring(0, 2) + '/' + value.substring(2);
        } else {
            e.target.value = value;
        }
    });
    
    // Allow only numbers for CVV
    cvvInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/gi, '');
    });
    
    // ------------- Form Validation -------------
    const paymentForm = document.querySelector('.payment-box');
    const confirmButton = document.querySelector('.confirm-btn');
    
    confirmButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        if(creditCardRadio.checked) {
            // Validate credit card details
            if(!validateCreditCardDetails()) {
                return;
            }
        }
        
        // If validation passes or cash payment is selected
        alert('Your booking has been confirmed!');
        // Here you would typically redirect to a confirmation page or process the payment
        // window.location.href = 'confirmation.html';
    });
    
    function validateCreditCardDetails() {
        let isValid = true;
        const cardNumber = cardNumberInput.value.replace(/\s+/g, '');
        const expiry = expiryInput.value;
        const cvv = cvvInput.value;
        const cardName = document.getElementById('card-name').value;
        const billingZip = document.getElementById('billing-zip').value;
        
        // Simple validation - you would want more robust validation in production
        if(cardNumber.length < 16) {
            alert('Please enter a valid card number');
            isValid = false;
        } else if(!expiry.includes('/') || expiry.length !== 5) {
            alert('Please enter a valid expiration date (MM/YY)');
            isValid = false;
        } else if(cvv.length < 3) {
            alert('Please enter a valid CVV');
            isValid = false;
        } else if(cardName.trim() === '') {
            alert('Please enter the name on your card');
            isValid = false;
        } else if(billingZip.trim() === '') {
            alert('Please enter your billing zip code');
            isValid = false;
        }
        
        return isValid;
    }
    
    // ------------- Edit Buttons -------------
    const dateEditBtn = document.querySelector('.date-container .edit-btn');
    const guestEditBtn = document.querySelector('.guest-container .edit-btn');
    
    dateEditBtn.addEventListener('click', function() {
        // In a real application, this would open a date picker or redirect to date selection
        alert('This would allow you to edit your booking dates');
    });
    
    guestEditBtn.addEventListener('click', function() {
        // In a real application, this would open a guest selection modal or redirect
        alert('This would allow you to edit number of guests');
    });
});
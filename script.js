
// Calculator state
        let currentOperand = '0';
        let previousOperand = '';
        let operation = null;
        let resetCurrentOperand = false;
        
        // DOM elements
        const currentOperandElement = document.getElementById('currentOperand');
        const previousOperandElement = document.getElementById('previousOperand');
        const themeToggle = document.getElementById('themeToggle');
        
        // Update display
        function updateDisplay() {
            currentOperandElement.textContent = currentOperand;
            if (operation) {
                previousOperandElement.textContent = `${previousOperand} ${getOperationSymbol(operation)}`;
            } else {
                previousOperandElement.textContent = previousOperand;
            }
        }
        
        // Get symbol for operation
        function getOperationSymbol(op) {
            switch(op) {
                case 'add': return '+';
                case 'subtract': return '−';
                case 'multiply': return '×';
                case 'divide': return '÷';
                default: return '';
            }
        }
        
        // Append number
        function appendNumber(number) {
            if (currentOperand === '0' || resetCurrentOperand) {
                currentOperand = number;
                resetCurrentOperand = false;
            } else {
                currentOperand += number;
            }
            updateDisplay();
        }
        
        // Choose operation
        function chooseOperation(op) {
            if (currentOperand === '') return;
            
            if (previousOperand !== '') {
                calculate();
            }
            
            operation = op;
            previousOperand = currentOperand;
            resetCurrentOperand = true;
            updateDisplay();
        }
        
        // Calculate percentage
        function calculatePercentage() {
            if (currentOperand === '') return;
            
            const current = parseFloat(currentOperand);
            const result = current / 100;
            
            // Round result to avoid floating point precision issues
            const roundedResult = Math.round(result * 1000000) / 1000000;
            
            currentOperand = roundedResult.toString();
            updateDisplay();
        }
        
        // Calculate result
        function calculate() {
            let result;
            const prev = parseFloat(previousOperand);
            const current = parseFloat(currentOperand);
            
            if (isNaN(prev) || isNaN(current)) return;
            
            switch(operation) {
                case 'add':
                    result = prev + current;
                    break;
                case 'subtract':
                    result = prev - current;
                    break;
                case 'multiply':
                    result = prev * current;
                    break;
                case 'divide':
                    if (current === 0) {
                        alert("Cannot divide by zero!");
                        return;
                    }
                    result = prev / current;
                    break;
                default:
                    return;
            }
            
            // Round result to avoid floating point precision issues
            result = Math.round(result * 1000000) / 1000000;
            
            currentOperand = result.toString();
            operation = null;
            previousOperand = '';
            resetCurrentOperand = true;
            updateDisplay();
        }
        
        // Clear calculator
        function clearCalculator() {
            currentOperand = '0';
            previousOperand = '';
            operation = null;
            updateDisplay();
        }
        
        // Delete last character
        function deleteLast() {
            if (currentOperand.length === 1) {
                currentOperand = '0';
            } else {
                currentOperand = currentOperand.slice(0, -1);
            }
            updateDisplay();
        }
        
        // Add decimal point
        function addDecimal() {
            if (resetCurrentOperand) {
                currentOperand = '0.';
                resetCurrentOperand = false;
            } else if (!currentOperand.includes('.')) {
                currentOperand += '.';
            }
            updateDisplay();
        }
        
        // Event listeners for buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                appendNumber(button.getAttribute('data-number'));
            });
        });
        
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                
                switch(action) {
                    case 'clear':
                        clearCalculator();
                        break;
                    case 'delete':
                        deleteLast();
                        break;
                    case 'decimal':
                        addDecimal();
                        break;
                    case 'equals':
                        calculate();
                        break;
                    case 'percentage':
                        calculatePercentage();
                        break;
                    default:
                        chooseOperation(action);
                        break;
                }
            });
        });
        
        // Theme toggle functionality
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', event => {
            if (event.key >= '0' && event.key <= '9') {
                appendNumber(event.key);
            } else if (event.key === '.') {
                addDecimal();
            } else if (event.key === '+') {
                chooseOperation('add');
            } else if (event.key === '-') {
                chooseOperation('subtract');
            } else if (event.key === '*') {
                chooseOperation('multiply');
            } else if (event.key === '/') {
                event.preventDefault();
                chooseOperation('divide');
            } else if (event.key === '%') {
                calculatePercentage();
            } else if (event.key === 'Enter' || event.key === '=') {
                event.preventDefault();
                calculate();
            } else if (event.key === 'Escape') {
                clearCalculator();
            } else if (event.key === 'Backspace') {
                deleteLast();
            }
        });
        
        // Initialize display
        updateDisplay();
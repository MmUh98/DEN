document.querySelectorAll('.op').forEach(btn => {
  btn.addEventListener('click', function() {
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    let result;
    switch (btn.dataset.op) {
      case 'add':
        result = num1 + num2;
        break;
      case 'subtract':
        result = num1 - num2;
        break;
      case 'multiply':
        result = num1 * num2;
        break;
      case 'divide':
        if (num2 === 0) {
          result = 'Error: Division by zero';
        } else {
          result = num1 / num2;
        }
        break;
      case 'sqrt':
        result = num1 >= 0 ? Math.sqrt(num1) : 'Error: Negative input';
        break;
      case 'pow':
        result = Math.pow(num1, num2);
        break;
      case 'sin':
        result = Math.sin(num1);
        break;
      case 'cos':
        result = Math.cos(num1);
        break;
      case 'tan':
        result = Math.tan(num1);
        break;
      case 'log':
        result = num1 > 0 ? Math.log10(num1) : 'Error: Non-positive input';
        break;
      case 'exp':
        result = Math.exp(num1);
        break;
      case 'clear':
        document.getElementById('num1').value = '';
        document.getElementById('num2').value = '';
        result = 0;
        break;
      default:
        result = 'Invalid operation';
    }
    document.getElementById('result-value').textContent = isNaN(result) ? result : result;
  });
});

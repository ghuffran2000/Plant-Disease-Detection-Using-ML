document.addEventListener('DOMContentLoaded', function() {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const imageCard = document.getElementById('image-card');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const labelElem = document.getElementById('label');
    const confidenceElem = document.getElementById('confidence');
    const clearButton = document.getElementById('clearButton');
    const resultImage = document.getElementById('resultImage');
    const API_URL = 'http://localhost:8000/predict'; 
  
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (event) => event.preventDefault());
    dropzone.addEventListener('drop', handleDrop);
  
    fileInput.addEventListener('change', handleFileSelect);
    clearButton.addEventListener('click', clearData);
  
    function handleDrop(event) {
      event.preventDefault();
      const files = event.dataTransfer.files;
      handleFiles(files);
    }
  
    function handleFileSelect(event) {
      const files = event.target.files;
      handleFiles(files);
    }
  
    function handleFiles(files) {
      if (files.length === 0) {
        return;
      }
  
      const file = files[0];
      const objectUrl = URL.createObjectURL(file);
  
      resultImage.src = objectUrl;
      dropzone.style.display = 'none';
      loadingDiv.style.display = 'block';
  
      sendFile(file);
    }
  
    async function sendFile(file) {
      let formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
  
        const data = await response.json();
        displayResult(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        loadingDiv.style.display = 'none';
        dropzone.style.display = 'block';
        alert('An error occurred while processing the image. Please check your network connection and try again.');
      }
    }
  
    function displayResult(data) {
      loadingDiv.style.display = 'none';
      resultDiv.style.display = 'block';
      labelElem.textContent = data.class;
      confidenceElem.textContent = `${(parseFloat(data.confidence) * 100).toFixed(2)}%`;
      clearButton.style.display = 'block';
    }
  
    function clearData() {
      fileInput.value = '';
      dropzone.style.display = 'flex';
      resultDiv.style.display = 'none';
      resultImage.src = '';
      clearButton.style.display = 'none';
    }
  });
  
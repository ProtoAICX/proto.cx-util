const demoFormElement = document.getElementById('demo-form')

if (demoFormElement) {
  demoFormElement.onsubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted');
  }
} else {
  console.log('Could not find demo form');
}

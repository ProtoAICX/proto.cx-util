// Function to format numbers with commas
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

$(document).ready(function () {
    function setProgress(range, calcNumber) {
    const newValue = Number(
      ((range.value - range.min) * 100) / (range.max - range.min)
    )
    const newPosition = 16 - newValue * 0.32
    document.documentElement.style.setProperty(
      `--range-progress-${calcNumber}`,
      `calc(${newValue}% + (${newPosition}px))`
    )
  }
  // Generic function to initialize a slider calculator
  function initializeSliderCalculator(sliderName, pricePerUnit) {
    if ($(`div#prolingual-calc-${sliderName}`).length) {
      let price = 0
      const range = document.getElementById(`prolingual-range-${sliderName}`)

      document.addEventListener('DOMContentLoaded', () => {
        setProgress(range, sliderName)
      })

      const Calculate = () => {
        price = Math.round(range.value * pricePerUnit)
        $(`.prolingual-calc_value-${sliderName}`).text(
          numberWithCommas(range.value).toString()
        )
      }

      const HandleInput = () => {
        setProgress(range, sliderName)
        Calculate()
        $(`.prolingual-calc_price-${sliderName}`).text(
          numberWithCommas(price).toString()
        )
      }

      range.oninput = () => {
        HandleInput()
      }

      HandleInput()
    }
  }

  // Initialize the three slider calculators with different price per units
  initializeSliderCalculator('ttt', 0.007)
  initializeSliderCalculator('stt', 0.08)
  initializeSliderCalculator('tts', 0.08)
  })

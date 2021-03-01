/*
 * LightningChartJS example that showcases a simulated ECG signal.
 */
// Import LightningChartJS
const lcjs = require("@arction/lcjs");
const data = require("./ecg_data.json");
var time = data["ecgData"];
var point = [];
for (let j = 0; j < time.length; j++) {
  var array = data["ecgData"][j]["extras"]["ecg"];
  for (let i = 0; i < array.length; i++) {
    point.push({ x: i, y: array[i] });
  }
}
// Extract required parts from LightningChartJS.
const {
  lightningChart,
  DataPatterns,
  AxisScrollStrategies,
  SolidLine,
  SolidFill,
  ColorHEX,
  AutoCursorModes,
  Themes,
} = lcjs;

// Import data-generators from 'xydata'-library.
const { createSampledDataGenerator } = require("@arction/xydata");

// Create a XY Chart.
const chart = lightningChart()
  .ChartXY({
    // theme: Themes.dark
  })
  .setTitle("ECG");

// Add line series to visualize the data received
const series = chart.addLineSeries({
  dataPattern: DataPatterns.horizontalProgressive,
});
// Style the series
series
  .setStrokeStyle(
    new SolidLine({
      thickness: 2,
      fillStyle: new SolidFill({ color: ColorHEX("#5aafc7") }),
    })
  )
  .setMouseInteractions(false);

chart.setAutoCursorMode(AutoCursorModes.disabled);

// Setup view nicely.
chart
  .getDefaultAxisY()
  .setTitle("mV")
  .setInterval(-1600, 1000)
  .setScrollStrategy(AxisScrollStrategies.expansion);

chart
  .getDefaultAxisX()
  .setTitle("milliseconds")
  .setInterval(0, 2500)
  .setScrollStrategy(AxisScrollStrategies.progressive);
// Create a data generator to supply a continuous stream of data.
createSampledDataGenerator(point, 1, 10)
  .setSamplingFrequency(1)
  .setInputData(point)
  .generate()
  .setStreamBatchSize(48)
  .setStreamInterval(50)
  .setStreamRepeat(true)
  .toStream()
  .forEach((point) => {
    // Push the created points to the series.
    series.add({ x: point.timestamp, y: point.data.y });
  });
document.addEventListener("click", function () {
  console.log("click");
});

function buildMetadata(sample) {
  const url = "/metadata/" + sample;
  d3.json(url).then(sample => {
    const sample_metadata = d3.select("#sample-metadata");

    sample_metadata.html("");

    Object.entries(sample).forEach(([key, value]) => {
      const row = sample_metadata.append("p");
      row.text(`${key}: ${value}`);
    });
  });
}

function buildCharts(sample) {
  const url = `/samples/${sample}`;

  d3.json(url).then((data) => {
    const bubbles = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: "markers",
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
      },
    };

    const bubbleTrace = [bubbles];
    const layout = {
      title: "Belly Button Bacteria",
      xaxis: { title: "OTU ID" },
    };

    Plotly.newPlot("bubble", bubbleTrace, layout);

    d3.json(url).then(data => {
      const pieData = [
        {
          values: data.sample_values.slice(0, 10),
          labels: data.otu_ids.slice(0, 10),
          hovertext: data.otu_labels.slice(0, 10),
          type: "pie",
        },
      ];

      const pieLayout = {
        margin: { t: 0, l: 0 },
        height: 600,
        width: 700,
      };

      Plotly.newPlot("pie", pieData, pieLayout);
    });
  });
}

function init() {
  const selector = d3.select("#selDataset");

  d3.json("/names").then(sampleNames => {
    sampleNames.forEach(sample => {
      selector.append("option").text(sample).property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();

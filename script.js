document.addEventListener("DOMContentLoaded", function () {
    let ukMapContainerUnique = document.getElementById("uk-map-container");
    let ukMapTooltipUnique = document.getElementById("uk-map-tooltip");
    let ukMapInfoBoxUnique = document.getElementById("uk-map-info-box");
    let ukMapLegendUnique = document.getElementById("uk-map-legend");

    let ukRegionDataUnique = {
        "England": { vacancyRate: 6.9, description: "In 2023/24 this figure stood at 8.1%, the vacancy rate percentage point change stands at -1.2%", link: "https://www.skillsforcare.org.uk/Adult-Social-Care-Workforce-Data/Workforce-intelligence/publications/Topics/Monthly-tracking/Recruitment-and-retention.aspx" },
        "East of England": { vacancyRate: 7.7, description: "In 2023/24 this figure stood at 8.3%, the vacancy rate percentage point change stands at -0.6%", link: "https://www.skillsforcare.org.uk/Adult-Social-Care-Workforce-Data/Workforce-intelligence/publications/Topics/Monthly-tracking/Recruitment-and-retention.aspx" },
        "East Midlands": { vacancyRate: 6.8, description: "In 2023/24 this figure stood at 8.7%, the vacancy rate percentage point change stands at -1.9%", link: "https://www.skillsforcare.org.uk/Adult-Social-Care-Workforce-Data/Workforce-intelligence/publications/Topics/Monthly-tracking/Recruitment-and-retention.aspx" },
        "Greater London": { vacancyRate: 9.1, description: "In 2023/24 this figure stood at 10.8%, the vacancy rate percentage point change stands at -1.7%", link: "https://www.skillsforcare.org.uk/Adult-Social-Care-Workforce-Data/Workforce-intelligence/publications/Topics/Monthly-tracking/Recruitment-and-retention.aspx" },
        "North East": { vacancyRate: 4.6, description: "In 2023/24 this figure stood at 6.1%, the vacancy rate percentage point change stands at -1.5%", link: "https://www.skillsforcare.org.uk/Adult-Social-Care-Workforce-Data/Workforce-intelligence/publications/Topics/Monthly-tracking/Recruitment-and-retention.aspx" },
        "North West": { vacancyRate: 6.9, description: "In 2023/24 this figure stood at 7.5%, the vacancy rate percentage point change stands at -0.6%", link: "https://www.skillsforcare.org.uk/Adult-Social-Care-Workforce-Data/Workforce-intelligence/publications/Topics/Monthly-tracking/Recruitment-and-retention.aspx" },
        "South East": { vacancyRate: 7.4, description: "In 2023/24 this figure stood at 8.3%, the vacancy rate percentage point change stands at -0.9%", link: "https://www.skillsforcare.org.uk/Adult-Social-Care-Workforce-Data/Workforce-intelligence/publications/Topics/Monthly-tracking/Recruitment-and-retention.aspx" },
        "South West": { vacancyRate: 6.2, description: "In 2023/24 this figure stood at 7.4%, the vacancy rate percentage point change stands at -1.2%", link: "https://www.skillsforcare.org.uk/Adult-Social-Care-Workforce-Data/Workforce-intelligence/publications/Topics/Monthly-tracking/Recruitment-and-retention.aspx" },
        "West Midlands": { vacancyRate: 6.1, description: "In 2023/24 this figure stood at 8.0%, the vacancy rate percentage point change stands at -1.9%", link: "https://www.skillsforcare.org.uk/Adult-Social-Care-Workforce-Data/Workforce-intelligence/publications/Topics/Monthly-tracking/Recruitment-and-retention.aspx" },
        "Yorkshire and the Humber": { vacancyRate: 5.0, description: "In 2023/24 this figure stood at 6.3%, the vacancy rate percentage point change stands at -1.3%", link: "https://www.skillsforcare.org.uk/Adult-Social-Care-Workforce-Data/Workforce-intelligence/publications/Topics/Monthly-tracking/Recruitment-and-retention.aspx" },
        "Scotland": { vacancyRate: 11.0, description: "Scottish social care workforce challenges persist.", link: "#" },
        "Wales": { vacancyRate: 9.0, description: "Vacancy rates increased", link: "#" },
        "Northern Ireland": { vacancyRate: 6.4, description: "Vacancy rates have decreased", link: "#" }
    };

    let vacancyRates = Object.values(ukRegionDataUnique).map(r => r.vacancyRate);
    let minVacancyRate = Math.min(...vacancyRates);
    let maxVacancyRate = Math.max(...vacancyRates);

    function getRegionColour(vacancyRate) {
        let percentage = (vacancyRate - minVacancyRate) / (maxVacancyRate - minVacancyRate);

        // Adjusted gradient: From light blue (low vacancy) to deep purple (high vacancy)
        let red = Math.round(230 - (percentage * 160));  // Keeps it slightly colourful
        let green = Math.round(230 - (percentage * 190));
        let blue = Math.round(255 - (percentage * 80));  // Ensures low vacancy regions are still visible

        return `rgb(${red}, ${green}, ${blue})`;
    }


    fetch("/images/united-kingdom.svg")
        .then(response => response.text())
        .then(ukMapSvgDataUnique => {
            ukMapContainerUnique.innerHTML = ukMapSvgDataUnique;
            let ukMapPathsUnique = document.querySelectorAll("svg path");

            ukMapPathsUnique.forEach(ukMapPathUnique => {
                let ukRegionNameUnique = ukMapPathUnique.getAttribute("name") ||
                    ukMapPathUnique.getAttribute("title") ||
                    "Unknown Region";

                // ✅ Remove Ireland (Republic of Ireland) properly
                if (ukRegionNameUnique.includes("Ireland") && !ukRegionNameUnique.includes("Northern")) {
                    ukMapPathUnique.remove();
                    return; // Skip processing
                }

                if (ukRegionDataUnique[ukRegionNameUnique]) {
                    let vacancyRate = ukRegionDataUnique[ukRegionNameUnique].vacancyRate;
                    let regionColour = getRegionColour(vacancyRate);
                    ukMapPathUnique.style.fill = regionColour;
                    ukMapPathUnique.style.pointerEvents = "all"; // ✅ Ensure hover events work
                }

                // ✅ Hover event (Fix tooltip not showing)
                ukMapPathUnique.addEventListener("mouseover", function (event) {
                    let region = ukRegionDataUnique[ukRegionNameUnique];
                    ukMapTooltipUnique.innerHTML = `
                        <strong>${ukRegionNameUnique}</strong><br>
                        Vacancy Rate: ${region.vacancyRate}%`;
                    ukMapTooltipUnique.style.display = "block";
                    ukMapTooltipUnique.style.left = event.pageX + 10 + "px";
                    ukMapTooltipUnique.style.top = event.pageY + 10 + "px";
                    this.style.stroke = "#0707cd";
                    this.style.strokeWidth = "1px";
                });

                ukMapPathUnique.addEventListener("mousemove", function (event) {
                    let tooltipWidth = ukMapTooltipUnique.offsetWidth;
                    let tooltipHeight = ukMapTooltipUnique.offsetHeight;

                    let tooltipX = event.pageX - (tooltipWidth / 2); // Center horizontally
                    let tooltipY = event.pageY - tooltipHeight - 10; // Move tooltip above cursor

                    // Ensure tooltip stays within the viewport
                    if (tooltipX < 0) tooltipX = 10;
                    if (tooltipY < 0) tooltipY = event.pageY + 20; // Fallback: move below cursor if too high

                    ukMapTooltipUnique.style.left = `${tooltipX}px`;
                    ukMapTooltipUnique.style.top = `${tooltipY}px`;
                });


                ukMapPathUnique.addEventListener("mouseout", function () {
                    ukMapTooltipUnique.style.display = "none";
                    this.style.stroke = "none";
                });

                // ✅ Click event for info box
                ukMapPathUnique.addEventListener("click", function () {
                    let region = ukRegionDataUnique[ukRegionNameUnique];
                    ukMapInfoBoxUnique.innerHTML = `
                        <h2>${ukRegionNameUnique}</h2>
                        <p><strong>Vacancy Rate:</strong> ${region.vacancyRate}%</p>
                        <p>${region.description}</p>
                    `;
                });
            });

            // ✅ Fix: Rebuild the Legend
            let legendHtml = '<h3>Vacancy Rate Scale</h3>';
            for (let i = 0; i <= 10; i++) {
                let vacancyRate = minVacancyRate + (i / 10) * (maxVacancyRate - minVacancyRate);
                let color = getRegionColour(vacancyRate);
                legendHtml += `<div style="background:${color}; width: 100%; padding: 5px;">${vacancyRate.toFixed(1)}%</div>`;
            }
            ukMapLegendUnique.innerHTML = legendHtml;
        })
        .catch(ukMapErrorUnique => console.error("Error loading UK SVG:", ukMapErrorUnique));
});

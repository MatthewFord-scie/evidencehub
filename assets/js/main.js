

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$nav = $('#nav'),
		$main = $('#main'),
		$navPanelToggle, $navPanel, $navPanelInner;

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				$bg = $('<div class="bg"></div>').appendTo($t),
				on, off;

			on = function() {

				$bg
					.removeClass('fixed')
					.css('transform', 'matrix(1,0,0,1,0,0)');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

					});

			};

			off = function() {

				$bg
					.addClass('fixed')
					.css('transform', 'none');

				$window
					.off('scroll._parallax');

			};

			// Disable parallax on ..
				if (browser.name == 'ie'			// IE
				||	browser.name == 'edge'			// Edge
				||	window.devicePixelRatio > 1		// Retina/HiDPI (= poor performance)
				||	browser.mobile)					// Mobile devices
					off();

			// Enable everywhere else.
				else {

					breakpoints.on('>large', on);
					breakpoints.on('<=large', off);

				}

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly();

	// Background.
		$wrapper._parallax(0.925);

	// Nav Panel.

		// Toggle.
			$navPanelToggle = $(
				'<a href="#navPanel" id="navPanelToggle">Menu</a>'
			)
				.appendTo($wrapper);

			// Change toggle styling once we've scrolled past the header.
				$header.scrollex({
					bottom: '5vh',
					enter: function() {
						$navPanelToggle.removeClass('alt');
					},
					leave: function() {
						$navPanelToggle.addClass('alt');
					}
				});

		// Panel.
			$navPanel = $(
				'<div id="navPanel">' +
					'<nav>' +
					'</nav>' +
					'<a href="#navPanel" class="close"></a>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-navPanel-visible'
				});

			// Get inner.
				$navPanelInner = $navPanel.children('nav');

			// Move nav content on breakpoint change.
				var $navContent = $nav.children();

				breakpoints.on('>medium', function() {

					// NavPanel -> Nav.
						$navContent.appendTo($nav);

					// Flip icon classes.
						$nav.find('.icons, .icon')
							.removeClass('alt');

				});

				breakpoints.on('<=medium', function() {

					// Nav -> NavPanel.
						$navContent.appendTo($navPanelInner);

					// Flip icon classes.
						$navPanelInner.find('.icons, .icon')
							.addClass('alt');

				});

			// Hack: Disable transitions on WP.
				if (browser.os == 'wp'
				&&	browser.osVersion < 10)
					$navPanel
						.css('transition', 'none');

	// Intro.
		var $intro = $('#intro');

		if ($intro.length > 0) {

			// Hack: Fix flex min-height on IE.
				if (browser.name == 'ie') {
					$window.on('resize.ie-intro-fix', function() {

						var h = $intro.height();

						if (h > $window.height())
							$intro.css('height', 'auto');
						else
							$intro.css('height', h);

					}).trigger('resize.ie-intro-fix');
				}

			// Hide intro on scroll (> small).
				breakpoints.on('>small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'bottom',
						top: '25vh',
						bottom: '-50vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

				});

			// Hide intro on scroll (<= small).
				breakpoints.on('<=small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'middle',
						top: '15vh',
						bottom: '-15vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

			});

		}

// 		Collapsible
	var coll = document.getElementsByClassName("collapsible");
	var i;

	for (i = 0; i < coll.length; i++) {
		coll[i].addEventListener("click", function() {
			this.classList.toggle("active");
			var content = this.nextElementSibling;
			if (content.style.display === "block") {
				content.style.display = "none";
			} else {
				content.style.display = "block";
			}
		});
	}

// 	Chart.js
	const xValues = [100,200,300,400,500,600,700,800,900,1000];

	new Chart("myChart", {
		type: "line",
		data: {
			labels: xValues,
			datasets: [{
				data: [860,1140,1060,1060,1070,1110,1330,2210,7830,2478],
				borderColor: "red",
				fill: false
			},{
				data: [1600,1700,1700,1900,2000,2700,4000,5000,6000,7000],
				borderColor: "green",
				fill: false
			},{
				data: [300,700,2000,5000,6000,4000,2000,1000,200,100],
				borderColor: "blue",
				fill: false
			}]
		},
		options: {
			legend: {display: false}
		}
	});

// 	ethnicity chart

	var xEthnicityValues = ["Bangladeshi", "Chinese", "Indian", "Pakistani", "Asian other",
		"Black African", "Black Caribbean", "Black other",
		"Mixed White/Asian", "Mixed White/Black African",
		"Mixed White/Black Caribbean", "Mixed other",
		"White British", "White Irish",
		"White Gypsy/Traveller", "White other", "Other", "Unknown"];

	var yValuesEthSupport = [0.5, 0.2, 1.8, 1.4, 1.2, 1.6, 2.1, 0.8, 0.2, 0.1, 0.3, 0.6, 79.6, 1.1, 0.04, 2.6, 1.0, 4.9]; // Adults receiving long-term support (%)

	var yValuesEthPercentage = [0.5, 0.2, 3.1, 2.7, 1.1, 2.5, 1.0, 0.5, 0.9, 0.4, 0.8, 0.8, 74.4, 0.9, 0.1, 6.2]; // Overall ethnic percentage (%)

	new Chart("ethnicChart", {
		type: "bar",
		data: {
			labels: xEthnicityValues,
			datasets: [{
				label: 'Adults Receiving Long-Term Support (%)',
				data: yValuesEthSupport,
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
			}, {
				label: 'Ethnic Percentage of England (%)',
				data: yValuesEthPercentage,
				backgroundColor: 'rgba(255, 99, 132, 0.6)',
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true,
					title: {
						display: true,
						text: 'Percentage (%)'
					}
				},
				x: {
					title: {
						display: true,
						text: 'Ethnic Groups'
					}
				}
			},
			plugins: {
				legend: {
					display: true,
					position: 'top',
				}
			}
		}
	});

// 	Evidence collapsible
// JavaScript to handle the collapsible functionality for info module
	document.addEventListener('DOMContentLoaded', function() {
		const toggleButtons = document.querySelectorAll('.info-toggle');

		toggleButtons.forEach(button => {
			button.addEventListener('click', function() {
				this.classList.toggle('active');
				const content = this.nextElementSibling;

				// Toggle the display of the content
				if (content.style.display === 'block') {
					content.style.display = 'none';
				} else {
					content.style.display = 'block';
				}

				// Set quality based on the data attribute
				const quality = parseInt(this.getAttribute('data-quality'));
				setQuality(content, quality);
			});
		});

		// Function to set the quality indicator
		function setQuality(content, quality) {
			const stars = content.querySelectorAll('.quality-star');
			stars.forEach((star, index) => {
				star.style.color = (index < quality) ? '#4caf50' : '#ccc'; // Green for filled, grey for unfilled
			});
		}
	});

// 	SEARCH FEATURE
	document.addEventListener('DOMContentLoaded', function () {
		const searchInput = document.getElementById('searchInput');
		const infoModules = document.querySelectorAll('.info-module');

		// Function to filter info modules based on search input
		searchInput.addEventListener('keyup', function () {
			const query = searchInput.value.toLowerCase(); // Get the current input value
			infoModules.forEach(module => {
				const title = module.querySelector('.info-toggle').innerText.toLowerCase(); // Get the title text
				if (title.includes(query)) { // Check if the title includes the query
					module.style.display = ''; // Show module
				} else {
					module.style.display = 'none'; // Hide module
				}
			});
		});
	});


	// 	Evidence collapsible 2 --------------------------------
// JavaScript to handle the collapsible functionality for info module
	document.addEventListener('DOMContentLoaded', function() {
		const toggleButtons2 = document.querySelectorAll('.info-toggle2');

		toggleButtons2.forEach(button => {
			button.addEventListener('click', function() {
				this.classList.toggle('active');
				const content2 = this.nextElementSibling;

				// Toggle the display of the content
				if (content2.style.display === 'block') {
					content2.style.display = 'none';
				} else {
					content2.style.display = 'block';
				}

				// Set quality based on the data attribute
				const quality = parseInt(this.getAttribute('data-quality'));
				setQuality(content2, quality);
			});
		});

		// Function to set the quality indicator
		function setQuality(content2, quality) {
			const stars2 = content2.querySelectorAll('.quality-star');
			stars2.forEach((star, index) => {
				star.style.color = (index < quality) ? '#4caf50' : '#ccc'; // Green for filled, grey for unfilled
			});
		}
	});
})(jQuery);
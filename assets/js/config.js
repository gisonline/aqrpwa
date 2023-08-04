//mesure line config
measureDistOptions = {
    position: 'topleft',            // Position to show the control. Values: 'topright', 'topleft', 'bottomright', 'bottomleft'
    unit: 'kilometres',             // Default unit the distances are displayed in. Values: 'kilometres', 'landmiles', 'nauticalmiles'
    useSubunits: true,              // Use subunits (metres/feet) in tooltips if distances are less than 1 kilometre/landmile
    clearMeasurementsOnStop: true,  // Clear all measurements when Measure Control is switched off
    showBearings: true,            // Whether bearings are displayed within the tooltips
    bearingTextIn: 'از',            // language dependend label for inbound bearings
    bearingTextOut: 'به',          // language dependend label for outbound bearings
    tooltipTextFinish: 'کلیک کنید <b>برای پایان دادن</b><br>',
    tooltipTextDelete: '',//'Press SHIFT-key and click to <b>delete point</b>',
    tooltipTextMove: '',//'Click and drag to <b>move point</b><br>',
    tooltipTextResume: '',//'<br>Press CTRL-key and click to <b>resume line</b>',
    tooltipTextAdd: '',//'Press CTRL-key and click to <b>add point</b>',
                                    // language dependend labels for point's tooltips
    measureControlTitleOn: 'Turn on PolylineMeasure',   // Title for the Measure Control going to be switched on
    measureControlTitleOff: 'Turn off PolylineMeasure', // Title for the Measure Control going to be switched off
    measureControlLabel: '&#8614;', // Label of the Measure Control (Unicode symbols are possible)
    measureControlClasses: [],      // Classes to apply to the Measure Control
    showClearControl: true,        // Show a control to clear all the measurements
    clearControlTitle: 'پاک کردن اندازه ها', // Title text to show on the Clear Control
    clearControlLabel: '&times',    // Label of the Clear Control (Unicode symbols are possible)
    clearControlClasses: [],        // Classes to apply to Clear Control
    showUnitControl: true,         // Show a control to change the units of measurements
    unitControlUnits: ["kilometres", "landmiles", "nauticalmiles"],
                                    // measurement units being cycled through by using the Unit Control
    unitControlTitle: {             // Title texts to show on the Unit Control
        text: 'تغییر واحد اندازه گیری',
        kilometres: 'کیلومتر',
        landmiles: 'مایل زمینی',
        nauticalmiles: 'مایل دریایی'
    },
    unitControlLabel: {             // Unit symbols to show in the Unit Control and measurement labels
        metres: 'm',
        kilometres: 'km',
        feet: 'ft',
        landmiles: 'mi',
        nauticalmiles: 'nm'
    },
    unitControlClasses: [],         // Classes to apply to the Unit Control
    tempLine: {                     // Styling settings for the temporary dashed line
        color: '#00f',              // Dashed line color
        weight: 2                   // Dashed line weight
    },          
    fixedLine: {                    // Styling for the solid line
        color: '#006',              // Solid line color
        weight: 2                   // Solid line weight
    },
    arrow: {                        // Styling of the midway arrow 
        color: '#000',              // Color of the arrow
    },
    startCircle: {                  // Style settings for circle marker indicating the starting point of the polyline
        color: '#000',              // Color of the border of the circle
        weight: 1,                  // Weight of the circle
        fillColor: '#0f0',          // Fill color of the circle
        fillOpacity: 1,             // Fill opacity of the circle
        radius: 3                   // Radius of the circle
    },
    intermedCircle: {               // Style settings for all circle markers between startCircle and endCircle
        color: '#000',              // Color of the border of the circle
        weight: 1,                  // Weight of the circle
        fillColor: '#ff0',          // Fill color of the circle
        fillOpacity: 1,             // Fill opacity of the circle
        radius: 3                   // Radius of the circle
    },
    currentCircle: {                // Style settings for circle marker indicating the latest point of the polyline during drawing a line
        color: '#000',              // Color of the border of the circle
        weight: 1,                  // Weight of the circle
        fillColor: '#f0f',          // Fill color of the circle
        fillOpacity: 1,             // Fill opacity of the circle
        radius: 6                   // Radius of the circle
    },
    endCircle: {                    // Style settings for circle marker indicating the last point of the polyline
        color: '#000',              // Color of the border of the circle
        weight: 1,                  // Weight of the circle
        fillColor: '#f00',          // Fill color of the circle
        fillOpacity: 1,             // Fill opacity of the circle
        radius: 3                   // Radius of the circle
    },
};


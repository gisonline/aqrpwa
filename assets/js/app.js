const version = "2023.10.27.4";
//alert(version)
const mapStore = localforage.createInstance({
    name: "maps",
    storeName: "saved_maps"
});

const featureStore = localforage.createInstance({
    name: "maps",
    storeName: "saved_features"
});

const map = L.map("map", {
    zoomSnap: L.Browser.mobile ? 0 : 1,
    // tap: (L.Browser.safari && !L.Browser.mobile) ? false : true,
    maxZoom: 22,
    zoomControl: false,
    renderer: L.canvas({
        padding: 0.5,
        tolerance: 10
    })
}).fitWorld();
map.attributionControl.setPrefix(`<span id="status" style="color:${navigator.onLine ? "green" : "red"}">&#9673;</span> <a href="#" onclick="showInfo(); return false;">درباره</a>`);

map.once("locationfound", (e) => {
    hideLoader();
    if (Object.values(layers.overlays)[0] instanceof L.TileLayer.MBTiles) {
        setTimeout(() => {
            map.fitBounds(Object.values(layers.overlays)[0].options.bounds);
            controls.locateCtrl.stopFollowing();
        }, 1);
    } else {
        map.fitBounds(e.bounds, {maxZoom: 18});
    }
});

map.on("click", (e) => {
    layers.select.clearLayers();
});

map.on("baselayerchange", (e) => {
    localStorage.setItem("basemap", e.name);
});

const layers = {
    basemaps: {
        "Streets": L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.@2xpng", {
            maxNativeZoom: 18,
            maxZoom: map.getMaxZoom(),
//            attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="https://carto.com/attribution">CARTO</a>',
        }).addTo(map),

        "Aerial": L.tileLayer("https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}", {
            maxNativeZoom: 16,
            maxZoom: map.getMaxZoom(),
            attribution: "USGS",
        }),

        "Topo": L.tileLayer("https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}", {
            maxNativeZoom: 16,
            maxZoom: map.getMaxZoom(),
            attribution: "USGS",
        }),

        "None": L.tileLayer("", {
            maxZoom: map.getMaxZoom()
        })
    },

    select: L.featureGroup(null).addTo(map),
    overlays: {},
    groups: {}
};

/*** Begin custom input control for adding local file ***/
L.Control.AddFile = L.Control.extend({
    onAdd: function (map) {
        const ua = window.navigator.userAgent;
        const iOS = !!ua.match(/iP(ad|od|hone)/i);
        fileInput = L.DomUtil.create("input", "hidden");
        fileInput.type = "file";
        fileInput.accept = iOS ? "*" : ".mbtiles, .geojson, .kml, .gpx, .csv";
        fileInput.style.display = "none";

        fileInput.addEventListener("change", function () {
            const file = fileInput.files[0];
            handleFile(file);
            this.value = "";
        }, false);

        const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");
        div.innerHTML = `
      <a class='leaflet-bar-part leaflet-bar-part-single file-control-btn' title='Load File' onclick='fileInput.click();'>
        <i class='icon-add'></i>
      </a>
    `;
        L.DomEvent.on(div, "click", function (e) {
            L.DomEvent.stopPropagation(e);
        });
        return div
    }
});

L.control.addfile = (opts) => {
    return new L.Control.AddFile(opts);
}

/*** menu ***/
L.Control.menuCommand = L.Control.extend({
//    options: {
//        position: 'topleft',
//    },

    onAdd: function (map) {
        var controlDiv = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        controlDiv.innerHTML = `
      <a class='leaflet-bar-part leaflet-bar-part-single file-control-btn icon-menu' title='Load File' onclick="">
        <i class='icon-menu'></i>
      </a>
    `;
        L.DomEvent
                .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
                .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
                .addListener(controlDiv, 'click', function () {
//                    window.location.reload();
                });

//        var controlUI = L.DomUtil.create('div', 'leaflet-control-command-interior', controlDiv);
//        controlUI.title = 'Map Commands';
        return controlDiv;
    }
});
L.control.menuCommand = function (options) {
    return new L.Control.menuCommand(options);
};
/*** reset command ***/
L.Control.resetCommand = L.Control.extend({
    onAdd: function (map) {
        var controlDiv = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        controlDiv.innerHTML = `
      <a class='leaflet-bar-part leaflet-bar-part-single file-control-btn icon-reset' title='Load File'>
        <i class='icon-menu'></i>
      </a>
    `;
        L.DomEvent
                .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
                .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
                .addListener(controlDiv, 'click', function () {
                    resetSW();
                });

//        var controlUI = L.DomUtil.create('div', 'leaflet-control-command-interior', controlDiv);
//        controlUI.title = 'Map Commands';
        return controlDiv;
    }
});
L.control.resetCommand = function (options) {
    return new L.Control.resetCommand(options);
};

/*** mesure dist ***/

/*** mesure area ***/
L.Control.mesureAreaCommand = L.Control.extend({
//    options: {
//        position: 'topleft',
//    },

    onAdd: function (map) {
        var controlDiv = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        controlDiv.innerHTML = `
      <a class='leaflet-bar-part leaflet-bar-part-single file-control-btn icon-mesurearea' title='Load File' onclick="window.location.reload();">
        <i class='icon-mesurearea'></i>
      </a>
    `;
        L.DomEvent
                .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
                .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
                .addListener(controlDiv, 'click', function () {
//                    MapShowCommand();
                });

//        var controlUI = L.DomUtil.create('div', 'leaflet-control-command-interior', controlDiv);
//        controlUI.title = 'Map Commands';
        return controlDiv;
    }
});

L.control.mesureAreaCommand = function (options) {
    return new L.Control.mesureAreaCommand(options);
};
/*** End custom control ***/

const controls = {
    layerCtrl: L.control.layers(layers.basemaps, null, {
        collapsed: true,
        position: "topright"
    }).addTo(map),

//  fileCtrl: L.control.addfile({
//    position: "bottomright"
//  }).addTo(map),
//  
    menuCommandCtrl: L.control.menuCommand({
        position: "topleft"
    }).addTo(map),

    locateCtrl: L.control.locate({
        icon: "icon-gps_fixed",
        iconLoading: "spinner icon-gps_fixed",
        setView: "untilPan",
        cacheLocation: true,
        position: "bottomright",
        flyTo: false,
        keepCurrentZoomLevel: true,
        showCompass: true,
        circleStyle: {
            interactive: false
        },
        markerStyle: {
            interactive: true
        },
        metric: true,
        strings: {
            title: "My location",
            popup: (options) => {
                const loc = controls.locateCtrl._marker.getLatLng();
                return `<div style="text-align: center;">شما در محدوده ${Number(options.distance).toLocaleString()} ${options.unit}<br>از <strong>${loc.lat.toFixed(6)}</strong>, <strong>${loc.lng.toFixed(6)}</strong></div>`;
            }
        },
        locateOptions: {
            enableHighAccuracy: true,
            maxZoom: 18
        },
        onLocationError: (e) => {
            hideLoader();
            document.querySelector(".leaflet-control-locate").getElementsByTagName("span")[0].className = "icon-gps_off";
            alert(e.message);
        },
        onLocationFound: (e) => {
            console.log(e);
        }
    }).addTo(map),

    scaleCtrl: L.control.scale({
        position: "bottomleft"
    }).addTo(map),

    measureDistCtrl: L.control.polylineMeasure(measureDistOptions).addTo(map),
    measureCtrl: L.control.measure({}).addTo(map),
    resetCommandCtrl: L.control.resetCommand({
        position: "topleft"
    }).addTo(map),

//var measureControl = L.control.measure({ position: 'topleft' });
//measureControl.addTo(map);
//    mesureDistCommandCtrl: L.control.mesureDistCommand({
//        position: "topleft"
//    }).addTo(map),
//    mesureAreaCommandCtrl: L.control.mesureAreaCommand({
//        position: "topleft"
//    }).addTo(map),
};
L.Measure = measureConf;

function handleFile(file) {
    showLoader();
    const name = file.name.split(".").slice(0, -1).join(".");

    if (file.name.endsWith(".mbtiles")) {
        loadRaster(file, name);
    } else if (file.name.endsWith(".geojson") || file.name.endsWith(".kml") || file.name.endsWith(".gpx") || file.name.endsWith(".csv")) {
        const format = file.name.split(".").pop();
        loadVector(file, name, format);
    } else {
        alert("MBTiles, GeoJSON, KML, GPX, and CSV files supported.");
        hideLoader();
    }
}

function loadVector(file, name, format) {
    const reader = new FileReader();
    let geojson = null;

    reader.onload = function (e) {
        if (format == "geojson") {
            geojson = JSON.parse(reader.result);
            name = geojson.name ? geojson.name : name;
        } else if (format == "kml") {
            const kml = (new DOMParser()).parseFromString(reader.result, "text/xml");
            geojson = toGeoJSON.kml(kml, {styles: true});
        } else if (format == "gpx") {
            const gpx = (new DOMParser()).parseFromString(reader.result, "text/xml");
            geojson = toGeoJSON.gpx(gpx);
        } else if (format == "csv") {
            const columns = reader.result.split(/\n/).filter(Boolean)[0].split(",");
            const options = {};
            if (columns.includes("Y") && columns.includes("X")) {
                options.latfield = "Y",
                        options.lonfield = "X"
            }
            csv2geojson.csv2geojson(reader.result, options, function (err, data) {
                if (data) {
                    geojson = data;
                }
            });
        }

        createVectorLayer(name, geojson, null, true);
    }

    reader.readAsText(file);
}

function createVectorLayer(name, data, key, save) {
    let radius = 4;
    var key = key ? key : Date.now().toString();
    const layer = L.geoJSON(data, {
        key: key,
        bubblingMouseEvents: false,
        style: (feature) => {
            return {
                color: feature.properties.hasOwnProperty("stroke") ? feature.properties["stroke"] : feature.properties["marker-color"] ? feature.properties["marker-color"] : feature.geometry.type == "Point" ? "#ffffff" : "#ff0000",
                opacity: feature.properties.hasOwnProperty("stroke-opacity") ? feature.properties["stroke-opacity"] : 1.0,
                weight: feature.properties.hasOwnProperty("stroke-width") ? feature.properties["stroke-width"] : feature.geometry.type == "Point" ? 1.5 : 3,
                fillColor: feature.properties.hasOwnProperty("fill") ? feature.properties["fill"] : feature.properties["marker-color"] ? feature.properties["marker-color"] : "#ff0000",
                fillOpacity: feature.properties.hasOwnProperty("fill-opacity") ? feature.properties["fill-opacity"] : feature.geometry.type != "Point" ? 0.2 : feature.geometry.type == "Point" ? 1 : "",
            };
        },
        pointToLayer: (feature, latlng) => {
            const size = feature.properties.hasOwnProperty("marker-size") ? feature.properties["marker-size"] : "medium";
            const sizes = {
                small: 4,
                medium: 6,
                large: 8
            };
            radius = sizes[size];
            return L.circleMarker(latlng, {
                radius: radius
            });
        },
        onEachFeature: (feature, layer) => {
            let table = "<div style='overflow:auto;'><table>";
            const hiddenProps = ["styleUrl", "styleHash", "styleMapHash", "stroke", "stroke-opacity", "stroke-width", "opacity", "fill", "fill-opacity", "icon", "scale", "coordTimes", "marker-size", "marker-color", "marker-symbol"];
            for (const key in feature.properties) {
                if (feature.properties.hasOwnProperty(key) && hiddenProps.indexOf(key) == -1) {
                    table += "<tr><th>" + key.toUpperCase() + "</th><td>" + formatProperty(feature.properties[key]) + "</td></tr>";
                }
            }
            table += "</table></div>";
            layer.bindPopup(table, {
                // closeButton: false,
                autoPanPadding: [15, 15],
                maxHeight: 300,
                maxWidth: 250
            });
            layer.on({
                popupclose: (e) => {
                    layers.select.clearLayers();
                },
                click: (e) => {
                    layers.select.clearLayers();
                    layers.select.addLayer(L.geoJSON(layer.toGeoJSON(), {
                        style: {
                            color: "#00FFFF",
                            weight: 5
                        },
                        pointToLayer: (feature, latlng) => {
                            return L.circleMarker(latlng, {
                                radius: radius,
                                color: "#00FFFF",
                                fillColor: "#00FFFF",
                                fillOpacity: 1
                            });
                        }
                    }))
                }
            });
        }
    });

    if (save) {
        const value = {
            "name": name,
            "features": data
        };

        featureStore.setItem(key, value).then((value) => {
            addOverlayLayer(layer, name, null, true);
            layers.overlays[L.Util.stamp(layer)] = layer;
            layer.addTo(map);
            zoomToLayer(L.Util.stamp(layer));
        }).catch((err) => {
            alert("Error saving data!");
        });
    } else {
        addOverlayLayer(layer, name, null, true);
        layers.overlays[L.Util.stamp(layer)] = layer;
    }
}

function loadRaster(file, name) {
    const reader = new FileReader();

    reader.onload = (e) => {
        createRasterLayer(name, reader.result);
    }

    reader.readAsArrayBuffer(file);
}

function createRasterLayer(name, data) {
    const key = Date.now().toString();
    const layer = L.tileLayer.mbTiles(data, {
        autoScale: true,
        fitBounds: true,
        updateWhenIdle: false,
        key: key
    }).on("databaseloaded", (e) => {
        name = (layer.options.name ? layer.options.name : name);
        // addOverlayLayer(layer, name);
        const value = {
            "name": name,
            "mbtiles": data
        };
        mapStore.setItem(key, value).then((value) => {
            addOverlayLayer(layer, name, null, false);
        }).catch((err) => {
            alert("Error saving data!");
        });

    }).addTo(map);
    layers.overlays[L.Util.stamp(layer)] = layer;
}

function addOverlayLayer(layer, name, group, saved) {
    hideLoader();
    const layerState = getLayerState();
    controls.layerCtrl.addOverlay(layer, `
    ${name.replace(/_/g, " ")}<br>
    <span class="layer-buttons">
      <input type="range" value="1" step="0.1" min="0" max="1" data-layer="${L.Util.stamp(layer)}" style="width: 100%;" oninput="changeOpacity(${L.Util.stamp(layer)});" ${saved ? "disabled" : ""}>
      <a class="layer-btn" href="#" title="Zoom to layer" onclick="zoomToLayer(${L.Util.stamp(layer)}); return false;"><i class="icon-zoom_out_map" style="color: darkslategray; font-size: 22px;"></i></a>
      <a class="layer-btn" href="#" title="Remove layer" onclick="removeLayer(${L.Util.stamp(layer)}, '${name}', '${group ? group : ''}'); L.DomEvent.disableClickPropagation(this); return false;"><i class="icon-delete" style="color: red; font-size: 22px;"></i></a>
    </span>
    <div style="clear: both;"></div>
  `);

    setTimeout(() => {
        updateLayerState(layerState);
    }, 100);


    layer.on("add", () => {
        document.querySelector(`[data-layer='${L.Util.stamp(layer)}']`).disabled = false;
    });
    layer.on("remove", () => {
        document.querySelector(`[data-layer='${L.Util.stamp(layer)}']`).disabled = true;
    });
}

function getLayerState() {
    const layers = {};
    document.querySelectorAll(".layer-buttons input").forEach(element => {
        const id = element.getAttribute("data-layer");
        const layer = map._layers[id];
        layers[id] = {
            disabled: (layer && map.hasLayer(layer)) ? false : true,
            opacity: element.value
        }
    });
    return layers;
}

function updateLayerState(layers) {
    document.querySelectorAll(".layer-buttons input").forEach(element => {
        const id = element.getAttribute("data-layer");
        if (layers[id]) {
            element.disabled = layers[id].disabled;
            element.value = layers[id].opacity;
        }
    });
}

function zoomToLayer(id) {
    const layer = layers.overlays[id];
    if (!map.hasLayer(layer)) {
        // map.addLayer(layers.overlays[id]);
        alert("Layer must be active first!");
    } else if (layer.options.bounds) {
        map.fitBounds(layer.options.bounds);
        controls.locateCtrl.stopFollowing();
    } else {
        map.fitBounds(layer.getBounds(), {padding: [20, 20]});
        controls.locateCtrl.stopFollowing();
    }
}

function removeLayer(id, name, group) {
    if (confirm(`Remove ${name.replace(/_/g, " ")}?`)) {
        const layerState = getLayerState();
        const layer = layers.overlays[id];
        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
        }
        if (layer instanceof L.TileLayer.MBTiles) {
            layer._db.close();
        }
        if (layer && layer.options && layer.options.key) {
            if (layer instanceof L.TileLayer.MBTiles) {
                mapStore.removeItem(layer.options.key).then(function () {
                    controls.layerCtrl.removeLayer(layer);
                    updateLayerState(layerState);
                });
            } else if (layer instanceof L.GeoJSON) {
                featureStore.removeItem(layer.options.key).then(function () {
                    controls.layerCtrl.removeLayer(layer);
                    updateLayerState(layerState);
                });
            }
        }
        if (group) {
            const groupLayer = layers.groups[group];
            const key = groupLayer.options.key;
            mapStore.removeItem(key).then(() => {
                controls.layerCtrl.removeLayer(groupLayer);
                updateLayerState(layerState);
            });
        }/* else {
         controls.layerCtrl.removeLayer(layer);
         updateLayerState(layerState);
         }*/
    }
}

function changeOpacity(id) {
    const value = document.querySelector(`[data-layer='${id}']`).value;
    const layer = layers.overlays[id];
    if (!map.hasLayer(layer)) {
        // map.addLayer(layers.overlays[id]);
        alert("Layer must be active first!");
    } else if (layer instanceof L.TileLayer.MBTiles) {
        layer.setOpacity(value);
    } else if (layer instanceof L.GeoJSON) {
        layer.eachLayer((layer) => {
            if (layer.feature.properties["fill-opacity"] != 0) {
                layer.setStyle({
                    fillOpacity: value
                });
            }
            if (layer.feature.properties["opacity"] != 0) {
                layer.setStyle({
                    opacity: value
                });
            }
        });
    }
}

function formatProperty(value) {
    if (typeof value == "string" && value.startsWith("http")) {
        return `<a href="${value}" target="_blank">${value}</a>`;
    } else {
        return value;
    }
}

function showLoader() {
    document.getElementById("progress-bar").style.display = "block";
}

function hideLoader() {
    document.getElementById("progress-bar").style.display = "none";
}

function switchBaseLayer(name) {
    const basemaps = Object.keys(layers.basemaps);
    for (const layer of basemaps) {
        if (layer == name) {
            map.addLayer(layers.basemaps[layer]);
        } else {
            map.removeLayer(layers.basemaps[layer]);
        }
    }
}

function loadBasemapConfig(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const config = JSON.parse(reader.result);
        if (confirm("Are you sure you want to overwrite the default basemaps?")) {
            loadCustomBasemaps(config);
            localStorage.setItem("basemapConfig", JSON.stringify(config));
        }
    }
    reader.readAsText(file);
}

function loadCustomBasemaps(config) {
    const basemaps = Object.keys(layers.basemaps);
    for (const layer of basemaps) {
        map.removeLayer(layers.basemaps[layer]);
        controls.layerCtrl.removeLayer(layers.basemaps[layer]);
    }
    layers.basemaps = {};
    config.forEach((element, index) => {
        let layer = null;
        if (element.type == "wms") {
            layer = L.tileLayer.wms(element.url, {
                maxNativeZoom: element.maxZoom ? element.maxZoom : 18,
                maxZoom: map.getMaxZoom(),
                layers: element.layers,
                format: element.format ? element.format : "image/png",
                attribution: element.attribution ? element.attribution : ""
            });
        } else if (element.type == "xyz") {
            layer = L.tileLayer(element.url, {
                maxNativeZoom: element.maxZoom ? element.maxZoom : 18,
                maxZoom: map.getMaxZoom(),
                attribution: element.attribution ? element.attribution : ""
            });
        }
        if (index == 0) {
            layer.addTo(map);
        }
        layers.basemaps[element.name] = layer;
        controls.layerCtrl.addBaseLayer(layer, element.name);
    });
    layers.basemaps["None"] = L.tileLayer("", {maxZoom: map.getMaxZoom()});
    controls.layerCtrl.addBaseLayer(layers.basemaps["None"], "None");
}

function showInfo() {
    alert("سامانه مدیریت اطلاعات مکانی موقوفات \n  اداره نقشه برداری");
}

function loadSavedFeatures() {
    featureStore.length().then((numberOfKeys) => {
        if (numberOfKeys > 0) {
            featureStore.iterate((value, key, iterationNumber) => {
                createVectorLayer(value.name, value.features, key, false);
            }).then(() => {
                // console.log("saved features loaded!");
            }).catch((err) => {
                console.log(err);
            });
        }
    }).catch((err) => {
        console.log(err);
    });
}

function loadSavedMaps() {
    const urlParams = new URLSearchParams(window.location.search);
    mapStore.length().then((numberOfKeys) => {
        /*if (!urlParams.has("map") && numberOfKeys != 1) {
         controls.locateCtrl.start();
         }*/
        if (numberOfKeys > 0) {
            mapStore.iterate((value, key, iterationNumber) => {
                const group = L.layerGroup(null, {key: key});
                const groupID = L.Util.stamp(group);
                layers.groups[groupID] = group;
                addOverlayLayer(group, value.name, groupID, true);
                group.once("add", (e) => {
                    const layer = L.tileLayer.mbTiles(value.mbtiles, {
                        autoScale: true,
                        fitBounds: (urlParams.has("map") && urlParams.get("map") == key) ? true : (numberOfKeys == 1) ? true : false,
                        updateWhenIdle: false,
                        zIndex: 10
                    });
                    group.addLayer(layer);
                    layers.overlays[groupID] = layer;
                });
                if ((numberOfKeys == 1) || (urlParams.has("map") && urlParams.get("map") == key)) {
                    map.addLayer(group);
                    switchBaseLayer("None");
                    document.querySelector(`[data-layer='${groupID}']`).disabled = false;
                }
            }).then(() => {
                // console.log("saved maps loaded!");
                loadSavedFeatures();
            }).catch((err) => {
                console.log(err);
            });
        } else {
            loadSavedFeatures();
        }
    }).catch((err) => {
        console.log(err);
    });
}

function loadURLparams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("map")) {
        const url = urlParams.get("map");
        mapStore.keys().then((keys) => {
            if (!keys.includes(url)) {
                fetchFile(url);
            }
        }).catch((err) => {
            console.log(err);
        });
        // window.history.replaceState(null, null, window.location.pathname);
    }
}

function fetchFile(url) {
    if (navigator.onLine) {
        showLoader();
        fetch(url)
                .then(response => response.arrayBuffer())
                .then(data => {
                    hideLoader();
                    const layer = L.tileLayer.mbTiles(data, {
                        autoScale: true,
                        fitBounds: true,
                        updateWhenIdle: false
                    }).on("databaseloaded", (e) => {
                        const name = layer.options.name ? layer.options.name : url.split("/").pop().split(".").slice(0, -1).join(".");
                        const value = {
                            "name": name,
                            "mbtiles": data
                        };
                        mapStore.setItem(url, value).then((value) => {
                            addOverlayLayer(layer, name);
                        }).catch((err) => {
                            alert("Error saving data!");
                        });
                    }).addTo(map);
                    layers.overlays[L.Util.stamp(layer)] = layer;
                })
                .catch((error) => {
                    hideLoader();
                    console.error("Error:", error);
                    alert("Error fetching remote file...");
                });
    } else {
        alert("Must be online to fetch data!");
        hideLoader();
    }
}

function updateNetworkStatus() {
    if (navigator.onLine) {
        document.getElementById("status").style.color = "green";
    } else {
        switchBaseLayer("None");
        document.getElementById("status").style.color = "red";
    }
}

// Drag and drop files
const dropArea = document.getElementById("map");

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
    }, false);
});

["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, showLoader, false);
});

["dragleave", "drop"].forEach(eventName => {
    dropArea.addEventListener(eventName, hideLoader, false);
});

dropArea.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    handleFile(file);
}, false);

window.addEventListener("offline", (e) => {
    updateNetworkStatus();
});

window.addEventListener("online", (e) => {
    updateNetworkStatus();
});

document.querySelector(".leaflet-control-layers-base").addEventListener("contextmenu", (e) => {
    e.preventDefault();
    let fileInput = L.DomUtil.create("input", "hidden");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        loadBasemapConfig(file);
        this.value = "";
    }, false);
    fileInput.click();
});

document.addEventListener("DOMContentLoaded", () => {
    showLoader();
    controls.locateCtrl.start();
});

initSqlJs({
    locateFile: function () {
        return "assets/vendor/sqljs-1.8.0/sql-wasm.wasm";
    }
}).then(function (SQL) {
    loadURLparams();
    loadSavedMaps();
    if (localStorage.getItem("basemapConfig")) {
        loadCustomBasemaps(JSON.parse(localStorage.getItem("basemapConfig")));
    }
    if (!navigator.onLine) {
        switchBaseLayer("None");
    } else if (localStorage.getItem("basemap")) {
        switchBaseLayer(localStorage.getItem("basemap"));
    }
    document.getElementsByClassName("leaflet-control-layers")[0].style.maxHeight = `${(document.getElementById("map").offsetHeight * .75)}px`;
    document.getElementsByClassName("leaflet-control-layers")[0].style.maxWidth = `${(document.getElementById("map").offsetWidth * .75)}px`;
});


//reset app code
function resetSW() {
    navigator.serviceWorker
            .getRegistration()
            .then((reg) => {
                return reg.unregister();
            })
            .then(() => {
                navigator.serviceWorker.register('assets/vendor/workbox-6.5.4/workbox-sw.js');
            });
    window.location.reload();
}

const requestWakeLock = async () => {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', (e) => {
            console.log(e);
//            wakeLockCheckbox.checked = false;
//            statusDiv.textContent = 'Wake Lock was released';
            console.log('Wake Lock was released');
        });
//        wakeLockCheckbox.checked = true;
//        statusDiv.textContent = 'Wake Lock is active';
        console.log('Wake Lock is active');
        alert('awake')
    } catch (e) {
//        wakeLockCheckbox.checked = false;
//        statusDiv.textContent = `${e.name}, ${e.message}`;
        console.error(`${e.name}, ${e.message}`);
    }
};
requestWakeLock();
alert('3')
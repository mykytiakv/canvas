$(canvasOptions.bgColor).change(function () {
    canvas.backgroundColor = $(this).val();
    canvas.renderAll();
});


$(canvasOptions.width).change(function() {
    changeCanvasSize();
});

$(canvasOptions.height).change(function() {
    changeCanvasSize();
});

function changeCanvasSize() {
    canvas.setDimensions({
        width: $(canvasOptions.width).val(),
        height: $(canvasOptions.height).val()
    });
}

// change zoom range
function setZoom(newZoomLevel) {
    var canvasHeight = $(canvasOptions.height).val();
    var canvasWidth = $(canvasOptions.width).val();
    zoomLevel = newZoomLevel;
    canvas.setZoom(zoomLevel);

    canvas.setDimensions({
        width: canvasWidth * zoomLevel,
        height: canvasHeight * zoomLevel
    });
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//set change inputs option window
for(var k in optionWindow) {
    $(optionWindow[k]).change(function () {
        changeFigure();
    });
}

for(var k in segmentWindow) {
    $(segmentWindow[k]).change(function () {
        changeSegment();
    });
}

for(var k in arenaWindow) {
    $(arenaWindow[k]).change(function () {
        changeArenaProperty();
    });
}

for(var k in textWindow) {
    $(textWindow[k]).change(function () {
        changeTextProperty();
    });
}

for(var k in addRowWindow) {
    $(addRowWindow[k]).change(function () {
        changeAddRowProperty();
    });
}

for(var k in ellipseWindow) {
    $(ellipseWindow[k]).change(function () {
        changeEllipseProperty();
    });
}

$(addRowWindow.radiusSelect).change(function () {
    var element = canvas.getActiveObject();
    var top = element.getObjects()[0].radius;
    var bottom = element.getObjects()[1].radius;
    $(addRowWindow.radius).val(
        (this.value === 'top') ? top : bottom
    );
});

for(var k in hallWindow) {
    var element;
    if (k === 'skewX') {
        $(hallWindow[k]).change(function () {
            element = canvas.getActiveObject();
            element.set('skewX', parseInt(this.value, 10)).setCoords();
            canvas.requestRenderAll();
        });
    } else if ( k === 'skewY') {
        $(hallWindow[k]).change(function () {
            element = canvas.getActiveObject();
            element.set('skewY', parseInt(this.value, 10)).setCoords();
            canvas.requestRenderAll();
        });
    } else {
        $(hallWindow[k]).change(function () {
            changeHallProperty();
        });
    }
}

for(var k in sceneWindow) {
    if (sceneWindow[k] !== sceneWindow.type) {
        $(sceneWindow[k]).change(function () {
            changeSceneProperty();
        })
    }
}

$(hallWindow.opacity).change(function () {
    var element = canvas.getActiveObject();
    var rect = element._objects[0];

    ($(this).is(':checked'))
        ? rect.set({ fill: 'rgba(0, 0, 0, 0)' })
        : rect.set({ fill: $(hallWindow.color).val() });

    canvas.renderAll();
});

for(var k in enterWindow) {
    if (k === 'type') {
        $(enterWindow[k]).change(function () {
            var objects = canvas.getObjects();
            var lastElem = objects[objects.length - 1];
            canvas.remove(lastElem);
            switch (this.value) {
                case 'enter1' : enter1(); break;
                case 'enter2' : enter2(); break;
                case 'enter3' : enter3(); break;
            }
            openEnterOptions();
        });
    } else {
        $(enterWindow[k]).change(function () {
            changeEnterProperty();
        });
    }
    canvas.renderAll();
}

(function() {
    $('#row-color').val(getRandomColor());
})();


$(sceneWindow.type).change(function () {
    var objects = canvas.getObjects();
    var lastElem = objects[objects.length - 1];
    canvas.remove(lastElem);
    if (this.value === 'ellipse') {
        ellipseScene();
    } else {
        rectangleScene();
    }

    objects = canvas.getObjects();
    lastElem = objects[objects.length - 1];
    canvas.setActiveObject(lastElem);
});
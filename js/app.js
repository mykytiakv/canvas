var figures = {
    arena:          '#arena',
    hall:           '#hall',
    addRow:         '#add-row',
    rectangle:      '#rectangle',
    circle:         '#circle',
    triangle:       '#triangle',
    polygon:        '#polygon',
    line:           '#line',
    polyline:       '#polyline',
    segment:        '#segment',
    text:           '#text',
    ellipse:        '#ellipse',
    scene:          '#scene',
    enter:          '#enter'
};

var windows =  {
    options:        '#element-options',
    segment:        '#segment-options',
    hall:           '#hall-options',
    arena:          '#arena-options',
    additionalRow:  '#add-row-property',
    text:           '#text-options',
    sectorOptions:  '#sector-options',
    ellipseOptions: '#ellipse-options',
    sceneOptions:   '#scene-options',
    place:          '#place-options',
    enter:          '#enter-options'
};

var optionWindow = {
    top:            '#element-top',
    left:           '#element-left',
    height:         '#element-height',
    width:          '#element-width',
    color:          '#color',
    opacity:        '#opacity',
    borderStyle:    '#border-style',
    borderColor:    '#border-color',
    text:           '#text-content',
    textAlign:      '#text-align',
    fontSize:       '#font-size',
    fontFamily:     '#font-family'
};

var segmentWindow = {
    topRadius:      '#top-radius',
    bottomRadius:   '#bottom-radius',
    lineWidth:      '#line-segment-width',
    lineColor:      '#line-segment-color',
    startAngle:     '#start-angle',
    endAngle:       '#end-angle',
    rowsNumber:     '#rows-number',
    places:         '#places',
    placesStep:     '#places-step'
};

var hallWindow = {
    height:         '#hall-height',
    width:          '#hall-width',
    color:          '#hall-color',
    stroke:         '#hall-stroke',
    rows:           '#hall-rows',
    places:         '#hall-places',
    placeType:      '#hall-places-type',
    placeSize:      '#hall-place-size',
    border:         '#hall-border',
    rowPadding:     '#hall-row-padding',
    placePadding:   '#hall-place-padding',
    opacity:        '#hall-opacity',
    skewX:          '#hall-skewx',
    skewY:          '#hall-skewy'
};

var canvasOptions = {
    height:         '#canvas-height',
    width:          '#canvas-width',
    bgColor:        '#back-color',
    range:          '#range'
};

var ellipseWindow = {
    Rx:             '#ellipse-rx',
    Ry:             '#ellipse-ry',
    color:          '#ellipse-color',
    borderColor:    '#ellipse-border-color',
    borderWidth:    '#ellipse-border-width'
};

var sceneWindow = {
    type:           '#scene-type',
    width:          '#scene-width',
    height:         '#scene-height',
    color:          '#scene-color',
    textColor:      '#scene-text-color',
    textValue:      '#scene-text-value',
    textSize:       '#scene-text-size'
};

var placeWindow = {
    color:          '#place-color',
    price:          '#place-price'
};

var enterWindow = {
    type:           '#enter-type',
    color:          '#enter-color'
};

var createFigure = {
    on: false,
    figure: ''
};

var zoomLevel = 1;
var sectorRows;

var HideControls = {
    'tl': false,
    'tr': false,
    'bl': false,
    'br': false,
    'ml': false,
    'mt': false,
    'mr': false,
    'mb': false,
    'mtr': true
};

var shadow = {
    color: 'rgba(0,0,0,0.6)',
    blur: 10,
    offsetX: 5,
    offsetY: 5,
    opacity: 0.6,
    fillShadow: true
};

fabric.Group.prototype.toObject = (function (toObject) {
    return function (properties) {
        return fabric.util.object.extend(toObject.call(this, properties), {
            name: this.name,
            places: this.places,
            sector: this.sector,
            place: this.place,
            row: this.row,
            price: this.price,
            status: this.status
        });
    };
})(fabric.Group.prototype.toObject);

var canvas = new fabric.Canvas('fabric', { selection: false, isDrawingMode: false });
canvas.backgroundColor = $(canvasOptions.bgColor).val();
canvas.renderAll();
canvas.on('mouse:down', function () {
    var element = canvas.getActiveObject();
    if(element) {
        //
        // openOptions(element);
        //
        element.selectable = true;
        element.on({
            'selected'     : function(target) {
                var keyPress = target.e.shiftKey;
                //
                // openOptions(this);
                //
                verifyKey(this);
            },
            'deselected'   : function() {
                $(windows.options).attr('hidden', true);
            }
        });
    }

    canvas.renderAll();
});

$(figures.rectangle).click(function () {
     canvasClick(this, createNewRectangle);
});

$(figures.circle).click(function () {
    canvasClick(this, createNewCircle);
});

$(figures.triangle).click(function () {
    canvasClick(this, createNewTriangle);
});

$(figures.polygon).click(function () {
   canvasClick(this, createNewPolygon);
});

$(figures.segment).click(function () {
   canvasClick(this, createNewSegment);
});

$(figures.text).click(function () {
   canvasClick(this, createNewText);
});

$(figures.arena).click(function () {
    canvasClick(this, createArenaCircles);
});

$(figures.hall).click(function() {
    canvasClick(this, createHall);
});

$(figures.ellipse).click(function() {
    canvasClick(this, createNewEllipse);
});

$(figures.scene).click(function() {
    $(sceneWindow.type).val('ellipse');
    ellipseScene();
});

$(figures.enter).click(function() {
    $(windows.enter).removeAttr('hidden');
    enter1();
    openEnterOptions();
});

function createNewText(posY, posX) {
    var text = new fabric.Text('Text', {
        left: posX,
        top: posY,
        fontFamily: 'Calibri',
        fontSize: 12,
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        hasControls: true,
        hasBorders: true,
        selectable: true,
        width: 100
    });

    text.setControlsVisibility(HideControls);

    text.on({
        'selected'     : function(target) {
            canvas.renderAll();
            $(windows.text).removeAttr('hidden');
            openTextOptions();
        },
        'deselected'   : function() {
            $(windows.text).attr('hidden', true);
        }
    });

    canvas.add(text);
    canvas.renderAll();
}

function createNewSegment(posY, posX) {
    var bottomRadius = 25;
    var topRadius = 65;
    var top = posY;
    var left = posX;
    var startAngle = 0;
    var endAngle = Math.PI;

    var circleBottom = new fabric.Circle({
        left:               left - bottomRadius,
        top:                top - bottomRadius,
        radius:             bottomRadius,
        stroke:             '#000',
        strokeWidth:        1,
        fill:               '',
        startAngle:         startAngle,
        angle:              0,
        endAngle:           endAngle
    });

    var circleTop = new fabric.Circle({
        left:               left - topRadius,
        top:                top - topRadius,
        radius:             topRadius,
        stroke:             '#000',
        strokeWidth:        1,
        fill:               '',
        startAngle:         startAngle,
        angle:              0,
        endAngle:           endAngle
    });

    var centerPointTop = new fabric.Circle({
        left:               posX,
        top:                posY,
        radius:             3,
        fill:               "red",
        originX:            "center",
        originY:            "center",
        hasControls:        false,
        hasBorders:         false,
        selectable:         false
    });

    //Top start point
    var topPoint1  = new fabric.Circle({
        left:               circleTop.radius + getX(circleTop.left, circleTop.radius, startAngle),
        top:                circleTop.radius + getY(circleTop.top, circleTop.radius, startAngle),
        radius:             3,
        fill:               "red",
        originX:            "center",
        originY:            "center",
        hasControls:        false,
        hasBorders:         false,
        selectable:         false
    });

    var topPoint2  = new fabric.Circle({
        left:               circleTop.radius + getX(circleTop.left, circleTop.radius, endAngle),
        top:                circleTop.radius + getY(circleTop.top, circleTop.radius, endAngle),
        radius:             3,
        fill:               "red",
        originX:            "center",
        originY:            "center",
        hasControls:        false,
        hasBorders:         false,
        selectable:         false
    });

    //Bottom start point
    var bottomPoint1  = new fabric.Circle({
        left:               circleBottom.radius + getX(circleBottom.left, circleBottom.radius, startAngle),
        top:                circleBottom.radius + getY(circleBottom.top, circleBottom.radius, startAngle),
        radius:             3,
        fill:               "red",
        originX:            "center",
        originY:            "center",
        hasControls:        false,
        hasBorders:         false,
        selectable:         false
    });

    var bottomPoint2  = new fabric.Circle({
        left:               circleBottom.radius + getX(circleBottom.left, circleBottom.radius, endAngle),
        top:                circleBottom.radius + getY(circleBottom.top, circleBottom.radius, endAngle),
        radius:             3,
        fill:               "red",
        originX:            "center",
        originY:            "center",
        hasControls:        false,
        hasBorders:         false,
        selectable:         false
    });

    var pointsLine1 = [topPoint1.left, topPoint1.top, bottomPoint1.left, bottomPoint1.top];
    var pointsLine2 = [topPoint2.left, topPoint2.top, bottomPoint2.left, bottomPoint2.top];

    var line1 = new fabric.Line(pointsLine1, {
        stroke:             'black',
        strokeWidth:        1
    });

    var line2 = new fabric.Line(pointsLine2, {
        stroke:             'black',
        strokeWidth:        1
    });

    var group = new fabric.Group([ circleTop, circleBottom, line1, line2, centerPointTop, topPoint1, topPoint2,
        bottomPoint1, bottomPoint2 ], {
        left:               left,
        top:                top,
        lockUniScaling:     true,
        fill:               'yellow'
    });

    group.on({
        'selected'     : function(target) {
            var keyPress = target.e.shiftKey;
            verifyKey(this);
            openSegmentOptions(this);
            canvas.renderAll();
        },
        'deselected'   : function() {
            $(windows.segment).attr('hidden', true);
        }
    });

    canvas.add(group);
}

function getX(cx, r, a) {
    return cx + r * Math.cos(a);
}

function getY(cx, r, a) {
    return cx + r * Math.sin(a);
}

Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
};

function openSegmentOptions(elem) {
    $(windows.segment).removeAttr('hidden');
    var bottomCircle = elem.getObjects()[0];
    var topCircle = elem.getObjects()[1];

    $(segmentWindow.topRadius).val(topCircle.radius);
    $(segmentWindow.bottomRadius).val(bottomCircle.radius);
    $(segmentWindow.lineWidth).val(topCircle.strokeWidth);
    $(segmentWindow.lineColor).val(topCircle.stroke);
    $(segmentWindow.startAngle).val(Math.degrees(topCircle.startAngle));
    $(segmentWindow.endAngle).val(Math.degrees(topCircle.endAngle));
}

function changeSegment() {
    var elem = canvas.getActiveObject();
    var bottomCircle = elem.getObjects()[0];
    var topCircle = elem.getObjects()[1];
    var line1 = elem.getObjects()[2];
    var line2 = elem.getObjects()[3];
    var centerPoint = elem.getObjects()[4];
    var topPoint1 = elem.getObjects()[5];
    var topPoint2 = elem.getObjects()[6];
    var bottomPoint1 = elem.getObjects()[7];
    var bottomPoint2 = elem.getObjects()[8];
    // var newPoint = elem.getObjects()[9];

    var topRadius = Number($(segmentWindow.topRadius).val());
    var bottomRadius = Number($(segmentWindow.bottomRadius).val());
    var lineWidth = Number($(segmentWindow.lineWidth).val());
    var lineColor = $(segmentWindow.lineColor).val();
    var startAngle = Math.radians(Number($(segmentWindow.startAngle).val()));
    var endAngle = Math.radians(Number($(segmentWindow.endAngle).val()));

    bottomCircle.set({
        left:           bottomRadius * (-1),
        top:            bottomRadius * (-1),
        radius:         bottomRadius,
        strokeWidth:    lineWidth,
        stroke:         lineColor,
        startAngle:     startAngle,
        endAngle:       endAngle
    });

    topCircle.set({
        left:           topRadius * (-1),
        top:            topRadius * (-1),
        radius:         topRadius,
        strokeWidth:    lineWidth,
        stroke:         lineColor,
        startAngle:     startAngle,
        endAngle:       endAngle
    });

    centerPoint.set({ left: 0, top: 0 });

    topPoint1.set({
        left:           Number(topCircle.radius +
            getX(topCircle.left, topCircle.radius, startAngle)),
        top:            Number(topCircle.radius +
            getY(topCircle.top, topCircle.radius, startAngle))
    });

    topPoint2.set({
        left:           Number(topCircle.radius +
            getX(topCircle.left, topCircle.radius, endAngle)),
        top:            Number(topCircle.radius +
            getY(topCircle.top, topCircle.radius, endAngle))
    });

    bottomPoint1.set({
        left:           Number(bottomCircle.radius +
            getX(bottomCircle.left, bottomCircle.radius, startAngle)),
        top:            Number(bottomCircle.radius +
            getY(bottomCircle.top, bottomCircle.radius, startAngle))
    });

    bottomPoint2.set({
        left:           Number(bottomCircle.radius +
            getX(bottomCircle.left, bottomCircle.radius, endAngle)),
        top:            Number(bottomCircle.radius +
            getY(bottomCircle.top, bottomCircle.radius, endAngle))
    });

    line1.set({
        strokeWidth:    lineWidth,
        stroke:         lineColor,
        x1:             topPoint1.left,
        y1:             topPoint1.top,
        x2:             bottomPoint1.left,
        y2:             bottomPoint1.top
    });


    line2.set({
        strokeWidth:    lineWidth,
        stroke:         lineColor,
        x1:             topPoint2.left,
        y1:             topPoint2.top,
        x2:             bottomPoint2.left,
        y2:             bottomPoint2.top
    });

    canvas.renderAll();
}

function paintedSegment(group, sideWidth, lineWidth, rowsNumber, top, left, topRadius, startAngle, endAngle) {
    if (isNaN(rowsNumber) || rowsNumber <= 0 ) rowsNumber = 1;
    var sectorWidth = sideWidth - lineWidth * 2;
    sectorRows = rowsNumber;
    var step = sectorWidth / sectorRows;
    var radius = topRadius + lineWidth;

    if (rowsNumber > 1) {
        for(var i = 0; i < sectorRows - 1; i++) {
            radius += step;
            var circle = new fabric.Circle({
                left:           left + radius * (-1),
                top:            top + radius * (-1),
                radius:         radius,
                stroke:         '#000',
                strokeWidth:    lineWidth,
                fill:           '',
                startAngle:     startAngle,
                angle:          0,
                endAngle:       endAngle,
                sectorRows:     true
            });

            group.addWithUpdate(circle);
        }
    }
}

function deleteSelectorRows() {
    //first deleting previous rows
    var elem = canvas.getActiveObject();
    var massive = elem._objects;

    for(var i = 0; i < 4; i++) {
        massive.forEach(function(element) {
            if(typeof(element.sectorRows) === typeof(true)) elem.removeWithUpdate(element);
        });
    }

    canvas.renderAll();
}

function deleteSelectorPlaces() {
    //first deleting previous places
    var elem = canvas.getActiveObject();
    var massive = elem._objects;

    for(var i = 0; i < 5; i++) {
        massive.forEach(function(element) {
            if(typeof(element.places) == typeof(true)) elem.removeWithUpdate(element);
        });
    }

    canvas.renderAll();
}

function sendSegment() {
    var elem = canvas.getActiveObject();
    var radiusTop = elem.getObjects()[0].radius;
    var radiusBottom = elem.getObjects()[1].radius;
    var sideWidth = radiusTop - radiusBottom;

    var top = elem.top + elem.height / 2;
    var left = elem.left + elem.width / 2;
    var topRadius = Number($(segmentWindow.topRadius).val());
    var lineWidth = Number($(segmentWindow.lineWidth).val());
    var startAngle = Math.radians(Number($(segmentWindow.startAngle).val()));
    var endAngle = Math.radians(Number($(segmentWindow.endAngle).val()));
    var rowsNumber = Number($(segmentWindow.rowsNumber).val());
    var places = Number($(segmentWindow.places).val());
    var placesStep = Number($(segmentWindow.placesStep).val());

    if(sideWidth < 0) sideWidth *= -1;
    changeSegment();
    deleteSelectorRows();
    deleteSelectorPlaces();
    paintedSegment(elem, sideWidth, lineWidth, rowsNumber, top, left, topRadius, startAngle, endAngle);
    createSectorRows(topRadius, startAngle, endAngle, rowsNumber, places, placesStep);

    $(windows.options).attr('hidden', true);
    canvas
        .discardActiveObject()
        .renderAll();
}

function createSectorRows(radius, startAngle, endAngle, rows, places, placesStep) {
    var elem = canvas.getActiveObject();
    var radiusTop = elem.getObjects()[0].radius;
    var radiusBottom = elem.getObjects()[1].radius;
    var lineWidth = radiusTop - radiusBottom;
    if (lineWidth < 0) lineWidth *= -1;
    var top = elem.top + elem.height / 2 - 3;
    var left = elem.left + elem.width / 2 - 3;
    var koef = endAngle / places;
    var vall = koef / 2;
    var step = lineWidth / rows;
    var placeText, rowText;
    var groupTop, groupLeft, pointLeft, pointTop;

    radius = radius + step / 2;
    for (var j = 0; j < rows; j++) {
        vall = koef / 2;


        for (var i = 0; i < places; i++) {
            pointLeft = Number(radius + getX(left, radius, startAngle + vall));
            pointTop = Number(radius + getY(top, radius, startAngle + vall));
            vall = vall + koef;
            placeText = String(i + 1);
            rowText = String(j + 1);

            groupLeft = pointLeft - radius;
            groupTop = pointTop - radius;

            //add row numbers
            if (i < 1) {
                var rowNum = new fabric.Text(rowText, {
                    left: groupLeft,
                    top: groupTop - 10,
                    fontSize: 8,
                    textAlign: 'left'
                });
                elem.addWithUpdate(rowNum);
            }


            var centerPoint = new fabric.Circle({
                left:           0,
                top:            0,
                radius:         2,
                fill:           "violet",
                originX:        "center",
                originY:        "center",
                hasControls:    false,
                hasBorders:     false,
                selectable:     false,
                ///additional attributes
                places:         true,
                place:          i,
                row:            j,
                price:          '100грн'
                // shadow     : {
                //     color  : 'black',
                //     blur   : 1,
                //     offset : { x: 1, y: 1 }, // Can be a number or an x/y object
                //     opacity: 0.3,
                //     fillShadow  : true, // True by default
                //     strokeShadow: false // False by default
                // }
            });
            var text = new fabric.Text(placeText, {
                fontFamily:     'Calibri',
                fontSize:       4,
                textAlign:      'center',
                originX:        'center',
                originY:        'center'
            });

            var group = new fabric.Group([centerPoint, text],{
                left:           groupLeft,
                top:            groupTop
            });

            elem.addWithUpdate(group);

        }
        radius = radius + step;
        places = places + placesStep;
        koef = endAngle / places;
    }
}


$(figures.polyline).click(function () {
    var points = [];
    if(getFigure(this)) {
        canvas.on('mouse:down', function() {
            var pointer = canvas.getPointer(event.e);
            var posX = pointer.x;
            var posY = pointer.y;
            var el = { x: posX, y: posY };
            points.push(el);
            removeLastObject();
            createNewPolyline(points);
        });
    } else {
        canvas.__eventListeners['mouse:down'] = [];
        points = [];
    }
    addEventListener("keydown", function(e) {
        if (e.keyCode == 13) {
            points = [];
        }
    });
});

$(figures.line).click(function() {
    var line, isDown;
    if(getFigure(this)) {
        canvas.on('mouse:down', function(o){
            isDown = true;
            var pointer = canvas.getPointer(o.e);

            var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
            line = new fabric.Line(points, {
                strokeWidth:        5,
                fill:               'black',
                stroke:             'black',
                originX:            'center',
                originY:            'center',
                selectable:         true,
                centeredScaling:    true
            });

            line.on({
                'selected'     : function(target) {
                    var keyPress = target.e.shiftKey;
                    openOptions(this);
                    verifyKey(this);
                    canvas.renderAll();
                },
                'deselected'   : function() {
                    $(windows.options).attr('hidden', true);
                }
            });
            canvas.add(line);
        });

        canvas.on('mouse:move', function(o){
            if (!isDown) return;
            var pointer = canvas.getPointer(o.e);
            line.set({ x2: pointer.x, y2: pointer.y });
            canvas.renderAll();
        });

        canvas.on('mouse:up', function(o){
            isDown = false;
        });
    } else {
        canvas.__eventListeners["mouse:down"] = [];
        canvas.__eventListeners["mouse:move"] = [];
        canvas.__eventListeners["mouse:up"] = [];
    }
});

function getFigure(element) {
    var id = element.id;
    var figure = createFigure.figure;
    var result, active;

    for(var k in figures) {
        $(figures[k]).removeClass('active');
    }

    if(figure === id) {
        createFigure.on = !createFigure.on;
    } else {
        createFigure.figure = id;
        createFigure.on = true;
    }

    active = createFigure.on;
    figure = createFigure.figure;

    if (active && figure === id) {
        $(element).addClass('active');
        result = true;
    } else {
        $(element).removeClass('active');
        result = false;
    }
    return result;
}

function removeLastObject() {
    var canvas_objects = canvas._objects;
    if(canvas_objects.length !== 0){
        var last = canvas_objects[canvas_objects.length -1]; //Get last object
        canvas.remove(last).renderAll();
    }
}

function canvasClick(button, func) {
    if(getFigure(button)) {
        canvas.on('mouse:down', function() {
            var pointer = canvas.getPointer(event.e);
            var posX = pointer.x;
            var posY = pointer.y;
            func(posY, posX);
        });
    } else {
        canvas.__eventListeners['mouse:down'] = [];
    }
}

function createNewRectangle(posY, posX) {
    var top = posY - 30;
    var left = posX - 30;
    var rect = new fabric.Rect({
        left:               left,
        top:                top,
        fill:               'gray',
        width:              60,
        height:             60,
        selectable:         true,
        centeredScaling:    true,
        stroke:             'black',
        strokeWidth:        1
    });

    var text = new fabric.Text('Text', {
        left:               rect.left + rect.width / 2,
        top:                rect.top + rect.height / 2,
        fontSize:           12,
        textAlign:          'left',
        maxWidth:           rect.width
    });

    text.left -= text.width / 2;
    text.top -= text.height / 2;

    text.hasRotatingPoint = true;

    rect.on({
        'selected'     : function(target) {
            var keyPress = target.e.shiftKey;
            openOptions(this);
            verifyKey(this);
        },
        'deselected'   : function() {
            $(windows.options).attr('hidden', true);
        }
    });


    rect.hasRotatingPoint = true;

    var group = new fabric.Group([ rect, text ], {
        left: left,
        top: top,
        lockUniScaling: true
    });

    group.on({
        'selected'     : function(target) {
            var keyPress = target.e.shiftKey;
            openOptions(this);
            verifyKey(this);
            canvas.renderAll();
        },
        'deselected'   : function() {
            $(windows.options).attr('hidden', true);
        },
        'mouse:over'   : function() {
            console.log('mouse:over');
        },
        'mouse:out'     : function() {
            console.log('mouse:out');
        }
    });

    canvas.add(group);
    return group;
}

function createNewCircle(posY, posX) {
    var top = posY - 30;
    var left = posX - 30;
    var circle = new fabric.Circle({
        left:           left,
        top:            top,
        fill:           'green',
        radius:         30
    });

    circle.on({
        'selected'     : function() {
            openOptions(this);
            verifyKey(this);
            $(windows.options).removeAttr('hidden');
        },
        'deselected'   : function() {
            $(windows.options).attr('hidden', true);
        },
        'mouseover'   : function(e) {
        }
    });

    circle.setShadow(shadow);
    circle.hasRotatingPoint = true;
    canvas.add(circle);
    canvas.renderAll();
}

function createNewTriangle(posY, posX) {
    var top = posY - 15;
    var left = posX - 15;
    var triangle = new fabric.Triangle({
        width:          30,
        height:         35,
        fill:           'blue',
        left:           left,
        top:            top
    });

    triangle.on({
        'selected'     : function() {
            openOptions(this);
            verifyKey(this);
            $(windows.options).removeAttr('hidden');
        },
        'deselected'   : function() {
            $(windows.options).attr('hidden', true);
        }
    });

    triangle.hasRotatingPoint = true;

    canvas.add(triangle);
    canvas.renderAll();
}

function createNewPolyline(points) {
    // var points = [
    //     { x: 10, y: 10 },
    //     { x: 50, y: 30 },
    //     { x: 40, y: 70 },
    //     { x: 60, y: 50 },
    //     { x: 100, y: 150 },
    //     { x: 40, y: 100 }
    // ];

    var polyline = new fabric.Polyline(points, {
        stroke: '#7c7c7c',
        fill: 'none',
        backgroundColor: $(canvasOptions.bgColor).val(),
        left: points[0].x,
        top: points[0].y
    });

    polyline.on({
        'selected'     : function() {
            verifyKey(this);
        }
    });
    canvas.add(polyline);
    canvas.renderAll();
}

function createNewPolygon(posY, posX) {
    var top = posY - 15;
    var left = posX - 15;
    var points = regularPolygonPoints(6,30);
    var polygon = new fabric.Polygon(points, {
        stroke:             'white',
        left:               left,
        top:                top,
        fill:               'gray',
        strokeWidth:        2,
        strokeLineJoin:     'bevil'
    }, false);

    polygon.on({
        'selected'     : function() {
            openOptions(this);
            verifyKey(this);
            $(windows.options).removeAttr('hidden');
        },
        'deselected'   : function() {
            $(windows.options).attr('hidden', true);
        }
    });

    polygon.hasRotatingPoint = true;
    canvas.add(polygon).renderAll();
}

function createNewEllipse(posY, posX) {
    var top = posY - 30;
    var left = posX - 30;
    var ellipse = new fabric.Ellipse({
        top:            top,
        left:           left,
        rx:             75,
        ry:             50,
        fill:           '#00bfff',
        stroke:         'black',
        strokeWidth:    2
    });

    ellipse.on({
        'selected'     : function() {
            // openOptions(this);
            openEllipseOptions(this);
            $(windows.ellipseOptions).removeAttr('hidden');
        },
        'deselected'   : function() {
            $(windows.ellipseOptions).attr('hidden', true);
        },
        'mouseover'   : function(e) {
        }
    });

    ellipse.hasRotatingPoint = true;
    canvas.add(ellipse);
    canvas.renderAll();
}

function regularPolygonPoints(sideCount, radius) {
    var sweep = Math.PI*2 / sideCount;
    var cx = radius;
    var cy = radius;
    var points = [];
    for(var i = 0; i < sideCount; i++) {
        var x = cx + radius * Math.cos(i * sweep);
        var y = cy + radius * Math.sin(i * sweep);
        points.push({ x: x, y: y });
    }
    return(points);
}

//set new values figure
function changeFigure() {
    var elem = canvas.getActiveObject();
    var newLeft = -1 * elem.getObjects()[1].width / 2;
    var newTop = -1 * elem.getObjects()[1].height / 2;
    if (elem._objects !== undefined) {
        elem.getObjects()[1].set({
            text:           $(optionWindow.text).val(),
            textAlign:      $(optionWindow.textAlign).val(),
            fontSize:       $(optionWindow.fontSize).val(),
            fontFamily:     $(optionWindow.fontFamily).val(),
            left:           newLeft,
            top:            newTop
        });

    }

    elem.setOptions({
        top:            Number($(optionWindow.top).val()),
        left:           Number($(optionWindow.left).val()),
        width:          Number($(optionWindow.width).val()),
        height:         Number($(optionWindow.height).val()),
        fill:           $(optionWindow.color).val(),
        opacity:        Number($(optionWindow.opacity).val()),
        strokeWidth:    parseInt($(optionWindow.borderStyle).val()),
        stroke:         $(optionWindow.borderColor).val(),
        scaleX:         1,
        scaleY:         1
    });
    canvas.renderAll();
}

function sendChanges() {
    changeFigure();
    $(windows.options).attr('hidden', true);
    canvas
        .discardActiveObject()
        .renderAll();
}

function verifyKey(elem) {
    addEventListener("keydown", function(e) {
        var newElem;
        if (e.keyCode == 46) {
            deleteObject();
        } else if(e.keyCode == 67 && e.ctrlKey === true) {
            newElem = canvas.getActiveObject();
            newElem.clone(function (o) {
                var vobj = o;
                if (vobj) {
                    vobj.set({
                        left:   newElem.left + 15,
                        top:    newElem.top + 15
                    });
                    canvas.add(vobj);
                    canvas.renderAll();
                    canvas.calcOffset();
                } else {
                    alert("Sorry Object Not Initialized");
                }
            });
        } else {
            //
        }
    });
}

//open options window
function openOptions(elem) {
    $(windows.options).removeAttr('hidden');

    /// заповнюємо поля
    if (elem._objects !== undefined) {
        $(optionWindow.text).val(elem.getObjects()[1].text);
        $(optionWindow.textAlign).val(elem.getObjects()[1].textAlign);
        $(optionWindow.fontSize).val(elem.getObjects()[1].fontSize);
        $(optionWindow.fontFamily).val(elem.getObjects()[1].fontFamily);
        //Times New Roman
    }

    $(optionWindow.top).val((elem.top).toFixed(0));
    $(optionWindow.left).val((elem.left).toFixed(0));
    $(optionWindow.height).val((elem.height * elem.scaleY).toFixed(0));
    $(optionWindow.width).val((elem.width * elem.scaleX).toFixed(0));
    $(optionWindow.color).val(elem.fill);
    $(optionWindow.opacity).val(elem.opacity);
    $(optionWindow.borderStyle).val((elem.strokeWidth * elem.scaleY).toFixed(0));
    $(optionWindow.borderColor).val(elem.stroke);
}

function deleteObject() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) canvas.remove(activeObject);
}

function openEllipseOptions(elem) {
    console.log('ellipse element', elem);
    $(ellipseWindow.Rx).val(elem.rx);
    $(ellipseWindow.Ry).val(elem.ry);
    $(ellipseWindow.color).val(elem.fill);
    $(ellipseWindow.borderColor).val(elem.stroke);
    $(ellipseWindow.borderWidth).val(elem.strokeWidth);
}

function changeEllipseProperty() {
    var elem = canvas.getActiveObject();
    var color = $(ellipseWindow.color).val();
    var rx = Number($(ellipseWindow.Rx).val());
    var ry = Number($(ellipseWindow.Ry).val());
    var borderColor = $(ellipseWindow.borderColor).val();
    var borderWidth = Number($(ellipseWindow.borderWidth).val());

    elem.set({
        ry:             ry,
        rx:             rx,
        fill:           color,
        stroke:         borderColor,
        strokeWidth:    borderWidth
    });

    canvas.renderAll();
}

function saveEllipse() {
    changeEllipseProperty();
    $(windows.ellipseOptions).attr('hidden');
}

function rectangleScene() {
    var width = 70;
    var color = '#2a9000';
    var top = 100, left = 100;
    var rectangle = new fabric.Rect({
        left:               left,
        top:                top,
        fill:               color,
        width:              width * 2,
        height:             width / 1.5,
        selectable:         true,
        centeredScaling:    true
    });
    var text = new fabric.Text('Scene', {
        left: rectangle.left + rectangle.width / 2,
        top: rectangle.top + rectangle.height / 2,
        fontSize: 12,
        textAlign: 'center',
        maxWidth: rectangle.width,
        fill: '#000'
    });

    text.left -= text.width / 2;
    text.top -= text.height / 2;

    var group = new fabric.Group([rectangle, text],{
        left: left,
        top: top
    });

    group.on({
        'selected'     : function() {
            $(windows.sceneOptions).removeAttr('hidden');
            $(windows.options).attr('hidden', true);
            openSceneOptions();
        },
        'deselected'   : function() {
            $(windows.options).attr('hidden', true);
            $(windows.sceneOptions).attr('hidden', true);
        }
    });

    canvas.add(group);
    canvas.renderAll();
}

function ellipseScene() {
    var radius = 50;
    var height = 75;
    var color = '#2a9000';
    var top = 100, left = 100;
    var rectangle = new fabric.Rect({
        left:               left,
        top:                top,
        fill:               color,
        width:              radius * 2,
        height:             height,
        selectable:         true,
        centeredScaling:    true
    });
    var circle = new fabric.Circle({
        left:               left,
        top:                top + (height - radius) - 1,
        fill:               color,
        radius:             radius,
        startAngle:         0,
        endAngle:           Math.PI
    });
    var text = new fabric.Text('Scene', {
        left:               rectangle.left + rectangle.width / 2,
        top:                rectangle.top + rectangle.height / 2,
        fontSize:           12,
        textAlign:          'center',
        maxWidth:           rectangle.width,
        fill:               '#000'
    });

    text.left -= text.width / 2;

    var group = new fabric.Group([rectangle, circle, text],{
        left:               left,
        top:                top
    });

    group.on({
        'selected'     : function() {
            $(windows.sceneOptions).removeAttr('hidden');
            $(windows.options).attr('hidden', true);
            openSceneOptions();
        },
        'deselected'   : function() {
            $(windows.options).attr('hidden', true);
            $(windows.sceneOptions).attr('hidden', true);
        }
    });

    canvas.add(group);
    canvas.renderAll();
}

function openSceneOptions() {
    var type = $(sceneWindow.type).val();
    var obj = canvas.getActiveObject();
    var el = obj.getObjects()[0];
    var text;
    (type === 'ellipse') ? text = obj.getObjects()[2] : text = obj.getObjects()[1];
    console.log('obj', obj);

    $(sceneWindow.width).val(el.width);
    $(sceneWindow.height).val(el.height);
    $(sceneWindow.color).val(el.fill);
    $(sceneWindow.textColor).val(text.fill);
    $(sceneWindow.textValue).val(text.text);
    $(sceneWindow.textSize).val(text.fontSize);
}

function changeSceneProperty() {
    var width = Number($(sceneWindow.width).val());
    var height = Number($(sceneWindow.height).val());
    var color = $(sceneWindow.color).val();
    var textColor = $(sceneWindow.textColor).val();
    var text = $(sceneWindow.textValue).val();
    var textSize = Number($(sceneWindow.textSize).val());

    var type = $(sceneWindow.type).val();
    var obj = canvas.getActiveObject();
    var el, textEl, el2;
    el = obj.getObjects()[0];

    if (type === 'ellipse') {
        el2 = obj.getObjects()[1];
        textEl = obj.getObjects()[2];
        el.set({
            width:      width,
            height:     height,
            fill:       color,
            top:        height / 2 * -1 - width / 4,
            left:       width / 2 * -1
        });
        el2.set({
            fill:       color,
            radius:     width / 2,
            top:        el.top + el.height - width / 2 - 1,
            left:       el.left
        });
        obj.set({ width: width, height: height + width / 2 });
        textEl.set({ fill: textColor, text: text, fontSize: textSize });
        textEl.set({ top: 0 - textEl.height / 2, left: 0 - textEl.width / 2});
    } else {
        textEl = obj.getObjects()[1];
        obj.set({ width: width, height: height });
        el.set({
            width:      width,
            height:     height,
            fill:       color,
            top:        height / 2 * -1,
            left:       width / 2 * -1
        });

        textEl.set({ fill: textColor, text: text, fontSize: textSize });
        textEl.set({ top: 0 - textEl.height / 2, left: 0 - textEl.width / 2});
    }

    canvas.renderAll();
}

function sendScene() {
    changeSceneProperty();
    $(windows.sceneOptions).attr('hidden', true);
}

function removePlace() {
    var place = canvas.getActiveObject();
    var placeInfo = {
        place:  place.place,
        row:    place.row,
        sector: place.sector
    };
    canvas.remove(place);
    changeAllPlaces(placeInfo);
}

function showPlaceInfo() {
    var place = canvas.getActiveObject();
    $(placeWindow.color).val(place.getObjects()[0].fill);
    $(placeWindow.price).val(place.price);
    $(windows.place).removeAttr('hidden');
}

function changePlace() {
    var color = $(placeWindow.color).val();
    var price = $(placeWindow.price).val();
    var place = canvas.getActiveObject();
    var objs = place.getObjects();

    place.set({ price: price });
    for (var i = 0; i < objs.length; i++) {
        if (objs[i].type !== 'text') {
            objs[i].set({ fill: color });
        }
    }
    canvas.renderAll();
    $(windows.place).attr('hidden', true);
}

function changeAllPlaces(placeInfo) {
    var objs = canvas.getObjects();
    var places = [], placeNum, placeObjs;
    for (var i = 0; i < objs.length; i++) {
        if (typeof (objs[i].places) === typeof(true)) {
            if(objs[i].row === placeInfo.row && objs[i].sector === placeInfo.sector) {
                places.push(objs[i]);
            }
        }
    }

    for (var j = 0; j < places.length; j++) {
        placeNum = places[j].place;
        placeObjs = places[j].getObjects();
        if (placeNum > placeInfo.place) {
            placeNum--;
            places[j].set({ place: placeNum });
            for (var k = 0; k < placeObjs.length; k++) {
                if (placeObjs[k].type === 'text') {
                    placeObjs[k].set({ text: String(placeNum) });
                }
            }
        }
    }
    canvas.renderAll();
}

function clonePlace() {
    var obj = canvas.getActiveObject();
    var objInfo = {
        place: obj.place,
        row: obj.row,
        sector: obj.sector
    };
    var newNum = getBiggestPlace(objInfo);
    obj.clone(function(cloned) {
        _clipboard = cloned;
    });

    _clipboard.clone(function(clonedObj) {
        canvas.discardActiveObject();
        clonedObj.set({
            left:           clonedObj.left + 10,
            top:            clonedObj.top + 10,
            hasControls:    false,
            hoverCursor:    'pointer',
            place:          newNum
        });
        clonedObj.on({
            'selected'     : function() {
                $(windows.place).removeAttr('hidden');
                showPlaceInfo();
            },
            'deselected'   : function() {
                $(windows.place).attr('hidden', true);
            }
        });
        canvas.add(clonedObj);
        _clipboard.top += 10;
        _clipboard.left += 10;
        var cloneObjs = clonedObj.getObjects();
        for (var i = 0; i < cloneObjs.length; i++) {
            if ( cloneObjs[i].type === 'text' ) {
                cloneObjs[i].set({ text: String(newNum) })
            }
        }
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
    });
}

function getBiggestPlace(placeInfo) {
    var objs = canvas.getObjects();
    var places = [];
    var biggestNum = 1;
    for (var i = 0; i < objs.length; i++) {
        if (typeof(objs[i].places) === typeof(true)) {
            if(objs[i].row === placeInfo.row && objs[i].sector === placeInfo.sector) {
                places.push(objs[i]);
            }
        }
    }
    for (var j = 0; j < places.length; j++) {
        if (biggestNum < places[j].place) biggestNum = places[j].place;
    }

    biggestNum++;
    return biggestNum;
}

function enter3() {
    var points = [
        { x: 0,     y: 25 },
        { x: 70,    y: 25 },
        { x: 70,    y: 0 },
        { x: 110,   y: 50 },
        { x: 70,    y: 100 },
        { x: 70,    y: 75 },
        { x: 0,     y: 75 }
    ];

    var polygon = new fabric.Polygon(points, {
        left:           50,
        top:            0,
        fill:           '#48a04a',
        stroke:         'black',
        strokeWidth:    1,
        selectable:     true,
        objectCaching:  false
    });
    polygon.on({
        'selected'     : function() {
            $(windows.enter).removeAttr('hidden');
        },
        'deselected'   : function() {
            $(windows.enter).attr('hidden', true);
        }
    });
    canvas.add(polygon);
    canvas.setActiveObject(polygon);
    canvas.renderAll();
}

function enter2() {
    var points = [
        { x: 0,     y: 50 },
        { x: 75,    y: 50 },
        { x: 75,    y: 30 },
        { x: 50,    y: 30 },
        { x: 100,   y: 0 },
        { x: 150,   y: 30 },
        { x: 125,   y: 30 },
        { x: 125,   y: 50 },
        { x: 200,   y: 50 },
        { x: 200,   y: 150 },
        { x: 125,   y: 150 },
        { x: 125,   y: 170 },
        { x: 150,   y: 170 },
        { x: 100,   y: 200 },
        { x: 50,    y: 170 },
        { x: 75,    y: 170 },
        { x: 75,    y: 150 },
        { x: 0,     y: 150 }
    ];

    var polygon = new fabric.Polygon(points, {
        left:           50,
        top:            0,
        fill:           '#48a04a',
        stroke:         'black',
        strokeWidth:    1,
        selectable:     true,
        objectCaching:  false
    });

    polygon.on({
        'selected'     : function() {
            $(windows.enter).removeAttr('hidden');
        },
        'deselected'   : function() {
            $(windows.enter).attr('hidden', true);
        }
    });

    canvas.add(polygon);
    canvas.setActiveObject(polygon);
    canvas.renderAll();
}

function enter1() {
    var points = [
        { x: 0,     y: 25 },
        { x: 70,    y: 25 },
        { x: 70,    y: 75 },
        { x: 0,     y: 75 }
    ];

    var poly = new fabric.Polyline(points, {
        stroke:         'black',
        strokeWidth:    2,
        fill:           'rgba(0, 0, 0, 0)',
        left:           100,
        top:            100
    });

    poly.on({
        'selected'     : function() {
            $(windows.enter).removeAttr('hidden');
        },
        'deselected'   : function() {
            $(windows.enter).attr('hidden', true);
        }
    });

    canvas.add(poly);
    canvas.setActiveObject(poly);
    canvas.renderAll();
}

function openEnterOptions() {
    var type = $(enterWindow.type).val();
    var obj = canvas.getActiveObject();

    if (type === 'enter1') {
        $(enterWindow.color).val(obj.stroke);
    } else {
        $(enterWindow.color).val(obj.fill);
    }
}

function changeEnterProperty() {
    var element = canvas.getActiveObject();
    var color = $(enterWindow.color).val();
    if (element.type === 'polyline') {
        element.set({ stroke: color });
    } else {
        element.set({ fill: color });
    }
    canvas.renderAll();
}

function sendEnter() {
    changeEnterProperty();
    $(windows.enter).attr('hidden', true);

    canvas.discardActiveObject();
    canvas.renderAll();
}
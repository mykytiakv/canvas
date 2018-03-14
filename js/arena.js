var arenaWindow = {
    topRadius:      '#arena-top-radius',
    bottomRadius:   '#arena-bottom-radius',
    topColor:       '#arena-top-color',
    bottomColor:    '#arena-bottom-color',
    lineWidth:      '#line-arena-width',
    lineColor:      '#line-arena-color',
    arenaSectors:   '#arena-sectors',
    numberOfInputs: '#input-num'
};

var textWindow = {
    textValue:      '#text-value',
    textStyle:      '#text-style',
    textSize:       '#text-size',
    textColor:      '#text-color',
    labelWidth:     '#label-width',
    labelHeight:    '#label-height',
    textJustify:    '#text-justify'
};

var addRowWindow = {
    radiusSelect:   '#add-row-select',
    radius:         '#add-row-radius',
    places:         '#add-row-places',
    sectors:        '#add-row-sectors',
    startAngle:     '#add-row-start',
    endAngle:       '#add-row-end',
    removeCircle:   '#add-row-remove'
};

var sectorOptionsWindow = {
    currentSector:  '#current-sector',
    sectorsNum:     '#sectors-num',
    rowsNum:        '#rows-num',
    places:         '#places-num',
    step:           '#step-inc',
    rowNumber:      '#row-number',
    rowPrice:       '#row-price',
    rowColor:       '#row-color'
};

var mainBottomRadius, mainTopRadius, mainStep, mainSectorNum = 0;
var placeRadius = 5;
var lastSectorNum = 0;

function createArenaCircles(top, left) {
    var circleTop = new fabric.Circle({
        left: left,
        top: top,
        // fill: '#7f5893',
        fill: getRandomColor(), //set random color
        radius: 170,
        strokeWidth: 2,
        stroke: 'black'
    });

    var circleBottom = new fabric.Circle({
        left: left,
        top: top,
        // fill: '#8bb1bd',
        fill: canvas.backgroundColor,
        radius: 50,
        strokeWidth: 2,
        stroke: 'black'
    });

    circleBottom.left = circleBottom.radius * (-1);
    circleBottom.top = circleBottom.radius * (-1);

    circleTop.left = circleTop.radius * (-1);
    circleTop.top = circleTop.radius * (-1);

    var centerPoint = new fabric.Circle({
        left: left,
        top: top,
        fill: 'black',
        radius: 2
    });

    centerPoint.left = circleTop.left + circleTop.radius - centerPoint.radius / 2;
    centerPoint.top = circleTop.top + circleTop.radius - centerPoint.radius / 2;


    var group = new fabric.Group([circleTop, circleBottom, centerPoint],{
        left: left,
        top: top
    });

    group.on({
        'selected'     : function() {
            $(windows.arena).removeAttr('hidden');
            openArenaOptions();
        },
        'deselected'   : function() {
            $(windows.arena).attr('hidden', true);
            $(windows.sectorOptions).attr('hidden', true)
        },
        'mouseover'   : function(e) {

        }
    });

    group.hasRotatingPoint = true;
    group.setControlsVisibility(HideControls);
    canvas.add(group);
    canvas.renderAll();
}

function openArenaOptions() {
    var elem = canvas.getActiveObject();
    var circleTop = elem.getObjects()[0];
    var circleBottom = elem.getObjects()[1];
    $(arenaWindow.topRadius).val(circleTop.radius);
    $(arenaWindow.topColor).val(circleTop.fill);
    $(arenaWindow.bottomRadius).val(circleBottom.radius);
    $(arenaWindow.bottomColor).val(circleBottom.fill);
    $(arenaWindow.lineWidth).val(circleTop.strokeWidth);
    $(arenaWindow.lineColor).val(circleTop.stroke);
}

function changeArenaProperty() {
    var elem = canvas.getActiveObject();
    var circleTop = elem.getObjects()[0];
    var circleBottom = elem.getObjects()[1];
    var centerPoint = elem.getObjects()[2];

    var topRadius = Number($(arenaWindow.topRadius).val());
    var bottomRadius = Number($(arenaWindow.bottomRadius).val());
    var stroke = $(arenaWindow.lineColor).val();
    var strokeWidth = Number($(arenaWindow.lineWidth).val());
    var topColor = $(arenaWindow.topColor).val();
    var bottomColor = $(arenaWindow.bottomColor).val();

    elem.set({
        height:         topRadius * 2 + strokeWidth,
        width:          topRadius * 2 + strokeWidth
    });

    circleTop.set({
        radius:         topRadius,
        left:           topRadius * (-1),
        top:            topRadius * (-1),
        stroke:         stroke,
        strokeWidth:    strokeWidth,
        fill:           topColor
    });

    circleBottom.set({
        radius:         bottomRadius,
        left:           bottomRadius * (-1),
        top:            bottomRadius * (-1),
        stroke:         stroke,
        strokeWidth:    strokeWidth,
        fill:           bottomColor
    });

    centerPoint.set({
        left:           circleTop.left + circleTop.radius - centerPoint.radius / 2,
        top:            circleTop.top + circleTop.radius - centerPoint.radius / 2
    });

    canvas.renderAll();
}

function createInputOutput() {
    var elem = canvas.getActiveObject();
    var circleTop = elem.getObjects()[0];
    var circleBottom = elem.getObjects()[1];
    var color = circleTop.fill;
    var start = 105;
    var end = 75;
    var input  = 30;
    var inputsNum = Number($(arenaWindow.numberOfInputs).val());

    mainBottomRadius = circleBottom.radius;
    mainTopRadius = circleTop.radius;

    if(inputsNum === 1) {
        createSegment(elem, circleTop, circleBottom, Math.radians(start) * (-1),
            Math.radians(end) * (-1), 'input', color);
    } else if (inputsNum === 2){
        createSegment(elem, circleTop, circleBottom, Math.radians(start) * (-1),
            Math.radians(end) * (-1), 'input', color);
        createSegment(elem, circleTop, circleBottom, Math.radians(start + 180) * (-1),
            Math.radians(end + 180) * (-1), 'input', color);
    } else {
        createSegment(elem, circleTop, circleBottom, Math.radians(start) * (-1),
            Math.radians(end) * (-1), 'input', color);
        createSegment(elem, circleTop, circleBottom, Math.radians(start + 235) * (-1),
            Math.radians(end + 240) * (-1), 'input', color);
        createSegment(elem, circleTop, circleBottom, Math.radians(start + 120) * (-1),
            Math.radians(end + 125) * (-1), 'input', color);
    }
}

function createSegment(group, circleTop, circleBottom, startAngle, endAngle, name, color) {
    var strokeWidth = circleBottom.strokeWidth;
    var segmentBottom = new fabric.Circle({
        left: circleBottom.left,
        top: circleBottom.top,
        radius: circleBottom.radius,
        stroke: color,
        strokeWidth: strokeWidth,
        fill: '',
        startAngle: startAngle,
        angle: 0,
        endAngle: endAngle
    });

    var segmentTop = new fabric.Circle({
        left: circleTop.left,
        top: circleTop.top,
        radius: circleTop.radius,
        stroke: color,
        strokeWidth: strokeWidth,
        fill: '',
        startAngle: startAngle,
        angle: 0,
        endAngle: endAngle
    });

    //Top start point
    var topPoint1  = new fabric.Circle({
        left: circleTop.radius + getX(segmentTop.left, segmentTop.radius, startAngle), //cx + r * cos(a)
        top: circleTop.radius + getY(segmentTop.top, segmentTop.radius, startAngle), //cy + r * sin(a)
        radius: 3,
        fill: "red",
        originX: "center",
        originY: "center",
        hasControls: false,
        hasBorders: false,
        selectable: false
    });

    var topPoint2  = new fabric.Circle({
        left: circleTop.radius + getX(segmentTop.left, segmentTop.radius, endAngle), //cx + r * cos(a)
        top: circleTop.radius + getY(segmentTop.top, segmentTop.radius, endAngle), //cy + r * sin(a)
        radius: 3,
        fill: "red",
        originX: "center",
        originY: "center",
        hasControls: false,
        hasBorders: false,
        selectable: false
    });

    //Bottom start point
    var bottomPoint1  = new fabric.Circle({
        left: circleBottom.radius + getX(segmentBottom.left, segmentBottom.radius, startAngle),
        top: circleBottom.radius + getY(segmentBottom.top, segmentBottom.radius, startAngle),
        radius: 3,
        fill: "red",
        originX: "center",
        originY: "center",
        hasControls: false,
        hasBorders: false,
        selectable: false
    });

    var bottomPoint2  = new fabric.Circle({
        left: circleBottom.radius + getX(segmentBottom.left, segmentBottom.radius, endAngle),
        top: circleBottom.radius + getY(segmentBottom.top, segmentBottom.radius, endAngle),
        radius: 3,
        fill: "red",
        originX: "center",
        originY: "center",
        hasControls: false,
        hasBorders: false,
        selectable: false
    });

    var pointsLine1 = [topPoint1.left, topPoint1.top, bottomPoint1.left, bottomPoint1.top];
    var pointsLine2 = [topPoint2.left, topPoint2.top, bottomPoint2.left, bottomPoint2.top];

    var line1 = new fabric.Line(pointsLine1, {
        stroke: color,
        strokeWidth: strokeWidth
    });

    var line2 = new fabric.Line(pointsLine2, {
        stroke: color,
        strokeWidth: strokeWidth
    });

    var group2 = new fabric.Group([ segmentBottom, segmentTop,
        // topPoint1, topPoint2, bottomPoint1, bottomPoint2,
        line1, line2 ], {
        left: circleTop.left,
        top: circleTop.top,
        lockUniScaling: true,
        fill: '',
        name: name
    });

    group.add(group2);
    canvas.renderAll();

}

function createSectors() {
    var elem = canvas.getActiveObject();
    var circleTop = elem.getObjects()[0];
    var circleBottom = elem.getObjects()[1];
    var color = circleTop.stroke;
    var start, end;
    var angle, someCircle;
    var coordinates = [];
    var elements = elem.getObjects();
    for(var element in elements) {
        var el = elements[element];
        if(el.name === 'input') {
            someCircle = el.getObjects()[0];
            angle = {
                startAngle: someCircle.startAngle,
                endAngle: someCircle.endAngle
            };
            coordinates.push(angle);
        }
    }

    for(var i = 0; i < coordinates.length; i++) {
        if (coordinates.length - i === 1) {
            end = coordinates[0].startAngle;
            start = coordinates[i].endAngle;
        } else {
            end = coordinates[i + 1].startAngle;
            start = coordinates[i].endAngle;
        }

        createSegment(elem, circleTop, circleBottom, start, end, 'sector', color);
    }
}

function rows() {
    var elem = canvas.getActiveObject();
    var circleTop = elem.getObjects()[0];
    var circleBottom = elem.getObjects()[1];
    var start, end;
    var elements = elem.getObjects();

    var rowsNumber = Number($(sectorOptionsWindow.rowsNum).val());
    var places = Number($(sectorOptionsWindow.places).val());
    var step = Number($(sectorOptionsWindow.step).val());
    var sectorsNumber = Number($(sectorOptionsWindow.sectorsNum).val());
    var inputNum = Number($(arenaWindow.numberOfInputs).val());
    var sideWidth = circleTop.radius - circleBottom.radius;
    var lineWidth = circleTop.strokeWidth;
    var bottomRadius = circleBottom.radius;
    var sectorCircle, rowArray;

    //перевіряємо кожен об'єкт активного елементу
    var back = function () {
        var result;
        var sectors = [];
        for(var element in elements) {
            var el = elements[element];
            // перевіряємо чи об'єкт є сектором та не прорисованим раніше
            if(el.name === 'sector' && !el.draw) {
                sectors.push(el);
                sectorCircle = el.getObjects()[0];
                // отримуємо start and end angles
                start = sectorCircle.startAngle;
                end = sectorCircle.endAngle;



                //create Sectors малювання секторів
                //видалення ліній
                // paintSectors(el, sideWidth, lineWidth, rowsNumber, bottomRadius, start, end);
                //


                //отримуємо інформацію про елемент: номер рядка, ціна, колір
                rowArray = getSectorRowValues();
                //create Rows малювання мість
                paintRows(el, start, end, rowsNumber, sectorsNumber, places, step, rowArray);

                mainSectorNum++; //добавляємо значення сектору (поточний сектор++)
                result = true;

                // цикл перевірки чи поточний сектор є останнім
                if(mainSectorNum === inputNum) {
                    result = false;
                    mainSectorNum = 0;
                }
                el.set({ draw: true }); // задаємо значення що елемент уже прорисований
                break; // вихід з циклу без пошуку наступного сектору
            }
            result = false;
        }
        return result;
    };

    var backRes = back();
    canvas.renderAll();
    return backRes;
}

function paintSectors(group, sideWidth, lineWidth, rowsNumber, bottomRadius, startAngle, endAngle) {
    if (isNaN(rowsNumber) || rowsNumber <= 0 ) rowsNumber = 1;
    var sectorWidth = sideWidth - lineWidth * 2;
    var step = sectorWidth / rowsNumber;
    var radius = bottomRadius + lineWidth;

    if (rowsNumber > 1) {
        for(var i = 0; i < rowsNumber - 1; i++) {
            radius += step;
            var sector = new fabric.Circle({
                left: radius * (-1),
                top: radius * (-1),
                radius: radius,
                stroke: '#000',
                strokeWidth: lineWidth,
                fill: '',
                startAngle: startAngle,
                angle: 0,
                endAngle: endAngle,
                sectorRows: true
            });

            group.add(sector);
        }
    }
    canvas.renderAll();
}

function paintRows(element, startAngle, endAngle, rows, sectors, places, placesStep, rowInfo) {
    var elem = canvas.getActiveObject();
    var radiusTop = elem.getObjects()[0].radius;
    var radiusBottom = elem.getObjects()[1].radius;
    var centerPoint = elem.getObjects()[2];
    var newPlace, degrees, placeInfo;
    var color, price, pl = places;

    var lineWidth = radiusTop - radiusBottom;
    if (lineWidth < 0) lineWidth *= -1;

    if (startAngle > endAngle) {
        degrees = Math.radians(360) - Math.abs(Math.abs(Math.abs(startAngle) - Math.abs(endAngle)));
    } else {
        degrees = Math.abs(Math.abs(Math.abs(startAngle) - Math.abs(endAngle)));
    }

    degrees = degrees / sectors;

    var offset = degrees / places; // градус зміщення в сторону місця
    var placeInRowStep = offset / 2; // ??
    var step = lineWidth / rows; // крок у висоту для переходу на наступний рядок
    var top, left, pointLeft, pointTop;
    var radius = radiusBottom; // радіус першого кола
    var numbT, numbL, textDegrees;

    mainStep = step;
    placeRadius = step / 3;
    radius = radius + step / 2; // перевизначення першого радіусу, збільшення кола для
    // малювання першого ряду
    top = 0; // позиція топ
    left = 0; // позиція лефт
    //цикл для малювання рядків

    for (var s = 0; s < sectors; s++) {
        radius = radiusBottom + step / 2; // змінюємо початковий радіус для малювання місць
        places = pl;
        // offset = degrees / places;
        offset = degrees / (places + sectors - 1);

        for (var j = 0; j < rows; j++) {
            placeInRowStep = offset / 2; // ??//

            // отримуємо інформацію про місце (колір і ціну місця)
            color = rowInfo[j].color;
            price = rowInfo[j].price;
            //цикл для малювання місць
            for (var i = 0; i < places; i++) {
                pointLeft = getX(left - 2, radius, startAngle + placeInRowStep); //визначаємо лефт місця
                pointTop = getY(top - 2, radius, startAngle + placeInRowStep); //визначаємо топ місця
                placeInRowStep += offset; // зміщуємо місце в сторону

                //перевіряємо чи останній сектор та останнє місце і малюємо номер рядка
                if (sectors - s !== 1 && places - i === 1) {
                    // numbT = getY(top, radius, startAngle + placeInRowStep) + placeRadius / 2;
                    // numbL = getX(left, radius, startAngle + placeInRowStep) + placeRadius / 2;
                    // numbT = getY(top, radius, startAngle + placeInRowStep);
                    // numbL = getX(left, radius, startAngle + placeInRowStep);
                    // console.log('startAngle', startAngle);
                    if (Math.abs(Math.degrees(startAngle)) < 180) {
                        numbT = getY(top, radius, startAngle + placeInRowStep) + placeRadius / 2;
                        numbL = getX(left, radius, startAngle + placeInRowStep);
                    } else {
                        numbT = getY(top, radius, startAngle + placeInRowStep) - placeRadius;
                        numbL = getX(left, radius, startAngle + placeInRowStep);
                    }
                    textDegrees = Math.degrees(90 + (startAngle + placeInRowStep / 2));
                    var rowNum2 = createRowNum(numbT, numbL, textDegrees, j+1);
                    elem.add(rowNum2);
                }

                // визначаємо позицію місця та малюємо його
                pointTop -= centerPoint.radius;
                pointLeft -= centerPoint.radius;

                placeInfo = {
                    color: color,
                    sector: s + 1 + lastSectorNum,
                    row: j + 1,
                    place: i + 1,
                    price: price
                };

                newPlace = createPlaceCircle(pointTop, pointLeft, placeInfo, placeRadius);
                elem.add(newPlace);
                canvas.renderAll();
            }

            radius = radius + step; //збільшуємо радіус розміщення місць
            // (переходимо до наступного рядку)
            places = places + placesStep; // добавляємо кількість посадочних місць якщо необхідно
            // offset = degrees / places;
            offset = degrees / (places + sectors - 1);
        }

        if (sectors - s === 1) lastSectorNum += ++s;

        // startAngle += degrees;
        startAngle += degrees + offset;

    }

    canvas.renderAll();
}

function createRowNum(top, left, angle, num) {
    var rowNum = new fabric.Text(String(num), {
        top: top,
        left: left,
        fontFamily: 'Calibri',
        fontSize: 8,
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        angle: angle
    });
        // rowNum.set({
        //     top: rowNum.top + rowNum.width
        // });
    return rowNum;
}

function paintAddRows(element, radius, startAngle, endAngle, sectors, places, position, sectorInfo) {
    var elem = canvas.getActiveObject();
    var centerPoint = elem.getObjects()[2];
    var degrees, newPlace;
    var top, left, pointLeft, pointTop;
    var offset, placeInRowStep;// градус зміщення в сторону місця
    var placeInfo = {};
    if (startAngle > endAngle) {
        degrees = Math.radians(360) - Math.abs(Math.abs(Math.abs(startAngle) - Math.abs(endAngle)));
    } else {
        degrees = Math.abs(Math.abs(Math.abs(startAngle) - Math.abs(endAngle)));
    }

    top = 0; left = 0;
    degrees = degrees / sectors;
    offset = degrees / places; // градус зміщення в сторону місця
    (position === 'top') ? radius = radius + 5 : radius = radius - 5;

    //цикл для малювання рядка
    for (var s = 0; s < sectors; s++) {
        placeInRowStep = offset / 2;

        //цикл для малювання місць
        for (var i = 0; i < places; i++) {
            pointLeft = getX(left, radius, startAngle + placeInRowStep); //визначаємо лефт місця
            pointTop = getY(top, radius, startAngle + placeInRowStep); //визначаємо топ місця
            placeInRowStep += offset; //зміщуємо місце в сторону

            pointTop -= centerPoint.radius;
            pointLeft -= centerPoint.radius;
            placeInfo = {
                color: sectorInfo[s].color,
                sector: s,
                row: 1,
                place: i + 1,
                price: sectorInfo[s].price
            };

            newPlace = createPlaceCircle(pointTop, pointLeft, placeInfo, placeRadius);
            element.add(newPlace);
        }

        startAngle += degrees;
    }

    canvas.renderAll();
}

function createPlaceCircle(top, left, placeInfo, radius) {
    var smallCircleShadow = {
        color: 'rgba(0,0,0,0.6)',
        blur: 0.7,
        offsetX: 0.7,
        offsetY: 0.7,
        opacity: 0.6,
        fillShadow: true
    };

    var centerPoint = new fabric.Circle({
        // radius: step / 4,
        radius: radius,
        fill: placeInfo.color,
        originX: "center",
        originY: "center",
        hasControls: false,
        hasBorders: false,
        selectable: false,
        stroke: 'blacks',
        strokeWidth: 0.5

    });

    // centerPoint.setShadow(smallCircleShadow);
    var text = new fabric.Text(String(placeInfo.place), {
        fontFamily: 'Calibri',
        fontSize: radius * 1.2,
        textAlign: 'center',
        originX: 'center',
        originY: 'center'
    });

    var group = new fabric.Group([centerPoint, text],{
        left: left - radius / 2,
        top: top - radius / 2,
        name: 'place',
        hoverCursor: 'pointer',
        ///additional attributes
        places: true,
        sector: placeInfo.sector,
        place: placeInfo.place,
        row: placeInfo.row,
        price: placeInfo.price,
        status: 'free'
    });

    group.on({
        'selected'     : function() {
            $(windows.place).removeAttr('hidden');
            showPlaceInfo();
        },
        'deselected'   : function() {
            $(windows.place).attr('hidden', true);
        }
    });

    return group;
}

function sendArena() {
    changeArenaProperty();
    createInputOutput();
    createSectors();
    $(windows.arena).attr('hidden', true);
    $(windows.sectorOptions).removeAttr('hidden');
    $(sectorOptionsWindow.currentSector).val('1').attr('disabled', true);

}

function openTextOptions() {
    var element = canvas.getActiveObject();
    $(textWindow.textValue).val(element.text);
    $(textWindow.textStyle).val(element.fontFamily);
    $(textWindow.textSize).val(element.fontSize);
    $(textWindow.textColor).val(element.fill);
    $(textWindow.labelHeight).val();
    $(textWindow.labelHeight).val();
    $(textWindow.textJustify).val();
}

function changeTextProperty() {
    var element = canvas.getActiveObject();
    element.set({
        text:           $(textWindow.textValue).val(),
        fontFamily:     $(textWindow.textStyle).val(),
        fontSize:       $(textWindow.textSize).val(),
        fill:           $(textWindow.textColor).val()
    });
    canvas.renderAll();
}

function openAddRowWindow() {
    var element = canvas.getActiveObject();
    var topCircle = element.getObjects()[0];
    var top = topCircle.radius;
    var bottom = element.getObjects()[1].radius;
    var centerPoint = element.getObjects()[2];
    var pTop = centerPoint.top + centerPoint.radius / 2;
    var pLeft = centerPoint.left + centerPoint.radius / 2;
    var radius = 170;

    var circle = $(addRowWindow.radiusSelect).val();
    (circle === 'top')
        ? $(addRowWindow.radius).val(top)
        : $(addRowWindow.radius).val(bottom);

    $(addRowWindow.startAngle).val(Math.degrees(topCircle.startAngle));
    $(addRowWindow.endAngle).val(Math.degrees(topCircle.endAngle));

    var transCircle = createTransrapentCircle(pTop, pLeft, radius);
    element.add(transCircle);
    canvas.renderAll();
}

function changeAddRowProperty() {
    var parent = canvas.getActiveObject();
    var object = parent.getObjects()[parent.getObjects().length - 1];
    var radius = Number($(addRowWindow.radius).val());
    var startAngle = Math.radians(Number($(addRowWindow.startAngle).val()));
    var endAngle = Math.radians(Number($(addRowWindow.endAngle).val()));

    object.set({
        top:            radius * (-1),
        left:           radius * (-1),
        radius:         radius,
        startAngle:     startAngle,
        endAngle:       endAngle,
        dirty:          true
    });

    if(object.width > parent.width) parent.width = object.width;
    if(object.height > parent.height) parent.height = object.height;

    canvas.renderAll();
}

function addNewRow() {
    $(windows.additionalRow).attr('hidden', true);

    var element = canvas.getActiveObject();
    var startAngle = Math.radians($(addRowWindow.startAngle).val());
    var endAngle = Math.radians($(addRowWindow.endAngle).val());
    var sectors = $(addRowWindow.sectors).val();
    var places = $(addRowWindow.places).val();
    var radius = Number($(addRowWindow.radius).val());
    var position = $(addRowWindow.radiusSelect).val();
    var remove = $(addRowWindow.removeCircle).is(":checked");
    var last = element.getObjects();
    var transparentCircle = last[last.length - 1];
    var lineWidth = $(arenaWindow.lineWidth).val();
    var sectorInfo;

    if (remove) {
        element.remove(transparentCircle);
        canvas.remove(transparentCircle);
    } else {
        if (lineWidth > 1) lineWidth -= 1;
        transparentCircle.set({ strokeWidth: lineWidth });
    }
    canvas.renderAll();
    sectorInfo = getAddSectorValues();
    paintAddRows(element, radius, startAngle, endAngle, sectors, places, position, sectorInfo);
}

function createTransrapentCircle(top, left, radius) {
    var transparentCircle = new fabric.Circle({
        top: top - radius,
        left: left - radius,
        radius: radius,
        stroke: 'black',
        strokeWidth: 1,
        fill: 'rgba(0,0,0,0)'
    });

    return transparentCircle;
}

function createCurrentSector() {
    var sectorNum = Number($(sectorOptionsWindow.currentSector).val());
    var res = rows();

    sectorNum++;
    $(sectorOptionsWindow.currentSector).val(sectorNum);
    $(windows.sectorOptions).attr('hidden', true);

    if (res) {
        setTimeout(function() {
            $(windows.sectorOptions).removeAttr('hidden');
        }, 1000);
    } else {
        $(windows.arena).removeAttr('hidden');
    }
}

$(sectorOptionsWindow.rowsNum).change(function() {
    var parent = '#sector-options';
    var button = '.sector-button';
    var sector = '.sector.elem-size';
    $(parent).find(sector).empty();
    $(parent).find(sector).remove();
    $(parent).find(button).empty();
    $(parent).find(button).remove();
    var inputs = Number(this.value);
    for(var i = 1; i <= inputs; i++) {
        $('<div class="sector elem-size"><div>' +
            '<label for="row-' + i + '-number">Row Number</label>' +
            '<input id="row-' + i + '-number" type="number" min="1" value="'+i+'" disabled></div>' +
            '<div>' +
            '<label for="row-' + i + '-price">Place Price</label>' +
            '<input id="row-' + i + '-price"></div>' +
            '<div>' +
            '<label for="row-' + i + '-color">Place Color</label>' +
            '<input id="row-' + i + '-color" type="color" value="' + getRandomColor() + '">' +
            '</div></div>')
            .appendTo(parent);
    }
    $('<div class="sector-button"><button id="row-click" class="btn btn-primary"' +
        'onclick="createCurrentSector();">Create Sector</button></div>').appendTo(parent);
});


$(addRowWindow.sectors).change(function() {
    var parent = '#add-row-property';
    var button = '.sector-button';
    var sector = '.sector.elem-size';
    $(parent).find(sector).empty();
    $(parent).find(sector).remove();
    $(parent).find(button).empty();
    $(parent).find(button).remove();
    var sectors = Number(this.value);
    for(var i = 1; i <= sectors; i++) {
        $('<div class="sector elem-size"><div>' +
            '<label for="sector-' + i + '-number">Sector Number</label>' +
            '<input id="sector-' + i + '-number" type="number" min="1" value="'+i+'" disabled>' +
            '<label for="sector-' + i + '-row">Row Number</label>' +
            '<input id="sector-' + i + '-row" type="number" min="1"></div>'+
            '<div>' +
            '<label for="sector-' + i + '-price">Sector Price</label>' +
            '<input id="sector-' + i + '-price">' +
            '<label for="sector-' + i + '-color">Sector Color</label>' +
            '<input id="sector-' + i + '-color" type="color" value="' + getRandomColor() + '">' +
            '</div></div>')
            .appendTo(parent);
    }
    $('<div class="sector-button"><button id="row-click" class="btn btn-primary"' +
        'onclick="addNewRow();">Add Sector</button>').appendTo(parent);
});

function getSectorRowValues() {
    var data = [];
    var row, price, color;
    var rowsNum = $(sectorOptionsWindow.rowsNum).val();
    for(var i = 1; i <= rowsNum; i++) {
        row = $('#row-' + i + '-number').val();
        price = $('#row-' + i + '-price').val();
        color = $('#row-' + i + '-color').val();
        data.push({
            row: row,
            price: price,
            color: color
        });
    }

    return data;
}

function getAddSectorValues() {
    var data = [];
    var row = 'next', sector, price, color;
    var sectorNum = $(addRowWindow.sectors).val();
    for(var i = 1; i <= sectorNum; i++) {
        sector = $('#sector-' + i + '-number').val();
        row = $('#sector' + i + '-row').val();
        price = $('#sector-' + i + '-price').val();
        color = $('#sector-' + i + '-color').val();
        data.push({
            sector: sector,
            row: row,
            price: price,
            color: color
        });
    }

    return data;
}

function getHallPlacesValues() {
    var data = [];
    var row, price, color;
    var rowsNum = $(hallWindow.rows).val();
    for(var i = 1; i <= rowsNum; i++) {
        row = Number($('#hallrow-' + i + '-number').val());
        price = $('#hallrow-' + i + '-price').val();
        color = $('#hallrow-' + i + '-color').val();
        data.push({
            row: row,
            price: price,
            color: color
        });
    }

    return data;
}
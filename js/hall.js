function createHall(top, left) {
    var rectangle = new fabric.Rect({
        left: 0,
        top: 0,
        fill: getRandomColor(),
        width: 150,
        height: 200,
        stroke: 'black',
        strokeWidth: 1
    });

    var hallRectangle = new fabric.Group([rectangle],{
        left: left,
        top: top,
        name: 'place'
    });

    hallRectangle.on({
        'selected'     : function() {
            $(windows.hall).removeAttr('hidden');
            openHallOptions();
        },
        'deselected'   : function() {
            $(windows.hall).attr('hidden', true);

        },
        'mouseover'   : function(e) {

        }
    });

    hallRectangle.hasRotatingPoint = true;
    hallRectangle.setControlsVisibility(HideControls);
    canvas.add(hallRectangle);
    canvas.renderAll();
}

function openHallOptions() {
    var parent = canvas.getActiveObject();
    var element = parent.getObjects()[0];
    $(hallWindow.width).val(element.width);
    $(hallWindow.height).val(element.height);
    $(hallWindow.color).val(element.fill);
    $(hallWindow.stroke).val(element.strokeWidth);
}

function changeHallProperty() {
    var parent = canvas.getActiveObject();
    var element = parent.getObjects()[0];
    var width = Number($(hallWindow.width).val());
    var height = Number($(hallWindow.height).val());
    var color = $(hallWindow.color).val();
    var stroke = Number($(hallWindow.stroke).val());

    if (!$(hallWindow.border).is(':checked')) stroke = 0;
    if ($(hallWindow.opacity).is(':checked')) color = 'rgba(0, 0, 0, 0)';

    element.set({
        width:          width,
        height:         height,
        left:           width / 2 * (-1) - stroke,
        top:            height / 2 * (-1) - stroke,
        fill:           color,
        strokeWidth:    stroke
    });

    parent.set({
        width:          width + stroke * 2,
        height:         height + stroke * 2
    });

    canvas.renderAll();
}

function addHallPlaces() {
    var element = canvas.getActiveObject();
    var hallPlace = element._objects[0];
    var rows = Number($(hallWindow.rows).val());
    var places = Number($(hallWindow.places).val());
    var placeInfo, place, figureStyle;
    var top, left, newWidth, newHeight;
    var placeStyle = $(hallWindow.placeType).val();
    var placeSize = Number($(hallWindow.placeSize).val());
    var placePadding = Number($(hallWindow.placePadding).val());
    var rowPadding = Number($(hallWindow.rowPadding).val());
    var stepBtwPlaces = placeSize * 2 + Number($(hallWindow.placePadding).val());
    var stepBtwRows = placeSize * 2 + Number($(hallWindow.rowPadding).val());
    var hallInfo = getHallPlacesValues();

    switch (placeStyle) {
        case 'circle':
            figureStyle = createPlaceCircle;
            break;
        case 'rectangle':
            figureStyle = createPlaceRectangle;
            break;
        case 'place-model':
            figureStyle = createPlaceModel;
            break;
        default:
            figureStyle = createPlaceCircle;
            break;
    }

    newWidth = (places + 2) * (placePadding + placeSize * 2);
    newHeight = (rows + 1) * (rowPadding + placeSize * 2);

    element.set({
        height:     newHeight,
        width:      newWidth
    });

    hallPlace.set({
        height:     newHeight,
        width:      newWidth,
        top:        element.height / 2 * (-1) - hallPlace.strokeWidth,
        left:       element.width / 2 * (-1) - hallPlace.strokeWidth
    });

    left = element.width / 2 * (-1);
    top = element.height / 2 * (-1) + stepBtwRows / 2;

    for (var i = 0; i < rows; i++) {
        left += stepBtwPlaces / 2; /// - place width / 2!!!! for circle and rect
        for (var j = 0; j < places; j++) {
            if (j === 0) {
                var rowNum = new fabric.Text(String(i + 1), {
                    fontFamily: 'Calibri',
                    fontSize: placeSize * 2,
                    textAlign: 'center',
                    originX: 'center',
                    originY: 'center',
                    top: top + stepBtwRows / 3,
                    left: left
                });
                element.add(rowNum);
                left += stepBtwPlaces / 2;
            }
            placeInfo = {
                color: hallInfo[i].color,
                sector: 1,
                row: hallInfo[i].row,
                place: j + 1,
                price: hallInfo[i].price
            };

            place = figureStyle(top, left, placeInfo, placeSize);
            left += stepBtwPlaces;
            element.add(place);
            if (places - j === 1) {
                var rowText = new fabric.Text(String(i + 1), {
                    fontFamily: 'Calibri',
                    fontSize: placeSize * 2,
                    textAlign: 'center',
                    originX: 'center',
                    originY: 'center',
                    top: top + stepBtwRows / 3,
                    left: left
                });
                rowText.set({ left: rowText.left + rowText.width / 2 });
                element.add(rowText);
            }
        }
        left = element.width / 2 * (-1);
        top += stepBtwRows;
    }

    canvas.renderAll();

    $(windows.hall).attr('hidden', true);
}

$(hallWindow.rows).change(function() {
    var parent = '#hall-options';
    $(parent).find('.sector.elem-size').empty();
    $(parent).find('.sector.elem-size').remove();
    $(parent).find('.sector-button').empty();
    $(parent).find('.sector-button').remove();
    var rows = Number(this.value);
    for(var i = 1; i <= rows; i++) {
        $('<div class="sector elem-size"><div>\n' +
            '<label for="hallrow-'+i+'-number">Row Number</label>\n' +
            '<input id="hallrow-'+i+'-number" type="number" min="1" value="'+i+'" disabled></div>\n' +
            '<div><label for="hallrow-'+i+'-price">Place Price</label>\n' +
            '<input id="hallrow-'+i+'-price"></div>\n' +
            '<div><label for="hallrow-'+i+'-color">Place Color</label>\n' +
            '<input id="hallrow-'+i+'-color" type="color" value="' + getRandomColor() + '"></div>\n' +
            '</div>').appendTo(parent);
    }

    $('<div class="sector-button"><button id="add-hall" class="btn btn-primary" ' +
        'onclick="addHallPlaces()">Apply</button>').appendTo(parent);
});

function createPlaceModel(top, left, placeInfo, size) {
    var koef = 3;
    size = size * 2;
    var topFigure = new fabric.Rect({
        left: 0,
        top: 0,
        fill: placeInfo.color,
        width: size,
        height: size * 1.2,
        rx: size / koef,
        ry: size / koef,
        stroke: 'black',
        strokeWidth: 0.5
    });

    var bottomFigure = new fabric.Rect({
        left: -1 * (size * 1.5 - size) / 2,
        top: topFigure.height - topFigure.ry,
        width: size * 1.5,
        height: size / 2,
        fill: placeInfo.color,
        ry: size / koef,
        rx: size / koef,
        stroke: 'black',
        strokeWidth: 0.5
    });

    var text = new fabric.Text(String(placeInfo.place), {
        fontFamily: 'Calibri',
        fontSize: size / 1.5,
        textAlign: 'center',
        originX: 'center',
        originY: 'center'
    });

    var placeModel = new fabric.Group([topFigure, bottomFigure, text],{
        left: left,
        top: top,
        name: 'place',
        hoverCursor: 'pointer',
        places: true,
        sector: placeInfo.sector,
        place: placeInfo.place,
        row: placeInfo.row,
        price: placeInfo.price,
        status: 'free'
    });

    placeModel.on({
        'selected'     : function() {
            $(windows.place).removeAttr('hidden');
            showPlaceInfo();
        },
        'deselected'   : function() {
            $(windows.place).attr('hidden', true);
        }
    });

    var textElement = placeModel.getObjects()[2];
    textElement.set({
        top: 0,
        left: 0
    });

    return placeModel;
}

function createPlaceRectangle(top, left, placeInfo, size) {
    size *= 2;
    var rectangle = new fabric.Rect({
        left: 0,
        top: 0,
        fill: placeInfo.color,
        width: size,
        height: size,
        stroke: 'black',
        strokeWidth: 0.5
    });
    var text = new fabric.Text(String(placeInfo.place), {
        fontFamily: 'Calibri',
        fontSize: size / 2 * 1.2,
        textAlign: 'center',
        originX: 'center',
        originY: 'center'
    });
    var placeModel = new fabric.Group([rectangle, text],{
        left: left,
        top: top,
        name: 'place',
        hoverCursor: 'pointer',
        places: true,
        sector: placeInfo.sector,
        place: placeInfo.place,
        row: placeInfo.row,
        price: placeInfo.price,
        status: 'free'
    });
    var textElement = placeModel.getObjects()[1];
    textElement.set({
        top:        textElement.width / 4,
        left:       textElement.width / 4
    });

    placeModel.on({
        'selected'     : function() {
            $(windows.place).removeAttr('hidden');
            showPlaceInfo();
        },
        'deselected'   : function() {
            $(windows.place).attr('hidden', true);
        }
    });

    return placeModel;
}
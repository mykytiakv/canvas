var canvas = new fabric.Canvas('fabric', {
    selection:      false,
    isDrawingMode:  false,
    hoverCursor:    'default'
});

var canvasOptions = {
    height:         '#canvas-height',
    width:          '#canvas-width',
    bgColor:        '#back-color',
    range:          '#range'
};

var main = {
    openJSON:       '#openJSON',
    unGroup:        '#ungroup',
    ticket:         '.ticket',
    tickets:        '#tickets',
    ticketForm:     '.tickets-sidebar',
    ticketRemove:   '.ticket-remove',
    buyTicket:      '#tickets-buy'
};

var zoom = {
    level:          0,
    levelMin:       -0.5,
    levelMax:       2
};

var priceTable = [];
var priceTableDiv = '#price-table';

//JSON loader
var jsonLoader = document.getElementById('jsonLoader');
jsonLoader.addEventListener('change', handleJson, false);

$(main.openJSON).click(function () {
    $('#jsonLoader').click();
    return false;
});

$(main.unGroup).click(function () {
    unGroupElement();
});

$('#fabric-container').hover(
    function() {
        $( window ).off( "scroll" );
    },
    function() {
        $(window).on("scroll")
    }
);



function unGroupElement() {
    var activeObject = canvas.getActiveObject();
    if (activeObject.type === "group") {
        var items = activeObject._objects;
        alert(items);
        activeObject._restoreObjectsState();
        canvas.remove(activeObject);
        for (var i = 0; i < items.length; i++) {
            var elem = items[i];
            canvas.add(elem);
            if (elem.name === "sector") {
                var arrayObjects = elem._objects;
                elem._restoreObjectsState();
                canvas.remove(elem);
                for (var e = 0; e < arrayObjects.length; e++) {
                    canvas.add(arrayObjects[e]);
                    arrayObjects[e].selectable = false;
                    arrayObjects[e].hasControls = false;
                }
            } else {
                items[i].selectable = false;
                items[i].hasControls = false;
            }
        }
    }
    canvas.renderAll();
    setZoom(1.5);
    getAllColors();
}

function setZoom(newZoomLevel) {
    var canvasHeight = canvas.height;
    var canvasWidth = canvas.width;
    canvas.setZoom(newZoomLevel);
    canvas.setDimensions({
        width: canvasWidth * newZoomLevel,
        height: canvasHeight * newZoomLevel
    });
}

function handleJson(e) {
    var files = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = reader.result;
        canvas.loadFromJSON(JSON.parse(contents), function () {
            canvas.renderAll();
        });
        canvas.renderAll();
    };
    reader.readAsText(files);
}

(function () {
    var oldColor;
    var panning = false;
    canvas.on('mouse:over', function (e) {
        var message;
        var element = e.target;
        var elementObjs;

        if (e.target !== null) {
            if (typeof(element.places) === typeof(true) &&
                element.status === 'free') {
                elementObjs = element.getObjects();
                oldColor = elementObjs[0].fill;
                var data = {
                    sector: element.sector,
                    place: element.place,
                    row: element.row,
                    price: element.price,
                    color: oldColor
                };
                canvas.set({ hoverCursor: 'pointer' });
                for (var i = 0; i < elementObjs.length; i++) {
                    if (elementObjs[i].type !== 'text') {
                        elementObjs[i].set({
                            hoverCursor: 'pointer',
                            fill: shadeColor(oldColor, -13)
                        });
                    }
                }

                var rectangle = new fabric.Rect({
                    left: element.left + 30,
                    top: element.top + 5,
                    fill: 'rgba(0,0,0,0.6)',
                    rx: 3,
                    ry: 3
                });

                if (typeof(element.sector) === "number") {
                    message = 'Sector: ' + element.sector + '\nPlace: ' + element.place +
                        '\nRow: ' + element.row + '\nPrice: ' + element.price + '\n';
                    rectangle.set({
                        'width': 50,
                        'height': 40
                    })
                } else {
                    message = 'Place: ' + element.place + '\nRow: ' + element.row +
                        '\nPrice: ' + element.price + '\n';
                    rectangle.set({
                        'width': 50,
                        'height': 30
                    })
                }

                element.on('mousedown', function () {
                    panning = false;
                    $(main.ticketForm).removeClass('hidden');
                    alert(message);
                    for (var i = 0; i < elementObjs.length; i++) {
                        if (elementObjs[i].type !== 'text') {
                            elementObjs[i].set({ fill: '#dddddd' });
                        }
                    }
                    element.set({ status: 'reserve' });
                    createNewTicket(data);
                });

                var text = new fabric.Text(message, {
                    left: rectangle.left + 5,
                    top: rectangle.top + 5,
                    fontSize: 6,
                    textAlign: 'left',
                    fill: 'white'
                });

                var group = new fabric.Group([rectangle, text], {
                    left: element.left + 15,
                    top: element.top + 15,
                    lockUniScaling: true,
                    style: 'info-message'
                });
                canvas.add(group);
                canvas.renderAll();
            } else if (typeof(element.places) === typeof(true) &&
                element.status === 'reserve') {
                canvas.set({ hoverCursor: 'default' });
                element.__eventListeners['mousedown'] = [];
                element.__eventListeners['mouse:over'] = [];
            } else if (typeof(element.places) === typeof(true) &&
                element.status === 'sold') {
                canvas.set({ hoverCursor: 'default' });
                element.__eventListeners['mousedown'] = [];
                element.__eventListeners['mouse:over'] = [];
            }
        }
    });

    canvas.on('mouse:out', function (e) {
        var element = e.target;
        var lastElem;
        var elementObjs;
        if (e.target !== null) {
            if (typeof(element.places) === typeof(true) &&
                (element.status) === 'free') {
                elementObjs = element.getObjects();
                lastElem = canvas.getObjects();
                canvas.set('hoverCursor', 'default');
                if (elementObjs[0].fill !== '#dddddd') {
                    for (var i = 0; i < elementObjs.length; i++) {
                        if (elementObjs[i].type !== 'text') {
                            elementObjs[i].set({ fill: oldColor });
                        } else {
                            elementObjs[i].set({ fill: 'black' });
                        }
                    }
                }
                if (lastElem[lastElem.length - 1].style === 'info-message') {
                    canvas.remove(lastElem[lastElem.length - 1]);
                }
                canvas.renderAll();
                element.__eventListeners['mousedown'] = [];
            } else if (typeof(element.places) === typeof(true) &&
                (element.status) === 'reserve') {
                lastElem = canvas.getObjects();
                if (lastElem[lastElem.length - 1].style === 'info-message') {
                    canvas.remove(lastElem[lastElem.length - 1]);
                }
                canvas.renderAll();
            }
        }
    });

    canvas.on('mouse:wheel', function(options) {
        var delta = options.e.wheelDelta;
        if (delta !== 0) {
            var pointer = canvas.getPointer(options.e, true);
            var point = new fabric.Point(pointer.x, pointer.y);
            if (delta > 0) {
                zoomIn(point);
            } else if (delta < 0) {
                zoomOut(point);
            }
        }
    });


    canvas.on('mouse:up', function (e) {
        panning = false;
    });

    canvas.on('mouse:down', function (e) {
        panning = true;
    });
    canvas.on('mouse:move', function (e) {
        if (panning && e && e.e) {
            var units = 10;
            var delta = new fabric.Point(e.e.movementX, e.e.movementY);
            canvas.relativePan(delta);
        }
    });



})();

function zoomIn(point) {
    if (zoom.level < zoom.levelMax) {
        zoom.level += 0.2;
        canvas.zoomToPoint(point, Math.pow(2, zoom.level));
        keepPositionInBounds(canvas);
    }
}

function zoomOut(point) {
    if (zoom.level > zoom.levelMin) {
        zoom.level -= 0.2;
        canvas.zoomToPoint(point, Math.pow(2, zoom.level));
        keepPositionInBounds(canvas);
    }
}

function keepPositionInBounds() {
    var width = canvas.getWidth();
    var height = canvas.getHeight();
    var zoom = canvas.getZoom();
    var xMin = (2 - zoom) * width / 2;
    var xMax = zoom * width / 2;
    var yMin = (2 - zoom) * height / 2;
    var yMax = zoom * height / 2;

    var point = new fabric.Point(width / 2, height / 2);
    var center = fabric.util.transformPoint(point, canvas.viewportTransform);

    var clampedCenterX = clamp(center.x, xMin, xMax);
    var clampedCenterY = clamp(center.y, yMin, yMax);

    var diffX = clampedCenterX - center.x;
    var diffY = clampedCenterY - center.y;

    if (diffX !== 0 || diffY !== 0) {
        canvas.relativePan(new fabric.Point(diffX, diffY));
    }
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

function shadeColor(color, percent) {  // deprecated. See below.
    var num = parseInt(color.slice(1), 16);
    var amt = Math.round(2.55 * percent);
    var R = (num >> 16) + amt;
    var G = (num >> 8 & 0x00FF) + amt;
    var B = (num & 0x0000FF) + amt;
    return "#" +
        (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) *
        0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) *
        0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

var removeCallback = function (e) {
    var tickets;
    e.preventDefault();
    $(e.currentTarget).parent().remove();
    findBrokenPlace($(e.currentTarget).data('place'));
    tickets = $(main.tickets).find(main.ticketRemove);
    if (tickets.length === 0) {
        setTimeout(function () {
            $(main.ticketForm).addClass('hidden');
        }, 250);
    }
};

$(main.ticketRemove).click(removeCallback);

$(main.buyTicket).click(function() {
    var data, elemObjs;
    var allObj = canvas.getObjects();
    var allElem = $(main.tickets).find(main.ticketRemove);
    for (var i = 0; i < allElem.length; i++) {
        data = $(allElem[i]).data('place').split(',');
        for(var k in allObj) {
            if(typeof(allObj[k].places) === typeof(true)) {
                if(allObj[k].sector === Number(data[0])
                    && allObj[k].row === Number(data[1])
                    && allObj[k].place === Number(data[2])) {
                    elemObjs = allObj[k].getObjects();
                    allObj[k].set({ status: 'sold' });
                    for (var j = 0; j < elemObjs.length; j++) {
                        elemObjs[j].set({ fill: 'white' });
                        elemObjs[j].set({ fill: 'white' });
                    }
                }
            }
        }
    }

    alert('You buy ' + i + 'tickets!');
    $(main.ticketForm).addClass('hidden');
    $(main.tickets).find('.ticket').remove();
});


function createNewTicket(data) {
    var ticket = $('<div class="ticket" style="border-left-color: ' + data.color + '">' +
        '<div class="ticket-main"><div>Сектор</div><p>' + data.sector + '</p></div>' +
        '<div class="ticket-main"><div>Ряд</div><p>' + data.row + '</p></div>' +
        '<div class="ticket-main"><div>Місце</div><p>' + data.place + '</p></div>' +
        '<div class="ticket-main"><div>Ціна</div><p>' + data.price + '</p></div>' +
        '<div class="ticket-remove" data-place="' +
        [data.sector, data.row, data.place, data.color].join(',') +
        '">&times;</div></div>');
    ticket.appendTo($(main.tickets));
    ticket.find(main.ticketRemove).click(removeCallback);
}

function findBrokenPlace(data) {
    var newData = data.split(',');
    var allObj = canvas.getObjects();
    var elemObjs;
    for(var k in allObj) {
        if(typeof(allObj[k].places) === typeof(true)) {
            if(allObj[k].sector === Number(newData[0])
                && allObj[k].row === Number(newData[1])
                && allObj[k].place === Number(newData[2])) {
                elemObjs = allObj[k].getObjects();
                allObj[k].set({status: 'free'});
                for (var i = 0; i < elemObjs.length; i++) {
                    if(elemObjs[i].type !== 'text') {
                        elemObjs[i].set({fill: newData[3]});
                    }
                }
            }
        }
    }
    canvas.renderAll();
}

function getAllColors() {
    var objects = canvas.getObjects();
    var color, price;
    for (var i = 0; i < objects.length; i++) {
        if (typeof(objects[i].places) === typeof(true)) {
            color = objects[i].getObjects()[0].fill;
            price = objects[i].price;
            if (!colorReview(priceTable, color)) {
                priceTable.push({
                    color: color,
                    price: price
                });
            }
        }
    }
    createPlaceTable(priceTable, priceTableDiv);
}

function colorReview(array, color) {
    var result;
    for (var i in array) {
        if (array[i].color === color) {
            result = true;
            break;
        } else {
            result = false;
        }
    }
    return result;
}

function createPlaceTable(array, div) {
    $(div).removeAttr('hidden');
    var content = '';
    $(div).html(content);
    content += '<div><label><span class="color" style="background-color: #ffffff">' +
        '</span>Sold</label></div>';
    content += '<div><label><span class="color" style="background-color: #dddddd">' +
        '</span>Reserved</label></div>';
    for (var i in array) {
        content += '<div><label><span class="color" style="background-color: ' + array[i].color +
            '"></span>' + array[i].price + '</label></div>';
    }
    $(content).appendTo($(div));
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}
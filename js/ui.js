$('#saveJSON').click(function() {
    // var json = JSON.stringify(canvas.toJSON());
    var json = JSON.stringify(canvas);
    var blob = new Blob([json], {type: "application/json"});
    saveAs(blob, 'canvas.json');
});

$('#openJSON').click(function() {
    $('#jsonLoader').click();
    return false;
});

$('#clearCanvas').click(function() {
    canvas.clear();
});

$('#openImage').click(function() {
    $('#imageLoader').click();
    return false;
});

$('#add-row').click(function() {
    $(windows.arena).attr('hidden', true);
    $(windows.additionalRow).removeAttr('hidden');
    openAddRowWindow();
});

$('#ungroup').click(function () {
    var activeObject = canvas.getActiveObject();
    if(activeObject.type === "group"){
        var items = activeObject._objects;
        alert(items);
        activeObject._restoreObjectsState();
        canvas.remove(activeObject);
        for(var i = 0; i < items.length; i++) {
            var elem = items[i];
            canvas.add(elem);
            // console.log(items[i].type, items[i]);
            if (elem.name === "place") {
                items[i].selectable = true;
                items[i].hasControls = false;
            } else if (elem.name === "sector") {
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
    alert('All objects are added!');
    canvas.renderAll();
});

//JSON loader
var jsonLoader = document.getElementById('jsonLoader');
jsonLoader.addEventListener('change', handleJson, false);

function handleJson(e) {
    var files = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = reader.result;
        console.log(contents);
        canvas.loadFromJSON(JSON.parse(contents), function() {
            canvas.renderAll();
        });
        canvas.renderAll();
    };

    reader.readAsText(files);
}

//image load
var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);

function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
            var imgInstance = new fabric.Image(img, {
                scaleX: 0.3,
                scaleY: 0.3
            });
            canvas.add(imgInstance);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
}


///text formatted

function wrapCanvasText(t, canvas, maxW, maxH, justify) {

    if (typeof maxH === "undefined") {
        maxH = 0;
    }
    var words = t.text.split(" ");
    var formatted = '';

    // This works only with monospace fonts
    justify = justify || 'left';

    // clear newlines
    var sansBreaks = t.text.replace(/(\r\n|\n|\r)/gm, "");
    // calc line height
    var lineHeight = new fabric.Text(sansBreaks, {
        fontFamily: t.fontFamily,
        fontSize: t.fontSize
    }).height;

    // adjust for vertical offset
    var maxHAdjusted = maxH > 0 ? maxH - lineHeight : 0;
    var context = canvas.getContext("2d");


    context.font = t.fontSize + "px " + t.fontFamily;
    var currentLine = '';
    var breakLineCount = 0;

    n = 0;
    while (n < words.length) {
        var isNewLine = currentLine == "";
        var testOverlap = currentLine + ' ' + words[n];

        // are we over width?
        var w = context.measureText(testOverlap).width;

        if (w < maxW) { // if not, keep adding words
            if (currentLine != '') currentLine += ' ';
            currentLine += words[n];
            // formatted += words[n] + ' ';
        } else {

            // if this hits, we got a word that need to be hypenated
            if (isNewLine) {
                var wordOverlap = "";

                // test word length until its over maxW
                for (var i = 0; i < words[n].length; ++i) {

                    wordOverlap += words[n].charAt(i);
                    var withHypeh = wordOverlap + "-";

                    if (context.measureText(withHypeh).width >= maxW) {
                        // add hyphen when splitting a word
                        withHypeh = wordOverlap.substr(0, wordOverlap.length - 2) + "-";
                        // update current word with remainder
                        words[n] = words[n].substr(wordOverlap.length - 1, words[n].length);
                        formatted += withHypeh; // add hypenated word
                        break;
                    }
                }
            }
            while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
                currentLine = ' ' + currentLine;

            while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
                currentLine = ' ' + currentLine + ' ';

            formatted += currentLine + '\n';
            breakLineCount++;
            currentLine = "";

            continue; // restart cycle
        }
        if (maxHAdjusted > 0 && (breakLineCount * lineHeight) > maxHAdjusted) {
            // add ... at the end indicating text was cutoff
            formatted = formatted.substr(0, formatted.length - 3) + "...\n";
            currentLine = "";
            break;
        }
        n++;
    }

    if (currentLine != '') {
        while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
            currentLine = ' ' + currentLine;

        while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
            currentLine = ' ' + currentLine + ' ';

        formatted += currentLine + '\n';
        breakLineCount++;
        currentLine = "";
    }

    // get rid of empy newline at the end
    formatted = formatted.substr(0, formatted.length - 1);

    var ret = new fabric.Text(formatted, { // return new text-wrapped text obj
        left: t.left,
        top: t.top,
        fill: t.fill,
        fontFamily: t.fontFamily,
        fontSize: t.fontSize,
        originX: t.originX,
        originY: t.originY,
        angle: t.angle
    });
    return ret;
}


$('#marker').click(function() {
    var radius = 50;
    var height = 75;
    var color = 'yellow';
    var top = 100, left = 100;
    var rectangle = new fabric.Rect({
        left: left,
        top: top,
        fill: color,
        width: radius * 2,
        height: height,
        selectable: true,
        centeredScaling: true
        // stroke: 'black',
        // strokeWidth: 1
    });
    var circle = new fabric.Circle({
        left: left,
        top: top + (height - radius),
        fill: color,
        radius: radius
    });
    var text = new fabric.Text('Text', {
        left: rectangle.left + rectangle.width / 2,
        top: rectangle.top + rectangle.height / 2,
        fontSize: 12,
        textAlign: 'center',
        maxWidth: rectangle.width
    });

    text.left -= text.width / 2;

    var group = new fabric.Group([rectangle, circle, text],{
        left: left,
        top: top
    });

    canvas.add(group);
    canvas.renderAll();

});
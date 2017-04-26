var issues = _
    .chain(data.issues)
    .map(function(o) {
        var start = o.start_date || o.created_on;
        var end = o.due_date;
        return {id: o.id, group: o.assigned_to.id, content: o.subject, start: start, end: end};
    })
    .value();

// create a data set with groups
var names = _
    .chain(data.issues)
    .groupBy('assigned_to.name')
    .value();

var groups = new vis.DataSet();

_.forEach(names, function(value, key) {
    groups.add({id: value[0].assigned_to.id, content: key})
})

// create a dataset with items
var items = new vis.DataSet(issues);

// create a timeline with some data
var container = document.getElementById('visualization');
// specify options
var options = {
  stack: true,
  // verticalScroll: true,
  horizontalScroll: true,
  zoomKey: 'ctrlKey',
  maxHeight: 400,
  start: new Date(),
  end: new Date(1000*60*60*24*30 + (new Date()).valueOf()),
};
var timeline = new vis.Timeline(container);
timeline.setOptions(options);
timeline.setGroups(groups);
timeline.setItems(items);

/**
 * Move the timeline a given percentage to left or right
 * @param {Number} percentage   For example 0.1 (left) or -0.1 (right)
 */
function move (percentage) {
    var range = timeline.getWindow();
    var interval = range.end - range.start;

    timeline.setWindow({
        start: range.start.valueOf() - interval * percentage,
        end:   range.end.valueOf()   - interval * percentage
    });
}

// attach events to the navigation buttons
document.getElementById('zoomIn').onclick    = function () { timeline.zoomIn( 0.5); };
document.getElementById('zoomOut').onclick   = function () { timeline.zoomOut( 0.5); };
document.getElementById('moveLeft').onclick  = function () { move( 0.5); };
document.getElementById('moveRight').onclick = function () { move(-0.5); };
var cmps = {}

// save file via browser file api
function local_save_data() {
    var data = {}
    for (uuid in cmps) {
        var cmp = cmps[uuid];
        data[uuid] = cmp.getData();
    }
    var file_content = JSON.stringify(data, null, 2);
    var BB = self.Blob;
    saveAs(
        new BB(
            [file_content]
            , {type: "text/plain;charset=UTF-8"}
        ), "asset_management.json"
    );
}

function local_load_data(event) {
    var file = event.target.files[0]; // FileList object
    var reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(event) {
            parse_loaded_data(JSON.parse(event.target.result));
        }
    })(file);
    reader.readAsText(file)
}

function component_cls_by_name(name) {
    for (var i = 0; i < components.length; i++) {
        if (components[i]._name == name) {
            return components[i];
        }
    }
    return null;
}

function parse_loaded_data(data) {
    // override global data
    var node;
    $.each( data, function( uuid, node_data ) {
        var cls = component_cls_by_name(node_data.name);
        cmps[uuid] = new cls(node_data, uuid);
    });
    // connect nodes after they all have been created
    $.each( cmps, function( uuid, cmp ) {
        if ("input" in cmp.data) {
            var input = cmp.data.input;
            $.each( input, function( scope, source_uuids ) {
                for (var i=0; i < source_uuids.length; i++) {
                    var source_uuid = source_uuids[i];
                    var source_cmp = cmps[source_uuid];
                    var source_node = $('#' + source_uuid);
                    // get positions for anchors from node_config
                    var source_data = source_cmp.output;
                    var target_data = cmp.input;
                    var source_pos = source_data.indexOf(scope);
                    var target_pos = target_data.indexOf(scope);
                    // create connection - jsPlumb does not allow us to connect
                    // the existing endpoints directly, so we create new
                    // connections on top of the existing ones
                    jsPlumb.connect({
                        source: source_uuid,
                        target: uuid,
                        scope: scope,
                        connector: "StateMachine",
                        anchors: [
                            [(source_pos+1.0)/(source_data.length+1), 1, 0, 1],
                            [(target_pos+1.0)/(target_data.length+1), 0, 0, -1]
                        ],
                        endpoint: "Dot",
                        endpointStyle: {
                            fillStyle: anchor_colors[scope],
                            radius: 8
                        },
                        paintStyle:{
                            lineWidth:3,
                            strokeStyle: anchor_colors[scope]
                        }

                    });
                }
            });
        }
    });
    jsPlumb.repaintEverything();
}


/**
 * send tasks to server
 */
function send_tasks() {
    var data = {}
    for (uuid in cmps) {
        var cmp = cmps[uuid];
        data[uuid] = cmp.getData();
    };
    $.ajax({
        type: "POST",
        url: '/run',
        data: {"data": JSON.stringify(data)},
        dataType: 'json'
    }).done(function (new_data) {
        //TODO: show some kind of success message
    });
}


/**
 * create dialog to show new
 */
$(document).ready(function() {
    var pos = {x: 0, y: 0};
    // clicked anywhere - show dialog
    $(document).click(function (e) {
        if (e.target !== document.documentElement) {
            return;
        }
        pos.x = e.pageX;
        pos.y = e.pageY;
        $("#add_component").dialog('open');
        $("#add_component").dialog('option', {
            position: {
                my: 'left top',
                at: '',
                of: e
            }
        });
    });

    function add_node(cmp_cls) {
        var cmp = new cmp_cls({
            title: "",
            name: cmp_cls._name,
            config: {},
            pos: {
                x: pos.x,
                y: pos.y
            }
        });
        cmps[cmp.uuid] = cmp;
        $( "#add_component" ).dialog('close');
    }

    $( "#add_component" ).dialog({
        draggable: true,
        modal: false,
        resizable: false,
        autoOpen: false
    });
    var save = $('<button>save</button>');
    save.click(local_save_data);
    $( "#add_component" ).append(save);

    var load = $('<input type="file" />');
    load.on("change", local_load_data);
    $( "#add_component" ).append(load);

    var run = $('<button>run</button>');
    run.click(send_tasks);
    $( "#add_component" ).append(run);

    for (var i=0; i < components.length; i++) {
        var comp = components[i];
        var li = $('<li class="ui-state-default add_window"></li>');
        li.append($(comp.icon));
        li.append('&nbsp;' + comp.name);
        li.click(add_node.bind(this, comp));
        $('#component_list').append(li);
    }


});

jsPlumb.bind("ready", function() {
    // detach connections on click (because it is sometimes hard to click
    // on the anchor, so you just need to hit the connection)
    jsPlumb.bind("click", function(c) {
        jsPlumb.detach(c);
    });

    // new connection established - update data
    jsPlumb.bind("connection", function(conInfo) {
        var elem_data = data[$(conInfo.target).data("uuid")];
        var source_uuid = $(conInfo.source).data("uuid");
        if (elem_data["input"] == null) {
            elem_data["input"] = {};
        }
        if (conInfo.sourceEndpoint.scope in elem_data["input"]) {
            var input = elem_data["input"][conInfo.sourceEndpoint.scope];
            if (input.indexOf(source_uuid) < 0) {
                // check, if uuid is already connected
                // (this check is required when we load the data)
                input.push(source_uuid);
            }
        } else {
            elem_data["input"][conInfo.sourceEndpoint.scope] = [source_uuid];
        }
    });

    //connection detached - update data
    jsPlumb.bind("connectionDetached", function(conInfo) {
        var elem_data = data[$(conInfo.target).data("uuid")];
        var source_uuid = $(conInfo.source).data("uuid");
        if (elem_data != null &&
            "input" in elem_data &&
            conInfo.sourceEndpoint.scope in elem_data["input"]) {
            if (elem_data["input"].length == 1 &&
                elem_data["input"][conInfo.sourceEndpoint.scope].length == 1) {
                // removed last connection - remove input completely
                delete elem_data["input"];
            } else {
                var dat = elem_data["input"][conInfo.sourceEndpoint.scope];
                dat.splice(dat.indexOf(source_uuid), 1);
            }
        }
    });

    jsPlumb.bind("connectionMoved", function(conInfo) {
        //alert($(conInfo.target).data("name"));
    });
});

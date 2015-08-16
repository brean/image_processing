function Component(data, uuid) {
    this.uuid = uuid || guid();
    this.data = data;
    this.createNode();
}

function folder_select(parent, name, value) {
    var wrapper = $('<div class="folder_select"></div>');
    parent.append(wrapper);
    var inp = $('<input name="' + name + '" value="' + value + '" ' +
                'class="source" />');
    wrapper.append(inp);
    return wrapper;
}

/**
 * add folder selection to list
 */
function add_folder_select(parent, first, name, value) {
    var wrapper = folder_select(parent, name, value);
    if (first) {
        var add_button = $(
            '<button type="button">'+
                '<span class="glyphicon glyphicon-plus"></span>' +
            '</button>');
        wrapper.append(add_button);
        add_button.click(function() {
            parent.append(add_folder_select(parent, false, name, ""));
        });

    } else {
        var removeButton = $(
            '<button type="button">' +
                '<span class="glyphicon glyphicon-trash"></span>' +
            '</button>');
        wrapper.append(removeButton);
        removeButton.click(function() {
            $(this).parent().remove();
        });
    }
}

Component.prototype.getData = function() {
    this.data.pos = {
        x: this.node.css('left'),
        y: this.node.css('top')
    }
    return this.data;
}

Component.prototype.create_list = function(key, data) {
    var td = $("<td></td>");
    var ndata = {};;
    if (key in data) {
        ndata = data[key];
    }
    if (key in data) {
        var value = data[key];
        if (value instanceof Array) {
            for (var i = 0; i < value.length; i++) {
                add_folder_select(td, i==0, key, value[i]);
            }
        } else {
            add_folder_select(td, true, key, value);
        }
    } else {
        add_folder_select(td, true, key, "");
    }
    return td;
}

function create_input(key, data, cls) {
    var inp = $('<input class="' + cls + '" name="' + key + '" />');
    if (key in data) {
        inp.val(data[key]);
    }
    return inp;
}

Component.prototype.create_text = function(key, data) {
    var td = $("<td></td>");
    td.append(create_input(key, data, "text"));
    return td;
}

Component.prototype.create_image = function(key, data) {
    var td = $("<td></td>");
    td.append(create_input(key, data, "source"));
    return td;
}

Component.prototype.create_folder = function(key, data) {
    var td = $("<td></td>");
    td.append(create_input(key, data, "source"));
    return td;
}

Component.prototype.showConfig = function() {
    var dialog = $('<div id="dialog" title="configure ' + this._name + '"></div>');
    $('body').append(dialog);

    var form = $('<form></form>');
    dialog.append(form);

    var tbl = null;
    tbl = $('<table></table>');
    form.append(tbl);

    var data = this.data.config;
    var scope = this;
    $.each( this.config, function( conf_key, conf_value ) {
        var tr = $("<tr></tr>");
        tbl.append(tr);
        tr.append($("<td style=\"vertical-align: top;\">" + conf_key + "</td>"));

        var td = scope["create_"+conf_value](conf_key, data);
        tr.append(td);
    });
    var save = $('<button>save</button>');
    dialog.append(save);
    save.click(function () {
        var node_data = form.serializeObject();
        if ("title" in node_data) {
            $("#" + this.uuid + " .title").text(node_data["title"]);
        }
        scope.data.config = node_data;


        $(this).closest('.ui-dialog-content').dialog('close');
        jsPlumb.repaintEverything();
    });
    dialog.dialog({minWidth: 520});
};

/**
 * remove single connection between this and another component
 *
 */
Component.prototype.disconnect = function(other, scope, direction, both) {
    var uuids = this.data[direction][scope];
    // find this uuid in other datas input/output
    var pos = uuids.indexOf(other.uuid);
    if (pos >= 0) {
        if (uuids.length > 1) {
            uuids.splice(pos, 1);
        } else {
            // remove last connection
            delete this.data[direction];
        }
    }
    // disconnect both ways
    if (both || both === undefined) {
        other.disconnect(
            this, scope, (direction === 'output') ? 'input' : 'output');
    }
}

Component.prototype.connect = function(other, scope, direction, both) {
    if (this.data[direction] == null) {
        this.data[direction] = {}
    }
    if (scope in this.data[direction]) {
        var uuids = this.data[direction][scope];
        if (uuids.indexOf(other.uuid) < 0) {
            // check, if uuid is already connected
            uuids.push(other.uuid);
        }
    } else {
        this.data[direction][scope] = [other.uuid];
    }
    // connect both ways
    if (both || both === undefined) {
        other.connect(
            this, scope, (direction === 'output') ? 'input' : 'output', false);
    }
}

/**
 * remove connection
 */
Component.prototype._removeConnections = function(direction) {
    var start = direction;
    for (var scope in this.data[start]) {
        var startUuids = this.data[start][scope];
        for (i = 0; i < startUuids.length; i++) {
            this.disconnect(
                cmps[startUuids[i]],
                scope,
                direction
            );
        }
    }
}

/**
 * remove all connections from this to any other component
 *
 * (used before deletion)
 */
Component.prototype.removeConnections = function() {
    this._removeConnections('input');
    this._removeConnections('output');
}


Component.prototype.remove = function() {
    var i, scope;
    // remove this component from all connected components
    this.removeConnections();
    delete cmps[this.uuid];
    reload();
}

Component.prototype.createNode = function() {
    var node = $('<div class="node" id="' + this.uuid + '">');
    this.node = node;
    node.data("name", this._name);
    node.data("uuid", this.uuid);
    node.appendTo('#connect_area');

    var container = $('<div></div>');
    if (this.config) {
        var settings_click = $('<button>' +
                ' <i class="glyphicon glyphicon-cog"></i></button>');
        settings_click.click(this.showConfig.bind(this));
        container.append(settings_click);
    }
    var icon_name = $('<span style="font-size: 14px;">&nbsp;' +
            this.icon +
        '&nbsp</span>&nbsp' +
        '<span style="font-size: 10px;">'+this._name+'&nbsp;</span>');
    container.append(icon_name);

    var removeButton = $(
        '<button type="button">' +
            '<span class="glyphicon glyphicon-remove"></span>' +
        '</button>');
    var uuid = this.uuid;
    removeButton.click(this.remove.bind(this));
    container.append(removeButton);

    node.append(container);

    if (this.data.pos && this.data.pos.x && this.data.pos.y) {
        node.css("left", this.data.pos.x);
        node.css("top", this.data.pos.y);
    }

    var i;
    var scope;

    if (this.input) {
        for (i=0; i < this.input.length; i++) {
            //Setting up a Target endPoint
            scope = this.input[i];
            jsPlumb.addEndpoint(node, {
                anchor: [(i+1.0)/(this.input.length+1), 0, 0, -1],
                endpoint: ["Dot", { radius: 8}],
                paintStyle: { fillStyle: anchor_colors[this.input[i]] },
                connectorStyle:{
                    lineWidth:3,
                    strokeStyle: anchor_colors[this.input[i]]
                },
                connector: "StateMachine",
                scope: scope,
                isSource: false,
                isTarget: true,
                maxConnections: -1
            });
        }
    }

    if (this.output) {
        for (i=0; i < this.output.length; i++) {
            scope = this.output[i];
            jsPlumb.addEndpoint(node, {
                anchor: [(i+1.0)/(this.output.length+1), 1, 0, 1],
                endpoint: ["Dot", { radius: 8}],
                paintStyle: { fillStyle: anchor_colors[this.output[i]] },
                connectorStyle:{
                    lineWidth:3,
                    strokeStyle: anchor_colors[this.output[i]]
                },
                connector: "StateMachine",
                scope: scope,
                isSource: true,
                isTarget: false,
                maxConnections: -1
            });
        }
    }

    jsPlumb.draggable(node);
}

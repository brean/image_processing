function Folder(data, uuid) {
    this.icon = Folder.icon;
    this._name = Folder._name;
    this.config = Folder.config;
    this.output = Folder.output;
    this.input = Folder.input;

    Component.call(this, data, uuid)
}

Folder.prototype = Object.create(Component.prototype);
Folder.prototype.constructor = Folder;

Folder.input = ['image', 'xml'];
Folder.output = ['image'];
Folder._name = 'folder'
Folder.config = {
    folder: "list"
};
Folder.icon = '<i class="glyphicon glyphicon-folder-open"></i>';

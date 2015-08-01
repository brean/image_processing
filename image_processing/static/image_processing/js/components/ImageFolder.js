function ImageFolder(data, uuid) {
    this.icon = ImageFolder.icon;
    this._name = ImageFolder._name;
    this.config = ImageFolder.config;
    this.output = ImageFolder.output;

    Component.call(this, data, uuid)
}

ImageFolder.prototype = Object.create(Component.prototype);
ImageFolder.prototype.constructor = ImageFolder;

ImageFolder.input = null;
ImageFolder.output = ['image'];
ImageFolder._name = 'image_folder'
ImageFolder.config = {
    folder: "list",
    title: "text"
};
ImageFolder.icon = '<i class="glyphicon glyphicon-picture"></i>';

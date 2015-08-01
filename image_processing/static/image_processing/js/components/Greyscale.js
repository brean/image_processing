function Greyscale(data, uuid) {
    this.icon = Greyscale.icon;
    this._name = Greyscale._name;
    this.config = Greyscale.config;
    this.input = Greyscale.input;
    this.output = Greyscale.output;

    Component.call(this, data, uuid)
}

Greyscale.prototype = Object.create(Component.prototype);
Greyscale.prototype.constructor = Greyscale;

Greyscale.input = ['image'];
Greyscale.output = ['image'];
Greyscale._name = 'greyscale'
Greyscale.config = {
    title: "text"
};
Greyscale.icon = '<i class="glyphicon glyphicon-picture" style="color: #c4c4c4;"></i>';

function Grayscale(data, uuid) {
    this.icon = Grayscale.icon;
    this._name = Grayscale._name;
    this.config = Grayscale.config;
    this.input = Grayscale.input;
    this.output = Grayscale.output;

    Component.call(this, data, uuid)
}

Grayscale.prototype = Object.create(Component.prototype);
Grayscale.prototype.constructor = Grayscale;

Grayscale.input = ['image'];
Grayscale.output = ['image'];
Grayscale._name = 'grayscale'
Grayscale.config = null;
Grayscale.icon = '<i class="glyphicon glyphicon-picture" style="color: #c4c4c4;"></i>';

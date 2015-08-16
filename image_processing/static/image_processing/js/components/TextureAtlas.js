function TextureAtlas(data, uuid) {
    this.icon = TextureAtlas.icon;
    this._name = TextureAtlas._name;
    this.config = TextureAtlas.config;
    this.input = TextureAtlas.input;
    this.output = TextureAtlas.output;

    Component.call(this, data, uuid)
}

TextureAtlas.prototype = Object.create(Component.prototype);
TextureAtlas.prototype.constructor = TextureAtlas;

TextureAtlas.input = ['image'];
TextureAtlas.output = ['image', 'xml'];
TextureAtlas._name = 'texture_atlas'
TextureAtlas.config = {
    name: "text"
};
TextureAtlas.icon = '<i class="glyphicon glyphicon-th"></i>';

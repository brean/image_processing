#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import shutil
import tempfile
from .task import Task
from txtrpacker.txtrpacker import pack_images
from PIL import Image

def gen_xml(placements, name=None, rotated=False):
    """Return xml texture atlas"""
    if name:
        header = u'<TextureAtlas imagePath="%s">' % name
    else:
        header = u'<TextureAtlas>'
    data = u''
    for area, name, im in placements:
        data += u'\n'
        data += u'  <SubTexture '
        data += u' name="%s"' % name.split(os.sep)[-1]
        data += u' x="%i"' % area.x1
        data += u' y="%i"' % area.y1
        data += u' width="%i"' % (area.x2 - area.x1)
        data += u' height="%i"' % (area.y2 - area.y1)
        if rotated:
            data += u'rotated="true"'
        data += u' />'
    footer = '\n</TextureAtlas>'
    return header + data + footer

class TextureAtlas(Task):
    name = 'texture atlas'

    def texture_atlas(self, files):
        self.texture_file = tempfile.mkstemp(suffix='.png')[1]
        print self.texture_file
        images = [(name, Image.open(name)) for name in files]

        placements = pack_images(images, padding=2, sort='maxarea',
                                 maxdim=2048, dstfilename=self.texture_file)
        self.xml_file = tempfile.mkstemp(suffix='.xml')[1]
        file(self.xml_file, 'w').write(gen_xml(placements))
        print self.xml_file
        return {
            'image': [self.texture_file],
            'xml': [self.xml_file]
        }

    def cleanup(self):
        if os.path.isfile(self.texture_file):
            os.remove(self.texture_file)
        if os.path.isfile(self.xml_file):
            os.remove(self.xml_file)

    def run(self):
        files = super(TextureAtlas, self).run()
        return self.texture_atlas(files['image'])

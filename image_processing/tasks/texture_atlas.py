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
    header = u'<TextureAtlas imagePath="%s.png">' % name

    data = u''
    for area, name, im in placements:
        data += u'\n'
        data += u'  <SubTexture'
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

    def __init__(self, mgr, uuid, task_data):
        super(TextureAtlas, self).__init__(mgr, uuid, task_data)
        if 'config' in task_data and 'name' in task_data['config']:
            self.texture_name = task_data['config']['name']
        else:
            self.texture_name = 'texture_'+uuid

    def texture_atlas(self, files):
        self.tmp_dir = tempfile.mkdtemp()
        texture_file = os.path.join(self.tmp_dir, self.texture_name)+'.png'
        images = [(name, Image.open(name)) for name in files]

        placements = pack_images(images, padding=2, sort='maxarea',
                                 maxdim=2048, dstfilename=texture_file)
        xml_file = os.path.join(self.tmp_dir, self.texture_name)+'.xml'
        file(xml_file, 'w').write(gen_xml(placements, self.texture_name))
        return {
            'image': [texture_file],
            'xml': [xml_file]
        }

    def cleanup(self):
        if os.path.exists(self.tmp_dir):
            shutil.rmtree(self.tmp_dir)

    def execute_task(self):
        self.files = self.texture_atlas(self.get_input_files())
        super(TextureAtlas, self).execute_task()

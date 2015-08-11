# -*- coding: utf-8 -*-
import os
import shutil
import tempfile
from PIL import Image
from .task import Task


class Grayscale(Task):
    name = 'grayscale'

    def _grayscale(self, files):
        self.tmp_dir = tempfile.mkdtemp()
        print self.tmp_dir
        tmp_files = []
        for img in files:
            name = img.split(os.path.sep)[-1]
            tmp_file = os.path.join(self.tmp_dir, name)
            tmp_files.append(tmp_file)
            Image.open(img)\
                .convert('LA')\
                .convert('RGBA')\
                .save(tmp_file)
        return tmp_files

    def cleanup(self):
        if os.path.exists(self.tmp_dir):
            shutil.rmtree(self.tmp_dir)

    def run(self):
        files = super(Grayscale, self).run()
        return {
            'image': self._grayscale(files['image'])
        }

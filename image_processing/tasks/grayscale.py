# -*- coding: utf-8 -*-
import os
import shutil
import tempfile
from PIL import Image
from .task import Task


class Grayscale(Task):
    name = 'grayscale'

    def grayscale(self, files):
        self.tmp_dir = tempfile.mkdtemp()
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

    def execute_task(self):
        self.files = {
            'image': self.grayscale(self.get_input_files())
        }
        super(Grayscale, self).execute_task()

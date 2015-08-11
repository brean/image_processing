# -*- coding: utf-8 -*-
import os
from .task import Task

class Folder(Task):
    name = 'image folder'

    def __init__(self, task_data, requirements):
        super(Folder, self).__init__(task_data, requirements)
        self.folder = self.task_data['config']['folder']
        self.ready = True

    def run(self):
        return self.get_files()

    def get_files(self):
        files = os.listdir(self.folder)
        images = []
        for f in files:
            ext = os.path.splitext(f)[1]
            if ext in ['.png', '.jpg', '.jpeg', '.gif', '.tiff']:
                images.append(os.path.join(self.folder, f))
        return {
            'image': images
        }

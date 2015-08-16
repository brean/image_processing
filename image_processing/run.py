# -*- coding: utf-8 -*-
import os
import json
import sys
from tasks.task_manager import TaskManager
from tasks.task import Task
from tasks.grayscale import Grayscale
from tasks.folder import Folder
from tasks.texture_atlas import TextureAtlas

mgr = TaskManager()
mgr.register_task('grayscale', Grayscale)
mgr.register_task('folder', Folder)
mgr.register_task('texture_atlas', TextureAtlas)


if __name__ == '__main__':
    filename = sys.argv[1]
    data = json.load(file(filename, 'r'))

    for uuid, values in data.items():
        mgr.create_task(values['name'], uuid, values)

    mgr.run()

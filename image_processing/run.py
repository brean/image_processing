# -*- coding: utf-8 -*-
import os
import json
import sys
from tasks.task import Task
from tasks.grayscale import Grayscale
from tasks.folder import Folder
from tasks.texture_atlas import TextureAtlas


def get_task(data, values):
    tasks = []
    if 'input' not in values:
        return tasks
    for scope, requirements in values['input'].items():
        for requirement in requirements:
            name = data[requirement]['name']
            required_tasks = get_task(data, data[requirement])
            if name == 'grayscale':
                tasks.append(Grayscale(data[requirement], required_tasks))
            elif name == 'texture_atlas':
                tasks.append(TextureAtlas(data[requirement], required_tasks))
            elif name == 'folder':
                tasks.append(Folder(data[requirement], required_tasks))
    return tasks


if __name__ == '__main__':
    filename = sys.argv[1]
    data = json.load(file(filename, 'r'))
    tasks = []

    for uuid, values in data.items():
        # find leaves
        if 'output' not in values:
            tasks += get_task(data, values)

    for task in tasks:
        task.run()

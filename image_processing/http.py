"""HTTP-Server for image processing tool

"""
import rw.http
from rw import gen
import json

from tasks.task_manager import TaskManager
from tasks.task import Task
from tasks.grayscale import Grayscale
from tasks.folder import Folder
from tasks.texture_atlas import TextureAtlas

mgr = TaskManager()
mgr.register_task('grayscale', Grayscale)
mgr.register_task('folder', Folder)
mgr.register_task('texture_atlas', TextureAtlas)


root = rw.http.Module('image_processing')


@root.get('/')
def index(handler):
    root.render_template('index.html')

@root.post('/run')
def start_run(handler):
    data = json.loads(handler.get_argument('data'))
    for uuid, values in data.items():
        mgr.create_task(values['name'], uuid, values)

    mgr.run()

"""An example using as many different features of rueckenwind as possible

"""
import rw.http
from rw import gen
import json


root = rw.http.Module('image_processing')


@root.get('/')
def index(handler):
    root.render_template('index.html')

@root.post('/run')
def start_run(handler):
    data = handler.get_argument('data')
    
